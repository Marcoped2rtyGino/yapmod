use std::{collections::BTreeMap, fs, path::PathBuf, sync::RwLock};

use serde::{Deserialize, Serialize};
use serde_json::Value;
use tauri::{AppHandle, Manager, State};

static CONFIG_CACHE: RwLock<Option<Config>> = RwLock::new(None);

pub type ConfigResult<T> = Result<T, Box<dyn std::error::Error>>;

#[derive(Clone, Copy, Debug)]
pub struct FirstRun(pub bool);

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub use_native_titlebar: Option<bool>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub start_maximized: Option<bool>,
    #[serde(default)]
    pub last_seen_version: Option<String>,
    #[serde(default)]
    pub settings: BTreeMap<String, Value>,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            use_native_titlebar: Some(false),
            start_maximized: Some(false),
            last_seen_version: None,
            settings: BTreeMap::new(),
        }
    }
}

impl Config {
    fn merge(self, other: Self) -> Self {
        let settings = if other.settings.is_empty() {
            self.settings
        } else {
            other.settings
        };

        Self {
            use_native_titlebar: other.use_native_titlebar.or(self.use_native_titlebar),
            start_maximized: other.start_maximized.or(self.start_maximized),
            last_seen_version: other.last_seen_version.or(self.last_seen_version),
            settings,
        }
    }

    /// Moves the legacy top-level boot settings into the settings map, so
    /// every value the UI can touch lives in exactly one place.
    fn migrate(mut self) -> Self {
        for (key, legacy) in [
            ("use_native_titlebar", self.use_native_titlebar),
            ("start_maximized", self.start_maximized),
        ] {
            if let Some(value) = legacy {
                self.settings
                    .entry(key.to_string())
                    .or_insert(Value::Bool(value));
            }
        }

        self.use_native_titlebar = None;
        self.start_maximized = None;

        self
    }

    pub fn setting_bool(&self, key: &str) -> Option<bool> {
        match self.settings.get(key) {
            Some(Value::Bool(value)) => Some(*value),
            _ => None,
        }
    }

    pub fn init(
        app: &AppHandle,
        current_version: &str,
    ) -> ConfigResult<(Self, bool, Option<String>)> {
        let path = config_path(app)?;
        let first_run = !path.exists();

        let mut config = if first_run {
            Self::default()
        } else {
            Self::from_file(path.clone())?
        }
        .migrate();

        let previous_version = config.last_seen_version.clone();

        if previous_version.as_deref() != Some(current_version) {
            config.last_seen_version = Some(current_version.to_owned());
            config.to_file(path)?;
        }

        *CONFIG_CACHE.write().expect("config cache lock poisoned") = Some(config.clone());

        Ok((config, first_run, previous_version))
    }

    pub fn load(app: &AppHandle) -> ConfigResult<Self> {
        if let Some(config) = CONFIG_CACHE
            .read()
            .expect("config cache lock poisoned")
            .clone()
        {
            return Ok(config);
        }

        let config = Self::from_file(config_path(app)?)?;
        *CONFIG_CACHE.write().expect("config cache lock poisoned") = Some(config.clone());

        Ok(config)
    }

    pub fn save(app: &AppHandle, config: &Config) -> ConfigResult<()> {
        config.to_file(config_path(app)?)?;
        *CONFIG_CACHE.write().expect("config cache lock poisoned") = Some(config.clone());

        Ok(())
    }

    pub fn from_file(path: PathBuf) -> ConfigResult<Self> {
        let contents = fs::read_to_string(path)?;
        Self::from_str(contents)
    }

    pub fn from_file_str(path: PathBuf) -> ConfigResult<String> {
        Ok(serde_json::to_string_pretty(&Self::from_file(path)?)?)
    }

    pub fn from_str(contents: impl AsRef<str>) -> ConfigResult<Self> {
        match serde_json::from_str::<Config>(contents.as_ref()) {
            Ok(config) => Ok(Self::default().merge(config).migrate()),
            Err(error) => {
                eprintln!("failed to parse config, using defaults: {error}");
                Ok(Self::default().migrate())
            }
        }
    }

    pub fn to_file(&self, path: PathBuf) -> ConfigResult<()> {
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent)?;
        }

        fs::write(path, serde_json::to_string_pretty(self)?)?;

        Ok(())
    }
}

fn config_path(app: &AppHandle) -> ConfigResult<PathBuf> {
    Ok(app.path().app_config_dir()?.join("config.json"))
}

#[tauri::command]
pub fn is_first_run(first_run: State<FirstRun>) -> bool {
    first_run.0
}

#[tauri::command]
pub fn get_config(app: AppHandle) -> Result<Config, String> {
    Config::load(&app).map_err(|error| error.to_string())
}

#[tauri::command]
pub fn set_config(app: AppHandle, config: Config) -> Result<(), String> {
    let mut config = config;

    if config.settings.is_empty()
        && let Ok(existing) = Config::load(&app)
    {
        config.settings = existing.settings;
    }

    Config::save(&app, &config).map_err(|error| error.to_string())
}

#[tauri::command]
pub fn set_settings(app: AppHandle, values: BTreeMap<String, Value>) -> Result<(), String> {
    let mut config = Config::load(&app).map_err(|error| error.to_string())?;

    for (key, value) in values {
        config.settings.insert(key, value);
    }

    Config::save(&app, &config).map_err(|error| error.to_string())
}

#[tauri::command]
pub fn get_setting(app: AppHandle, key: String) -> Result<Option<Value>, String> {
    let config = Config::load(&app).map_err(|error| error.to_string())?;

    Ok(config.settings.get(&key).cloned())
}

#[tauri::command]
pub fn read_config_file(app: AppHandle) -> Result<String, String> {
    Config::from_file_str(config_path(&app).map_err(|error| error.to_string())?)
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub fn write_config_file(app: AppHandle, contents: String) -> Result<(), String> {
    let config = Config::from_str(&contents).map_err(|error| error.to_string())?;
    Config::save(&app, &config).map_err(|error| error.to_string())
}

#[tauri::command]
pub fn default_config() -> Config {
    Config::default()
}

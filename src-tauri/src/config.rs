use std::{collections::BTreeMap, fs, path::PathBuf, sync::RwLock};

use serde::{Deserialize, Serialize};
use serde_json::Value;
use tauri::{AppHandle, Manager};
use ts_rs::TS;

static CONFIG_CACHE: RwLock<Option<Config>> = RwLock::new(None);

pub type ConfigResult<T> = Result<T, Box<dyn std::error::Error>>;

/// The settings of the desktop client.
///
/// Every option the user can change lives in `settings`, keyed by name.
#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "types.ts")]
pub struct Config {
    #[serde(default)]
    pub last_seen_version: Option<String>,
    #[serde(default)]
    pub settings: BTreeMap<String, Value>,
}

/// The settings that are always present.
const DEFAULT_SETTINGS: [(&str, bool); 2] =
    [("use_native_titlebar", false), ("start_maximized", false)];

impl Default for Config {
    fn default() -> Self {
        let settings = DEFAULT_SETTINGS
            .iter()
            .map(|(key, value)| ((*key).to_string(), Value::Bool(*value)))
            .collect();

        Self {
            last_seen_version: None,
            settings,
        }
    }
}

impl Config {
    /// Fills in the settings that are missing from the loaded config.
    fn merge(self, other: Self) -> Self {
        let mut settings = self.settings;
        settings.extend(other.settings);

        Self {
            last_seen_version: other.last_seen_version.or(self.last_seen_version),
            settings,
        }
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
        };

        let previous_version = config.last_seen_version.clone();

        if previous_version.as_deref() != Some(current_version) {
            config.last_seen_version = Some(current_version.to_owned());
            config.to_file(path)?;
        }

        cache(&config);

        Ok((config, first_run, previous_version))
    }

    pub fn load(app: &AppHandle) -> ConfigResult<Self> {
        if let Some(config) = cached() {
            return Ok(config);
        }

        let config = Self::from_file(config_path(app)?)?;
        cache(&config);

        Ok(config)
    }

    pub fn save(app: &AppHandle, config: &Config) -> ConfigResult<()> {
        config.to_file(config_path(app)?)?;
        cache(config);

        Ok(())
    }

    pub fn from_file(path: PathBuf) -> ConfigResult<Self> {
        let contents = fs::read_to_string(path)?;
        Self::from_str(contents)
    }

    pub fn from_str(contents: impl AsRef<str>) -> ConfigResult<Self> {
        match serde_json::from_str::<Config>(contents.as_ref()) {
            Ok(config) => Ok(Self::default().merge(config)),
            Err(error) => {
                eprintln!("failed to parse config, using defaults: {error}");
                Ok(Self::default())
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

/// The config that was loaded last.
fn cached() -> Option<Config> {
    CONFIG_CACHE
        .read()
        .expect("config cache lock poisoned")
        .clone()
}

/// Keeps the config around, so it is only read from disk once.
fn cache(config: &Config) {
    *CONFIG_CACHE.write().expect("config cache lock poisoned") = Some(config.clone());
}

fn config_path(app: &AppHandle) -> ConfigResult<PathBuf> {
    Ok(app.path().app_config_dir()?.join("config.json"))
}

#[tauri::command]
pub fn set_settings(app: AppHandle, values: BTreeMap<String, Value>) -> Result<(), String> {
    let mut config = Config::load(&app).map_err(|error| error.to_string())?;

    for (key, value) in values {
        config.settings.insert(key, value);
    }

    Config::save(&app, &config).map_err(|error| error.to_string())
}

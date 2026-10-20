mod assets;

use crate::config::Config;

use assets::{MINIMUM_CSS, POSTINJECT_JS, PREINJECT_JS, RELEASE_NOTES_JSON};

fn release_notes(version: &str) -> Option<serde_json::Value> {
    let notes: serde_json::Value = serde_json::from_str(RELEASE_NOTES_JSON.as_str()).ok()?;

    notes.get(version).cloned()
}

pub fn preinject(
    config: &Config,
    first_run: bool,
    version: &str,
    previous_version: Option<&str>,
) -> String {
    let config = serde_json::to_string(config).expect("config must be valid JSON");
    let notes = serde_json::to_string(&release_notes(version)).expect("notes must be valid JSON");
    let version = serde_json::to_string(version).expect("version must be valid UTF-8");
    let previous_version =
        serde_json::to_string(&previous_version).expect("version must be valid UTF-8");

    format!(
        "window.__YAPMOD_CONFIG__ = {config};\n\
         window.__YAPMOD_FIRST_RUN__ = {first_run};\n\
         window.__YAPMOD_VERSION__ = {version};\n\
         window.__YAPMOD_PREVIOUS_VERSION__ = {previous_version};\n\
         window.__YAPMOD_RELEASE_NOTES__ = {notes};\n\
         {}",
        PREINJECT_JS.as_str()
    )
}

pub fn postinject() -> String {
    let os = serde_json::to_string(std::env::consts::OS).expect("os name must be valid UTF-8");
    let css = serde_json::to_string(MINIMUM_CSS.as_str()).expect("minimum.css must be valid UTF-8");

    format!(
        "document.documentElement.dataset.yapmodOs = {os};\n{}\nwindow.__yapmod.applyCss({css});",
        POSTINJECT_JS.as_str()
    )
}

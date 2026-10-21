use serde::Serialize;
use ts_rs::TS;

use crate::config::Config;
use crate::hosts::INTERNAL_HOST;

use super::assets::PREINJECT_JS;
use super::release::{ReleaseInfo, notes_for};

/// The payload the preinject bundle reads.
///
/// Everything the injected code needs to know about the app is in here, so
/// there is a single global to look at.
#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "types.ts")]
pub struct Payload {
    pub config: Config,
    pub os: String,
    pub internal_host: String,
    pub release: ReleaseInfo,
}

pub fn preinject(
    config: &Config,
    first_run: bool,
    version: &str,
    previous_version: Option<&str>,
) -> String {
    let payload = Payload {
        config: config.clone(),
        os: std::env::consts::OS.to_string(),
        internal_host: INTERNAL_HOST.to_string(),
        release: ReleaseInfo {
            version: version.to_string(),
            previous_version: previous_version.map(str::to_string),
            first_run,
            notes: notes_for(version),
        },
    };

    let payload = serde_json::to_string(&payload).expect("payload must be valid JSON");

    format!("window.__YAPMOD__ = {payload};\n{}", PREINJECT_JS.as_str())
}

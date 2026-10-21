use serde::Serialize;
use serde_json::Value;

use crate::config::Config;

use super::{assets::PREINJECT_JS, release::notes_for};

/// The payload the preinject bundle reads.
///
/// Everything the injected code needs to know about the app is in here, so
/// there is a single global to look at.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Payload<'a> {
    config: &'a Config,
    os: &'a str,
    version: &'a str,
    previous_version: Option<&'a str>,
    first_run: bool,
    notes: Option<Value>,
}

pub fn preinject(
    config: &Config,
    first_run: bool,
    version: &str,
    previous_version: Option<&str>,
) -> String {
    let payload = Payload {
        config,
        os: std::env::consts::OS,
        version,
        previous_version,
        first_run,
        notes: notes_for(version),
    };

    let payload = serde_json::to_string(&payload).expect("payload must be valid JSON");

    format!(
        "window.__YAPMOD__ = {payload};\n{}",
        PREINJECT_JS.as_str()
    )
}

use serde_json::Value;

use super::assets::RELEASE_NOTES_JSON;

fn all_notes() -> Value {
    serde_json::from_str(RELEASE_NOTES_JSON.as_str()).unwrap_or_else(|_| Value::Object(Default::default()))
}

pub fn notes_for(version: &str) -> Option<Value> {
    all_notes().get(version).cloned()
}

/// Every release, keyed by version, so the changelog can list all of them.
pub fn changelog() -> Value {
    all_notes()
}

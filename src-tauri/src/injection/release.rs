use serde_json::Value;

use super::assets::RELEASE_NOTES_JSON;

pub fn notes_for(version: &str) -> Option<Value> {
    let notes: Value = serde_json::from_str(RELEASE_NOTES_JSON.as_str()).ok()?;

    notes.get(version).cloned()
}

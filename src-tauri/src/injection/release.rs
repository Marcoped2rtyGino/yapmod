use std::collections::BTreeMap;

use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::version::compare_versions;

use super::assets::RELEASE_NOTES_JSON;

/// One "Highlights"/"New"/"Fixed" block of a release.
#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "types.ts")]
pub struct ReleaseNotesSection {
    pub heading: Option<String>,
    pub items: Vec<String>,
}

/// The notes of a release.
#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "types.ts")]
pub struct ReleaseNotes {
    pub title: Option<String>,
    pub date: Option<String>,
    pub summary: Option<String>,
    pub sections: Option<Vec<ReleaseNotesSection>>,
}

/// A release and its notes.
#[derive(Debug, Clone, Serialize, TS)]
#[ts(export, export_to = "types.ts")]
pub struct ReleaseEntry {
    pub version: String,
    pub notes: ReleaseNotes,
}

/// Everything the injected code knows about the release that is running.
#[derive(Debug, Clone, Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "types.ts")]
pub struct ReleaseInfo {
    pub version: String,
    pub previous_version: Option<String>,
    pub first_run: bool,
    pub notes: Option<ReleaseNotes>,
}

fn all_notes() -> BTreeMap<String, ReleaseNotes> {
    match serde_json::from_str(RELEASE_NOTES_JSON.as_str()) {
        Ok(notes) => notes,
        Err(error) => {
            eprintln!("failed to parse the release notes: {error}");
            BTreeMap::new()
        }
    }
}

pub fn notes_for(version: &str) -> Option<ReleaseNotes> {
    all_notes().get(version).cloned()
}

/// Every release, newest first.
///
/// The list is fetched on demand, so it is not shipped with every page
/// load.
#[tauri::command]
pub fn get_changelog() -> Vec<ReleaseEntry> {
    let mut releases: Vec<ReleaseEntry> = all_notes()
        .into_iter()
        .map(|(version, notes)| ReleaseEntry { version, notes })
        .collect();

    releases.sort_by(|left, right| compare_versions(&right.version, &left.version));

    releases
}

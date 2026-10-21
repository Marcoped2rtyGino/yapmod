use std::{
    env,
    path::{Path, PathBuf},
};

fn main() {
    let manifest_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());

    ensure_injection_bundles(&manifest_dir.join("gen").join("injection"));

    // The webview runs on a remote origin (yapper.website), so every command
    // the injected code calls has to be part of the app ACL. Without this
    // manifest the runtime rejects them with "not allowed by ACL".
    tauri_build::try_build(tauri_build::Attributes::new().app_manifest(
        tauri_build::AppManifest::new().commands(&[
            "set_settings",
            "set_badge_count",
            "notify",
            "request_notification_permission",
            "check_for_update",
            "get_changelog",
        ]),
    ))
    .expect("failed to run tauri-build");
}

fn ensure_injection_bundles(dir: &Path) {
    for bundle in ["preinject.js", "postinject.js"] {
        let path = dir.join(bundle);

        if !path.exists() {
            panic!(
                "missing injection bundle `{}`\nrun `pnpm injection:build` before building",
                path.display()
            );
        }
    }
}

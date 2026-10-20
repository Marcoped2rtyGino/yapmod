use std::{
    env,
    path::{Path, PathBuf},
};

fn main() {
    let manifest_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());

    ensure_injection_bundles(&manifest_dir.join("gen").join("injection"));

    tauri_build::build()
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

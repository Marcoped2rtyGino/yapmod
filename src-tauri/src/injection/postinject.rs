use super::assets::{MINIMUM_CSS, POSTINJECT_JS};

pub fn postinject() -> String {
    let os = serde_json::to_string(std::env::consts::OS).expect("os name must be valid UTF-8");
    let css = serde_json::to_string(MINIMUM_CSS.as_str()).expect("minimum.css must be valid UTF-8");

    format!(
        "document.documentElement.dataset.yapmodOs = {os};\n{}\nwindow.__yapmod.applyCss({css});",
        POSTINJECT_JS.as_str()
    )
}

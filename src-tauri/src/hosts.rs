/// The host that identifies the app itself.
///
/// The injected code gets the same host, so both sides agree on what counts
/// as an internal link.
pub const INTERNAL_HOST: &str = "yapper.website";

/// Whether a host belongs to the app.
pub fn is_internal_host(host: &str) -> bool {
    let host = host.to_ascii_lowercase();

    host == INTERNAL_HOST || host.ends_with(&format!(".{INTERNAL_HOST}"))
}

/// Whether a URL stays on the app, so internal windows keep the default
/// behaviour and external ones are sent to the browser.
pub fn is_internal_url(url: &tauri::Url) -> bool {
    match url.host_str() {
        Some(host) => is_internal_host(host),
        None => true,
    }
}

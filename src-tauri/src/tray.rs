use tauri::{
    AppHandle,
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};

use crate::{config::Config, window};

/// The id of the tray icon.
const TRAY_ID: &str = "yapmod";

/// The setting that keeps the app in the tray.
const SETTING: &str = "keep_in_tray";

/// The menu item that brings the window back.
const SHOW_ID: &str = "show";

/// The menu item that really closes the app.
const QUIT_ID: &str = "quit";

/// Whether the user wants the app to keep running in the tray.
fn enabled(config: &Config) -> bool {
    config.setting_bool(SETTING).unwrap_or(true)
}

/// Adds the tray icon when the user wants it.
///
/// A tray that cannot be created is not fatal: the app keeps working and
/// closing the window quits it instead.
pub fn install(app: &AppHandle, config: &Config) {
    if !enabled(config) {
        return;
    }

    if let Err(error) = create(app) {
        eprintln!("failed to create the tray icon: {error}");
    }
}

/// Creates or removes the tray icon, so it matches the config.
///
/// The setting is applied right away, without a restart.
pub fn sync(app: &AppHandle) {
    let wanted = Config::load(app)
        .map(|config| enabled(&config))
        .unwrap_or(false);
    let present = app.tray_by_id(TRAY_ID).is_some();

    if wanted == present {
        return;
    }

    if wanted {
        if let Err(error) = create(app) {
            eprintln!("failed to create the tray icon: {error}");
        }
    } else {
        remove(app);
    }
}

/// Whether closing the window should hide it instead of quitting.
///
/// A missing tray means there is no way back to the window, so the app quits
/// like it did before the tray existed.
pub fn keeps_running(app: &AppHandle) -> bool {
    if app.tray_by_id(TRAY_ID).is_none() {
        return false;
    }

    Config::load(app)
        .map(|config| enabled(&config))
        .unwrap_or(false)
}

fn create(app: &AppHandle) -> tauri::Result<()> {
    let show = MenuItem::with_id(app, SHOW_ID, "Show Yapmod", true, None::<&str>)?;
    let separator = PredefinedMenuItem::separator(app)?;
    let quit = MenuItem::with_id(app, QUIT_ID, "Quit Yapmod", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show, &separator, &quit])?;

    let mut builder = TrayIconBuilder::with_id(TRAY_ID)
        .tooltip("Yapmod")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id().as_ref() {
            SHOW_ID => window::show_main(app),
            QUIT_ID => app.exit(0),
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                window::show_main(tray.app_handle());
            }
        });

    #[cfg(target_os = "macos")]
    {
        // A template icon follows the colour of the menu bar, so the logo
        // stays readable in both the light and the dark theme.
        builder = builder
            .icon(tauri::image::Image::from_bytes(include_bytes!(
                "../icons/tray.png"
            ))?)
            .icon_as_template(true);
    }

    #[cfg(not(target_os = "macos"))]
    {
        builder = builder.icon(tauri::image::Image::from_bytes(include_bytes!(
            "../icons/32x32.png"
        ))?);
    }

    builder.build(app)?;

    Ok(())
}

fn remove(app: &AppHandle) {
    app.remove_tray_by_id(TRAY_ID);

    // Without a tray there is no way back to a hidden window, so it is shown
    // again before the tray goes away.
    window::show_main(app);
}

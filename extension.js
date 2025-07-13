// Import required GNOME Shell libraries and modules
const St = imports.gi.St;  // Shell toolkit for UI elements
const Main = imports.ui.main;  // Access to main UI components like panel, layout manager
const Gio = imports.gi.Gio;  // For file handling, settings, etc.
const ExtensionUtils = imports.misc.extensionUtils;  // Utilities for working with extensions
const Pango = imports.gi.Pango;  // Text layout/rendering
const Clutter = imports.gi.Clutter;  // Input handling, animations, etc.
const GLib = imports.gi.GLib;  // General utilities: timeouts, file IO, etc.

// Access to the extension directory
const Me = ExtensionUtils.getCurrentExtension();

// Import internal modules (likely your own files in the extension)
const NoteView = Me.imports.view.noteView;  // Manages creation and display of the sticky note UI
const DragHandler = Me.imports.services.dragHandler;  // Handles mouse-based dragging of the note
const SettingsManager = Me.imports.services.settingsManager;  // Handles persistent storage of note content and state
const FocusManager = Me.imports.services.focusManager;  // Handles focus behavior (e.g., focus on click)
const StateToggle = Me.imports.services.stateToggle;  // Toggles visual or behavior state (like z-index)

// Container for UI components created by NoteView
let components = {};

// Called once when the extension is loaded (but not yet enabled)
function init() {
    SettingsManager.init();  // Initialize settings schema and bindings
}

// Called when the extension is enabled (user turns it on)
function enable() {
    // Create the UI components (note container, text area, buttons, etc.)
    components = NoteView.createComponents();

    // Enable dragging functionality for the sticky note using defined elements
    DragHandler.enable(components.scrollBox, components.dragButton);

    // Restore previously saved note text from settings or file
    SettingsManager.restoreText(components.note);

    // Enable focus behavior (e.g., click to focus)
    FocusManager.enable(components.note);

    // Enable state toggle behavior (e.g., toggling between always-on-top modes)
    StateToggle.enable(components.scrollBox);

    // Add UI components to the screen
    NoteView.assembleUI(components);
}

// Called when the extension is disabled (user turns it off)
function disable() {
    // Cleanly disable the state toggle logic
    StateToggle.disable();

    // Remove all UI elements from the screen and cleanup
    NoteView.destroyUI(components);

    // Clear the components object
    components = {};
}

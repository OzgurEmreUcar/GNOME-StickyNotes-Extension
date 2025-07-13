// Import necessary GNOME libraries
const { St, Clutter } = imports.gi;
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();  // Reference to the current extension

// Create and return the sticky note UI components
function createComponents() {
    // The outer scrollable container, allows future flexibility for overflow content
    const scrollBox = new St.ScrollView({
        overlay_scrollbars: true,
        x_expand: true,
        y_expand: true,
        clip_to_allocation: true,
        reactive: true,
        track_hover: true,
        can_focus: false,
    });

    // A box that holds both the drag button and the text entry
    const noteBox = new St.BoxLayout({
        reactive: true,
        x_expand: true,
        y_expand: true,
        visible: true,
        track_hover: true,
        can_focus: false,
    });

    // The actual text entry field where the user types
    const note = new St.Entry({
        name: 'noteEntry',
        can_focus: true,
        text: "Type here…",
        track_hover: true,
        x_expand: true,

        style_class: 'sticky-note'
    });

    // Button for dragging the note around, with a handle icon
    const dragButton = new St.Button({
        label: "☰",
        style_class: 'drag-handle',
        can_focus: false,
        reactive: true,
        track_hover: true,
        x_align: St.Align.START,
        y_align: St.Align.MIDDLE,
    });

    // Assemble the UI hierarchy
    noteBox.add_child(dragButton);
    noteBox.add_child(note);
    scrollBox.add_actor(noteBox);  // Add the box into the scrollable container

    // Return all parts so they can be used elsewhere (e.g., enabling drag)
    return { scrollBox, noteBox, note, dragButton };
}

// Add the sticky note to the screen at the saved position
function assembleUI({ scrollBox }) {
    const settings = Me.imports.services.settingsManager.getSettings();

    // Add the scrollBox to the background layer so it’s visible over desktop
    Main.layoutManager._backgroundGroup.add_child(scrollBox);

    // Restore the last saved position
    scrollBox.set_position(
        settings.get_int('note-position-x'),
        settings.get_int('note-position-y')
    );
}

// Cleanly destroy the UI (used when disabling the extension)
function destroyUI({ scrollBox }) {
    if (scrollBox) {
        scrollBox.destroy();  // Fully remove and clean up
    }
}

// Export functions for use in main extension file
var createComponents = createComponents;
var assembleUI = assembleUI;
var destroyUI = destroyUI;

// Import necessary GNOME libraries
const { St, Clutter } = imports.gi;
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();  // Reference to the current extension

// Create and return the sticky note UI components
function createComponents() {
    // The outer scrollable container, allows future flexibility for overflow content
    const scrollBox = new St.ScrollView({
        overlay_scrollbars: true,     // Show scrollbars when hovered
        reactive: true,               // Responds to input events
        track_hover: true,            // Reacts to hover events
        clip_to_allocation: true,     // Clips drawing to allocated space
    });

    // A box that holds both the drag button and the text entry
    const noteBox = new St.BoxLayout({
        reactive: true,
        x_expand: true,               // Expand horizontally
        y_expand: true,               // Expand vertically
    });

    // The actual text entry field where the user types
    const note = new St.Entry({
        name: 'noteEntry',
        text: 'Type here…',          // Default placeholder text
        can_focus: true,             // Can receive keyboard focus
        x_expand: true,
        track_hover: true,
        style_class: 'sticky-note',  // CSS class for styling
    });

    // Button for dragging the note around, with a handle icon
    const dragButton = new St.Button({
        label: '☰',                   // Menu/drag handle icon
        style_class: 'drag-handle',   // CSS class for styling
        reactive: true,
        can_focus: false,             // No focus needed
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

// Import GNOME libraries
const { Clutter, St } = imports.gi;
const Main = imports.ui.main;

// Declare variables for UI elements and state
let button, scrollBox, state = true;

/**
 * Enables the state toggle button for the sticky note
 * @param {St.ScrollView} box - The scrollBox container of the note
 */
function enable(box) {
    scrollBox = box;

    // Create a button with a bird emoji, used as a toggle control
    button = new St.Button({
        label: '🐦',                  // Button label/icon
        style_class: 'drag-handle',  // CSS class for consistent styling
        reactive: true,              // Can receive input events
        can_focus: true,             // Can be keyboard focused
        x_align: St.Align.START,     // Align button to start (left)
        y_align: Clutter.ActorAlign.CENTER,  // Vertically center button
    });

    // Connect button press event to toggle the sticky note's visual layering
    button.connect('button-press-event', () => {
        state = !state;  // Flip the toggle state

        if (state) {
            // Move scrollBox from uiGroup (normal layer) to backgroundGroup (below windows)
            Main.uiGroup.remove_child(scrollBox);
            Main.layoutManager._backgroundGroup.add_child(scrollBox);
        } else {
            // Move scrollBox from backgroundGroup back to uiGroup (above windows)
            Main.layoutManager._backgroundGroup.remove_child(scrollBox);
            Main.uiGroup.add_child(scrollBox);
        }
    });

    // Insert the toggle button at the leftmost position in the panel's right box
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

/**
 * Disables the toggle button and cleans up
 */
function disable() {
    if (button) {
        button.destroy();  // Remove button from UI
        button = null;     // Clear reference for GC
    }
}

// Export the enable and disable functions
var enable = enable;
var disable = disable;

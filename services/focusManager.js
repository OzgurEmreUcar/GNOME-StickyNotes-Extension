const GLib = imports.gi.GLib;

/**
 * Enables focus management on the note entry widget.
 * When the note loses focus, it tries to regain it after a short delay.
 * This helps keep the note focused unless the user explicitly focuses elsewhere.
 * 
 * @param {St.Entry} note - The sticky note text entry widget
 */
function enable(note) {
    // Listen for changes to the 'has-focus' property of the note
    note.connect('notify::has-focus', () => {
        // If the note lost focus
        if (!note.has_focus()) {
            // Schedule a timeout callback 100ms later
            GLib.timeout_add(GLib.PRIORITY_DEFAULT, 100, () => {
                // If note still doesn't have focus, grab it again
                if (!note.has_focus()) {
                    note.grab_key_focus();
                }
                // Return REMOVE to run this callback only once
                return GLib.SOURCE_REMOVE;
            });
        }
    });
}

// Export the enable function
var enable = enable;

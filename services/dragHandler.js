const { Clutter } = imports.gi;
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const SettingsManager = Me.imports.services.settingsManager;

// State variables to track dragging
let dragActive = false;
let dragStartX, dragStartY;       // Mouse pointer position at drag start
let actorStartX, actorStartY;     // scrollBox position at drag start

/**
 * Enables dragging behavior on the note's drag button.
 * When the user clicks and drags the dragButton, moves the scrollBox accordingly.
 * Saves the new position when drag ends.
 * 
 * @param {St.ScrollView} scrollBox - The container to move around
 * @param {St.Button} dragButton - The drag handle button to listen for drag events
 */
function enable(scrollBox, dragButton) {
    // On mouse button press over dragButton: start dragging
    dragButton.connect('button-press-event', (_, event) => {
        dragActive = true;

        // Save initial pointer coordinates on screen
        [dragStartX, dragStartY] = event.get_coords();

        // Save initial scrollBox position
        [actorStartX, actorStartY] = scrollBox.get_position();

        // Grab pointer so we receive all pointer events until release
        dragButton.grab_pointer();

        return Clutter.EVENT_STOP; // Stop event propagation
    });

    // On mouse movement over dragButton during dragging
    dragButton.connect('motion-event', (_, event) => {
        // Only react if dragging is active
        if (!dragActive) return Clutter.EVENT_PROPAGATE;

        // Check if left mouse button is still pressed
        const state = event.get_state();
        if (state & Clutter.ModifierType.BUTTON1_MASK) {
            // Calculate movement delta from initial pointer position
            const [x, y] = event.get_coords();
            const dx = x - dragStartX;
            const dy = y - dragStartY;

            // Update the scrollBox position by applying the delta
            scrollBox.set_position(actorStartX + dx, actorStartY + dy);

            return Clutter.EVENT_STOP; // Consume event
        }
        return Clutter.EVENT_PROPAGATE;
    });

    // On mouse button release: end dragging and save position
    dragButton.connect('button-release-event', () => {
        // Get the transformed position of the scrollBox (accounting for scaling, transforms)
        let [x, y] = scrollBox.get_transformed_position();

        // Save the new position to settings for persistence
        SettingsManager.savePosition(Math.round(x), Math.round(y));

        dragActive = false;             // Reset dragging state
        dragButton.ungrab_pointer();    // Release pointer grab

        return Clutter.EVENT_STOP;
    });
}

// Export the enable function for external use
var enable = enable;

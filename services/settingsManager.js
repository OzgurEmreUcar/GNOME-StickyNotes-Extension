// Import Gio for GNOME settings and ExtensionUtils for extension context
const Gio = imports.gi.Gio;
const ExtensionUtils = imports.misc.extensionUtils;

// Holds the Gio.Settings object after initialization
let settings;

/**
 * Initialize the settings schema for the extension.
 * Loads the custom GSettings schema from the extension's 'schemas' directory.
 */
function init() {
    // Get the path to the 'schemas' directory inside the extension folder
    const schemaDir = ExtensionUtils.getCurrentExtension().dir.get_child('schemas');

    // Create a new schema source from the directory (overriding default schema source)
    const schemaSource = Gio.SettingsSchemaSource.new_from_directory(
        schemaDir.get_path(),                 // Directory path of the schemas
        Gio.SettingsSchemaSource.get_default(), // Default system schema source
        false                                // Do not recursively search
    );

    // Look up the schema object by its ID, must match the one defined in the XML file
    const schemaObj = schemaSource.lookup('org.gnome.shell.extensions.sticky', true);

    // Create the Gio.Settings object using the loaded schema
    settings = new Gio.Settings({ settings_schema: schemaObj });
}

/**
 * Returns the current Gio.Settings object
 * @returns {Gio.Settings}
 */
function getSettings() {
    return settings;
}

/**
 * Saves the note's position coordinates into the settings
 * @param {number} x - X coordinate of the note
 * @param {number} y - Y coordinate of the note
 */
function savePosition(x, y) {
    settings.set_int('note-position-x', x);
    settings.set_int('note-position-y', y);
}

/**
 * Restores the text of the note from the saved settings,
 * and sets up a listener to update settings when the text changes.
 * @param {St.Entry} note - The text entry widget for the note
 */
function restoreText(note) {
    // Import Pango for text wrapping modes
    const Pango = imports.gi.Pango;

    // Get the Clutter text actor underlying the St.Entry
    const clutterText = note.get_clutter_text();

    // Configure the text to wrap properly (multi-line)
    clutterText.set_single_line_mode(false);
    clutterText.set_activatable(false);
    clutterText.set_line_wrap(true);
    clutterText.set_line_wrap_mode(Pango.WrapMode.WORD_CHAR);

    // Connect to the text-changed signal to save changes to settings
    clutterText.connect('text-changed', () => {
        settings.set_string('note-text', note.get_text());
    });

    // Load previously saved note text and set it in the UI
    const savedText = settings.get_string('note-text');
    if (savedText) {
        note.set_text(savedText);
    }
}

// Export functions for external usage
var init = init;
var getSettings = getSettings;
var savePosition = savePosition;
var restoreText = restoreText;

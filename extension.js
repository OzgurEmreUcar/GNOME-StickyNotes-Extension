const St = imports.gi.St;
const Main = imports.ui.main;
const Gio = imports.gi.Gio;
const ExtensionUtils = imports.misc.extensionUtils;
const Pango = imports.gi.Pango;

let scrollBox, noteBox, note, settings;

function init() {
    const GioSSS = Gio.SettingsSchemaSource;
    let schemaDir = ExtensionUtils.getCurrentExtension().dir.get_child('schemas');
    let schemaSource = GioSSS.new_from_directory(schemaDir.get_path(), GioSSS.get_default(), false);
    let schemaObj = schemaSource.lookup('org.gnome.shell.extensions.sticky', true);

    settings = new Gio.Settings({ settings_schema: schemaObj });
}

function enable() {
    scrollBox = new St.ScrollView({
        overlay_scrollbars: true,
        x_expand: true,
        y_expand: true,
        clip_to_allocation: true,
        reactive: true,
        track_hover: true,
        can_focus: false,
    });

    noteBox = new St.BoxLayout({
        reactive: true,
        x_expand: true,
        y_expand: true,
        visible: true,
        track_hover: true,
        can_focus: false,
    });

    note = new St.Entry({
        name: 'noteEntry',
        can_focus: true,
        track_hover: true,
        x_expand: true,
        style_class: 'notesTextField',
        text: 'Type here...'
    });

    const clutterText = note.get_clutter_text();
    clutterText.set_single_line_mode(false);
    clutterText.set_activatable(false);
    clutterText.set_line_wrap(true);
    clutterText.set_line_wrap_mode(Pango.WrapMode.WORD_CHAR);

    // Connect to the clutter text signal
    clutterText.connect('text-changed', () => {
        settings.set_string('note-text', note.get_text());
    });

    // Load saved note text
    let savedText = settings.get_string('note-text');
    if (savedText)
        note.set_text(savedText);

    noteBox.add_child(note);
    scrollBox.add_actor(noteBox);

    Main.uiGroup.add_child(scrollBox);
    scrollBox.set_position(100, 100);
}

function disable() {
    if (scrollBox) {
        scrollBox.destroy();
        scrollBox = null;
    }
}

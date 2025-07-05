const St = imports.gi.St;
const Main = imports.ui.main;
const Gio = imports.gi.Gio;
const ExtensionUtils = imports.misc.extensionUtils;
const Pango = imports.gi.Pango;
const Clutter = imports.gi.Clutter;

let scrollBox, noteBox, note, settings, dragButton;
let dragStartX = 0, dragStartY = 0;
let actorStartX = 0, actorStartY = 0;
let dragActive = false;

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

    dragButton = new St.Button({
        label: "☰",
        style_class: 'drag-handle',
        can_focus: false,
        reactive: true,
        track_hover: true,
        x_align: St.Align.START,
        y_align: St.Align.MIDDLE,
    });

    // Dragging handlers with global pointer grab for smooth drag
    dragButton.connect('button-press-event', (actor, event) => {
        dragActive = true;
        const [x, y] = event.get_coords();
        dragStartX = x;
        dragStartY = y;
        [actorStartX, actorStartY] = scrollBox.get_position();

        // Grab pointer globally so motion events continue outside actor
        Main.uiGroup.get_stage().set_key_focus(null);
        actor.grab_pointer();

        return Clutter.EVENT_STOP;
    });

    dragButton.connect('motion-event', (actor, event) => {
        if (!dragActive)
            return Clutter.EVENT_PROPAGATE;

        const state = event.get_state();
        if (state & Clutter.ModifierType.BUTTON1_MASK) {
            const [x, y] = event.get_coords();
            const dx = x - dragStartX;
            const dy = y - dragStartY;
            scrollBox.set_position(actorStartX + dx, actorStartY + dy);
            return Clutter.EVENT_STOP;
        }
        return Clutter.EVENT_PROPAGATE;
    });

    dragButton.connect('button-release-event', (actor, event) => {
        dragActive = false;
        actor.ungrab_pointer();
        return Clutter.EVENT_STOP;
    });

    note = new St.Entry({
        name: 'noteEntry',
        can_focus: true,
        text: "Type here…",
        track_hover: true,
        x_expand: true,

        style_class: 'sticky-note'
    });

    const clutterText = note.get_clutter_text();
    clutterText.set_single_line_mode(false);
    clutterText.set_activatable(false);
    clutterText.set_line_wrap(true);
    clutterText.set_line_wrap_mode(Pango.WrapMode.WORD_CHAR);

    clutterText.connect('text-changed', () => {
        settings.set_string('note-text', note.get_text());
    });

    // Restore saved text
    let savedText = settings.get_string('note-text');
    if (savedText)
        note.set_text(savedText);

    noteBox.add_child(dragButton);
    noteBox.add_child(note);
    scrollBox.add_actor(noteBox);

    Main.uiGroup.add_child(scrollBox);
    scrollBox.set_position(100, 100);

    // Explicitly focus note to allow typing right away
    note.grab_key_focus();

    // Also listen for focus-out event to regrab focus if needed
note.connect('notify::has-focus', () => {
    if (!note.has_focus()) {
        GLib.timeout_add(GLib.PRIORITY_DEFAULT, 100, () => {
            if (!note.has_focus()) {
                note.grab_key_focus();
            }
            return GLib.SOURCE_REMOVE;
        });
    }
});

}

function disable() {
    if (scrollBox) {
        scrollBox.destroy();
        scrollBox = null;
    }
}

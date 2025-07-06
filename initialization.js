export function initializeComponents()
{
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
        text: "Type here…",
        track_hover: true,
        x_expand: true,

        style_class: 'sticky-note'
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

    changeStateButton = new St.Button({        
        label: "🐦",
        style_class: 'drag-handle',
        can_focus: true,
        reactive: true,
        track_hover: true,
        x_align: St.Align.START,
        y_align: Clutter.ActorAlign.CENTER,
    });
}
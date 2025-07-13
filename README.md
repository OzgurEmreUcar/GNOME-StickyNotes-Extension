# GNOME Sticky Notes Extension

A simple GNOME Shell extension that adds one draggable, editable sticky note to your desktop — perfect for jotting down quick reminders or ideas.

---

## About GNOME

GNOME is a widely-used, modern desktop environment for Linux and other Unix-like operating systems, providing a clean and accessible graphical interface with a focus on usability and elegance.

---

## What is a GNOME Shell Extension?

GNOME Shell extensions are small JavaScript programs that customize or extend the GNOME Shell’s functionality without modifying the core source code. They allow users to add new features or tweak the desktop environment.

---

## What is GJS?

GJS (GNOME JavaScript) is the JavaScript environment used to write GNOME Shell extensions and apps. It provides bindings to GNOME libraries, enabling use of GNOME’s UI and system APIs from JavaScript.

---

## Features

- Single sticky note with editable text.
- Drag and reposition the note anywhere on your desktop.
- Persistent saving of note content and position across sessions.
- Toggle the note’s layering to keep it above or below other windows.
- Add or remove the sticky note with a panel button.
- Lightweight and unobtrusive.

---

## Compatibility

- **Wayland:** Fully functional and smooth operation.
- **X11:** Mostly works, but there is a known issue with focusing the sticky note window.

---

## Installation

Clone the repository into your GNOME extensions directory:

```bash
git clone https://github.com/OzgurEmreUcar/GNOME-StickyNotes-Extension ~/.local/share/gnome-shell/extensions/StickyNotes@ozgur
```
Then enable the extension using GNOME Extensions app or by running:

```bash
gnome-extensions enable StickyNotes@ozgur

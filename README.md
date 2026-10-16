# Anything2Ascii

Turn **text**, **images**, or your **camera** into ASCII art directly in your browser. Anything2Ascii is a lightweight, client-side tool with bundled fonts and no required backend. Your images are processed locally in your browser.

**Live website:** https://ascii.hungg.indevs.in

## Use it

Open **https://ascii.hungg.indevs.in** in a modern browser. No installation or localhost server is needed. Camera access requires HTTPS and permission from your browser.

## Features

### Sources
- **Text:** Convert one or more lines into ASCII characters with adjustable alignment, weight, italic styling, and solid or outline rendering.
- **Image:** Select an image, drag and drop it, paste it with `Ctrl+V`, or try a sample.
- **Camera:** Generate live ASCII art from your camera, pause it, take a snapshot, switch cameras, and mirror the view.

### Fonts
Uses Torus as the default interface and ASCII-art font, alongside a collection of bundled fonts that can be selected in the editor. You can also upload or drop your own `.otf`, `.ttf`, `.woff`, or `.woff2` font.

### Character sets
Includes Classic, Detailed, Blocks, Binary, Braille, Quadrants, Edges, Word Fill, Custom, Dots, Hex, and Retro modes.

### Adjustments
Change output width, contrast, brightness, gamma, sharpening, threshold, inversion, automatic levels, dithering, and horizontal or vertical flipping.

### Preview and export
- Fit the output to the window or adjust character size manually.
- Copy ASCII text to the clipboard.
- Export as `.txt`, `.png`, `.svg`, or standalone `.html`.
- Copy the rendered image.

### Interface
- English-only interface; no language selector.
- Light and dark themes.
- No output colour-selection controls.
- Responsive layout for desktop and mobile.
- Settings are remembered between visits, with a reset option.

## Project files

| File | Description |
| --- | --- |
| `index.html` | Main page structure |
| `style.css` | Layout and styling |
| `app.js` | ASCII conversion and interface logic |
| `fonts.css` | Bundled fonts encoded as base64 |

## Privacy

Text and images are processed in the browser. The app does not require an account or send images to a backend for ASCII conversion.

## Credits

Bundled Google Fonts are distributed under the SIL Open Font License. Torus is retained from the original project.

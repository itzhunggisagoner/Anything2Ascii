/* Anything2Ascii — turns text, images or a camera feed into ASCII characters.
   No external libraries. Everything runs in the browser. */
(() => {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const MONO = 'ui-monospace, "DejaVu Sans Mono", Menlo, Consolas, "Courier New", monospace';
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  const narrow = matchMedia("(max-width: 860px)").matches;

  /* ================================================================
     Translations
     ================================================================ */
  const I18N = {
    en: {
      tag: "Turn text, images or your camera into characters.",
      langAria: "Switch language", themeToDark: "Switch to dark theme", themeToLight: "Switch to light theme",
      "src.title": "Source", "src.text": "Text", "src.image": "Image", "src.camera": "Camera",
      "txt.label": "Text to convert", "txt.ph": "Type something, multiple lines work",
      "font.title": "Font", "font.upload": "Upload font", "font.formats": ".otf .ttf .woff .woff2",
      "font.err": "Couldn't read that font file. Try .otf, .ttf, .woff or .woff2.",
      "font.default": "Default", "font.sans": "System sans", "font.serif": "System serif", "font.mono": "System mono",
      "tag.system": "System", "tag.sans": "Sans", "tag.display": "Display", "tag.script": "Script", "tag.hand": "Handwritten",
      "tag.pixel": "Pixel", "tag.tech": "Tech", "tag.mono": "Mono", "tag.serif": "Serif", "tag.round": "Rounded",
      "tag.deco": "Decorative", "tag.upload": "Uploaded",
      "txt.style": "Style", "style.solid": "Solid", "style.outline": "Outline",
      "txt.align": "Alignment", "align.left": "Left", "align.center": "Center", "align.right": "Right",
      "txt.italic": "Italic", "adj.weight": "Text weight",
      "img.choose": "Choose an image or drop it here",
      "img.sub": "Pasting with Ctrl+V works too. PNG, JPG, WebP, GIF, SVG.",
      "img.replace": "Click to replace", "img.pasted": "Pasted image", "img.sampleName": "Sample picture",
      "img.sample": "Try a sample",
      "img.notimg": "That file isn't an image. Choose a PNG, JPG, WebP, GIF or SVG.",
      "img.fail": "Couldn't read that image. Try a PNG, JPG, WebP or GIF.",
      "cam.hint": "Live ASCII from your webcam. Video stays on this device.",
      "cam.start": "Start camera", "cam.stop": "Stop camera", "cam.pause": "Pause", "cam.resume": "Resume",
      "cam.snap": "Snapshot", "cam.switch": "Switch camera", "cam.mirror": "Mirror", "cam.mirror.sub": "Flip the picture like a mirror.",
      "cam.denied": "Couldn't open the camera. Allow camera access in your browser and try again.",
      "cam.unsupported": "This browser can't open a camera here. Camera needs https:// or localhost.",
      "chars.title": "Characters",
      "mode.classic": "Classic", "mode.detailed": "Detailed", "mode.blocks": "Blocks", "mode.binary": "Binary",
      "mode.braille": "Braille", "mode.quad": "Quadrants", "mode.edges": "Edges", "mode.word": "Word fill",
      "mode.custom": "Custom", "mode.dots": "Dots", "mode.hex": "Hex", "mode.retro": "Retro",
      "word.label": "Phrase to repeat", "word.hint": "The letters run one after another to fill the dark areas.",
      "custom.label": "Characters, light to dark", "custom.hint": "First character for the lightest areas, last for the darkest.",
      "adj.title": "Adjust", "adj.width": "Width (columns)", "adj.contrast": "Contrast", "adj.bright": "Brightness",
      "adj.gamma": "Gamma", "adj.sharpen": "Sharpen", "adj.thresh": "Threshold", "adj.invert": "Invert",
      "adj.auto": "Auto levels", "adj.auto.sub": "Stretches dull images to the full range.",
      "adj.dither": "Dithering", "adj.dither.sub": "Smoother gradients for Braille and Quadrants.",
      "adj.flip": "Flip", "adj.flipH": "Horizontal", "adj.flipV": "Vertical",
      "col.title": "Colour",
      "pal.theme": "Theme", "pal.phosphor": "Phosphor", "pal.amber": "Amber", "pal.ice": "Ice", "pal.paper": "Paper",
      "pal.mono": "Mono", "pal.rose": "Rose", "pal.custom": "Custom",
      "col.fg": "Text", "col.bg": "Background",
      "col.source": "Use picture colours", "col.source.sub": "Every character takes the colour of the pixels it covers.",
      reset: "Reset settings",
      "meta.unit": "cols × rows", "meta.chars": "{n} characters",
      "view.fit": "Fit", "view.size": "Character size",
      "out.copy": "Copy", "out.copied": "Copied", "out.copyAria": "Copy to clipboard", "out.export": "Export",
      "out.aria": "ASCII result",
      "exp.txt": "Plain text", "exp.png": "Image", "exp.svg": "Vector", "exp.html": "Web page",
      "exp.copyimg": "Copy image", "exp.scale": "PNG scale",
      "empty.text": "Type something on the left to get started.",
      "empty.image": "Drop an image anywhere, paste it with Ctrl+V, choose a file or try the sample.",
      "empty.camera": "Press Start camera to see yourself in characters.",
      "empty.nothing": "Nothing to draw. Try raising the threshold or lowering the brightness.",
    },
    vi: {
      tag: "Biến chữ, ảnh hoặc camera thành ký tự.",
      langAria: "Đổi ngôn ngữ", themeToDark: "Chuyển sang giao diện tối", themeToLight: "Chuyển sang giao diện sáng",
      "src.title": "Nguồn", "src.text": "Chữ", "src.image": "Ảnh", "src.camera": "Camera",
      "txt.label": "Văn bản cần chuyển", "txt.ph": "Nhập chữ, có thể nhiều dòng",
      "font.title": "Phông chữ", "font.upload": "Tải phông lên", "font.formats": ".otf .ttf .woff .woff2",
      "font.err": "Không đọc được tệp phông này. Hãy thử .otf, .ttf, .woff hoặc .woff2.",
      "font.default": "Mặc định", "font.sans": "Sans hệ thống", "font.serif": "Serif hệ thống", "font.mono": "Mono hệ thống",
      "tag.system": "Hệ thống", "tag.sans": "Sans", "tag.display": "Tiêu đề", "tag.script": "Thư pháp", "tag.hand": "Viết tay",
      "tag.pixel": "Pixel", "tag.tech": "Công nghệ", "tag.mono": "Mono", "tag.serif": "Serif", "tag.round": "Bo tròn",
      "tag.deco": "Trang trí", "tag.upload": "Đã tải lên",
      "txt.style": "Kiểu chữ", "style.solid": "Đặc", "style.outline": "Viền",
      "txt.align": "Căn lề", "align.left": "Trái", "align.center": "Giữa", "align.right": "Phải",
      "txt.italic": "In nghiêng", "adj.weight": "Độ đậm chữ",
      "img.choose": "Chọn ảnh hoặc kéo thả vào đây",
      "img.sub": "Có thể dán bằng Ctrl+V. PNG, JPG, WebP, GIF, SVG.",
      "img.replace": "Bấm để thay ảnh", "img.pasted": "Ảnh đã dán", "img.sampleName": "Ảnh mẫu",
      "img.sample": "Thử ảnh mẫu",
      "img.notimg": "Tệp này không phải ảnh. Hãy chọn PNG, JPG, WebP, GIF hoặc SVG.",
      "img.fail": "Không đọc được ảnh này. Hãy thử PNG, JPG, WebP hoặc GIF.",
      "cam.hint": "ASCII trực tiếp từ webcam. Video không rời khỏi thiết bị của bạn.",
      "cam.start": "Bật camera", "cam.stop": "Tắt camera", "cam.pause": "Tạm dừng", "cam.resume": "Tiếp tục",
      "cam.snap": "Chụp khung hình", "cam.switch": "Đổi camera", "cam.mirror": "Lật gương", "cam.mirror.sub": "Lật hình như soi gương.",
      "cam.denied": "Không mở được camera. Hãy cho phép truy cập camera trong trình duyệt rồi thử lại.",
      "cam.unsupported": "Trình duyệt này không mở được camera ở đây. Camera cần https:// hoặc localhost.",
      "chars.title": "Bộ ký tự",
      "mode.classic": "Cổ điển", "mode.detailed": "Chi tiết", "mode.blocks": "Khối", "mode.binary": "Nhị phân",
      "mode.braille": "Braille", "mode.quad": "Ô vuông", "mode.edges": "Đường viền", "mode.word": "Lấp bằng chữ",
      "mode.custom": "Tuỳ chọn", "mode.dots": "Chấm", "mode.hex": "Hex", "mode.retro": "Hoài cổ",
      "word.label": "Cụm từ lặp lại", "word.hint": "Các chữ nối tiếp nhau để lấp đầy vùng tối.",
      "custom.label": "Ký tự, từ sáng đến tối", "custom.hint": "Ký tự đầu cho vùng sáng nhất, ký tự cuối cho vùng tối nhất.",
      "adj.title": "Điều chỉnh", "adj.width": "Chiều rộng (cột)", "adj.contrast": "Tương phản", "adj.bright": "Độ sáng",
      "adj.gamma": "Gamma", "adj.sharpen": "Làm nét", "adj.thresh": "Ngưỡng", "adj.invert": "Đảo ngược",
      "adj.auto": "Tự cân sáng", "adj.auto.sub": "Kéo giãn ảnh xám xịt ra toàn dải sáng tối.",
      "adj.dither": "Khử bậc (dither)", "adj.dither.sub": "Chuyển sắc mượt hơn cho Braille và Ô vuông.",
      "adj.flip": "Lật", "adj.flipH": "Ngang", "adj.flipV": "Dọc",
      "col.title": "Màu sắc",
      "pal.theme": "Theo giao diện", "pal.phosphor": "Phốt pho", "pal.amber": "Hổ phách", "pal.ice": "Băng", "pal.paper": "Giấy",
      "pal.mono": "Đen trắng", "pal.rose": "Hồng", "pal.custom": "Tuỳ chọn",
      "col.fg": "Chữ", "col.bg": "Nền",
      "col.source": "Dùng màu của ảnh", "col.source.sub": "Mỗi ký tự lấy màu của vùng ảnh nó phủ lên.",
      reset: "Đặt lại cài đặt",
      "meta.unit": "cột × dòng", "meta.chars": "{n} ký tự",
      "view.fit": "Vừa khung", "view.size": "Cỡ ký tự",
      "out.copy": "Sao chép", "out.copied": "Đã chép", "out.copyAria": "Sao chép vào clipboard", "out.export": "Xuất",
      "out.aria": "Kết quả ASCII",
      "exp.txt": "Văn bản", "exp.png": "Ảnh", "exp.svg": "Vector", "exp.html": "Trang web",
      "exp.copyimg": "Chép ảnh", "exp.scale": "Tỉ lệ PNG",
      "empty.text": "Nhập chữ ở bên trái để bắt đầu.",
      "empty.image": "Thả ảnh vào bất kỳ đâu, dán bằng Ctrl+V, chọn tệp hoặc thử ảnh mẫu.",
      "empty.camera": "Bấm Bật camera để thấy mình bằng ký tự.",
      "empty.nothing": "Không có gì để vẽ. Thử tăng ngưỡng hoặc giảm độ sáng.",
    },
  };
  let lang = "en";
  const t = (k, vars) => {
    let s = (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k;
    if (vars) for (const [a, b] of Object.entries(vars)) s = s.replace(`{${a}}`, b);
    return s;
  };

  /* ================================================================
     Character sets
     ================================================================ */
  // lh = line-height (times font size). Cell aspect ratio = 0.6 / lh.
  const QUAD = [" ", "▘", "▝", "▀", "▖", "▌", "▞", "▛", "▗", "▚", "▐", "▜", "▄", "▙", "▟", "█"];
  const DETAILED = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
  const BRAILLE_DOTS = [[0, 0, 0x01], [0, 1, 0x02], [0, 2, 0x04], [1, 0, 0x08], [1, 1, 0x10], [1, 2, 0x20], [0, 3, 0x40], [1, 3, 0x80]];

  const MODES = [
    { id: "classic",  sample: ".:-=+*#%@",  kind: "ramp",    ramp: " .:-=+*#%@", lh: 1.2 },
    { id: "detailed", sample: "$@B%8&WM#*", kind: "ramp",    ramp: DETAILED,    lh: 1.2 },
    { id: "blocks",   sample: "░▒▓█",       kind: "ramp",    ramp: " ░▒▓█",     lh: 1.0 },
    { id: "binary",   sample: "0 1 0 1",    kind: "ramp",    ramp: " 01",       lh: 1.2 },
    { id: "braille",  sample: "⠁⠃⠇⡇⣇⣿",    kind: "braille", lh: 1.2 },
    { id: "quad",     sample: "▘▝▚▙▟█",     kind: "quad",    lh: 1.0 },
    { id: "edges",    sample: "/ \\ | -",   kind: "edge",    lh: 1.2 },
    { id: "word",     sample: "",           kind: "word",    lh: 1.2 },
    { id: "custom",   sample: "",           kind: "ramp",    lh: 1.2 },
    { id: "dots",     sample: "·:•●",       kind: "ramp",    ramp: " ·:•●",     lh: 1.2 },
    { id: "hex",      sample: "1A5F",       kind: "ramp",    ramp: " 1234567890ABCDEF", lh: 1.2 },
    { id: "retro",    sample: ".;+xX$&",    kind: "ramp",    ramp: " .,;:+=xX$&", lh: 1.2 },
  ];

  /* ================================================================
     Fonts for text
     ================================================================ */
  // css = font stack. Bundled fonts live in fonts.css (base64), so they also work from file://.
  // z = preview size multiplier for fonts that are very wide or narrow.
  const FONTS = [
    { id: "default",  tag: "system", css: null },
    { id: "sys-sans", tag: "system", css: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
    { id: "sys-serif", tag: "system", css: 'Georgia, "Times New Roman", serif' },
    { id: "sys-mono", tag: "system", css: MONO },
    { id: "bvp", name: "Be Vietnam Pro", tag: "sans", css: '"Be Vietnam Pro", sans-serif' },
    { id: "grotesk", name: "Space Grotesk", tag: "sans", css: '"Space Grotesk", sans-serif' },
    { id: "oswald", name: "Oswald", tag: "display", css: '"Oswald", sans-serif' },
    { id: "anton", name: "Anton", tag: "display", css: '"Anton", sans-serif' },
    { id: "bebas", name: "Bebas Neue", tag: "display", css: '"Bebas Neue", sans-serif' },
    { id: "archivo", name: "Archivo Black", tag: "display", css: '"Archivo Black", sans-serif' },
    { id: "bangers", name: "Bangers", tag: "display", css: '"Bangers", cursive' },
    { id: "righteous", name: "Righteous", tag: "display", css: '"Righteous", sans-serif' },
    { id: "baloo", name: "Baloo 2", tag: "round", css: '"Baloo 2", sans-serif' },
    { id: "fredoka", name: "Fredoka", tag: "round", css: '"Fredoka", sans-serif' },
    { id: "playfair", name: "Playfair Display", tag: "serif", css: '"Playfair Display", serif', z: .85 },
    { id: "lobster", name: "Lobster", tag: "script", css: '"Lobster", cursive' },
    { id: "pacifico", name: "Pacifico", tag: "script", css: '"Pacifico", cursive' },
    { id: "dancing", name: "Dancing Script", tag: "script", css: '"Dancing Script", cursive' },
    { id: "marker", name: "Permanent Marker", tag: "hand", css: '"Permanent Marker", cursive', z: .85 },
    { id: "caveat", name: "Caveat", tag: "hand", css: '"Caveat", cursive' },
    { id: "orbitron", name: "Orbitron", tag: "tech", css: '"Orbitron", sans-serif', z: .9 },
    { id: "chakra", name: "Chakra Petch", tag: "tech", css: '"Chakra Petch", sans-serif' },
    { id: "monoton", name: "Monoton", tag: "deco", css: '"Monoton", cursive', z: .8 },
    { id: "pixel", name: "Press Start 2P", tag: "pixel", css: '"Press Start 2P", monospace', z: .55 },
    { id: "vt323", name: "VT323", tag: "pixel", css: '"VT323", monospace', z: 1.15 },
    { id: "jbmono", name: "JetBrains Mono", tag: "mono", css: '"JetBrains Mono", monospace', z: .9 },
    { id: "torus", name: "Torus", tag: "display", css: '"Torus", sans-serif' },
  ];
  const fontById = (id) => FONTS.find((f) => f.id === id) || FONTS[0];

  /* ================================================================
     Colour palettes for the output
     ================================================================ */
  // fg/bg = null means "follow the UI theme".
  const PALETTES = [
    { id: "theme",    fg: null,      bg: null },
    { id: "phosphor", fg: "#3DFFA8", bg: "#04120C" },
    { id: "amber",    fg: "#FFB000", bg: "#1A1000" },
    { id: "ice",      fg: "#7DE7FF", bg: "#06141F" },
    { id: "paper",    fg: "#1B1A17", bg: "#F6F2E7" },
    { id: "mono",     fg: "#F2F2F2", bg: "#000000" },
    { id: "rose",     fg: "#B3124F", bg: "#FFEFF4" },
    { id: "custom",   fg: null,      bg: null },
  ];

  /* ================================================================
     State
     ================================================================ */
  const DEFAULTS = {
    text: "Hello, World",
    font: "torus",
    italic: false, outline: false, align: "left", weight: 3,
    mode: "classic",
    colsText: narrow ? 64 : 120,
    colsImg: narrow ? 64 : 90,
    contrast: 100, bright: 0, gamma: 100, sharpen: 0, sens: 50,
    invert: false, auto: false, dither: true, flipH: false, flipV: false,
    word: "ASCII", custom: ".oO@",
    palette: "theme", fg: "#35e3a5", bg: "#07100d", srcCol: false,
    fit: true, px: 10, scale: 2,
  };
  const state = Object.assign({}, DEFAULTS, {
    source: "text",
    img: null, imgName: "",
    last: null,
  });
  const PERSIST = Object.keys(DEFAULTS);

  try {
    const saved = JSON.parse(localStorage.getItem("a2a-state") || "null");
    if (saved && typeof saved === "object") {
      for (const k of PERSIST) if (k !== "font" && k in saved && typeof saved[k] === typeof DEFAULTS[k]) state[k] = saved[k];
    }
  } catch {}
  if (!MODES.some((m) => m.id === state.mode)) state.mode = DEFAULTS.mode;
  if (!PALETTES.some((p) => p.id === state.palette)) state.palette = DEFAULTS.palette;
  if (!FONTS.some((f) => f.id === state.font)) state.font = DEFAULTS.font;

  let saveTimer = 0;
  function persist() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        const o = {};
        for (const k of PERSIST) o[k] = state[k];
        if (state.font.startsWith("user-")) o.font = DEFAULTS.font; // uploaded fonts don't survive a reload
        localStorage.setItem("a2a-state", JSON.stringify(o));
      } catch {}
    }, 250);
  }

  const cam = { on: false, paused: false, facing: "user", mirror: true, stream: null };

  const el = {};
  for (const id of [
    "txt", "file", "out", "cv", "empty", "empty-msg", "stage", "screen", "meta-wrap", "meta-size", "meta-chars", "note", "modes",
    "cols", "contrast", "bright", "gamma", "sharpen", "sens", "weight", "invert", "auto", "dither", "word", "custom",
    "copy", "export", "menu", "dl-txt", "dl-png", "dl-svg", "dl-html", "copy-img", "theme", "lang", "lang-lbl",
    "src-seg", "style-seg", "align-seg", "scale-seg", "fonts", "font-btn", "font-file", "font-note", "font-count",
    "italic", "fit", "px", "pals", "fg", "bg", "srccol", "row-custom-col", "row-srccol", "flip-h", "flip-v",
    "cam", "cam-toggle", "cam-toggle-lbl", "cam-pause", "cam-pause-lbl", "cam-extra", "cam-snap", "cam-flip", "cam-note",
    "mirror", "sample-btn", "reset", "thumb", "ico", "drop-title", "drop-sub",
  ]) el[id.replace(/-(\w)/g, (_, c) => c.toUpperCase())] = document.getElementById(id);
  el.copyLbl = el.copy.querySelector(".lbl");

  const curMode = () => MODES.find((m) => m.id === state.mode);
  const isDark = () => root.dataset.theme === "dark";
  const cssVar = (n) => getComputedStyle(root).getPropertyValue(n).trim();

  /* ================================================================
     i18n application
     ================================================================ */
  function applyI18n() {
    root.lang = lang;
    for (const n of document.querySelectorAll("[data-i18n]")) n.textContent = t(n.dataset.i18n);
    for (const n of document.querySelectorAll("[data-i18n-ph]")) n.placeholder = t(n.dataset.i18nPh);
    for (const n of document.querySelectorAll("[data-i18n-aria]")) n.setAttribute("aria-label", t(n.dataset.i18nAria));

    for (const m of MODES) nameEls[m.id].textContent = t("mode." + m.id);
    for (const p of PALETTES) palNameEls[p.id].textContent = t("pal." + p.id);
    for (const f of FONTS) if (f.tagEl) f.tagEl.textContent = t("tag." + f.tag);
    for (const f of FONTS) if (f.id === "default" || f.id === "sys-sans" || f.id === "sys-serif" || f.id === "sys-mono") f.nameEl.textContent = t("font." + f.id.replace("sys-", "").replace("default", "default"));

    syncThemeButton();
    syncCam();
    refreshImageLabels();
    schedule();
  }
  // English-only interface; language switching is disabled.

  /* ================================================================
     Theme
     ================================================================ */
  function syncThemeButton() {
    el.theme.setAttribute("aria-label", isDark() ? t("themeToLight") : t("themeToDark"));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = isDark() ? "#060C0A" : "#EDEBE4";
  }
  el.theme.addEventListener("click", () => {
    root.classList.add("theme-anim");
    root.dataset.theme = isDark() ? "light" : "dark";
    try { localStorage.setItem("a2a-theme", root.dataset.theme); } catch {}
    syncThemeButton();
    paintPaletteSwatches();
    schedule();
    setTimeout(() => root.classList.remove("theme-anim"), 450);
  });

  /* ================================================================
     Palette -> actual colours
     ================================================================ */
  function outColors() {
    const p = PALETTES.find((x) => x.id === state.palette) || PALETTES[0];
    if (p.id === "custom") return { fg: state.fg, bg: state.bg };
    if (p.fg) return { fg: p.fg, bg: p.bg };
    return { fg: cssVar("--ink"), bg: cssVar("--field") };
  }
  function hexLum(hex) {
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    if (!m) return 0;
    return (0.299 * parseInt(m[1], 16) + 0.587 * parseInt(m[2], 16) + 0.114 * parseInt(m[3], 16)) / 255;
  }
  const outDark = () => hexLum(outColors().bg) < 0.5;

  function applyPalette() {
    const { fg, bg } = outColors();
    el.screen.style.setProperty("--out-fg", fg);
    el.screen.style.setProperty("--out-bg", bg);
  }

  /* ================================================================
     Build the sidebar tiles
     ================================================================ */
  const nameEls = {}, sampleEls = {}, palNameEls = {};

  for (const m of MODES) {
    const label = document.createElement("label");
    label.className = "mode";
    const input = document.createElement("input");
    input.type = "radio"; input.name = "mode"; input.value = m.id;
    input.checked = m.id === state.mode;
    const tile = document.createElement("span");
    tile.className = "tile";
    const sample = document.createElement("span");
    sample.className = "sample"; sample.setAttribute("aria-hidden", "true");
    const name = document.createElement("span");
    name.className = "name";
    tile.append(sample, name);
    label.append(input, tile);
    el.modes.append(label);
    sampleEls[m.id] = sample; nameEls[m.id] = name;
    input.addEventListener("change", () => {
      state.mode = m.id;
      tile.classList.remove("pop"); void tile.offsetWidth; tile.classList.add("pop");
      syncUi(); schedule(true); persist();
    });
    tile.addEventListener("animationend", () => tile.classList.remove("pop"));
  }
  function refreshSamples() {
    for (const m of MODES) {
      if (m.id === "word") sampleEls[m.id].textContent = Array.from(state.word || "ASCII").slice(0, 10).join("");
      else if (m.id === "custom") sampleEls[m.id].textContent = state.custom;
      else sampleEls[m.id].textContent = m.sample;
    }
  }

  for (const p of PALETTES) {
    const label = document.createElement("label");
    label.className = "pal";
    const input = document.createElement("input");
    input.type = "radio"; input.name = "pal"; input.value = p.id; input.checked = p.id === state.palette;
    const tile = document.createElement("span");
    tile.className = "tile";
    const sw = document.createElement("span");
    sw.className = "sw"; sw.textContent = "Aa"; sw.setAttribute("aria-hidden", "true");
    sw.dataset.pal = p.id;
    const name = document.createElement("span");
    name.className = "name";
    tile.append(sw, name);
    label.append(input, tile);
    el.pals.append(label);
    palNameEls[p.id] = name;
    input.addEventListener("change", () => { state.palette = p.id; syncUi(); schedule(); persist(); });
  }
  function paintPaletteSwatches() {
    for (const sw of el.pals.querySelectorAll(".sw")) {
      const id = sw.dataset.pal;
      let c;
      if (id === "theme") c = { fg: cssVar("--ink"), bg: cssVar("--field") };
      else if (id === "custom") c = { fg: state.fg, bg: state.bg };
      else { const p = PALETTES.find((x) => x.id === id); c = { fg: p.fg, bg: p.bg }; }
      sw.style.color = c.fg; sw.style.background = c.bg;
    }
  }

  let userFontCount = 0;
  function addFontCard(f) {
    const label = document.createElement("label");
    label.className = "fnt";
    const input = document.createElement("input");
    input.type = "radio"; input.name = "font"; input.value = f.id; input.checked = f.id === state.font;
    const tile = document.createElement("span");
    tile.className = "tile";
    const nm = document.createElement("span");
    nm.className = "fname";
    nm.style.fontFamily = f.css || "inherit";
    if (f.z) nm.style.fontSize = Math.round(19 * f.z) + "px";
    if (f.name) nm.textContent = f.name;
    const tg = document.createElement("span");
    tg.className = "ftag";
    f.nameEl = nm; f.tagEl = tg;
    tile.append(nm, tg);
    label.append(input, tile);
    el.fonts.append(label);
    input.addEventListener("change", () => {
      state.font = f.id; el.fontNote.textContent = "";
      syncUi(); schedule(true); persist();
    });
    return label;
  }
  for (const f of FONTS) addFontCard(f);

  /* ================================================================
     Fonts: stacks, loading, uploads
     ================================================================ */
  // The browser's default font is whatever <html> computes to, since the
  // stylesheet never sets a font-family there.
  const defaultFamily = () => (getComputedStyle(root).fontFamily || "serif") + ", serif";
  // "Browser default" is previewed in the browser's own default font, not the app's UI font.
  FONTS[0].nameEl.style.fontFamily = defaultFamily();
  const textFamily = () => {
    const f = fontById(state.font);
    return f.css || defaultFamily();
  };

  // Bundled fonts are loaded lazily; the canvas needs them ready before measuring.
  const fontLoads = new Set();
  function ensureFont(family, sample) {
    const spec = `160px ${family}`;
    let ready = true;
    try { ready = document.fonts.check(spec, sample); } catch {}
    if (ready) return true;
    const key = family + "|" + sample;
    if (!fontLoads.has(key)) {
      fontLoads.add(key);
      document.fonts.load(spec, sample).catch(() => {}).finally(() => { textCache.key = ""; schedule(true); });
    }
    return false;
  }

  async function loadFontFile(file) {
    el.fontNote.textContent = "";
    if (!file) return;
    try {
      const fam = `UserFont${++userFontCount}`;
      const face = new FontFace(fam, await file.arrayBuffer());
      await face.load();
      document.fonts.add(face);
      const f = { id: "user-" + userFontCount, name: file.name.replace(/\.[^.]+$/, ""), tag: "upload", css: `"${fam}", sans-serif` };
      FONTS.push(f);
      const card = addFontCard(f);
      f.tagEl.textContent = t("tag.upload");
      state.font = f.id;
      el.fontCount.textContent = String(FONTS.length);
      syncUi();
      card.scrollIntoView({ block: "nearest" });
      schedule(true);
    } catch {
      el.fontNote.textContent = t("font.err");
    }
  }
  el.fontBtn.addEventListener("click", () => el.fontFile.click());
  el.fontFile.addEventListener("change", () => { loadFontFile(el.fontFile.files[0]); el.fontFile.value = ""; });

  /* ================================================================
     Segmented controls
     ================================================================ */
  function bindSeg(seg, attr, getVal, setVal) {
    seg.querySelectorAll("button").forEach((b, i) => {
      b.addEventListener("click", () => {
        if (getVal() === b.dataset[attr]) return;
        setVal(b.dataset[attr], i);
      });
    });
  }
  function paintSeg(seg, attr, val) {
    const btns = Array.from(seg.querySelectorAll("button"));
    btns.forEach((b, i) => {
      const on = b.dataset[attr] === String(val);
      b.setAttribute("aria-pressed", String(on));
      if (on) seg.style.setProperty("--pos", i);
    });
  }
  bindSeg(el.srcSeg, "src", () => state.source, (v) => setSource(v));
  bindSeg(el.styleSeg, "style", () => (state.outline ? "outline" : "solid"), (v) => { state.outline = v === "outline"; syncUi(); schedule(true); persist(); });
  bindSeg(el.alignSeg, "align", () => state.align, (v) => { state.align = v; syncUi(); schedule(); persist(); });
  bindSeg(el.scaleSeg, "scale", () => String(state.scale), (v) => { state.scale = +v; syncUi(); persist(); });

  /* ================================================================
     Source: text
     ================================================================ */
  let textCache = { key: "", val: null };

  function buildTextSource() {
    const family = textFamily();
    const key = [state.text, family, state.weight, state.italic, state.outline, state.align].join("|");
    if (textCache.key === key) return textCache.val;

    const lines = state.text.replace(/\r/g, "").split("\n");
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    let val = null;

    if (lines.some((l) => l.trim())) {
      if (!ensureFont(family, state.text)) return textCache.val; // keep the last picture until the font arrives
      const style = state.italic ? "italic " : "";
      const probe = document.createElement("canvas").getContext("2d");
      let size = 160;
      probe.font = `${style}${size}px ${family}`;
      let maxW = Math.max(...lines.map((l) => probe.measureText(l || " ").width));
      if (maxW > 7000) {
        size = Math.floor(size * 7000 / maxW);
        probe.font = `${style}${size}px ${family}`;
        maxW = Math.max(...lines.map((l) => probe.measureText(l || " ").width));
      }

      const pad = Math.round(size * 0.3);
      const lineH = size * 1.25;
      const c = document.createElement("canvas");
      c.width = Math.ceil(maxW + pad * 2);
      c.height = Math.ceil(lines.length * lineH + pad * 2);
      const x = c.getContext("2d", { willReadFrequently: true });
      x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height);
      x.font = `${style}${size}px ${family}`;
      x.fillStyle = "#000"; x.strokeStyle = "#000";
      x.lineJoin = "round";
      x.textAlign = state.align;
      const ax = state.align === "left" ? pad : state.align === "center" ? c.width / 2 : c.width - pad;
      lines.forEach((l, i) => {
        const y = pad + (i + 1) * lineH - size * 0.3;
        if (state.outline) {
          x.lineWidth = Math.max(2, size / 26);
          x.strokeText(l, ax, y);
        } else {
          x.lineWidth = state.weight * size / 80;
          x.fillText(l, ax, y);
          if (state.weight > 0) x.strokeText(l, ax, y);
        }
      });

      // Crop to the inked area.
      const data = x.getImageData(0, 0, c.width, c.height).data;
      let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
      for (let y = 0; y < c.height; y++) {
        for (let xx = 0; xx < c.width; xx++) {
          if (data[(y * c.width + xx) * 4] < 200) {
            if (xx < x0) x0 = xx;
            if (xx > x1) x1 = xx;
            if (y < y0) y0 = y;
            if (y > y1) y1 = y;
          }
        }
      }
      if (x1 >= 0) {
        const m = Math.round(size * 0.06);
        x0 = Math.max(0, x0 - m); y0 = Math.max(0, y0 - m);
        x1 = Math.min(c.width - 1, x1 + m); y1 = Math.min(c.height - 1, y1 + m);
        const w = x1 - x0 + 1, h = y1 - y0 + 1;
        const o = document.createElement("canvas");
        o.width = w; o.height = h;
        const ox = o.getContext("2d");
        ox.fillStyle = "#fff"; ox.fillRect(0, 0, w, h);
        ox.drawImage(c, x0, y0, w, h, 0, 0, w, h);
        val = { node: o, w, h };
      }
    }
    textCache = { key, val };
    return val;
  }

  /* ================================================================
     Source: image / camera
     ================================================================ */
  function nodeSize(n) {
    if (n.videoWidth) return [n.videoWidth, n.videoHeight];
    if (n.naturalWidth) return [n.naturalWidth, n.naturalHeight];
    return [n.width || 0, n.height || 0];
  }
  function getSource() {
    if (state.source === "text") return buildTextSource();
    if (state.source === "camera") {
      if (!cam.on || !el.cam.videoWidth) return null;
      return { node: el.cam, w: el.cam.videoWidth, h: el.cam.videoHeight };
    }
    if (!state.img) return null;
    const [w, h] = nodeSize(state.img);
    return w && h ? { node: state.img, w, h } : null;
  }

  const flipX = () => state.flipH !== (state.source === "camera" && cam.mirror);
  const flipY = () => state.flipV;

  // Draw the source at w×h (halving step by step for a clean downscale) and return RGBA pixels.
  function sampleRGBA(src, w, h) {
    let cur = src.node, cw = src.w, ch = src.h;
    while (cw >= w * 2 && ch >= h * 2) {
      const nw = Math.max(w, Math.floor(cw / 2)), nh = Math.max(h, Math.floor(ch / 2));
      const c = document.createElement("canvas");
      c.width = nw; c.height = nh;
      const x = c.getContext("2d");
      x.fillStyle = "#fff"; x.fillRect(0, 0, nw, nh);
      x.imageSmoothingQuality = "high";
      x.drawImage(cur, 0, 0, nw, nh);
      cur = c; cw = nw; ch = nh;
    }
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const x = c.getContext("2d", { willReadFrequently: true });
    x.fillStyle = "#fff"; x.fillRect(0, 0, w, h);
    x.imageSmoothingQuality = "high";
    x.save();
    x.translate(flipX() ? w : 0, flipY() ? h : 0);
    x.scale(flipX() ? -1 : 1, flipY() ? -1 : 1);
    x.drawImage(cur, 0, 0, w, h);
    x.restore();
    return x.getImageData(0, 0, w, h).data;
  }

  // Returns density: 1 = ink (dense character), 0 = empty.
  function density(src, w, h, inv) {
    const px = sampleRGBA(src, w, h);
    const n = w * h;
    let lum = new Float32Array(n);
    for (let i = 0; i < n; i++) lum[i] = (0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]) / 255;

    if (state.auto) {                       // stretch between the 1st and 99th percentile
      const hist = new Uint32Array(256);
      for (let i = 0; i < n; i++) hist[Math.min(255, (lum[i] * 255) | 0)]++;
      let acc = 0, lo = 0, hi = 255;
      const cut = n * 0.01;
      for (let i = 0; i < 256; i++) { acc += hist[i]; if (acc > cut) { lo = i; break; } }
      acc = 0;
      for (let i = 255; i >= 0; i--) { acc += hist[i]; if (acc > cut) { hi = i; break; } }
      if (hi - lo > 4) for (let i = 0; i < n; i++) lum[i] = clamp((lum[i] - lo / 255) / ((hi - lo) / 255), 0, 1);
    }

    if (state.sharpen > 0 && w > 2 && h > 2) {   // unsharp mask with a 3×3 box blur
      const amt = state.sharpen / 100 * 2.5;
      const out = new Float32Array(n);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let s = 0, c = 0;
          for (let dy = -1; dy <= 1; dy++) {
            const yy = y + dy; if (yy < 0 || yy >= h) continue;
            for (let dx = -1; dx <= 1; dx++) {
              const xx = x + dx; if (xx < 0 || xx >= w) continue;
              s += lum[yy * w + xx]; c++;
            }
          }
          const i = y * w + x;
          out[i] = clamp(lum[i] + amt * (lum[i] - s / c), 0, 1);
        }
      }
      lum = out;
    }

    const k = state.contrast / 100, b = state.bright / 100, g = 1 / (state.gamma / 100);
    for (let i = 0; i < n; i++) {
      let v = clamp((lum[i] - 0.5) * k + 0.5 + b, 0, 1);
      if (g !== 1) v = Math.pow(v, g);
      lum[i] = inv ? v : 1 - v;
    }
    return lum;
  }

  function binarize(d, W, H, dither) {
    const shift = state.sens / 100 - 0.5;
    const e = new Float32Array(W * H);
    for (let i = 0; i < e.length; i++) e[i] = clamp(d[i] + shift, 0, 1);
    const out = new Uint8Array(W * H);
    if (!dither) {
      for (let i = 0; i < e.length; i++) out[i] = e[i] > 0.5 ? 1 : 0;
      return out;
    }
    // Floyd–Steinberg
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x, old = e[i], nw = old > 0.5 ? 1 : 0, err = old - nw;
        out[i] = nw;
        if (x + 1 < W) e[i + 1] += err * 7 / 16;
        if (y + 1 < H) {
          if (x > 0) e[i + W - 1] += err * 3 / 16;
          e[i + W] += err * 5 / 16;
          if (x + 1 < W) e[i + W + 1] += err / 16;
        }
      }
    }
    return out;
  }

  /* ================================================================
     Generate
     ================================================================ */
  function emptyMessage() {
    return t(state.source === "text" ? "empty.text" : state.source === "image" ? "empty.image" : "empty.camera");
  }

  function generate() {
    const src = getSource();
    if (!src) return { empty: emptyMessage() };
    const m = curMode();
    const aspect = 0.6 / m.lh;
    const cols = state.source === "text" ? state.colsText : state.colsImg;
    const rows = clamp(Math.round(cols * src.h / src.w * aspect), 1, 600);
    // On a dark output, dense characters look bright, so photos need inverting.
    const inv = state.invert !== (state.source !== "text" && outDark());
    const lines = [];

    if (m.kind === "ramp" || m.kind === "word") {
      const d = density(src, cols, rows, inv);
      if (m.kind === "ramp") {
        let ramp = m.id === "custom" ? Array.from(state.custom) : Array.from(m.ramp);
        if (ramp.length === 0) ramp = [" ", "@"];
        if (ramp.length === 1) ramp.unshift(" ");
        const n = ramp.length - 1;
        for (let y = 0; y < rows; y++) {
          let s = "";
          for (let x = 0; x < cols; x++) s += ramp[Math.round(d[y * cols + x] * n)];
          lines.push(s);
        }
      } else {
        const phrase = Array.from(state.word.replace(/\s+/g, ""));
        if (!phrase.length) phrase.push("A");
        const thr = 1 - state.sens / 100;
        let k = 0;
        for (let y = 0; y < rows; y++) {
          let s = "";
          for (let x = 0; x < cols; x++) s += d[y * cols + x] > thr ? phrase[k++ % phrase.length] : " ";
          lines.push(s);
        }
      }
    } else if (m.kind === "braille") {
      const W = cols * 2, H = rows * 4;
      const bin = binarize(density(src, W, H, inv), W, H, state.dither);
      for (let cy = 0; cy < rows; cy++) {
        let s = "";
        for (let cx = 0; cx < cols; cx++) {
          let mask = 0;
          for (const [dx, dy, bit] of BRAILLE_DOTS) if (bin[(cy * 4 + dy) * W + cx * 2 + dx]) mask |= bit;
          s += String.fromCharCode(0x2800 + mask);
        }
        lines.push(s);
      }
    } else if (m.kind === "quad") {
      const W = cols * 2, H = rows * 2;
      const bin = binarize(density(src, W, H, inv), W, H, state.dither);
      for (let cy = 0; cy < rows; cy++) {
        let s = "";
        for (let cx = 0; cx < cols; cx++) {
          const i = cy * 2 * W + cx * 2;
          s += QUAD[bin[i] | (bin[i + 1] << 1) | (bin[i + W] << 2) | (bin[i + W + 1] << 3)];
        }
        lines.push(s);
      }
    } else if (m.kind === "edge") {
      const d = density(src, cols, rows, inv);
      const th = 0.15 + (1 - state.sens / 100) * 2.2;
      const g = (xx, yy) => d[yy * cols + xx];
      for (let y = 0; y < rows; y++) {
        let s = "";
        for (let x = 0; x < cols; x++) {
          if (x === 0 || y === 0 || x === cols - 1 || y === rows - 1) { s += " "; continue; }
          const gx = (g(x + 1, y - 1) + 2 * g(x + 1, y) + g(x + 1, y + 1)) - (g(x - 1, y - 1) + 2 * g(x - 1, y) + g(x - 1, y + 1));
          const gy = (g(x - 1, y + 1) + 2 * g(x, y + 1) + g(x + 1, y + 1)) - (g(x - 1, y - 1) + 2 * g(x, y - 1) + g(x + 1, y - 1));
          if (Math.hypot(gx, gy) <= th) { s += " "; continue; }
          let phi = Math.atan2(gx, -gy) * 180 / Math.PI;
          phi = ((phi % 180) + 180) % 180;
          s += phi < 22.5 || phi >= 157.5 ? "-" : phi < 67.5 ? "\\" : phi < 112.5 ? "|" : "/";
        }
        lines.push(s);
      }
    }

    // Per-cell colours from the picture (not for text, which has none).
    const colors = state.srcCol && state.source !== "text" ? sampleRGBA(src, cols, rows) : null;

    // Trim empty rows and trailing spaces; remember how many leading rows were dropped.
    const trimmed = lines.map((l) => l.replace(/ +$/, ""));
    let row0 = 0;
    while (trimmed.length && !trimmed[0]) { trimmed.shift(); row0++; }
    while (trimmed.length && !trimmed[trimmed.length - 1]) trimmed.pop();
    if (!trimmed.length) return { empty: t("empty.nothing") };
    return { text: trimmed.join("\n"), lines: trimmed, lh: m.lh, cols, rows: trimmed.length, colors, row0 };
  }

  /* ================================================================
     Rendering
     ================================================================ */
  let revealId = 0;
  function show(text, animate) {
    cancelAnimationFrame(revealId);
    const lines = text.split("\n");
    if (!animate || reduced || lines.length < 4) { el.out.textContent = text; return; }
    const step = Math.max(1, Math.ceil(lines.length / 24));
    let n = 0;
    const tick = () => {
      n = Math.min(lines.length, n + step);
      el.out.textContent = lines.slice(0, n).join("\n");
      if (n < lines.length) revealId = requestAnimationFrame(tick);
    };
    tick();
  }

  // Measure the real width of the widest line (in em): Braille and block
  // characters can fall back to fonts with different widths.
  const measureCtx = document.createElement("canvas").getContext("2d");
  function widestEm(lines) {
    measureCtx.font = `100px ${MONO}`;
    let max = 0;
    for (const line of lines) max = Math.max(max, measureCtx.measureText(line).width);
    return max / 100;
  }

  function rgbKey(px, i) { return `rgb(${px[i * 4]},${px[i * 4 + 1]},${px[i * 4 + 2]})`; }

  function drawColored(v, fs, cw, canvas, dpr) {
    const lineH = fs * v.lh;
    const maxLen = v.maxLen;
    const w = Math.ceil(cw * maxLen), h = Math.ceil(lineH * v.lines.length);
    canvas.width = Math.max(1, Math.round(w * dpr)); canvas.height = Math.max(1, Math.round(h * dpr));
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    const x = canvas.getContext("2d");
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.clearRect(0, 0, w, h);
    x.font = `${fs}px ${MONO}`;
    x.textBaseline = "middle"; x.textAlign = "left";
    v.lines.forEach((line, r) => {
      const chars = Array.from(line);
      const base = (r + v.row0) * v.cols;
      for (let c = 0; c < chars.length; c++) {
        if (chars[c] === " ") continue;
        x.fillStyle = rgbKey(v.colors, base + c);
        x.fillText(chars[c], c * cw, (r + 0.5) * lineH);
      }
    });
  }

  function fit() {
    const v = state.last;
    if (!v) return;
    const cs = getComputedStyle(el.screen);
    const avail = el.screen.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const fs = state.fit ? clamp(avail / (v.em || v.cols * 0.602), 3, 32) : state.px;
    if (state.fit) {
      el.px.value = fs; paintRange(el.px);
    }
    if (v.colors) {
      const cw = fs * v.em / v.maxLen;
      let dpr = Math.min(devicePixelRatio || 1, 3);
      const pxCount = (cw * v.maxLen * dpr) * (fs * v.lh * v.lines.length * dpr);
      if (pxCount > 40e6) dpr = Math.max(1, dpr * Math.sqrt(40e6 / pxCount));
      drawColored(v, fs, cw, el.cv, dpr);
    } else {
      el.out.style.fontSize = fs + "px";
      el.out.style.lineHeight = fs * v.lh + "px";
    }
  }

  function update(animate = false) {
    const r = generate();
    const has = !!r.text;
    el.copy.disabled = el.export.disabled = !has;
    if (!has) {
      state.last = null;
      cancelAnimationFrame(revealId);
      el.out.hidden = true; el.cv.hidden = true;
      el.empty.hidden = false;
      el.emptyMsg.textContent = r.empty;
      el.metaWrap.hidden = true;
      return;
    }
    r.maxLen = Math.max(...r.lines.map((l) => Array.from(l).length));
    r.em = widestEm(r.lines);
    state.last = r;
    el.empty.hidden = true;
    const colored = !!r.colors;
    el.out.hidden = colored; el.cv.hidden = !colored;
    el.cv.setAttribute("aria-label", t("out.aria"));
    if (colored) cancelAnimationFrame(revealId);
    fit();
    if (!colored) show(r.text, animate);
    el.metaSize.textContent = `${r.cols}×${r.rows}`;
    el.metaChars.textContent = t("meta.chars", { n: r.text.replace(/\n/g, "").length.toLocaleString(lang === "vi" ? "vi-VN" : "en-US") });
    el.metaWrap.hidden = false;
  }

  let queued = false, wantAnim = false;
  function schedule(animate = false) {
    wantAnim = wantAnim || animate;
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const a = wantAnim; wantAnim = false;
      applyPalette();
      update(a);
    });
  }

  new ResizeObserver(() => fit()).observe(el.screen);

  /* ================================================================
     UI sync
     ================================================================ */
  function paintRange(input) {
    const p = (input.value - input.min) / (input.max - input.min) * 100;
    input.style.setProperty("--p", p + "%");
  }

  function syncUi() {
    const m = curMode();
    $("#extra-word").hidden = m.id !== "word";
    $("#extra-custom").hidden = m.id !== "custom";
    $("#row-sens").hidden = !["braille", "quad", "edge", "word"].includes(m.kind);
    $("#row-dither").hidden = !["braille", "quad"].includes(m.kind);
    $("#row-weight").hidden = state.outline;
    el.rowSrccol.hidden = state.source === "text";
    el.rowCustomCol.hidden = state.palette !== "custom";

    paintSeg(el.srcSeg, "src", state.source);
    paintSeg(el.styleSeg, "style", state.outline ? "outline" : "solid");
    paintSeg(el.alignSeg, "align", state.align);
    paintSeg(el.scaleSeg, "scale", state.scale);
    el.italic.checked = state.italic;
    el.flipH.setAttribute("aria-pressed", String(state.flipH));
    el.flipV.setAttribute("aria-pressed", String(state.flipV));
    el.fit.setAttribute("aria-pressed", String(state.fit));
    if (!state.fit) { el.px.value = state.px; paintRange(el.px); }

    el.fonts.querySelectorAll("input").forEach((i) => { i.checked = i.value === state.font; });
    el.fontCount.textContent = String(FONTS.length);
    el.txt.style.fontFamily = textFamily();

    el.cols.value = state.source === "text" ? state.colsText : state.colsImg;
    $("#cols-o").textContent = el.cols.value;
    $("#contrast-o").textContent = state.contrast + "%";
    $("#bright-o").textContent = (state.bright > 0 ? "+" : "") + state.bright;
    $("#gamma-o").textContent = (state.gamma / 100).toFixed(2);
    $("#sharpen-o").textContent = state.sharpen + "%";
    $("#sens-o").textContent = state.sens + "%";
    $("#weight-o").textContent = state.weight;
    for (const r of [el.cols, el.contrast, el.bright, el.gamma, el.sharpen, el.sens, el.weight]) paintRange(r);
    el.pals.querySelectorAll("input").forEach((i) => { i.checked = i.value === state.palette; });
    paintPaletteSwatches();
    applyPalette();
    refreshSamples();
  }

  function setSource(s) {
    const changed = state.source !== s;
    if (changed && state.source === "camera") camStop();
    state.source = s;
    $("#pane-text").hidden = s !== "text";
    $("#pane-image").hidden = s !== "image";
    $("#pane-camera").hidden = s !== "camera";
    syncUi();
    schedule(changed);
  }

  /* Text-ish inputs */
  el.txt.addEventListener("input", () => { state.text = el.txt.value; schedule(); persist(); });
  el.word.addEventListener("input", () => { state.word = el.word.value; refreshSamples(); schedule(); persist(); });
  el.custom.addEventListener("input", () => { state.custom = el.custom.value; refreshSamples(); schedule(); persist(); });
  el.italic.addEventListener("change", () => { state.italic = el.italic.checked; syncUi(); schedule(true); persist(); });

  /* Sliders */
  el.cols.addEventListener("input", () => {
    const v = +el.cols.value;
    if (state.source === "text") state.colsText = v; else state.colsImg = v;
    syncUi(); schedule(); persist();
  });
  for (const key of ["contrast", "bright", "gamma", "sharpen", "sens", "weight"]) {
    el[key].addEventListener("input", () => { state[key] = +el[key].value; syncUi(); schedule(); persist(); });
  }
  for (const key of ["invert", "auto", "dither"]) {
    el[key].addEventListener("change", () => { state[key] = el[key].checked; schedule(); persist(); });
  }
  el.srccol.addEventListener("change", () => { state.srcCol = el.srccol.checked; schedule(); persist(); });
  el.flipH.addEventListener("click", () => { state.flipH = !state.flipH; syncUi(); schedule(); persist(); });
  el.flipV.addEventListener("click", () => { state.flipV = !state.flipV; syncUi(); schedule(); persist(); });
  el.fg.addEventListener("input", () => { state.fg = el.fg.value; syncUi(); schedule(); persist(); });
  el.bg.addEventListener("input", () => { state.bg = el.bg.value; syncUi(); schedule(); persist(); });

  /* View size */
  el.fit.addEventListener("click", () => { state.fit = !state.fit; if (!state.fit) state.px = +el.px.value; syncUi(); fit(); persist(); });
  el.px.addEventListener("input", () => { state.fit = false; state.px = +el.px.value; syncUi(); fit(); persist(); });

  /* Reset */
  el.reset.addEventListener("click", () => {
    const keep = { font: state.font.startsWith("user-") ? state.font : DEFAULTS.font };
    Object.assign(state, DEFAULTS, keep);
    el.txt.value = state.text; el.word.value = state.word; el.custom.value = state.custom;
    el.invert.checked = state.invert; el.auto.checked = state.auto; el.dither.checked = state.dither;
    el.srccol.checked = state.srcCol; el.fg.value = state.fg; el.bg.value = state.bg;
    el.modes.querySelectorAll("input").forEach((i) => { i.checked = i.value === state.mode; });
    syncUi(); schedule(true); persist();
  });

  /* ================================================================
     Press ripple
     ================================================================ */
  document.addEventListener("pointerdown", (e) => {
    if (reduced) return;
    const host = e.target.closest(".pill, .chip, .seg button, .round-btn, .mode, .fnt, .pal");
    if (!host || host.disabled) return;
    const box = host.matches(".mode, .fnt, .pal") ? host.querySelector(".tile") : host;
    const r = box.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2;
    const span = document.createElement("span");
    span.className = "ripple";
    span.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    box.append(span);
    span.addEventListener("animationend", () => span.remove());
  });

  /* ================================================================
     Image input
     ================================================================ */
  let objectUrl = "";
  function refreshImageLabels() {
    if (state.img) {
      el.dropTitle.textContent = state.imgName === "@sample" ? t("img.sampleName") : state.imgName === "@pasted" ? t("img.pasted") : state.imgName;
      el.dropSub.textContent = t("img.replace");
    } else {
      el.dropTitle.textContent = t("img.choose");
      el.dropSub.textContent = t("img.sub");
    }
  }
  function useImage(node, name, thumbUrl) {
    state.img = node;
    state.imgName = name;
    el.thumb.src = thumbUrl; el.thumb.hidden = false;
    el.ico.hidden = true;
    refreshImageLabels();
    setSource("image");
    schedule(true);
  }
  function loadImageFile(file) {
    el.note.textContent = "";
    if (!file || !file.type.startsWith("image/")) {
      setSource("image");
      el.note.textContent = t("img.notimg");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = url;
      useImage(img, file.name || "@pasted", url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setSource("image");
      el.note.textContent = t("img.fail");
    };
    img.src = url;
  }
  el.file.addEventListener("change", () => { loadImageFile(el.file.files[0]); el.file.value = ""; });

  // A small procedural picture so there is something to try right away.
  function makeSample() {
    const W = 640, H = 420;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const x = c.getContext("2d");
    let g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#fdf3d0"); g.addColorStop(0.62, "#f4a259"); g.addColorStop(0.621, "#2d6a4f"); g.addColorStop(1, "#143d2e");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    g = x.createRadialGradient(W * 0.68, H * 0.3, 8, W * 0.68, H * 0.3, 70);   // sun
    g.addColorStop(0, "#fff"); g.addColorStop(1, "#ffd166");
    x.fillStyle = g; x.beginPath(); x.arc(W * 0.68, H * 0.3, 62, 0, 7); x.fill();
    const hill = (col, base, amp, ph) => {
      x.fillStyle = col; x.beginPath(); x.moveTo(0, H);
      for (let i = 0; i <= W; i += 8) x.lineTo(i, base + Math.sin(i / 90 + ph) * amp + Math.sin(i / 37 + ph * 2) * amp * 0.25);
      x.lineTo(W, H); x.fill();
    };
    hill("#40916c", H * 0.62, 26, 1); hill("#1b4332", H * 0.74, 22, 3);
    g = x.createRadialGradient(W * 0.3, H * 0.52, 6, W * 0.32, H * 0.56, 120);   // sphere
    g.addColorStop(0, "#ffffff"); g.addColorStop(0.45, "#e63946"); g.addColorStop(1, "#4a0d14");
    x.fillStyle = "rgba(0,0,0,.35)"; x.beginPath(); x.ellipse(W * 0.34, H * 0.9, 120, 18, 0, 0, 7); x.fill();
    x.fillStyle = g; x.beginPath(); x.arc(W * 0.3, H * 0.55, 100, 0, 7); x.fill();
    return c;
  }
  el.sampleBtn.addEventListener("click", () => {
    el.note.textContent = "";
    const c = makeSample();
    useImage(c, "@sample", c.toDataURL("image/png"));
  });

  const isFontFile = (f) => /\.(otf|ttf|woff2?)$/i.test(f.name);
  window.addEventListener("dragover", (e) => {
    e.preventDefault();
    document.body.classList.add("dragging");
  });
  window.addEventListener("dragleave", (e) => { if (!e.relatedTarget) document.body.classList.remove("dragging"); });
  window.addEventListener("drop", (e) => {
    e.preventDefault();
    document.body.classList.remove("dragging");
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (!f) return;
    if (isFontFile(f)) { setSource("text"); loadFontFile(f); } else loadImageFile(f);
  });
  window.addEventListener("paste", (e) => {
    const items = e.clipboardData ? Array.from(e.clipboardData.items) : [];
    const item = items.find((i) => i.type.startsWith("image/"));
    if (item) { e.preventDefault(); loadImageFile(item.getAsFile()); }
  });

  /* ================================================================
     Camera
     ================================================================ */
  let liveId = 0, lastFrame = 0;
  function liveLoop(ts) {
    if (!cam.on) return;
    liveId = requestAnimationFrame(liveLoop);
    if (cam.paused || state.source !== "camera" || ts - lastFrame < 66) return;
    lastFrame = ts;
    update(false);
  }
  function syncCam() {
    el.camToggleLbl.textContent = t(cam.on ? "cam.stop" : "cam.start");
    el.camPause.hidden = !cam.on;
    el.camExtra.hidden = !cam.on;
    el.camPause.classList.toggle("paused", cam.paused);
    el.camPauseLbl.textContent = t(cam.paused ? "cam.resume" : "cam.pause");
    el.camToggle.closest(".cam-card").classList.toggle("live", cam.on && !cam.paused);
    el.mirror.checked = cam.mirror;
  }
  async function camStart() {
    el.camNote.textContent = "";
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      el.camNote.textContent = t("cam.unsupported");
      return;
    }
    try {
      cam.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: cam.facing, width: { ideal: 960 } }, audio: false });
      el.cam.srcObject = cam.stream;
      await el.cam.play();
      cam.on = true; cam.paused = false;
      syncCam();
      cancelAnimationFrame(liveId);
      liveId = requestAnimationFrame(liveLoop);
    } catch {
      camStop();
      el.camNote.textContent = t("cam.denied");
    }
  }
  function camStop() {
    cancelAnimationFrame(liveId);
    if (cam.stream) cam.stream.getTracks().forEach((tr) => tr.stop());
    cam.stream = null; cam.on = false; cam.paused = false;
    el.cam.srcObject = null;
    syncCam();
    schedule();
  }
  el.camToggle.addEventListener("click", () => (cam.on ? camStop() : camStart()));
  el.camPause.addEventListener("click", () => { cam.paused = !cam.paused; syncCam(); });
  el.camFlip.addEventListener("click", async () => {
    cam.facing = cam.facing === "user" ? "environment" : "user";
    cam.mirror = cam.facing === "user";
    camStop();
    await camStart();
  });
  el.mirror.addEventListener("change", () => { cam.mirror = el.mirror.checked; schedule(); });
  el.camSnap.addEventListener("click", () => {
    if (!cam.on || !el.cam.videoWidth) return;
    const c = document.createElement("canvas");
    c.width = el.cam.videoWidth; c.height = el.cam.videoHeight;
    const x = c.getContext("2d");
    if (cam.mirror) { x.translate(c.width, 0); x.scale(-1, 1); }
    x.drawImage(el.cam, 0, 0);
    camStop();
    useImage(c, "@pasted", c.toDataURL("image/jpeg", 0.7));
  });
  window.addEventListener("pagehide", () => { if (cam.on) camStop(); });

  /* ================================================================
     Export
     ================================================================ */
  const copyLabelKey = "out.copy";
  let copyTimer = 0;
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.append(ta); ta.select();
      document.execCommand("copy"); ta.remove();
    }
  }
  function flashCopied() {
    el.copy.classList.add("done");
    el.copyLbl.textContent = t("out.copied");
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      el.copy.classList.remove("done");
      el.copyLbl.textContent = t(copyLabelKey);
    }, 1600);
  }
  async function doCopy() {
    if (!state.last) return;
    await copyText(state.last.text);
    flashCopied();
  }
  el.copy.addEventListener("click", doCopy);
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "c") { e.preventDefault(); doCopy(); }
    if (e.key === "Escape") closeMenu();
  });

  function download(blob, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  // Group consecutive characters of (nearly) the same colour into runs, so HTML/SVG stay small.
  function colorRuns(v) {
    const q = (n) => (n >> 4 << 4) | 8;
    return v.lines.map((line, r) => {
      const chars = Array.from(line);
      const base = (r + v.row0) * v.cols;
      const runs = [];
      let cur = null;
      chars.forEach((ch, c) => {
        let col = null;
        if (v.colors && ch !== " ") {
          const i = (base + c) * 4;
          col = "#" + [q(v.colors[i]), q(v.colors[i + 1]), q(v.colors[i + 2])].map((n) => n.toString(16).padStart(2, "0")).join("");
        }
        if (cur && (ch === " " || col === null || cur.col === col)) {
          cur.text += ch; if (cur.col === null) cur.col = col;
        } else {
          cur = { col, text: ch }; runs.push(cur);
        }
      });
      return runs;
    });
  }
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function exportSvg() {
    const v = state.last, { fg, bg } = outColors();
    const fs = 14, lineH = fs * v.lh, cw = fs * v.em / v.maxLen, pad = fs * 1.5;
    const W = Math.ceil(cw * v.maxLen + pad * 2), H = Math.ceil(lineH * v.lines.length + pad * 2);
    const runs = colorRuns(v);
    const body = runs.map((rs, r) => {
      const spans = rs.map((s) => `<tspan${s.col ? ` fill="${s.col}"` : ""}>${esc(s.text)}</tspan>`).join("");
      return `<text x="${pad}" y="${(pad + (r + 0.5) * lineH).toFixed(2)}" dominant-baseline="central" xml:space="preserve">${spans}</text>`;
    }).join("\n");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${MONO.replace(/"/g, "'")}" font-size="${fs}" fill="${fg}">\n<rect width="100%" height="100%" fill="${bg}"/>\n${body}\n</svg>\n`;
  }

  function exportHtml() {
    const v = state.last, { fg, bg } = outColors();
    const runs = colorRuns(v);
    const body = runs.map((rs) => rs.map((s) => (s.col ? `<span style="color:${s.col}">${esc(s.text)}</span>` : esc(s.text))).join("")).join("\n");
    return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ASCII art</title>
<style>
  html { background: ${bg}; }
  body { margin: 0; padding: 4vmin; display: grid; place-items: center; min-height: 100vh; box-sizing: border-box; }
  pre { margin: 0; color: ${fg}; font-family: ${MONO.replace(/"/g, "'")}; font-size: min(${(92 / v.em).toFixed(3)}vw, 18px); line-height: ${v.lh}; white-space: pre; }
</style>
</head>
<body>
<pre>${body}</pre>
</body>
</html>
`;
  }

  function renderPngCanvas(scale) {
    const v = state.last, { fg, bg } = outColors();
    let fs = 16 * scale;
    const cwOf = (f) => f * v.em / v.maxLen;
    let pad = fs * 2;
    let W = cwOf(fs) * v.maxLen + pad * 2, H = fs * v.lh * v.lines.length + pad * 2;
    const k = Math.min(1, 16000 / W, 16000 / H, Math.sqrt(100e6 / (W * H)));
    if (k < 1) { fs *= k; pad = fs * 2; W = cwOf(fs) * v.maxLen + pad * 2; H = fs * v.lh * v.lines.length + pad * 2; }
    const c = document.createElement("canvas");
    c.width = Math.ceil(W); c.height = Math.ceil(H);
    const x = c.getContext("2d");
    x.fillStyle = bg; x.fillRect(0, 0, c.width, c.height);
    x.font = `${fs}px ${MONO}`;
    x.textBaseline = "middle"; x.textAlign = "left";
    const lineH = fs * v.lh, cw = cwOf(fs);
    x.fillStyle = fg;
    v.lines.forEach((line, r) => {
      const y = pad + (r + 0.5) * lineH;
      if (!v.colors) { x.fillText(line, pad, y); return; }
      const chars = Array.from(line), base = (r + v.row0) * v.cols;
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] === " ") continue;
        x.fillStyle = rgbKey(v.colors, base + i);
        x.fillText(chars[i], pad + i * cw, y);
      }
    });
    return c;
  }

  const menuOpen = () => !el.menu.hidden;
  function closeMenu() {
    if (!menuOpen()) return;
    el.menu.hidden = true; el.export.setAttribute("aria-expanded", "false");
  }
  el.export.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = !menuOpen();
    el.menu.hidden = !open;
    el.export.setAttribute("aria-expanded", String(open));
    if (open) el.menu.querySelector("button").focus();
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".menu-wrap")) closeMenu(); });
  el.copyImg.hidden = !(navigator.clipboard && window.ClipboardItem);

  const stamp = () => "anything2ascii";
  el.dlTxt.addEventListener("click", () => {
    if (state.last) download(new Blob([state.last.text], { type: "text/plain;charset=utf-8" }), stamp() + ".txt");
    closeMenu();
  });
  el.dlPng.addEventListener("click", () => {
    if (!state.last) return;
    renderPngCanvas(state.scale).toBlob((b) => b && download(b, stamp() + ".png"), "image/png");
    closeMenu();
  });
  el.dlSvg.addEventListener("click", () => {
    if (state.last) download(new Blob([exportSvg()], { type: "image/svg+xml;charset=utf-8" }), stamp() + ".svg");
    closeMenu();
  });
  el.dlHtml.addEventListener("click", () => {
    if (state.last) download(new Blob([exportHtml()], { type: "text/html;charset=utf-8" }), stamp() + ".html");
    closeMenu();
  });
  el.copyImg.addEventListener("click", () => {
    if (!state.last) return;
    renderPngCanvas(state.scale).toBlob(async (b) => {
      try { await navigator.clipboard.write([new ClipboardItem({ "image/png": b })]); flashCopied(); } catch {}
    }, "image/png");
    closeMenu();
  });

  /* ================================================================
     Start
     ================================================================ */
  el.txt.value = state.text; el.word.value = state.word; el.custom.value = state.custom;
  el.invert.checked = state.invert; el.auto.checked = state.auto; el.dither.checked = state.dither;
  el.srccol.checked = state.srcCol; el.fg.value = state.fg; el.bg.value = state.bg;
  $("#pane-text").hidden = false;
  syncUi();
  applyI18n();
  // Let the UI font settle, then draw the first result.
  const settle = document.fonts && document.fonts.ready ? document.fonts.ready.catch(() => {}) : Promise.resolve();
  Promise.race([settle, new Promise((r) => setTimeout(r, 1200))]).then(() => update(true));

  // Hook for automated checks.
  window.__a2a = { state, generate, t, FONTS, MODES };
})();

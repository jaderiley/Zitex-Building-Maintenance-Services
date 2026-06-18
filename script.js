/* ============================================================
   SITE POPULATION ENGINE
   Reads CONFIG (defined in config.js) and fills the page.
   ============================================================ */

(function () {
  if (typeof CONFIG === 'undefined') {
    console.error('CONFIG missing. Make sure config.js loads before script.js.');
    return;
  }

  // ─── HELPERS ───────────────────────────────────────────────

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const getPath = (obj, path) =>
    path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

  // Convert "+27 11 482 7480" or "0114827480" → "+27114827480" (E.164)
  const toIntl = (raw) => {
    if (!raw) return '';
    let n = raw.replace(/[^\d+]/g, '');
    if (n.startsWith('+')) return n;
    if (n.startsWith('27')) return '+' + n;
    if (n.startsWith('0')) return '+27' + n.slice(1);
    return '+' + n;
  };

  // Pretty SA phone for display: "+27114827480" → "011 482 7480"
  const prettyPhone = (raw) => {
    const n = toIntl(raw).replace('+27', '0');
    if (n.length === 10) {
      return n.slice(0, 3) + ' ' + n.slice(3, 6) + ' ' + n.slice(6);
    }
    return raw;
  };

  // WhatsApp deep-link: requires international, no plus, no spaces
  const waLink = (raw, text = '') => {
    const n = toIntl(raw).replace('+', '');
    const t = text ? '?text=' + encodeURIComponent(text) : '';
    return `https://wa.me/${n}${t}`;
  };

  const telLink = (raw) => 'tel:' + toIntl(raw);

  // ─── ICON LIBRARY ──────────────────────────────────────────
  // Shared line-icon set (24x24, stroke, currentColor) covering the
  // service categories used across the whole template family.
  // Reference by name from config.js: services[].icon

  const svgIcon = (inner) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ` +
    `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

  const ICONS = {
    snowflake:  svgIcon('<path d="M12 2v20M4.5 6.2l15 11.6M19.5 6.2l-15 11.6"/>'),
    fridge:     svgIcon('<rect x="5" y="2" width="14" height="20" rx="1.5"/><line x1="5" y1="9" x2="19" y2="9"/><line x1="8" y1="4.5" x2="8" y2="6.5"/><line x1="8" y1="12" x2="8" y2="14.5"/>'),
    splitUnit:  svgIcon('<rect x="2" y="6" width="20" height="6" rx="1.5"/><line x1="5" y1="9" x2="16" y2="9"/><circle cx="19" cy="9" r="0.75" fill="currentColor"/><path d="M6 14l-1.5 4M12 14l-1 4M18 14l-1.5 4"/>'),
    gauge:      svgIcon('<circle cx="12" cy="13" r="8"/><path d="M12 13 16.5 8.5"/><path d="M8 5l1 2.2M16 5l-1 2.2"/><circle cx="12" cy="13" r="1" fill="currentColor"/>'),
    coldroom:   svgIcon('<rect x="4" y="2" width="16" height="20" rx="1"/><rect x="13.5" y="7" width="2" height="5" rx="1" fill="currentColor"/><line x1="4" y1="8" x2="9" y2="8"/><line x1="4" y1="11" x2="9" y2="11"/>'),
    circuit:    svgIcon('<path d="M2 12h4l2-6 4 12 2-6h8"/><circle cx="6" cy="12" r="1.1" fill="currentColor"/><circle cx="18" cy="12" r="1.1" fill="currentColor"/>'),
    calendar:   svgIcon('<rect x="3" y="4" width="18" height="17" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/><path d="M8 14l2 2 5-5"/>'),
    droplet:    svgIcon('<path d="M12 2.5c3.4 4.4 6 7.8 6 11a6 6 0 1 1-12 0c0-3.2 2.6-6.6 6-11z"/>'),
    bolt:       svgIcon('<path d="M13 2 4.5 13h6l-1 9 8.5-11h-6l1-9z"/>'),
    tree:       svgIcon('<path d="M12 2 5 12h4l-5 8h16l-5-8h4z"/><path d="M12 20v3"/>'),
    key:        svgIcon('<circle cx="8" cy="8" r="4.5"/><path d="M11.2 11.2 20 20m-5-5-2 2m4-1-2 2"/>'),
    bug:        svgIcon('<ellipse cx="12" cy="13" rx="5" ry="6.5"/><path d="M12 6.5V3.5M9.5 4.5 11 6.5M14.5 4.5 13 6.5"/><path d="M4 9l4 2.5M20 9l-4 2.5M4 17l4-2.5M20 17l-4-2.5"/>'),
    garage:     svgIcon('<path d="M3 21V10l9-7 9 7v11z"/><path d="M5 13h14M5 17h14"/>'),
    wrench:     svgIcon('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
    broom:      svgIcon('<path d="M20 3 10 13"/><path d="M10 13 4 21M10 13l2 8M10 13l5-2"/>'),
    car:        svgIcon('<path d="M4 16l1.4-4.5A2 2 0 0 1 7.3 10h9.4a2 2 0 0 1 1.9 1.5L20 16"/><path d="M3 16h18v2.5H3z"/><circle cx="7.5" cy="18.5" r="1.5"/><circle cx="16.5" cy="18.5" r="1.5"/>'),
    hardhat:    svgIcon('<path d="M3 16a9 9 0 0 1 18 0"/><path d="M2 16h20v2.5H2z"/><line x1="12" y1="5.5" x2="12" y2="8"/>'),
    shield:     svgIcon('<path d="M12 2.5 4.5 5.5v5.5c0 5 3 8.7 7.5 10.5 4.5-1.8 7.5-5.5 7.5-10.5V5.5z"/><path d="M8.5 12l2.5 2.5 4.5-4.5"/>'),
    door:       svgIcon('<rect x="5" y="2" width="14" height="20" rx="1"/><circle cx="14.5" cy="12" r="1" fill="currentColor"/>'),
    padlock:    svgIcon('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1.2" fill="currentColor"/>'),
    safe:       svgIcon('<rect x="3" y="3" width="18" height="18" rx="1.5"/><circle cx="11" cy="12" r="5.5"/><line x1="11" y1="6.5" x2="11" y2="9"/><circle cx="11" cy="12" r="1" fill="currentColor"/><rect x="17.5" y="9" width="2" height="6" rx="0.5" fill="currentColor"/>'),
    keyring:    svgIcon('<circle cx="6" cy="6" r="3"/><path d="M9 6h12"/><circle cx="6" cy="13" r="3"/><path d="M9 13h9"/><circle cx="6" cy="20" r="3"/><path d="M9 20h6"/>')
  };

  // ─── "WORK" GALLERY — blueprint-style diagrams ──────────────
  // Each entry is a self-contained inline SVG (240x180) using shared
  // .bp-* classes from styles.css so it re-themes with the active
  // palette automatically. Reference by name from config.js: content.gallery[].art

  const GALLERY_ART = {

    splitUnitInstall: `
      <svg viewBox="0 0 240 180" role="img" aria-label="Diagram of a split-unit aircon indoor unit connected through a wall to the outdoor condenser">
        <rect class="bp-bg" width="240" height="180"/>
        <rect width="240" height="180" fill="url(#bpGrid)"/>
        <line class="bp-dim" x1="156" y1="8" x2="156" y2="172"/>
        <text class="bp-label" x="160" y="18">WALL</text>
        <rect class="bp-line" x="18" y="30" width="116" height="32" rx="4"/>
        <line class="bp-line" x1="28" y1="40" x2="124" y2="40"/>
        <line class="bp-line" x1="28" y1="48" x2="124" y2="48"/>
        <line class="bp-line" x1="28" y1="56" x2="124" y2="56"/>
        <circle class="bp-fill-accent" cx="124" cy="38" r="2"/>
        <text class="bp-label" x="18" y="24">INDOOR UNIT</text>
        <path class="bp-accent" d="M134 44 H180 V92"/>
        <text class="bp-label bp-label--accent" x="138" y="40">&#216;6.35 / &#216;9.52 LINESET</text>
        <rect class="bp-line" x="186" y="92" width="46" height="58" rx="2"/>
        <circle class="bp-line" cx="209" cy="118" r="13"/>
        <path class="bp-line" d="M209 105v26M196 118h26M199.5 108.5l19 19M218.5 108.5l-19 19"/>
        <line class="bp-line" x1="194" y1="150" x2="194" y2="156"/>
        <line class="bp-line" x1="224" y1="150" x2="224" y2="156"/>
        <text class="bp-label" x="186" y="166">OUTDOOR UNIT</text>
      </svg>`,

    regasGauges: `
      <svg viewBox="0 0 240 180" role="img" aria-label="Diagram of a manifold gauge set connected to a refrigerant cylinder and an aircon service valve for regassing">
        <rect class="bp-bg" width="240" height="180"/>
        <rect width="240" height="180" fill="url(#bpGrid)"/>
        <text class="bp-label bp-label--accent" x="14" y="20">R410A &#183; 350 / 120 PSI</text>
        <rect class="bp-line" x="60" y="40" width="70" height="50" rx="4"/>
        <circle class="bp-line" cx="80" cy="65" r="14"/>
        <circle class="bp-line" cx="116" cy="65" r="14"/>
        <path class="bp-line" d="M80 65 80 55"/>
        <path class="bp-accent" d="M116 65 124 56"/>
        <text class="bp-label" x="73" y="86">LOW</text>
        <text class="bp-label" x="107" y="86">HIGH</text>
        <path class="bp-accent" d="M60 80 Q34 86 34 110 V128"/>
        <rect class="bp-line" x="22" y="128" width="24" height="38" rx="5"/>
        <line class="bp-line" x1="26" y1="138" x2="42" y2="138"/>
        <text class="bp-label" x="18" y="174">CYLINDER</text>
        <path class="bp-line" d="M130 80 Q170 88 170 112 V128"/>
        <rect class="bp-line" x="142" y="128" width="76" height="38" rx="2"/>
        <line class="bp-line" x1="152" y1="140" x2="208" y2="140"/>
        <line class="bp-line" x1="152" y1="150" x2="208" y2="150"/>
        <text class="bp-label" x="142" y="174">SERVICE VALVE</text>
      </svg>`,

    fridgeCutaway: `
      <svg viewBox="0 0 240 180" role="img" aria-label="Cutaway diagram of a domestic fridge and freezer showing the evaporator coil, thermostat, compressor and condenser">
        <rect class="bp-bg" width="240" height="180"/>
        <rect width="240" height="180" fill="url(#bpGrid)"/>
        <rect class="bp-line" x="70" y="8" width="90" height="164" rx="4"/>
        <line class="bp-line" x1="70" y1="48" x2="160" y2="48"/>
        <path class="bp-accent" d="M82 16 h12 v8 h-12 v8 h12 v8 h-12"/>
        <text class="bp-label bp-label--accent" x="100" y="22">EVAPORATOR COIL</text>
        <line class="bp-line" x1="155" y1="14" x2="155" y2="22"/>
        <line class="bp-line" x1="155" y1="56" x2="155" y2="68"/>
        <circle class="bp-line" cx="92" cy="64" r="8"/>
        <path class="bp-line" d="M92 64 96 58"/>
        <text class="bp-label" x="104" y="68">THERMOSTAT</text>
        <circle class="bp-line" cx="100" cy="158" r="14"/>
        <circle class="bp-fill-accent" cx="100" cy="158" r="2.5"/>
        <text class="bp-label" x="118" y="160">COMPRESSOR</text>
        <path class="bp-dim" d="M168 60v100M168 60h24M168 80h24M168 100h24M168 120h24M168 140h24M168 160h24"/>
        <text class="bp-label" x="170" y="50">CONDENSER</text>
      </svg>`,

    coldRoomDoor: `
      <svg viewBox="0 0 240 180" role="img" aria-label="Diagram of a commercial cold room door with evaporator unit and digital temperature display">
        <rect class="bp-bg" width="240" height="180"/>
        <rect width="240" height="180" fill="url(#bpGrid)"/>
        <rect class="bp-line" x="14" y="10" width="212" height="160" rx="2"/>
        <rect class="bp-line" x="40" y="20" width="90" height="140" rx="2"/>
        <path class="bp-dim" d="M130 160 A90 90 0 0 0 200 90"/>
        <rect class="bp-fill-accent" x="118" y="84" width="6" height="22" rx="3"/>
        <text class="bp-label" x="42" y="172">COLD ROOM DOOR</text>
        <rect class="bp-line" x="150" y="22" width="64" height="22" rx="2"/>
        <line class="bp-line" x1="158" y1="29" x2="206" y2="29"/>
        <line class="bp-line" x1="158" y1="36" x2="206" y2="36"/>
        <text class="bp-label" x="150" y="18">EVAPORATOR UNIT</text>
        <rect class="bp-line" x="160" y="60" width="50" height="26" rx="2"/>
        <text class="bp-label bp-label--accent" x="167" y="78" style="font-size:9px">-18&#176;C</text>
        <text class="bp-label" x="160" y="94">SET POINT</text>
      </svg>`,

    ductedLayout: `
      <svg viewBox="0 0 240 180" role="img" aria-label="Ceiling plan diagram of a ducted air conditioning system with a central air handler and four diffuser vents">
        <rect class="bp-bg" width="240" height="180"/>
        <rect width="240" height="180" fill="url(#bpGrid)"/>
        <rect class="bp-line" x="100" y="74" width="40" height="32" rx="2"/>
        <line class="bp-line" x1="108" y1="84" x2="132" y2="84"/>
        <line class="bp-line" x1="108" y1="92" x2="132" y2="92"/>
        <text class="bp-label" x="100" y="68">AIR HANDLER</text>
        <path class="bp-line" d="M120 74V30"/>
        <path class="bp-line" d="M52 30H188"/>
        <path class="bp-line" d="M120 106V150"/>
        <path class="bp-line" d="M52 150H188"/>
        <rect class="bp-line" x="28" y="20" width="24" height="18" rx="1"/>
        <line class="bp-line" x1="32" y1="25" x2="48" y2="25"/>
        <line class="bp-line" x1="32" y1="30" x2="48" y2="30"/>
        <line class="bp-line" x1="32" y1="35" x2="48" y2="35"/>
        <rect class="bp-line" x="188" y="20" width="24" height="18" rx="1"/>
        <line class="bp-line" x1="192" y1="25" x2="208" y2="25"/>
        <line class="bp-line" x1="192" y1="30" x2="208" y2="30"/>
        <line class="bp-line" x1="192" y1="35" x2="208" y2="35"/>
        <rect class="bp-line" x="28" y="142" width="24" height="18" rx="1"/>
        <line class="bp-line" x1="32" y1="147" x2="48" y2="147"/>
        <line class="bp-line" x1="32" y1="152" x2="48" y2="152"/>
        <line class="bp-line" x1="32" y1="157" x2="48" y2="157"/>
        <rect class="bp-line" x="188" y="142" width="24" height="18" rx="1"/>
        <line class="bp-line" x1="192" y1="147" x2="208" y2="147"/>
        <line class="bp-line" x1="192" y1="152" x2="208" y2="152"/>
        <line class="bp-line" x1="192" y1="157" x2="208" y2="157"/>
        <path class="bp-accent" d="M40 29l8 0m-3-3l3 3-3 3"/>
        <path class="bp-accent" d="M200 29l-8 0m3-3l-3 3 3 3"/>
        <path class="bp-accent" d="M40 151l8 0m-3-3l3 3-3 3"/>
        <path class="bp-accent" d="M200 151l-8 0m3-3l-3 3 3 3"/>
        <text class="bp-label" x="156" y="170">&#216;200 DUCT RUN</text>
      </svg>`,

    lockCylinderPick: `
      <svg viewBox="0 0 240 180" role="img" aria-label="Diagram of a euro cylinder lock being picked, showing the pin stacks aligned along the shear line with a tension wrench and pick inserted">
        <rect class="bp-bg" width="240" height="180"/>
        <rect width="240" height="180" fill="url(#bpGrid)"/>
        <rect class="bp-line" x="14" y="20" width="60" height="140" rx="2"/>
        <text class="bp-label" x="18" y="34">DOOR</text>
        <circle class="bp-line" cx="44" cy="90" r="22"/>
        <circle class="bp-fill-ink" cx="44" cy="90" r="2.5"/>
        <text class="bp-label" x="14" y="172">CYLINDER</text>
        <line class="bp-dim" x1="100" y1="70" x2="226" y2="70"/>
        <text class="bp-label bp-label--accent" x="128" y="44">SHEAR LINE</text>
        <g class="bp-line">
          <rect x="106" y="56" width="8" height="14"/>
          <rect x="106" y="70" width="8" height="20"/>
          <rect x="128" y="50" width="8" height="20"/>
          <rect x="128" y="70" width="8" height="14"/>
          <rect x="150" y="58" width="8" height="12"/>
          <rect x="150" y="70" width="8" height="22"/>
          <rect x="172" y="52" width="8" height="18"/>
          <rect x="172" y="70" width="8" height="16"/>
          <rect x="194" y="60" width="8" height="10"/>
          <rect x="194" y="70" width="8" height="24"/>
        </g>
        <path class="bp-accent" d="M44 95 H100"/>
        <text class="bp-label" x="100" y="110">TENSION WRENCH</text>
        <path class="bp-accent" d="M44 84 H226"/>
        <text class="bp-label bp-label--accent" x="198" y="44">PICK</text>
        <text class="bp-label" x="14" y="14">NON-DESTRUCTIVE ENTRY</text>
      </svg>`,

    keyCutting: `
      <svg viewBox="0 0 240 180" role="img" aria-label="Diagram of a key-cutting machine tracing the bitting pattern from an original key onto a blank">
        <rect class="bp-bg" width="240" height="180"/>
        <rect width="240" height="180" fill="url(#bpGrid)"/>
        <rect class="bp-line" x="16" y="16" width="208" height="148" rx="2"/>
        <text class="bp-label" x="20" y="12">KEY-CUTTING MACHINE</text>
        <rect class="bp-line" x="40" y="50" width="50" height="14" rx="2"/>
        <rect class="bp-line" x="40" y="100" width="50" height="14" rx="2"/>
        <path class="bp-line" d="M90 57 H150 M150 57 V46 M138 57 V50 M126 57 V52 M114 57 V48"/>
        <text class="bp-label" x="92" y="44">ORIGINAL</text>
        <path class="bp-accent" d="M90 107 H150"/>
        <text class="bp-label bp-label--accent" x="92" y="124">BLANK</text>
        <circle class="bp-line" cx="180" cy="107" r="14"/>
        <text class="bp-label" x="166" y="128">CUTTER</text>
        <circle class="bp-fill-accent" cx="150" cy="57" r="2"/>
        <text class="bp-label" x="150" y="20">TRACE BITTING 1&#8211;9</text>
      </svg>`,

    lockUpgrade: `
      <svg viewBox="0 0 240 180" role="img" aria-label="Cross-section diagram of a door edge comparing a standard lock cylinder with an upgraded high-security cylinder and reinforced strike plate">
        <rect class="bp-bg" width="240" height="180"/>
        <rect width="240" height="180" fill="url(#bpGrid)"/>
        <line class="bp-dim" x1="120" y1="10" x2="120" y2="170"/>
        <text class="bp-label" x="20" y="20">STANDARD</text>
        <text class="bp-label bp-label--accent" x="140" y="20">UPGRADED</text>
        <rect class="bp-line" x="30" y="70" width="60" height="40" rx="3"/>
        <circle class="bp-line" cx="60" cy="90" r="12"/>
        <text class="bp-label" x="30" y="124">STD CYLINDER</text>
        <rect class="bp-line" x="150" y="70" width="60" height="40" rx="3"/>
        <circle class="bp-accent" cx="180" cy="90" r="14"/>
        <circle class="bp-line" cx="180" cy="90" r="9"/>
        <text class="bp-label bp-label--accent" x="150" y="124">ANTI-PICK CYLINDER</text>
        <rect class="bp-line" x="30" y="140" width="60" height="10" rx="1"/>
        <text class="bp-label" x="30" y="156">STRIKE PLATE</text>
        <rect class="bp-accent" x="150" y="140" width="60" height="10" rx="1"/>
        <text class="bp-label bp-label--accent" x="150" y="156">REINFORCED STRIKE</text>
      </svg>`,

    masterKeySystem: `
      <svg viewBox="0 0 240 180" role="img" aria-label="Hierarchy diagram of a master key system: one master key opens three doors, each of which also has its own individual key">
        <rect class="bp-bg" width="240" height="180"/>
        <rect width="240" height="180" fill="url(#bpGrid)"/>
        <circle class="bp-accent" cx="120" cy="22" r="8"/>
        <path class="bp-accent" d="M128 22H152M142 22V28M150 22V26"/>
        <text class="bp-label bp-label--accent" x="92" y="10">MASTER KEY</text>
        <path class="bp-dim" d="M120 30V46M40 46H200M40 46V54M120 46V54M200 46V54"/>
        <rect class="bp-line" x="20" y="54" width="40" height="106" rx="2"/>
        <rect class="bp-line" x="100" y="54" width="40" height="106" rx="2"/>
        <rect class="bp-line" x="180" y="54" width="40" height="106" rx="2"/>
        <circle class="bp-line" cx="40" cy="106" r="3"/>
        <circle class="bp-fill-ink" cx="40" cy="106" r="0.8"/>
        <circle class="bp-line" cx="120" cy="106" r="3"/>
        <circle class="bp-fill-ink" cx="120" cy="106" r="0.8"/>
        <circle class="bp-line" cx="200" cy="106" r="3"/>
        <circle class="bp-fill-ink" cx="200" cy="106" r="0.8"/>
        <text class="bp-label" x="20" y="142">OWN KEY</text>
        <text class="bp-label" x="100" y="142">OWN KEY</text>
        <text class="bp-label" x="180" y="142">OWN KEY</text>
        <text class="bp-label" x="20" y="172">ENTRANCE</text>
        <text class="bp-label" x="100" y="172">OFFICE</text>
        <text class="bp-label" x="180" y="172">STORE</text>
      </svg>`,

    safeMechanism: `
      <svg viewBox="0 0 240 180" role="img" aria-label="Cross-section diagram of a safe door showing the dial mechanism, bolt-work plate and locking bolts extending into the frame">
        <rect class="bp-bg" width="240" height="180"/>
        <rect width="240" height="180" fill="url(#bpGrid)"/>
        <rect class="bp-line" x="16" y="14" width="160" height="152" rx="2"/>
        <text class="bp-label" x="20" y="10">SAFE DOOR</text>
        <circle class="bp-line" cx="96" cy="90" r="34"/>
        <circle class="bp-line" cx="96" cy="90" r="4"/>
        <line class="bp-accent" x1="96" y1="90" x2="96" y2="62"/>
        <text class="bp-label bp-label--accent" x="60" y="46">DIAL</text>
        <path class="bp-line" d="M176 50H210M176 90H214M176 130H210"/>
        <circle class="bp-fill-accent" cx="210" cy="50" r="2"/>
        <circle class="bp-fill-accent" cx="214" cy="90" r="2"/>
        <circle class="bp-fill-accent" cx="210" cy="130" r="2"/>
        <text class="bp-label" x="176" y="40">LOCKING BOLTS</text>
        <text class="bp-label" x="20" y="172">BOLT-WORK PLATE</text>
        <path class="bp-dim" d="M16 100h160"/>
      </svg>`
  };

  // ─── DATA-CONFIG BINDINGS (all [data-config="path.to.value"]) ──

  // Fields that may legitimately contain HTML (e.g. <em>...</em> in hero title).
  // CONFIG is author-controlled so HTML is trusted; safer than textContent for these.
  const HTML_FIELDS = new Set([
    'content.heroTitle',
    'content.heroLead',
    'content.servicesTitle',
    'content.servicesLead',
    'content.galleryTitle',
    'content.galleryLead',
    'content.areasTitle',
    'content.areasLead',
    'content.whyTitle',
    'content.reviewsTitle',
    'content.faqTitle',
    'content.faqLead',
    'content.contactTitle',
    'content.contactLead',
    'content.featuredQuote',
    'content.eyebrow'
  ]);

  $$('[data-config]').forEach((el) => {
    const path = el.getAttribute('data-config');
    const value = getPath(CONFIG, path);
    if (value == null) return;
    if (el.tagName === 'META' || el.tagName === 'INPUT') {
      el.setAttribute('content', value);
    } else if (HTML_FIELDS.has(path)) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  });

  // ─── PALETTE ───────────────────────────────────────────────

  if (CONFIG.branding && CONFIG.branding.palette) {
    document.documentElement.setAttribute('data-palette', CONFIG.branding.palette);
  }

  // ─── LOGO MONOGRAM (generated per-client brand mark, zero-cost) ──
  // Builds a 1–2 letter monogram from the business name so every site
  // gets its own brand mark in the accent colour instead of the shared
  // placeholder square. No image, no API — pure markup.
  (function () {
    const STOP = new Set(['and','the','of','for','services','service','solutions',
      'co','pty','ltd','group','enterprise','enterprises','specialist','specialists']);
    const words = (CONFIG.business.name || '')
      .replace(/&/g, ' ')
      .replace(/[^A-Za-z\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
    const significant = words.filter((w) => !STOP.has(w.toLowerCase()));
    const pick = (significant.length ? significant : words).slice(0, 2);
    const initials = pick.map((w) => w[0].toUpperCase()).join('')
      || ((CONFIG.business.name || '?')[0] || '?').toUpperCase();
    $$('.nav__logo-mark, .footer__brand-mark').forEach((el) => {
      el.classList.add('logo-mark--mono');
      el.textContent = initials;
    });
  })();

  // ─── PAGE META / SEO ──────────────────────────────────────

  document.title = CONFIG.meta.title;
  $('meta[name="description"]').setAttribute('content', CONFIG.meta.description);
  $('#ogTitle').setAttribute('content', CONFIG.meta.title);
  $('#ogDescription').setAttribute('content', CONFIG.meta.description);
  if (CONFIG.branding && CONFIG.branding.ogImage) {
    $('#ogImage').setAttribute('content', CONFIG.branding.ogImage);
  }

  // ─── PHONE / WHATSAPP LINKS ───────────────────────────────

  const phone = CONFIG.business.phone;
  const wa    = CONFIG.business.whatsapp || CONFIG.business.phone;
  const businessName = CONFIG.business.name;

  // Tel links
  ['#navCta', '#heroCallBtn', '#contactPhoneRow', '#footerPhone', '#callbarPhone'].forEach((sel) => {
    const el = $(sel);
    if (el) el.setAttribute('href', telLink(phone));
  });

  // Display phone text
  ['#heroPhoneText', '#contactPhoneText'].forEach((sel) => {
    const el = $(sel);
    if (el) el.textContent = prettyPhone(phone);
  });
  $('#footerPhone').textContent = prettyPhone(phone);

  // WhatsApp links
  const waDefaultMsg = `Hi ${businessName}, I found you on Google and would like to ask about your services.`;
  ['#heroWaBtn', '#callbarWhatsapp'].forEach((sel) => {
    const el = $(sel);
    if (el) el.setAttribute('href', waLink(wa, waDefaultMsg));
  });
  const footerWa = $('#footerWhatsapp');
  if (footerWa) {
    footerWa.setAttribute('href', waLink(wa, waDefaultMsg));
    footerWa.textContent = prettyPhone(wa);
  }

  // ─── TRUST STRIP ───────────────────────────────────────────

  const trustStrip = $('#trustStrip');
  if (trustStrip && CONFIG.content.trustSignals) {
    trustStrip.innerHTML = CONFIG.content.trustSignals
      .map((t) => `<li>${t}</li>`)
      .join('');
  }

  // ─── MARQUEE (services + areas, scrolling under hero) ──────

  const marquee = $('#marqueeTrack');
  if (marquee) {
    const items = [
      ...(CONFIG.content.services || []).map(s => s.title),
      ...(CONFIG.business.suburbs || [])
    ];
    if (items.length) {
      const inner = items.join('   ✦   ');
      // double for seamless loop
      marquee.innerHTML = `<span>${inner}</span><span>${inner}</span>`;
    }
  }

  // ─── SERVICES GRID ─────────────────────────────────────────

  const servicesGrid = $('#servicesGrid');
  if (servicesGrid && CONFIG.content.services) {
    servicesGrid.innerHTML = CONFIG.content.services
      .map((s, i) => `
        <li class="service">
          <div class="service__top">
            <span class="service__icon">${ICONS[s.icon] || ICONS.wrench}</span>
            <span class="service__num">${String(i + 1).padStart(2, '0')}</span>
          </div>
          <h3 class="service__title">${s.title}</h3>
          <p class="service__desc">${s.desc}</p>
        </li>
      `).join('');
  }

  // ─── "WORK" GALLERY ────────────────────────────────────────

  const galleryGrid = $('#galleryGrid');
  if (galleryGrid && CONFIG.content.gallery) {
    galleryGrid.innerHTML = CONFIG.content.gallery
      .map((g) => `
        <li class="gallery-card${g.image ? ' gallery-card--photo' : ''}">
          <div class="gallery-card__art">${g.image
            ? `<img src="${g.image}" alt="${(g.title || '').replace(/"/g, '&quot;')}" loading="lazy" decoding="async" />`
            : (GALLERY_ART[g.art || g.key] || '')}</div>
          <div class="gallery-card__body">
            <span class="gallery-card__fig">${g.fig || ''}</span>
            <h3 class="gallery-card__title">${g.title || ''}</h3>
            <p class="gallery-card__caption">${g.caption || ''}</p>
          </div>
        </li>
      `).join('');
  }

  // ─── PHOTO BAND (optional full-width image break) ──────────
  const band = $('#band');
  if (band && CONFIG.content.band && CONFIG.content.band.image) {
    const bandImg = $('#bandImg');
    const bandText = $('#bandText');
    if (bandImg) bandImg.setAttribute('src', CONFIG.content.band.image);
    if (bandImg) bandImg.setAttribute('alt', CONFIG.content.band.alt || '');
    if (bandText) bandText.textContent = CONFIG.content.band.text || '';
    band.hidden = false;
  }

  // ─── FAQ ───────────────────────────────────────────────────

  const faqList = $('#faqList');
  if (faqList && CONFIG.content.faq) {
    const plusIcon = `<svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`;
    faqList.innerHTML = CONFIG.content.faq
      .map((f, i) => `
        <details class="faq-item">
          <summary>
            <span class="faq-item__num">${String(i + 1).padStart(2, '0')}</span>
            <span class="faq-item__q">${f.q}</span>
            ${plusIcon}
          </summary>
          <div class="faq-item__answer">${f.a}</div>
        </details>
      `).join('');
  }

  // ─── AREAS LIST + MAP ──────────────────────────────────────

  const areasList = $('#areasList');
  if (areasList && CONFIG.business.suburbs) {
    areasList.innerHTML = CONFIG.business.suburbs.map(s => `<li>${s}</li>`).join('');
  }
  const areasMap = $('#areasMap');
  if (areasMap && CONFIG.business.address) {
    const q = encodeURIComponent(CONFIG.business.address);
    areasMap.setAttribute('src', `https://maps.google.com/maps?q=${q}&t=&z=12&ie=UTF8&iwloc=&output=embed`);
  }

  // ─── WHY US ────────────────────────────────────────────────

  const whyGrid = $('#whyGrid');
  if (whyGrid && CONFIG.content.why) {
    whyGrid.innerHTML = CONFIG.content.why
      .map((w, i) => `
        <li class="why-item">
          <span class="why-item__num">${String(i + 1).padStart(2, '0')}</span>
          <h3 class="why-item__title">${w.title}</h3>
          <p class="why-item__desc">${w.desc}</p>
        </li>
      `).join('');
  }

  // ─── REVIEWS ───────────────────────────────────────────────

  const reviewsGrid = $('#reviewsGrid');
  if (reviewsGrid && CONFIG.content.reviews) {
    const starSvg = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    reviewsGrid.innerHTML = CONFIG.content.reviews
      .map((r) => `
        <li class="review">
          <div class="review__stars">${starSvg.repeat(r.stars || 5)}</div>
          <p class="review__body">${r.body}</p>
          <div class="review__footer">
            <span class="review__name">${r.name}</span>
            <span class="review__source">${r.source || 'Google'}</span>
          </div>
        </li>
      `).join('');
  }

  // ─── QUOTE FORM → WHATSAPP ────────────────────────────────

  const form = $('#quoteForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;
      $$('[required]', form).forEach((el) => {
        if (!el.value.trim()) {
          el.classList.add('is-invalid');
          valid = false;
        } else {
          el.classList.remove('is-invalid');
        }
      });
      if (!valid) return;

      const fd = new FormData(form);
      const text = [
        `Hi ${businessName},`,
        ``,
        `Name: ${fd.get('name')}`,
        `Phone: ${fd.get('phone')}`,
        ``,
        `${fd.get('message')}`
      ].join('\n');
      window.location.href = waLink(wa, text);
    });

    // Clear invalid on input
    form.addEventListener('input', (e) => {
      if (e.target.classList.contains('is-invalid')) {
        e.target.classList.remove('is-invalid');
      }
    });
  }

  // ─── NAV SCROLL STATE ─────────────────────────────────────

  const nav = $('#nav');
  const onScroll = () => {
    if (window.scrollY > 8) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── FOOTER YEAR ──────────────────────────────────────────

  $('#footerYear').textContent = new Date().getFullYear();

  // ─── JSON-LD SCHEMAS ──────────────────────────────────────

  const injectJsonLd = (obj) => {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  };

  const siteUrl = (CONFIG.meta && CONFIG.meta.url) || undefined;

  // Canonical URL — prevents duplicate indexing of preview vs production URLs
  const canonicalEl = document.getElementById('canonical');
  if (canonicalEl && siteUrl) canonicalEl.setAttribute('href', siteUrl);

  // LocalBusiness — with per-review items and url
  const reviewSchemas = (CONFIG.content.reviews || []).map((r) => ({
    '@type': 'Review',
    'author': { '@type': 'Person', 'name': r.name },
    'reviewRating': { '@type': 'Rating', 'ratingValue': r.stars || 5, 'bestRating': 5 },
    'reviewBody': r.body
  }));

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': businessName,
    'telephone': toIntl(phone),
    'url': siteUrl,
    'image': (CONFIG.branding && CONFIG.branding.ogImage) || undefined,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': CONFIG.business.address || '',
      'addressLocality': (CONFIG.business.suburbs && CONFIG.business.suburbs[0]) || '',
      'addressRegion': CONFIG.business.region || 'Gauteng',
      'addressCountry': 'ZA'
    },
    'areaServed': CONFIG.business.suburbs || [],
    'priceRange': CONFIG.business.priceRange || '$$',
    'aggregateRating': CONFIG.content.googleRating ? {
      '@type': 'AggregateRating',
      'ratingValue': CONFIG.content.googleRating,
      'reviewCount': CONFIG.content.reviewsCount
    } : undefined,
    'review': reviewSchemas.length ? reviewSchemas : undefined
  };
  $('#jsonld').textContent = JSON.stringify(jsonld, null, 2);

  // FAQPage — enables Google FAQ rich results (accordion snippets in search)
  if (CONFIG.content.faq && CONFIG.content.faq.length) {
    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': CONFIG.content.faq.map((f) => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
      }))
    });
  }

  // WebSite — establishes site identity for Google (only when url is configured)
  if (siteUrl) {
    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': businessName,
      'url': siteUrl
    });
  }

})();

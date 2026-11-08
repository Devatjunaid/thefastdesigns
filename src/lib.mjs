// Small HTML helpers used by tool definitions (build-time only).
export const range = (id, label, min, max, value, step = 1, unit = '') =>
  `<label class="f"><span>${label} <output>${value}</output>${unit}</span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
export const num = (id, label, value, attrs = '') =>
  `<label class="f"><span>${label}</span><input type="number" id="${id}" value="${value}" ${attrs}></label>`;
export const txt = (id, label, value = '', attrs = '') =>
  `<label class="f"><span>${label}</span><input type="text" id="${id}" value="${value}" spellcheck="false" ${attrs}></label>`;
export const color = (id, label, value) =>
  `<label class="f"><span>${label}</span><span class="color-in"><input type="color" id="${id}" value="${value}" aria-label="${label} picker"><input type="text" id="${id}T" value="${value}" spellcheck="false" aria-label="${label} value"></span></label>`;
export const sel = (id, label, opts, selected) =>
  `<label class="f"><span>${label}</span><select id="${id}">${opts.map(o => { const [v, t] = Array.isArray(o) ? o : [o, o]; return `<option value="${v}"${String(v) === String(selected) ? ' selected' : ''}>${t}</option>`; }).join('')}</select></label>`;
export const chk = (id, label, checked = false) =>
  `<label class="chk"><input type="checkbox" id="${id}"${checked ? ' checked' : ''}> ${label}</label>`;
export const drop = (id, { accept = 'image/*', multiple = false, text } = {}) =>
  `<label class="drop" id="${id}Zone"><input type="file" id="${id}" accept="${accept}"${multiple ? ' multiple' : ''} hidden><strong>${multiple ? 'Drop images here or click to upload' : 'Drop an image here or click to upload'}</strong><small>${text || 'PNG, JPG, WebP, GIF or SVG · you can also paste · files never leave your device'}</small></label>`;
export const code = (id, label = 'Copy') =>
  `<div class="code"><pre id="${id}"></pre><button type="button" class="btn-sm" data-copy-from="${id}">${label}</button></div>`;

export const ICONS = {
  color: '<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4A4.6 4.6 0 0 0 22 10c0-3.9-4.5-7-10-7z"/><circle cx="7.5" cy="10.5" r="1.1"/><circle cx="12" cy="7.5" r="1.1"/><circle cx="16.5" cy="10.5" r="1.1"/></svg>',
  css: '<svg viewBox="0 0 24 24"><path d="M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16"/></svg>',
  image: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>',
  gen: '<svg viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z"/></svg>',
  calc: '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h1M12 12h1M16 12h0M8 16h1M12 16h1M16 12v4"/></svg>',
  bolt: '<svg viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  free: '<svg viewBox="0 0 24 24"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"/></svg>',
  wifi: '<svg viewBox="0 0 24 24"><path d="M2 2l20 20M8.5 16.4a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 5.2-2.8M19 12.9a10 10 0 0 0-2.4-1.7M1.4 9a16 16 0 0 1 4.4-2.6M22.6 9A16 16 0 0 0 10.7 5M12 20h0"/></svg>',
  user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  layers: '<svg viewBox="0 0 24 24"><path d="M12 2l10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
};

export const LOGO = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#141414"/><path d="M11 7h13v4h-9v3.6h7v4h-7V25h-4z" fill="#E8DCC4"/><path d="M4.5 15.6h3.8M5.8 19.6h2.5" stroke="#E8DCC4" stroke-width="2" stroke-linecap="round"/><rect x="20.5" y="20.5" width="5" height="5" rx="1.2" fill="#C8A97E"/></svg>';

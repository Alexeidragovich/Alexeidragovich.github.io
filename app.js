                /* ════════════════════════════════════════════
   STATE — البيانات الافتراضية
════════════════════════════════════════════ */
const DEFAULT_STATE = {
  name:       'أحمد الطيب',
  title:      'مهندس أمن المعلومات',
  bio:        'متخصص في اختبار الاختراق والأمن السيبراني. خبرة في حماية البنية التحتية والكشف عن الثغرات الأمنية.',
  location:   'الخرطوم، السودان',
  email:      'ahmed.tayeb@protonmail.com',
  userPass:   'user123',
  adminPass:  'admin123',
  coverImg:   null,
  avatarImg:  null,
  colors: {
    primary:  '#00ff88',
    accent:   '#00aaff',
    bg:       '#0a0e1a',
    card:     '#111827',
    text:     '#e2e8f0',
    muted:    '#94a3b8',
  },
  font: 'Cairo',
  social: {
    github:     'https://github.com/Alexeidragovich',
    linkedin:   'https://linkedin.com/in/ahmed-tayeb-yosof',
    twitter:    '',
    hackthebox: '',
    tryhackme:  '',
    telegram:   '',
    website:    '',
  },
  projects: [
    {
      id: 1,
      name: 'نظام كشف التسلل المتقدم',
      desc: 'نظام IDS/IPS قائم على الذكاء الاصطناعي للكشف عن الهجمات الصفرية في الوقت الفعلي بدقة 97%.',
      link: '#',
      tags: ['Python', 'AI', 'IDS'],
      img: null,
    },
    {
      id: 2,
      name: 'اختبار اختراق — بنك وطني',
      desc: 'اكتشاف 23 ثغرة أمنية حرجة في البنية التحتية المصرفية وتقديم خطة علاجية مفصلة.',
      link: '#',
      tags: ['Pentest', 'CVE', 'Banking'],
      img: null,
    },
    {
      id: 3,
      name: 'NetScan Pro',
      desc: 'أداة مفتوحة المصدر لتحليل حركة الشبكة واكتشاف الأجهزة غير المصرح بها.',
      link: '#',
      tags: ['Rust', 'Network', 'OSINT'],
      img: null,
    },
  ],
};

let S = JSON.parse(JSON.stringify(DEFAULT_STATE));

/* ── تحميل من db.json و localStorage ───── */
async function loadState() {
  try {
    const res = await fetch('db.json');
    if (!res.ok) throw new Error('فشل تحميل db.json');
    const data = await res.json();
    S = deepMerge(JSON.parse(JSON.stringify(DEFAULT_STATE)), data);
  } catch (e) {
    console.warn('⚠️ استخدام القيم الافتراضية (تعذر تحميل db.json):', e.message);
    S = JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  // محاولة تحميل أي تغييرات سابقة من localStorage (تجاوز)
  try {
    const raw = localStorage.getItem('pf_state');
    if (raw) {
      const saved = JSON.parse(raw);
      S = deepMerge(S, saved);
    }
  } catch (_) {}
}

function saveState() {
  try {
    localStorage.setItem('pf_state', JSON.stringify(S));
  } catch (_) {}
}

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

/* ════════════════════════════════════════════
   SOCIAL META — تعريف منصات التواصل
════════════════════════════════════════════ */
const SOCIAL_META = [
  { key: 'github',     icon: 'ic-github',     label: 'GitHub' },
  { key: 'linkedin',   icon: 'ic-linkedin',   label: 'LinkedIn' },
  { key: 'twitter',    icon: 'ic-twitter',    label: 'Twitter / X' },
  { key: 'hackthebox', icon: 'ic-hackthebox', label: 'HackTheBox' },
  { key: 'tryhackme',  icon: 'ic-tryhackme',  label: 'TryHackMe' },
  { key: 'telegram',   icon: 'ic-telegram',   label: 'Telegram' },
  { key: 'website',    icon: 'ic-globe',      label: 'الموقع الشخصي' },
];

const FONTS = [
  { name: 'Cairo',         url: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap' },
  { name: 'Tajawal',       url: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap' },
  { name: 'Almarai',       url: 'https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap' },
  { name: 'IBM Plex Mono', url: '' },
  { name: 'Orbitron',      url: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&display=swap' },
  { name: 'Space Mono',    url: 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap' },
];

/* ════════════════════════════════════════════
   CANVAS — خلفية Matrix
════════════════════════════════════════════ */
const Matrix = (() => {
  let raf, drops = [], canvas, ctx;

  function init() {
    canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    run();
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    drops = Array(Math.floor(canvas.width / 18)).fill(1);
  }

  const CHARS = '01アイウエオカキセキュリティ{}[]<>/\\';

  function run() {
    raf = requestAnimationFrame(run);
    ctx.fillStyle = 'rgba(10,14,26,0.055)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = (S.colors.primary || '#00ff88') + '33';
    ctx.font = '13px monospace';
    drops.forEach((y, x) => {
      ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x * 18, y * 18);
      if (y * 18 > canvas.height && Math.random() > 0.974) drops[x] = 0;
      drops[x]++;
    });
  }

  function show() { canvas && (canvas.style.display = 'block'); }
  function hide() { canvas && (canvas.style.display = 'none'); }

  return { init, show, hide };
})();

/* ════════════════════════════════════════════
   PAGES — التنقل بين الصفحات
════════════════════════════════════════════ */
const Pages = (() => {
  const LOGIN_PAGES = ['user-login', 'admin-login'];

  function show(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById('page-' + id);
    if (!el) return;
    el.classList.add('active');

    if (LOGIN_PAGES.includes(id)) { Matrix.show(); }
    else                          { Matrix.hide(); }

    if (id === 'portfolio') Portfolio.render();
    if (id === 'admin')     Admin.init();

    // clear errors
    document.querySelectorAll('.field-error').forEach(e => e.textContent = '');
    document.querySelectorAll('.field-input').forEach(i => i.classList.remove('is-error'));
  }

  return { show };
})();

/* ════════════════════════════════════════════
   AUTH — تسجيل الدخول والخروج
════════════════════════════════════════════ */
const Auth = (() => {
  function loginUser() {
    const pass = document.getElementById('user-pass').value;
    const errEl = document.getElementById('user-err');
    const inp   = document.getElementById('user-pass');

    if (!pass) { return setError(errEl, inp, 'الرجاء إدخال كلمة المرور'); }
    if (pass !== S.userPass) { return setError(errEl, inp, 'كلمة المرور غير صحيحة'); }

    errEl.textContent = '';
    inp.classList.remove('is-error');
    inp.value = '';
    Pages.show('portfolio');
  }

  function loginAdmin() {
    const pass = document.getElementById('admin-pass').value;
    const errEl = document.getElementById('admin-err');
    const inp   = document.getElementById('admin-pass');

    if (!pass) { return setError(errEl, inp, 'الرجاء إدخال كلمة المرور'); }
    if (pass !== S.adminPass) { return setError(errEl, inp, 'كلمة المرور غير صحيحة'); }

    errEl.textContent = '';
    inp.classList.remove('is-error');
    inp.value = '';
    Pages.show('admin');
  }

  function logout() {
    document.getElementById('user-pass').value  = '';
    document.getElementById('admin-pass').value = '';
    Pages.show('user-login');
  }

  function setError(errEl, inp, msg) {
    errEl.textContent = msg;
    inp.classList.add('is-error');
    inp.focus();
  }

  return { loginUser, loginAdmin, logout };
})();

/* ════════════════════════════════════════════
   UI — مساعدات الواجهة
════════════════════════════════════════════ */
const UI = (() => {
  function toggleEye(inputId, btn) {
    const inp = document.getElementById(inputId);
    const isHidden = inp.type === 'password';
    inp.type = isHidden ? 'text' : 'password';
    btn.innerHTML = isHidden
      ? `<svg class="icon icon--sm"><use href="#ic-eye-off"/></svg>`
      : `<svg class="icon icon--sm"><use href="#ic-eye"/></svg>`;
  }

  function svg(id, cls = 'icon icon--sm') {
    return `<svg class="${cls}"><use href="#${id}"/></svg>`;
  }

  return { toggleEye, svg };
})();

/* ════════════════════════════════════════════
   UPLOAD — رفع الصور
════════════════════════════════════════════ */
const Upload = (() => {
  function readFile(file, cb) {
    const r = new FileReader();
    r.onload = e => cb(e.target.result);
    r.readAsDataURL(file);
  }

  function cover(input) {
    const file = input.files[0]; if (!file) return;
    readFile(file, data => {
      S.coverImg = data;
      const el = document.getElementById('pf-cover');
      el.style.backgroundImage = `url(${data})`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.classList.add('has-image');
    });
  }

  function avatar(input) {
    const file = input.files[0]; if (!file) return;
    readFile(file, data => {
      S.avatarImg = data;
      const el = document.getElementById('pf-avatar');
      el.innerHTML = `
        <img src="${data}" alt="avatar"/>
        <label class="pf-avatar__upload" for="inp-avatar">
          ${UI.svg('ic-camera', 'icon icon--xs')}
        </label>
        <input type="file" id="inp-avatar" accept="image/*" style="display:none" onchange="Upload.avatar(this)"/>
      `;
    });
  }

  function adminCover(input) {
    const file = input.files[0]; if (!file) return;
    readFile(file, data => {
      S.coverImg = data;
      const uz = document.getElementById('uz-cover');
      uz.style.backgroundImage = `url(${data})`;
      uz.classList.add('has-image');
      uz.innerHTML = '';
    });
  }

  function adminAvatar(input) {
    const file = input.files[0]; if (!file) return;
    readFile(file, data => {
      S.avatarImg = data;
      const uz = document.getElementById('uz-avatar');
      uz.style.backgroundImage = `url(${data})`;
      uz.classList.add('has-image');
      uz.innerHTML = '';
    });
  }

  function projectImg(input) {
    const file = input.files[0]; if (!file) return;
    readFile(file, data => {
      S._newProjectImg = data;
      const uz = document.getElementById('uz-np');
      uz.style.backgroundImage = `url(${data})`;
      uz.classList.add('has-image');
      uz.innerHTML = '';
    });
  }

  return { cover, avatar, adminCover, adminAvatar, projectImg };
})();

/* ════════════════════════════════════════════
   PORTFOLIO — عرض صفحة البورتوفوليو
════════════════════════════════════════════ */
const Portfolio = (() => {
  const CODE_LINES = [
    'nmap -sV --script vuln target.io',
    'msfconsole -q -x "use exploit/..."',
    'hashcat -m 0 hash.txt rockyou.txt',
    'sqlmap -u "target.io/?id=1" --dbs',
  ];

  function render() {
    applyColors();
    applyFont();

    // brand on login page
    setText('brand-name',    S.name);
    setText('brand-title',   S.title);

    // cover
    const cover = document.getElementById('pf-cover');
    if (S.coverImg) {
      cover.style.backgroundImage = `url(${S.coverImg})`;
      cover.style.backgroundSize = 'cover';
      cover.style.backgroundPosition = 'center';
      cover.classList.add('has-image');
    }
    setText('cover-code', CODE_LINES.join('\n'));

    // avatar
    const av = document.getElementById('pf-avatar');
    if (S.avatarImg) {
      av.innerHTML = `
        <img src="${S.avatarImg}" alt="${S.name}"/>
        <label class="pf-avatar__upload" for="inp-avatar">
          ${UI.svg('ic-camera', 'icon icon--xs')}
        </label>
        <input type="file" id="inp-avatar" accept="image/*" style="display:none" onchange="Upload.avatar(this)"/>
      `;
    }

    // info
    setText('pf-name', S.name);
    setText('pf-title-disp', S.title);
    setText('pf-bio', S.bio);

    const locEl = document.getElementById('pf-location-disp');
    locEl.innerHTML = `${UI.svg('ic-map-pin', 'icon icon--xs')} ${S.location}`;

    const mailEl = document.getElementById('pf-email-disp');
    mailEl.innerHTML = `${UI.svg('ic-mail', 'icon icon--xs')} ${S.email}`;

    // social
    const sr = document.getElementById('pf-social');
    sr.innerHTML = SOCIAL_META
      .filter(m => S.social[m.key])
      .map(m => `
        <a class="social-btn" href="${S.social[m.key]}" target="_blank" rel="noreferrer" title="${m.label}">
          ${UI.svg(m.icon, 'icon icon--sm')}
        </a>
      `).join('');

    // projects
    renderProjects();
  }

  function renderProjects() {
    const grid  = document.getElementById('projects-grid');
    const count = document.getElementById('proj-count');
    if (!grid) return;

    count.textContent = S.projects.length;
    grid.innerHTML = S.projects.map(p => {
      const tagsHtml = (p.tags || []).slice(0, 3).map(t =>
        `<span class="tag-chip">${t}</span>`).join('');

      const thumb = p.img
        ? `<img src="${p.img}" alt="${p.name}"/>`
        : `
          <div class="project-card__dot-bg"></div>
          <div class="project-card__placeholder">
            &lt;security/&gt;<br>{ pentest }<br>[exploit]
          </div>
        `;

      return `
        <div class="project-card">
          <div class="project-card__thumb">
            ${thumb}
            <div class="project-card__tags">${tagsHtml}</div>
          </div>
          <div class="project-card__body">
            <div class="project-card__name">${p.name}</div>
            <p class="project-card__desc">${p.desc}</p>
            <a class="project-card__link" href="${p.link}" target="_blank" rel="noreferrer">
              ${UI.svg('ic-external', 'icon icon--xs')} عرض المشروع
            </a>
          </div>
        </div>
      `;
    }).join('');
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  return { render };
})();

/* ════════════════════════════════════════════
   ADMIN — لوحة التحكم
════════════════════════════════════════════ */
const Admin = (() => {
  const TAB_LABELS = {
    profile:    'الملف الشخصي',
    appearance: 'المظهر',
    social:     'التواصل الاجتماعي',
    projects:   'المشاريع',
    security:   'الأمان',
  };

  /* ── تهيئة لوحة التحكم ────────────────── */
  function init() {
    applyColors();
    applyFont();

    // profile fields
    setVal('f-name',     S.name);
    setVal('f-title',    S.title);
    setVal('f-bio',      S.bio);
    setVal('f-location', S.location);
    setVal('f-email',    S.email);
    setVal('f-userpass', S.userPass);
    setVal('f-adminpass', S.adminPass);

    // color pickers
    Object.entries(S.colors).forEach(([k, v]) => {
      const inp = document.getElementById('c-' + k);
      const val = document.getElementById('c-' + k + '-val');
      if (inp) inp.value = v;
      if (val) val.textContent = v;
    });

    // cover/avatar upload zones
    if (S.coverImg) {
      const uz = document.getElementById('uz-cover');
      if (uz) { uz.style.backgroundImage = `url(${S.coverImg})`; uz.classList.add('has-image'); uz.innerHTML = ''; }
    }
    if (S.avatarImg) {
      const uz = document.getElementById('uz-avatar');
      if (uz) { uz.style.backgroundImage = `url(${S.avatarImg})`; uz.classList.add('has-image'); uz.innerHTML = ''; }
    }

    // fonts
    buildFonts();

    // social fields
    buildSocialFields();

    // projects
    renderProjectsList();
  }

  /* ── بناء اختيار الخطوط ──────────────── */
  function buildFonts() {
    const grid = document.getElementById('fonts-grid');
    if (!grid) return;
    grid.innerHTML = FONTS.map(f => `
      <button
        class="font-btn ${S.font === f.name ? 'active' : ''}"
        style="font-family:'${f.name}',sans-serif"
        onclick="Admin.setFont('${f.name}')">
        ${f.name}
      </button>
    `).join('');
  }

  function setFont(name) {
    S.font = name;
    applyFont();
    buildFonts();
  }

  /* ── بناء حقول التواصل ───────────────── */
  function buildSocialFields() {
    const wrap = document.getElementById('social-fields');
    if (!wrap) return;
    wrap.innerHTML = SOCIAL_META.map(m => `
      <div class="social-field-row">
        <div class="social-field-icon">${UI.svg(m.icon)}</div>
        <input class="field-input" id="s-${m.key}" value="${S.social[m.key] || ''}"
          placeholder="https://..." style="flex:1"/>
      </div>
    `).join('');
  }

  /* ── تبويبات ─────────────────────────── */
  function switchTab(id, btn) {
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    const pane = document.getElementById('tab-' + id);
    if (pane) pane.classList.add('active');
    if (btn)  btn.classList.add('active');
    const heading = document.getElementById('admin-page-title');
    if (heading) heading.textContent = TAB_LABELS[id] || id;
  }

  /* ── ألوان مباشرة ────────────────────── */
  function liveColor(input, varName) {
    document.documentElement.style.setProperty(varName, input.value);
    const key = varName.replace('--', '').replace('-bg', 'bg').replace('card-bg','card');
    const map = { primary:'primary', accent:'accent', bg:'bg', 'card-bg':'card', text:'text', muted:'muted' };
    const stateKey = map[varName.replace('--','')];
    if (stateKey && S.colors[stateKey] !== undefined) S.colors[stateKey] = input.value;
    const valEl = document.getElementById(input.id + '-val');
    if (valEl) valEl.textContent = input.value;
  }

  /* ── حفظ ─────────────────────────────── */
  function save() {
    // profile
    S.name     = getVal('f-name')     || S.name;
    S.title    = getVal('f-title')    || S.title;
    S.bio      = getVal('f-bio')      || S.bio;
    S.location = getVal('f-location') || S.location;
    S.email    = getVal('f-email')    || S.email;
    S.userPass  = getVal('f-userpass')  || S.userPass;
    S.adminPass = getVal('f-adminpass') || S.adminPass;

    // social
    SOCIAL_META.forEach(m => {
      const el = document.getElementById('s-' + m.key);
      if (el) S.social[m.key] = el.value;
    });

    // colors from pickers
    ['primary','accent','bg','card','text','muted'].forEach(k => {
      const el = document.getElementById('c-' + k);
      if (el) S.colors[k] = el.value;
    });

    saveState();

    // UI feedback
    const btn   = document.getElementById('save-btn');
    const label = document.getElementById('save-label');
    btn.classList.add('saved');
    label.textContent = 'تم الحفظ';
    setTimeout(() => {
      btn.classList.remove('saved');
      label.textContent = 'حفظ التغييرات';
    }, 2200);

    // update brand on login page
    const bn = document.getElementById('brand-name');
    const bt = document.getElementById('brand-title');
    if (bn) bn.textContent = S.name;
    if (bt) bt.textContent = S.title;
  }

  /* ── إضافة مشروع ─────────────────────── */
  function addProject() {
    const name = getVal('np-name').trim();
    if (!name) { alert('يرجى إدخال اسم المشروع'); return; }

    S.projects.push({
      id:   Date.now(),
      name,
      desc: getVal('np-desc'),
      link: getVal('np-link') || '#',
      tags: getVal('np-tags').split(',').map(t => t.trim()).filter(Boolean),
      img:  S._newProjectImg || null,
    });

    S._newProjectImg = null;
    ['np-name','np-desc','np-link','np-tags'].forEach(id => setVal(id, ''));
    const uz = document.getElementById('uz-np');
    if (uz) { uz.style.backgroundImage = ''; uz.classList.remove('has-image'); uz.innerHTML = `${UI.svg('ic-camera','icon icon--md icon--muted')}<span>رفع صورة المشروع (اختياري)</span>`; }

    renderProjectsList();
  }

  /* ── قائمة المشاريع في الإدارة ──────── */
  function renderProjectsList() {
    const list = document.getElementById('projects-admin-list');
    if (!list) return;
    list.innerHTML = S.projects.map(p => `
      <div class="project-admin-item" id="pai-${p.id}">
        <div class="project-admin-item__head">
          <span class="project-admin-item__name">${p.name}</span>
          <div class="project-admin-item__actions">
            <button class="btn-sm btn-sm--edit" onclick="Admin.toggleEditProject(${p.id})">
              ${UI.svg('ic-edit')} تعديل
            </button>
            <button class="btn-sm btn-sm--del" onclick="Admin.deleteProject(${p.id})">
              ${UI.svg('ic-trash')}
            </button>
          </div>
        </div>
        <div class="project-admin-item__form" id="pf-${p.id}">
          <div class="field-group">
            <label class="field-label">الاسم</label>
            <input class="field-input" id="pe-name-${p.id}" value="${p.name}"/>
          </div>
          <div class="field-group">
            <label class="field-label">الوصف</label>
            <textarea class="field-input field-input--textarea" id="pe-desc-${p.id}" rows="2">${p.desc}</textarea>
          </div>
          <div class="fields-row">
            <div class="field-group">
              <label class="field-label">الرابط</label>
              <input class="field-input" id="pe-link-${p.id}" value="${p.link}"/>
            </div>
            <div class="field-group">
              <label class="field-label">الوسوم</label>
              <input class="field-input" id="pe-tags-${p.id}" value="${(p.tags||[]).join(', ')}"/>
            </div>
          </div>
          <button class="btn btn--primary" style="width:100%" onclick="Admin.updateProject(${p.id})">
            ${UI.svg('ic-save')} حفظ المشروع
          </button>
        </div>
      </div>
    `).join('');
  }

  function toggleEditProject(id) {
    const form = document.getElementById('pf-' + id);
    if (form) form.classList.toggle('open');
  }

  function updateProject(id) {
    const p = S.projects.find(x => x.id === id);
    if (!p) return;
    p.name = getVal(`pe-name-${id}`) || p.name;
    p.desc = getVal(`pe-desc-${id}`);
    p.link = getVal(`pe-link-${id}`) || '#';
    p.tags = getVal(`pe-tags-${id}`).split(',').map(t => t.trim()).filter(Boolean);
    renderProjectsList();
  }

  function deleteProject(id) {
    if (!confirm('هل تريد حذف هذا المشروع؟')) return;
    S.projects = S.projects.filter(p => p.id !== id);
    renderProjectsList();
  }

  /* ── utils ───────────────────────────── */
  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
  }
  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  return {
    init, switchTab, liveColor, setFont, save,
    addProject, renderProjectsList,
    toggleEditProject, updateProject, deleteProject,
  };
})();

/* ════════════════════════════════════════════
   THEME — تطبيق الألوان والخطوط
════════════════════════════════════════════ */
function applyColors() {
  const r = document.documentElement;
  r.style.setProperty('--primary',  S.colors.primary);
  r.style.setProperty('--accent',   S.colors.accent);
  r.style.setProperty('--bg',       S.colors.bg);
  r.style.setProperty('--card-bg',  S.colors.card);
  r.style.setProperty('--text',     S.colors.text);
  r.style.setProperty('--muted',    S.colors.muted);
}

function applyFont() {
  const f = FONTS.find(x => x.name === S.font);
  if (f && f.url && !document.querySelector(`link[href="${f.url}"]`)) {
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = f.url;
    document.head.appendChild(link);
  }
  document.documentElement.style.setProperty('--font', `'${S.font}', sans-serif`);
}

/* ════════════════════════════════════════════
   BOOT — التشغيل
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  await loadState();
  Matrix.init();
  applyColors();
  applyFont();

  const bn = document.getElementById('brand-name');
  const bt = document.getElementById('brand-title');
  if (bn) bn.textContent = S.name;
  if (bt) bt.textContent = S.title;

  Pages.show('user-login');
});

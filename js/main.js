/* ═══════════════════════════════════════════════════════
   LANTERN NETWORK — Main JS
   ═══════════════════════════════════════════════════════ */

/* ── Toast ── */
function showToast(title, desc) {
  let wrap = document.getElementById('toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.id = 'toast-wrap'; document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = 'toast-item';
  t.innerHTML = `<div class="toast-title">${title}</div>${desc ? `<div class="toast-desc">${desc}</div>` : ''}`;
  wrap.appendChild(t);
  setTimeout(() => { t.style.animation = 'toastOut .3s ease both'; setTimeout(() => t.remove(), 300); }, 4200);
}

/* ── Mobile menu ── */
function initMobileMenu() {
  const tog = document.getElementById('mob-tog');
  const nav = document.getElementById('mob-nav');
  const icon = document.getElementById('mob-icon');
  if (!tog || !nav) return;
  tog.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    if (icon) { icon.setAttribute('data-lucide', open ? 'x' : 'menu'); lucide.createIcons(); }
  });
  nav.querySelectorAll('.nav-a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    if (icon) { icon.setAttribute('data-lucide', 'menu'); lucide.createIcons(); }
  }));
}

/* ── Active nav ── */
function setActiveNav() {
  const page = document.body.getAttribute('data-page') || 'index';
  document.querySelectorAll('.nav-a[data-page]').forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-page') === page);
  });
}

/* ── Init layout (nav + footer are now inline in each page) ── */
function initLayout() {
  const yr = document.getElementById('copy-year');
  if (yr) yr.textContent = new Date().getFullYear();
  setActiveNav();
  initMobileMenu();
  lucide.createIcons();
}

/* ══════════════════════════════════════════════════════
   HERO SLIDER
   ══════════════════════════════════════════════════════ */
const SLIDES = [
  {
    eyebrow: 'AFL Authorized Service Centre',
    lead: 'MEA\'s Authorized',
    emphasis: 'AFL Service & Calibration Center.',
    sub: 'Expert Repair, Calibration, Maintenance And Certification For AFL Fiber-Optic Equipment Across The Middle East & Africa.',
    trust: '10,000+ Devices Serviced · OEM-Approved Precision · MEA Coverage',
    img: 'assets/otdr-repair.jpg',
    imgAlt: 'AFL OTDR repair and calibration center',
    imgLabel: 'AFL Authorized Service Centre · MEA',
    imgSub: 'OEM-Approved Repair & Calibration',
    ctas: [{l:'Book Service',h:'service-center.html'},{l:'Request Calibration',h:'contact.html'}]
  },
  {
    eyebrow: 'MEA Digital Infrastructure Partner',
    lead: 'Designing The Future Of',
    emphasis: 'Fiber & Digital Infrastructure',
    sub: 'Authorized Technology Partner For The World\'s Leading Telecom And Network Infrastructure Brands Across The Middle East & Africa.',
    trust: 'ISO,ICV Certified · DUNS Certified · MEA Regional Technology Partner',
    img: 'assets/datacenter.jpg',
    imgAlt: 'Fiber optic network infrastructure',
    imgLabel: 'MEA Digital Infrastructure Partner',
    imgSub: 'ISO,ICV & DUNS Certified · UAE Based',
    ctas: [{l:'Book Service',h:'service-center.html'},{l:'Contact Our Experts',h:'contact.html'}]
  },
  {
    eyebrow: 'Training & Network Excellence',
    lead: 'Building The Next Generation Of',
    emphasis: 'Fiber Professionals',
    sub: 'Globally Recognized FTTx Training And ETA FOT-OSP Certification With Hands-On Fiber Labs Across MEA.',
    trust: 'ETA Fiber Optics Technician · Light Brigade Certified · Hands-On Labs',
    img: 'assets/training-lab.jpg',
    imgAlt: 'Fiber optic training lab',
    imgLabel: 'ETA FOT-OSP Certified Training · MEA',
    imgSub: 'Light Brigade Certified · Hands-On Labs',
    ctas: [{l:'View Training Programs',h:'training.html'},{l:'Enroll Now',h:'contact.html'}]
  }
];

function initHeroSlider() {
  const container = document.getElementById('hero-slider');
  if (!container) return;
  let cur = 0, timer = null;
  const total = SLIDES.length;

  function render(idx, animate) {
    const s = SLIDES[idx];
    // Update slide text
    const content = container.querySelector('.hero-slide-content');
    content.innerHTML = `
      <span class="pill hero-pill">
        <i data-lucide="sparkles" style="width:.875rem;height:.875rem"></i>
        ${s.eyebrow}
      </span>
      <h1 class="hero-title">${s.lead} ${s.emphasis}</h1>
      <p class="hero-subtitle">${s.sub}</p>
      ${s.trust ? `<p class="hero-trust">${s.trust}</p>` : ''}
      <div class="hero-ctas">
        <a href="${s.ctas[0].h}" class="btn btn-lg btn-hero">${s.ctas[0].l}</a>
        <a href="${s.ctas[1].h}" class="btn btn-lg btn-hero">${s.ctas[1].l}</a>
      </div>`;
    if (animate) {
      content.style.animation = 'none';
      content.offsetHeight; // reflow
      content.style.animation = 'fade-up .6s ease both';
    }
    // Update hero image + overlay card
    const imgWrap = container.querySelector('.hero-img-wrap');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      const titleEl = imgWrap.querySelector('.hero-overlay-title');
      const subEl   = imgWrap.querySelector('.hero-overlay-sub');
      if (img && s.img) {
        if (animate) {
          img.classList.add('img-fade');
          setTimeout(() => {
            img.src = s.img;
            img.alt = s.imgAlt || '';
            img.onload = () => img.classList.remove('img-fade');
            // fallback if already cached
            if (img.complete) img.classList.remove('img-fade');
          }, 250);
        } else {
          img.src = s.img;
          img.alt = s.imgAlt || '';
        }
      }
      if (titleEl && s.imgLabel) titleEl.textContent = s.imgLabel;
      if (subEl && s.imgSub)    subEl.textContent = s.imgSub;
    }
    container.querySelectorAll('.hero-dot').forEach((d,i) => d.classList.toggle('active', i === idx));
    lucide.createIcons();
  }

  function go(n) {
    clearInterval(timer);
    cur = ((n % total) + total) % total;
    render(cur, true);
    timer = setInterval(() => go(cur + 1), 7000);
  }

  render(0, false);
  timer = setInterval(() => go(cur + 1), 7000);

  container.querySelector('#hero-prev').addEventListener('click', () => go(cur - 1));
  container.querySelector('#hero-next').addEventListener('click', () => go(cur + 1));
  container.querySelectorAll('.hero-dot').forEach((d,i) => d.addEventListener('click', () => go(i)));
}

/* ══════════════════════════════════════════════════════
   CUSTOMER ORBIT
   ══════════════════════════════════════════════════════ */
const CUSTOMERS = [
  { name: 'WIOCC', logo: 'assets/customers/wiocc.png', big: true },
  { name: 'Savanna Fibre', logo: 'assets/customers/savanna.svg', big: true },
  { name: 'Du', logo: 'assets/customers/du.png' },
  { name: 'Etisalat by e&', logo: 'assets/customers/etisalat.svg', big: true },
  { name: 'Oman Broadband', logo: 'assets/customers/oman-broadband.svg', small: true },
  { name: 'Blue Crane Communications', logo: 'assets/customers/bluecrane.png', small: true },
  { name: 'MTN South Sudan', logo: 'assets/customers/mtn.svg', small: true }
];

function buildOrbit() {
  const wrap = document.getElementById('orbit-wrap');
  if (!wrap) return;

  // Inner ring: only Du and Etisalat at 180° apart
  const innerC = CUSTOMERS.filter(c => c.name === 'Du' || c.name === 'Etisalat by e&');
  // Outer ring: everyone else
  const outerC = CUSTOMERS.filter(c => c.name !== 'Du' && c.name !== 'Etisalat by e&');

  function tile(c, size) {
    const d = document.createElement('div');
    d.className = `orbit-tile orbit-tile-${c.big ? 'lg' : size}`;
    if (c.logo) {
      const img = document.createElement('img');
      img.src = c.logo;
      img.alt = c.name;
      img.loading = 'lazy';
      if (c.invert) img.style.filter = 'brightness(0)';
      if (c.big) { 
        img.style.width = 'auto'; 
        img.style.maxWidth = '120px'; 
        img.style.maxHeight = '90px'; 
        img.style.height = 'auto'; 
      }
      if (c.small) {
        img.style.width = 'auto';
        img.style.maxWidth = '90px';
        img.style.maxHeight = '70px';
        img.style.height = 'auto';
      }
      d.appendChild(img);
    } else {
      const s = document.createElement('span');
      s.textContent = c.name;
      d.appendChild(s);
    }
    return d;
  }

  function placeRing(customers, radiusPct, spinClass, counterClass, size, phase) {
    const ring = document.createElement('div');
    ring.className = spinClass;
    customers.forEach((c, idx) => {
      const angle = phase + (idx / customers.length) * 360;
      const rad = angle * Math.PI / 180;
      const x = 50 + radiusPct * Math.sin(rad);
      const y = 50 - radiusPct * Math.cos(rad);
      const pos = document.createElement('div');
      pos.style.cssText = `position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%)`;
      const counter = document.createElement('div');
      counter.className = counterClass;
      counter.appendChild(tile(c, size));
      pos.appendChild(counter);
      ring.appendChild(pos);
    });
    wrap.appendChild(ring);
  }

  // Responsive radius — smaller on mobile to prevent tile overflow at edges
  const vw = window.innerWidth;
  const outerR = vw < 480 ? 36 : vw < 640 ? 38 : 46;
  const innerR = vw < 480 ? 21 : vw < 640 ? 22 : 26;

  // Outer — clockwise (all logos except Du & Etisalat)
  placeRing(outerC, outerR, 'orbit-spin-cw', 'orbit-counter-cw', 'lg', 0);

  // Inner — Du at top (0°), Etisalat at bottom (180°), counter-clockwise
  // Place them manually at fixed 0° and 180° angles
  const innerRing = document.createElement('div');
  innerRing.className = 'orbit-spin-ccw';

  innerC.forEach((c, idx) => {
    // 0° = top, 180° = bottom
    const angle = idx === 0 ? 0 : 180;
    const rad = angle * Math.PI / 180;
    const x = 50 + innerR * Math.sin(rad);
    const y = 50 - innerR * Math.cos(rad);
    const pos = document.createElement('div');
    pos.style.cssText = `position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%)`;
    const counter = document.createElement('div');
    counter.className = 'orbit-counter-ccw';
    counter.appendChild(tile(c, 'sm'));
    pos.appendChild(counter);
    innerRing.appendChild(pos);
  });
  wrap.appendChild(innerRing);
}

/* ══════════════════════════════════════════════════════
   VISITOR CAPTURE DIALOG
   ══════════════════════════════════════════════════════ */
const STORAGE_KEY = 'lantern_visitor_v3';

function initVisitorDialog() {
  if (sessionStorage.getItem(STORAGE_KEY)) return;
  setTimeout(() => {
    const backdrop = document.createElement('div');
    backdrop.className = 'dialog-backdrop';
    backdrop.id = 'visitor-dialog';
    backdrop.innerHTML = `
      <div class="dialog-box">
        <div class="pill pill-white" style="font-size:.65rem">
          <i data-lucide="sparkles" style="width:.875rem;height:.875rem"></i>
          Welcome To Lantern Network
        </div>
        <h2>Stay Connected With Lantern</h2>
        <p class="desc">Share A Few Details And Our Team Will Reach Out With Relevant Solutions, Updates And Offers.</p>
        <form class="dialog-form" id="visitor-form">
          <div>
            <label class="fld-label" for="vc-name">Name *</label>
            <input class="fld" id="vc-name" name="name" required placeholder="Your full name">
          </div>
          <div>
            <label class="fld-label" for="vc-email">Email *</label>
            <input class="fld" id="vc-email" name="email" type="email" required placeholder="you@company.com">
          </div>
          <div>
            <label class="fld-label" for="vc-mobile">Mobile Number *</label>
            <input class="fld" id="vc-mobile" name="mobile" type="tel" required placeholder="+971 50 000 0000">
          </div>
          <div class="dialog-footer">
            <button type="button" class="btn btn-ghost" id="vc-dismiss">Maybe Later</button>
            <button type="submit" class="btn btn-primary" id="vc-submit">Submit</button>
          </div>
        </form>
      </div>`;
    document.body.appendChild(backdrop);
    lucide.createIcons();

    function dismiss() { sessionStorage.setItem(STORAGE_KEY, 'dismissed'); backdrop.remove(); }
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) dismiss(); });
    document.getElementById('vc-dismiss').addEventListener('click', dismiss);
    document.getElementById('visitor-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('vc-submit');
      btn.disabled = true; btn.textContent = 'Sending…';
      setTimeout(() => {
        sessionStorage.setItem(STORAGE_KEY, 'captured');
        backdrop.remove();
        showToast('Thank You!', 'We\'ve Received Your Details. Our Team Will Be In Touch Shortly.');
      }, 600);
    });
  }, 800);
}

/* ══════════════════════════════════════════════════════
   CONTACT FORM
   ══════════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    btn.disabled = true;
    btn.innerHTML = 'Sending…';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = 'Send Message <i data-lucide="send" style="width:1rem;height:1rem"></i>';
      form.reset();
      lucide.createIcons();
      showToast('Message Sent', 'Thank You — Our Team Will Contact You Within 1 Business Day.');
    }, 800);
  });
}

/* ══════════════════════════════════════════════════════
   REVEAL ON SCROLL
   ══════════════════════════════════════════════════════ */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════════════════
   COUNT-UP ANIMATION
   ══════════════════════════════════════════════════════ */
function initCountUp() {
  const els = document.querySelectorAll('.sv');
  if (!els.length) return;

  function animateCount(el) {
    const raw    = el.textContent.trim();
    const num    = parseFloat(raw.replace(/[^0-9.]/g, ''));
    const suffix = raw.replace(/[0-9.]/g, '');   // e.g. "+", "%"

    if (isNaN(num)) return;   // skip non-numeric like "AFL"

    const duration = 1800;
    const steps    = 60;
    const interval = duration / steps;
    let current    = 0;

    el.textContent = '0' + suffix;

    const timer = setInterval(() => {
      current += num / steps;
      if (current >= num) {
        current = num;
        clearInterval(timer);
      }
      el.textContent = (Number.isInteger(num)
        ? Math.floor(current)
        : current.toFixed(1)) + suffix;
    }, interval);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  els.forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════════════════
   KEYWORD SEARCH — Data & Logic
   ══════════════════════════════════════════════════════ */
const SEARCH_INDEX = [
  // AFL
  { name: 'AFL OTDR',               cat: 'AFL — Test & Measurement', icon: 'scan-line',    href: 'service-center.html',           keywords: ['afl','otdr','optical time domain','reflectometer','test'] },
  { name: 'AFL Fusion Splicer',     cat: 'AFL — Test & Measurement', icon: 'zap',          href: 'service-center.html',           keywords: ['afl','fusion','splicer','splicing'] },
  { name: 'AFL Optical Power Meter',cat: 'AFL — Test & Measurement', icon: 'gauge',        href: 'service-center.html',           keywords: ['afl','optical','power meter','light source'] },
  { name: 'AFL Fiber Cleaver',      cat: 'AFL — Test & Measurement', icon: 'scissors',     href: 'service-center.html',           keywords: ['afl','cleaver','fiber cleave'] },
  { name: 'AFL Visual Fault Locator',cat:'AFL — Test & Measurement', icon: 'flashlight',   href: 'service-center.html',           keywords: ['afl','vfl','visual fault','locator'] },
  { name: 'AFL Authorized Service Centre', cat:'AFL — Service',      icon: 'badge-check',  href: 'service-center.html',           keywords: ['afl','service','calibration','repair','authorized','service centre','center'] },
  { name: 'AFL Traceable Calibration',     cat:'AFL — Service',      icon: 'ruler',        href: 'service-center.html',           keywords: ['calibration','traceable','nist','oem','certified'] },
  { name: 'AFL Fiber Optic Cables',        cat:'AFL — Connectivity', icon: 'cable',        href: 'services.html',                 keywords: ['afl','cable','fiber optic','connectivity','patch cord'] },
  { name: 'AFL Hyperscale',                cat:'AFL — Data Centre',  icon: 'server',       href: 'hyperscale.html',               keywords: ['afl','hyperscale','data centre','data center','high density','patch panel'] },
  { name: 'AFL FS100 Splicer',             cat:'AFL — Test & Measurement', icon: 'zap',   href: 'service-center.html',           keywords: ['fs100','fs-100','afl splicer'] },
  // Fujikura
  { name: 'Fujikura Fiber Cables',         cat:'Fujikura — Cables',  icon: 'cable',        href: 'services.html#fujikura-cables', keywords: ['fujikura','fiber','cable','optical','single mode','multimode'] },
  { name: 'Fujikura Spider Web Ribbon SWR',cat:'Fujikura — Cables',  icon: 'layers',       href: 'services.html#fujikura-cables', keywords: ['fujikura','swr','spider web ribbon','ribbon fiber','ftth'] },
  { name: 'Fujikura FTTH Cable',           cat:'Fujikura — Cables',  icon: 'home',         href: 'services.html#fujikura-cables', keywords: ['fujikura','ftth','fttx','drop cable','indoor','home'] },
  { name: 'Fujikura Data Centre Fiber',    cat:'Fujikura — Data Centre', icon: 'server',   href: 'hyperscale.html',               keywords: ['fujikura','data centre','om3','om4','multimode','datacenter'] },
  // Anritsu
  { name: 'Anritsu Spectrum Analyzer',     cat:'Anritsu — RF Testing', icon: 'radio',      href: 'services.html#anritsu',         keywords: ['anritsu','spectrum','analyzer','rf','frequency'] },
  { name: 'Anritsu Site Master',           cat:'Anritsu — RF Testing', icon: 'signal-high',href: 'services.html#anritsu',         keywords: ['anritsu','site master','cable','antenna','vswr','return loss'] },
  { name: 'Anritsu PIM Tester',            cat:'Anritsu — RF Testing', icon: 'zap-off',    href: 'services.html#anritsu',         keywords: ['anritsu','pim','passive intermodulation','tester'] },
  { name: 'Anritsu Network Master',        cat:'Anritsu — Transport',  icon: 'network',    href: 'services.html#anritsu',         keywords: ['anritsu','network master','transport','ethernet','sync'] },
  // Yokogawa
  { name: 'Yokogawa OTDR',                 cat:'Yokogawa — Test',      icon: 'scan-line',  href: 'services.html#yokogawa',        keywords: ['yokogawa','otdr','optical','test','reflectometer'] },
  { name: 'Yokogawa Optical Spectrum Analyzer', cat:'Yokogawa — Test', icon: 'activity',   href: 'services.html#yokogawa',        keywords: ['yokogawa','optical spectrum','osa','analyzer','wavelength'] },
  // Genie Networks
  { name: 'Genie Networks DDoS Protection',cat:'Genie — Network Intelligence', icon:'shield-check', href:'services.html#genie', keywords:['genie','ddos','protection','mitigation','network security'] },
  { name: 'Genie BGP Traffic Analysis',    cat:'Genie — Network Intelligence', icon:'git-branch',   href:'services.html#genie', keywords:['genie','bgp','traffic','analysis','peering','routing'] },
  { name: 'Genie NetFlow & IPFIX',         cat:'Genie — Network Intelligence', icon:'activity',     href:'services.html#genie', keywords:['genie','netflow','ipfix','traffic intelligence','flow'] },
  // Nivtrix
  { name: 'Nivtrix BILLOS — Billing OSS', cat:'Nivtrix — Platforms',  icon:'database',    href:'services.html#nivtrix',          keywords:['nivtrix','billos','billing','revenue','oss','bss'] },
  { name: 'Nivtrix COMMOS — CPaaS',       cat:'Nivtrix — Platforms',  icon:'radio',       href:'services.html#nivtrix',          keywords:['nivtrix','commos','cpaas','messaging','omnichannel','sms'] },
  { name: 'Nivtrix GISOS — GIS',          cat:'Nivtrix — Platforms',  icon:'globe-2',     href:'services.html#nivtrix',          keywords:['nivtrix','gisos','gis','geospatial','mapping','network map'] },
  { name: 'Nivtrix NETOS — Network OSS',  cat:'Nivtrix — Platforms',  icon:'network',     href:'services.html#nivtrix',          keywords:['nivtrix','netos','oss','network operations','automation','nms'] },
  { name: 'Nivtrix FINOS — Fintech',      cat:'Nivtrix — Platforms',  icon:'landmark',    href:'services.html#nivtrix',          keywords:['nivtrix','finos','fintech','digital payments','wallet','mobile money'] },
  { name: 'Nivtrix AIOPS OS',             cat:'Nivtrix — Platforms',  icon:'cpu',         href:'services.html#nivtrix',          keywords:['nivtrix','aiops','ai','monitoring','intelligence','machine learning'] },
  // FICER
  { name: 'FICER Coherent DWDM Optics',   cat:'FICER — Transceivers', icon:'cpu',         href:'services.html#ficer',            keywords:['ficer','dwdm','coherent','transceiver','optics','long haul','metro'] },
  { name: 'FICER SFP+ / QSFP Modules',    cat:'FICER — Transceivers', icon:'plug',        href:'services.html#ficer',            keywords:['ficer','sfp','qsfp','transceiver module','optical module','pluggable'] },
  // Services & Pages
  { name: 'AFL Service Centre',           cat:'Services',             icon:'wrench',       href:'service-center.html',            keywords:['service centre','repair','oem','calibration','workshop'] },
  { name: 'Fiber Optic Training',         cat:'Training',             icon:'graduation-cap',href:'training.html',                  keywords:['training','fiber optic','eta','fot-osp','light brigade','certification','course'] },
  { name: 'ETA FOT-OSP Certification',    cat:'Training',             icon:'award',        href:'training.html',                  keywords:['eta','fot-osp','certification','fiber optics technician','oscp'] },
  { name: 'Hyperscale Data Centre',       cat:'Solutions',            icon:'server',       href:'hyperscale.html',                keywords:['hyperscale','data centre','high density','ribbon','patch panel','400g','800g'] },
  { name: 'About Lantern Network',        cat:'Company',              icon:'info',         href:'about.html',                     keywords:['about','lantern','company','team','mea','dubai'] },
  { name: 'Contact / Get a Quote',        cat:'Company',              icon:'mail',         href:'contact.html',                   keywords:['contact','quote','enquiry','email','phone','reach'] },
  { name: 'Partners Overview',            cat:'Company',              icon:'handshake',    href:'partners.html',                  keywords:['partners','authorized','reseller','distribute'] },
];

function scoreResult(item, q) {
  const lq = q.toLowerCase().trim();
  const name = item.name.toLowerCase();
  const cat  = item.cat.toLowerCase();
  // Exact name match
  if (name === lq) return 100;
  // Name starts with query
  if (name.startsWith(lq)) return 90;
  // Name contains query
  if (name.includes(lq)) return 80;
  // Category contains query
  if (cat.includes(lq)) return 60;
  // Keywords
  for (const kw of item.keywords) {
    if (kw === lq) return 75;
    if (kw.startsWith(lq)) return 65;
    if (kw.includes(lq)) return 50;
  }
  return 0;
}

function initKeywordSearch() {
  const input    = document.getElementById('site-search-input');
  const dropdown = document.getElementById('search-dropdown');
  const noRes    = document.getElementById('search-no-results');
  const btn      = document.getElementById('site-search-btn');
  if (!input || !dropdown) return;

  let focusedIdx = -1;

  function closeDropdown() {
    dropdown.hidden = true;
    noRes.hidden = true;
    focusedIdx = -1;
  }

  function renderResults(q) {
    dropdown.innerHTML = '';
    noRes.hidden = true;

    if (!q || q.length < 2) { closeDropdown(); return; }

    const scored = SEARCH_INDEX
      .map(item => ({ item, score: scoreResult(item, q) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    if (!scored.length) {
      dropdown.hidden = true;
      noRes.hidden = false;
      lucide.createIcons();
      return;
    }

    // Group by category
    const groups = {};
    scored.forEach(({ item }) => {
      if (!groups[item.cat]) groups[item.cat] = [];
      groups[item.cat].push(item);
    });

    let itemCount = 0;
    Object.entries(groups).forEach(([cat, items]) => {
      const grp = document.createElement('div');
      grp.className = 'search-dropdown-group';
      grp.textContent = cat;
      dropdown.appendChild(grp);
      items.forEach(item => {
        const el = document.createElement('a');
        el.href = item.href;
        el.className = 'search-result-item';
        el.setAttribute('role', 'option');
        el.dataset.idx = itemCount++;
        el.innerHTML = `
          <div class="search-result-icon"><i data-lucide="${item.icon}"></i></div>
          <div class="search-result-text">
            <div class="search-result-name">${item.name}</div>
          </div>
          <div class="search-result-arrow"><i data-lucide="arrow-right"></i></div>`;
        dropdown.appendChild(el);
      });
    });

    focusedIdx = -1;
    dropdown.hidden = false;
    lucide.createIcons();
  }

  function setFocus(idx) {
    const items = dropdown.querySelectorAll('.search-result-item');
    items.forEach(el => el.classList.remove('focused'));
    if (idx >= 0 && idx < items.length) {
      items[idx].classList.add('focused');
      items[idx].scrollIntoView({ block: 'nearest' });
      focusedIdx = idx;
    } else {
      focusedIdx = -1;
    }
  }

  input.addEventListener('input', () => renderResults(input.value));

  input.addEventListener('keydown', (e) => {
    const items = dropdown.querySelectorAll('.search-result-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocus(Math.min(focusedIdx + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocus(Math.max(focusedIdx - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIdx >= 0 && items[focusedIdx]) {
        items[focusedIdx].click();
      } else if (input.value.trim().length >= 2) {
        // Navigate to first result if any
        if (items.length) items[0].click();
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
      input.blur();
    }
  });

  btn.addEventListener('click', () => {
    const q = input.value.trim();
    if (q.length < 2) return;
    const items = dropdown.querySelectorAll('.search-result-item');
    if (items.length) items[0].click();
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#keyword-search')) closeDropdown();
  });
}

/* ══════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initLayout();            // nav + footer inline — set active link, mobile menu, icons, copyright
  initHeroSlider();
  buildOrbit();
  initVisitorDialog();
  initContactForm();
  initReveal();
  initCountUp();
  initKeywordSearch();
});

/* ══════════════════════════════════════════════════════
   ORBIT SVG SPOKES (appended after buildOrbit)
   ══════════════════════════════════════════════════════ */
function buildOrbitSpokes() {
  const wrap = document.getElementById('orbit-wrap');
  if (!wrap) return;
  const outer = CUSTOMERS.filter(c => c.name !== 'Du' && c.name !== 'Etisalat by e&');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;color:rgba(0,66,130,.15)';
  svg.setAttribute('aria-hidden', 'true');
  outer.forEach((_, i) => {
    const a = (i / outer.length) * 360;
    const rad = a * Math.PI / 180;
    const x2 = 50 + 46 * Math.sin(rad);
    const y2 = 50 - 46 * Math.cos(rad);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '50'); line.setAttribute('y1', '50');
    line.setAttribute('x2', String(x2)); line.setAttribute('y2', String(y2));
    line.setAttribute('stroke', 'currentColor');
    line.setAttribute('stroke-width', '0.2');
    line.setAttribute('stroke-dasharray', '0.6 1');
    svg.appendChild(line);
  });
  // Insert after rings but before tiles
  const center = wrap.querySelector('.orbit-center');
  wrap.insertBefore(svg, center);
}

// Override buildOrbit to also call spokes
const _origBuildOrbit = buildOrbit;
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(buildOrbitSpokes, 50);
}, { once: false });

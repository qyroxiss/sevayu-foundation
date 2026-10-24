// Sevayu Foundation: header, seva filters, the plate of seva (bar + drawer), portfolio gallery and viewer.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WHATSAPP = '919323547108';
  const rupees = (n) => '₹' + n.toLocaleString('en-IN');
  const root = document.documentElement;

  // ---------- gentle entrance ----------
  const reveals = document.querySelectorAll('.sec-head, .appeal-grid > *, .seva-card, .impact-text, .impact-photo, .np-head, .np-photo, .principles li, .giver, .q-side, .q-list');
  if ('IntersectionObserver' in window && !reduce) {
    reveals.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  }

  // ---------- header: solid once past the hero; links follow the section being read ----------
  const bar = document.getElementById('top-bar');
  const hero = document.querySelector('.hero');
  const links = [...document.querySelectorAll('.top-links a')];
  const linkTargets = links.map((a) => document.querySelector(a.getAttribute('href')));
  const onHeader = () => {
    bar.classList.toggle('is-solid', hero.getBoundingClientRect().bottom < 90);
    let on = -1;
    linkTargets.forEach((t, i) => { if (t && t.getBoundingClientRect().top < innerHeight * 0.35) on = i; });
    links.forEach((a, i) => a.classList.toggle('is-on', i === on));
  };

  // ---------- seva groups ----------
  const sevaCards = [...document.querySelectorAll('.seva-card')];
  document.querySelectorAll('.seg-btn[data-group]').forEach((btn) => btn.addEventListener('click', () => {
    const g = btn.dataset.group;
    document.querySelectorAll('.seg-btn[data-group]').forEach((b) => { b.classList.toggle('is-on', b === btn); b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
    sevaCards.forEach((card) => {
      const on = g === 'all' || card.dataset.group === g || card.dataset.group === 'all';
      card.hidden = !on;
      card.classList.remove('is-shown');
      if (on && !reduce) { void card.offsetWidth; card.classList.add('is-shown'); }
    });
  }));

  // ---------- the plate of seva ----------
  const plate = new Map(); // id -> { name, price, qty }
  const list = document.getElementById('plate-items');
  const empty = document.getElementById('plate-empty');
  const total = document.getElementById('plate-total');
  const send = document.getElementById('plate-send');
  const nameField = document.getElementById('donor-name');
  const plateBar = document.getElementById('plate-bar');
  const barTotal = document.getElementById('dock-total');
  const barCount = document.getElementById('plate-count');
  const cards = sevaCards.filter((c) => c.dataset.price);
  const plus = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

  const sum = () => [...plate.values()].reduce((s, it) => s + it.price * it.qty, 0);
  const count = () => [...plate.values()].reduce((s, it) => s + it.qty, 0);
  const freq = () => document.querySelector('input[name="freq"]:checked').value;
  const message = () => {
    const lines = ['Hare Krishna. I would like to give a seva to Sevayu Foundation' + (freq() === 'monthly' ? ', every month:' : ':')];
    for (const it of plate.values()) lines.push(`- ${it.name}${it.qty > 1 ? ' × ' + it.qty : ''}: ${rupees(it.price * it.qty)}`);
    lines.push(`Total: ${rupees(sum())}${freq() === 'monthly' ? ' a month' : ''}`);
    const n = nameField.value.trim();
    if (n) lines.push(`Name: ${n}`);
    lines.push('Please share the UPI / bank details.');
    return lines.join('\n');
  };
  const updateLink = () => { if (sum()) send.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message())}`; };

  const change = (id, d, name, price) => {
    const it = plate.get(id) || { name, price, qty: 0 };
    it.qty += d;
    if (it.qty <= 0) plate.delete(id); else plate.set(id, it);
    render(d > 0);
  };

  const renderCard = (card) => {
    const id = card.dataset.id;
    const it = plate.get(id);
    const box = card.querySelector('.stepper');
    card.classList.toggle('is-picked', !!it);
    box.replaceChildren();
    if (!it) {
      const add = document.createElement('button');
      add.type = 'button'; add.className = 'add';
      add.innerHTML = plus + '<span>Add to plate</span>';
      add.setAttribute('aria-label', `Add ${card.dataset.name} to your plate`);
      add.addEventListener('click', () => change(id, 1, card.dataset.name, Number(card.dataset.price)));
      box.append(add);
      return;
    }
    const minus = document.createElement('button');
    minus.type = 'button'; minus.className = 'qty-btn'; minus.textContent = '−';
    minus.setAttribute('aria-label', `One less: ${card.dataset.name}`);
    minus.addEventListener('click', () => change(id, -1));
    const n = document.createElement('span');
    n.className = 'qty-n'; n.textContent = it.qty; n.setAttribute('aria-live', 'polite');
    const more = document.createElement('button');
    more.type = 'button'; more.className = 'qty-btn'; more.textContent = '+';
    more.setAttribute('aria-label', `One more: ${card.dataset.name}`);
    more.addEventListener('click', () => change(id, 1));
    box.append(minus, n, more);
  };

  const render = (added) => {
    list.replaceChildren(...[...plate.entries()].map(([id, it]) => {
      const li = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = it.qty > 1 ? `${it.name} × ${it.qty}` : it.name;
      const amt = document.createElement('span');
      amt.className = 'amt'; amt.textContent = rupees(it.price * it.qty);
      const rm = document.createElement('button');
      rm.type = 'button'; rm.className = 'remove'; rm.textContent = '×';
      rm.setAttribute('aria-label', `Remove ${it.name}`);
      rm.addEventListener('click', () => { plate.delete(id); render(); });
      li.append(label, amt, rm);
      return li;
    }));
    empty.hidden = plate.size > 0;
    const t = sum(), c = count();
    total.textContent = rupees(t) + (freq() === 'monthly' && t ? ' / month' : '');
    barTotal.textContent = rupees(t);
    barCount.textContent = `${c} ${c === 1 ? 'seva' : 'sevas'}`;
    plateBar.hidden = t === 0;
    if (added && !reduce) { plateBar.classList.remove('bump'); void plateBar.offsetWidth; plateBar.classList.add('bump'); total.classList.add('bump'); setTimeout(() => total.classList.remove('bump'), 240); }
    cards.forEach(renderCard);
    updateLink();
  };

  document.getElementById('any-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('any-amount');
    const v = Math.round(Number(input.value));
    if (!v || v < 1) { input.focus(); return; }
    change('any-' + v, 1, 'A seva of my choice', v);
    input.value = '';
  });
  document.querySelectorAll('input[name="freq"]').forEach((r) => r.addEventListener('change', () => render()));
  nameField.addEventListener('input', updateLink);

  // ---------- drawer ----------
  const drawer = document.getElementById('drawer');
  const panel = drawer.querySelector('.drawer-panel');
  let lastFocus = null;
  const openPlate = () => {
    lastFocus = document.activeElement;
    drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false');
    root.classList.add('is-locked');
    setTimeout(() => panel.focus(), 50);
  };
  const closePlate = () => {
    drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true');
    root.classList.remove('is-locked');
    lastFocus?.focus?.();
  };
  document.querySelectorAll('[data-open-plate]').forEach((b) => b.addEventListener('click', openPlate));
  document.querySelectorAll('[data-close-plate]').forEach((b) => b.addEventListener('click', closePlate));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('is-open')) closePlate(); });
  panel.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = [...panel.querySelectorAll('button, a, input')].filter((el) => !el.hidden && el.offsetParent !== null);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  // ---------- portfolio filters ----------
  const tiles = [...document.querySelectorAll('.pf-tile')];
  const pfEmpty = document.getElementById('pf-empty');
  document.querySelectorAll('.chip[data-filter]').forEach((chip) => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    document.querySelectorAll('.chip[data-filter]').forEach((c) => { c.classList.toggle('is-on', c === chip); c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
    let shown = 0;
    tiles.forEach((tile) => {
      const on = f === 'all' || tile.dataset.cat === f;
      tile.hidden = !on;
      tile.classList.remove('is-shown');
      if (on) { shown++; if (!reduce) { void tile.offsetWidth; tile.classList.add('is-shown'); } }
    });
    pfEmpty.hidden = shown > 0;
  }));

  // ---------- viewer: photographs and the film, opened only when asked ----------
  // The film is never on the page until someone presses play; closing the viewer unloads it.
  const viewer = document.getElementById('viewer');
  const stage = document.getElementById('viewer-stage');
  const cap = document.getElementById('viewer-cap');
  const prev = document.getElementById('viewer-prev');
  const next = document.getElementById('viewer-next');
  let items = [], at = 0, opener = null;

  const unload = () => {
    const v = stage.querySelector('video');
    if (v) { v.pause(); v.removeAttribute('src'); v.load(); }
    stage.replaceChildren();
  };
  const show = (i) => {
    at = (i + items.length) % items.length;
    const btn = items[at];
    unload();
    if (btn.dataset.film) {
      const v = document.createElement('video');
      v.src = btn.dataset.film; v.controls = true; v.autoplay = true; v.playsInline = true;
      v.poster = btn.querySelector('img').getAttribute('src');
      v.setAttribute('aria-label', btn.dataset.caption);
      stage.append(v);
    } else {
      const img = document.createElement('img');
      img.src = btn.dataset.src; img.alt = btn.querySelector('img').alt;
      stage.append(img);
    }
    cap.textContent = btn.dataset.caption;
    prev.hidden = next.hidden = items.length < 2;
  };
  const open = (btn) => {
    opener = btn;
    items = btn.closest('#pf-grid') ? [...document.querySelectorAll('#pf-grid .pf-tile:not([hidden]) .pf-open')] : [btn];
    show(items.indexOf(btn));
    root.classList.add('is-viewing');
    viewer.showModal();
  };
  viewer.addEventListener('close', () => { unload(); root.classList.remove('is-viewing'); opener?.focus(); });
  viewer.addEventListener('click', (e) => { if (e.target === viewer || e.target === stage) viewer.close(); });
  viewer.addEventListener('keydown', (e) => {
    if (items.length < 2) return;
    if (e.key === 'ArrowRight') show(at + 1);
    if (e.key === 'ArrowLeft') show(at - 1);
  });
  prev.addEventListener('click', () => show(at - 1));
  next.addEventListener('click', () => show(at + 1));
  document.getElementById('viewer-close').addEventListener('click', () => viewer.close());
  document.querySelectorAll('.film, .pf-open').forEach((btn) => btn.addEventListener('click', () => open(btn)));

  // ---------- scroll ----------
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { ticking = false; onHeader(); });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onHeader();
  render();
})();

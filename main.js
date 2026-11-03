(function () {
  const root = document.documentElement;
  root.classList.add('js');

  // Footer year
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // Nav: border on scroll + mobile menu
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  document.querySelectorAll('.nav__menu > a').forEach((a) =>
    a.addEventListener('click', () => setMenu(false))
  );

  // CV dropdowns: close on outside click, Escape, or after choosing a file
  const dropdowns = Array.from(document.querySelectorAll('details.dropdown'));
  document.addEventListener('click', (e) => {
    dropdowns.forEach((d) => { if (d.open && !d.contains(e.target)) d.open = false; });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    dropdowns.forEach((d) => {
      if (d.open) { d.open = false; d.querySelector('summary').focus(); }
    });
    if (nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  dropdowns.forEach((d) =>
    d.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { d.open = false; }))
  );

  // Copy email
  const copyBtn = document.querySelector('[data-copy]');
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copyBtn.dataset.copy);
        copyBtn.textContent = 'Copied';
        copyBtn.classList.add('is-copied');
        setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('is-copied'); }, 1800);
      } catch (_) { /* clipboard blocked: the mailto link still works */ }
    });
  } else if (copyBtn) {
    copyBtn.hidden = true;
  }

  // Reveal on scroll
  const items = document.querySelectorAll('.reveal');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach((el) => io.observe(el));
})();

// Git Academy — interações mínimas e diretas
(function () {

  // Menu mobile
  document.querySelectorAll('.nav-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.nav-links')?.classList.toggle('open');
    });
  });

  // Tabs (instalação)
  document.querySelectorAll('.tabs').forEach(tabs => {
    const scope = tabs.parentElement;
    tabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.tab;
        scope.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === target));
      });
    });
  });

  // Filtros da página de comandos
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const scope = btn.closest('.container');
      const targetGroup = btn.dataset.group;

      scope.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      scope.querySelectorAll('.cmd-group').forEach(group => {
        if (targetGroup === 'all') {
          group.classList.add('active');
        } else {
          group.classList.toggle('active', group.dataset.group === targetGroup);
        }
      });
    });
  });

  // Reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

})();
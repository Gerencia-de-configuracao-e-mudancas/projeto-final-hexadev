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

})();
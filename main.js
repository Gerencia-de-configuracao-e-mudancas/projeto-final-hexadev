(function () {

  // Menu mobile
  document.querySelectorAll('.nav-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.nav-links')?.classList.toggle('open');
    });
  });

})();
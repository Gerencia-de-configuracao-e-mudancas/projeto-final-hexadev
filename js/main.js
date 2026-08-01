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

    // Botão copiar
  document.querySelectorAll('.copy').forEach(botao => {
    botao.addEventListener('click', () => {
      const comando = botao
        .closest('.cmd-card')
        .querySelector('.line')
        .textContent;

      navigator.clipboard.writeText(comando)
        .then(() => {
          const textoOriginal = botao.textContent;
          botao.textContent = 'Copiado!';
          setTimeout(() => {
            botao.textContent = textoOriginal;
          }, 1500);
        });
    });
  });

  // Reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

})();

//  Animação interativa do diagrama de branches  
(function () {

  const diagram = document.getElementById('branch-diagram');
  if (!diagram) return; 

  const btnStart = document.getElementById('btn-start-animation');
  const btnReset = document.getElementById('btn-reset-animation');
  const lineFeature = document.getElementById('line-feature');
  const lineMain = document.getElementById('line-main');
  const svg = document.getElementById('merge-connector');
  const path = document.getElementById('merge-path');
  const terminalBody = document.getElementById('terminal-body');

  const dots = {
    c1: diagram.querySelector('[data-commit="c1"]'),
    c2: diagram.querySelector('[data-commit="c2"]'),
    c3: diagram.querySelector('[data-commit="c3"]'),
    c4: diagram.querySelector('[data-commit="c4"]'),
    c5: diagram.querySelector('[data-commit="c5"]'),
  };

  const sleep = ms => new Promise(res => setTimeout(res, ms));

  function leftPercent(dot) {
    return parseFloat(dot.style.left);
  }

  function growLine(lineEl, toPercent) {
    lineEl.querySelector('.line-fill').style.width = toPercent + '%';
  }

  function showDot(dot, { instant = false } = {}) {
    if (instant) dot.style.transition = 'none';
    dot.classList.add('show');
    if (instant) requestAnimationFrame(() => { dot.style.transition = ''; });
  }

  function hideDot(dot) {
    dot.classList.remove('show', 'merge-highlight');
  }

  function appendTerminalLine(text, type) {
  if (type === 'cmd') {
    terminalBody.insertAdjacentHTML('beforeend',
      `<div class="term-line"><span class="prompt">$</span> <span class="cmd">${text}</span></div>`);
  } else {
    terminalBody.insertAdjacentHTML('beforeend', `<span class="out">${text}</span>`);
  }
}

  function drawMergeConnector() {
    const rect = diagram.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${diagram.clientWidth} ${diagram.clientHeight}`);

    const start = dots.c4.getBoundingClientRect();
    const end = dots.c5.getBoundingClientRect();

    const x1 = start.left - rect.left + start.width / 2;
    const y1 = start.top - rect.top + start.height / 2;
    const x2 = end.left - rect.left + end.width / 2;
    const y2 = end.top - rect.top + end.height / 2;
    const midX = (x1 + x2) / 2;

    const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
    path.setAttribute('d', d);

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    path.getBoundingClientRect();
    svg.classList.add('show');
    path.style.strokeDashoffset = 0;
  }

  function resetDiagram() {
    Object.values(dots).forEach(hideDot);
    growLine(lineFeature, 0);
    growLine(lineMain, leftPercent(dots.c2));
    svg.classList.remove('show');
    path.removeAttribute('d');
    terminalBody.innerHTML = '';

  
    showDot(dots.c1, { instant: true });
    showDot(dots.c2, { instant: true });

    btnStart.disabled = false;
    btnReset.disabled = true;
  }

  async function runAnimation() {
    btnStart.disabled = true;
    btnReset.disabled = true;

    appendTerminalLine('git checkout -b feature/api', 'cmd');
    appendTerminalLine("Switched to a new branch 'feature/api'", 'out');
    await sleep(500);

    // cria C3
    growLine(lineFeature, leftPercent(dots.c3));
    await sleep(300);
    showDot(dots.c3);
    appendTerminalLine('git commit -m "feat: endpoint /users"', 'cmd');
    await sleep(700);

    // cria C4
    growLine(lineFeature, leftPercent(dots.c4));
    await sleep(300);
    showDot(dots.c4);
    appendTerminalLine('git commit -m "feat: endpoint /posts"', 'cmd');
    await sleep(700);

    // merge de volta na main
    appendTerminalLine('git checkout main &amp;&amp; git merge feature/api', 'cmd');
    await sleep(400);
    drawMergeConnector();
    await sleep(500);

    growLine(lineMain, leftPercent(dots.c5));
    showDot(dots.c5);
    dots.c5.classList.add('merge-highlight');
    appendTerminalLine("Merge made by the 'ort' strategy.", 'out');

    btnReset.disabled = false;
  }

  btnStart.addEventListener('click', runAnimation);
  btnReset.addEventListener('click', resetDiagram);

  // estado inicial da página
  resetDiagram();

})();
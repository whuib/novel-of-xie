(function () {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch (_) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }
  };
  let chapters = [];
  try { chapters = JSON.parse($('#chapter-data').textContent); } catch (_) {}

  const themeButton = $('.theme-toggle');
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    storage.set('novel-theme', theme);
    if (themeButton) {
      themeButton.setAttribute('aria-label', theme === 'dark' ? '切换日间模式' : '切换夜间模式');
      themeButton.title = theme === 'dark' ? '切换日间模式' : '切换夜间模式';
      const label = themeButton.querySelector('.theme-label');
      if (label) label.textContent = theme === 'dark' ? '日间' : '夜间';
    }
  }
  setTheme(storage.get('novel-theme') === 'dark' ? 'dark' : 'light');
  themeButton?.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

  const savedOrder = Number(storage.get('novel-last-chapter'));
  const savedChapter = chapters.find(item => item.order === savedOrder);
  const continueLink = $('#continue-link');
  if (continueLink && savedChapter) {
    continueLink.href = savedChapter.url;
    $('#continue-title').textContent = savedChapter.title;
    continueLink.hidden = false;
  }
  document.querySelectorAll('[data-progress-for]').forEach(element => {
    const value = Number(storage.get('novel-progress-' + element.dataset.progressFor));
    if (value >= 98) element.textContent = '已读完';
    else if (value > 1) element.textContent = '已读 ' + Math.round(value) + '%';
  });

  const article = $('.chapter-page');
  if (!article) return;
  const order = Number(article.dataset.chapterOrder);
  const content = $('#chapter-content');
  const progress = $('.reading-progress');
  const progressFill = $('#progress-fill');
  const fontDisplay = $('.font-size-value');
  const lineDisplay = $('.line-height-value');
  const lineValues = [1.7, 1.95, 2.2];
  const lineLabels = ['紧凑', '舒适', '宽松'];
  let fontSize = Math.min(24, Math.max(15, Number(storage.get('novel-font-size')) || 18));
  let lineIndex = Math.max(0, lineValues.indexOf(Number(storage.get('novel-line-height'))));
  function applySettings() {
    document.documentElement.style.setProperty('--reader-size', fontSize + 'px');
    document.documentElement.style.setProperty('--reader-leading', lineValues[lineIndex]);
    fontDisplay.textContent = String(fontSize);
    lineDisplay.textContent = lineLabels[lineIndex];
    storage.set('novel-font-size', String(fontSize));
    storage.set('novel-line-height', String(lineValues[lineIndex]));
  }
  applySettings();
  $('.font-decrease')?.addEventListener('click', () => { fontSize = Math.max(15, fontSize - 1); applySettings(); });
  $('.font-increase')?.addEventListener('click', () => { fontSize = Math.min(24, fontSize + 1); applySettings(); });
  $('.line-height-toggle')?.addEventListener('click', () => { lineIndex = (lineIndex + 1) % lineValues.length; applySettings(); });

  storage.set('novel-last-chapter', String(order));
  let pending = false;
  function updateProgress() {
    pending = false;
    const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const percent = Math.min(100, Math.max(0, window.scrollY / total * 100));
    progressFill.style.width = percent + '%';
    progress.setAttribute('aria-valuenow', String(Math.round(percent)));
    storage.set('novel-progress-' + order, String(Math.round(percent)));
    storage.set('novel-scroll-' + order, String(Math.round(window.scrollY)));
  }
  function requestUpdate() {
    if (!pending) { pending = true; requestAnimationFrame(updateProgress); }
  }
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  window.addEventListener('pagehide', updateProgress);
  const previousScroll = Number(storage.get('novel-scroll-' + order));
  let visited = false;
  try { visited = !!sessionStorage.getItem('novel-visited-' + order); } catch (_) {}
  if (previousScroll > 0 && !location.hash && !visited) {
    // Restore once per browser tab; ordinary back/forward navigation retains its native position.
    requestAnimationFrame(() => { window.scrollTo(0, previousScroll); requestUpdate(); });
  }
  try { sessionStorage.setItem('novel-visited-' + order, '1'); } catch (_) {}
  requestUpdate();
})();

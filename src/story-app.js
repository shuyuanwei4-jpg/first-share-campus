const storyRoot = document.getElementById('content');
const progressKey = 'first-share-stories-v2';
const scenePictures = [
  [['食堂', '餐费预算', '¥100'], ['新学期的菜单', '每份套餐', '¥18'], ['印明信片', '今天拿出', '¥100'], ['下课咖啡', '小股东', '1 股']],
  [['校园账本', '现在的存款', '¥8,000'], ['模拟订单', '一手', '100 股'], ['维修报价', '今天要付', '¥600']],
  [['下课咖啡', '公司总股数', '10 万股'], ['咖啡店账本', '剩余现金', '¥12 万'], ['交易小票', '买一股花了', '¥10'], ['下课咖啡', '同一笔分红', '¥0.60']],
  [['旧教材摊', '最接近的报价', '¥20 / 22'], ['旧教材摊', '卖家要价', '¥22'], ['虚构行情', '最新成交', '¥10.01'], ['持仓小票', '当天可卖', '0 股']],
  [['群聊消息', '发来一个', '开户链接'], ['券商 App', '界面入口', '开户'], ['券商 App', '界面入口', '行情'], ['交易回执', '界面入口', '当日委托']],
];
const artProps = { canteen: 'meal', wallet: 'coin', time: 'clock', coffee: 'coffee', market: 'book', phone: 'phone', receipt: 'receipt' };

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(progressKey)) ?? {}; }
  catch { return {}; }
}

const storedProgress = loadProgress();
const progress = STORIES.map((story, index) => {
  const stored = storedProgress[index] ?? {};
  const scene = Number.isInteger(stored.scene) && stored.scene >= 0 && stored.scene < story.scenes.length ? stored.scene : 0;
  const answers = story.scenes.map((item, n) => Number.isInteger(stored.answers?.[n]) && item.choices[stored.answers[n]] ? stored.answers[n] : null);
  return { scene, answers, done: stored.done === true };
});

function saveProgress() {
  try { localStorage.setItem(progressKey, JSON.stringify(progress)); }
  catch { /* The current page can still keep progress in memory. */ }
}

function todayIndex() {
  return progress.findIndex(entry => !entry.done);
}

function dayNumber(index) {
  return String(index + 1).padStart(2, '0');
}

function chapterHeading(index, label, count = 0, step = 0) {
  const tracker = count ? `<div class="step-control" aria-label="第 ${step + 1} 幕，共 ${count} 幕"><strong>${step + 1}</strong> / ${count} 幕<div class="segments" aria-hidden="true">${Array.from({ length: count }, (_, n) => `<i class="${n === step ? 'active' : n < step ? 'visited' : ''}"></i>`).join('')}</div></div>` : '';
  return `<header class="story-heading"><div><p class="day-display" aria-hidden="true">Day ${dayNumber(index)}<span class="dot">.</span></p><h1>${label}</h1></div>${tracker}</header>`;
}

function pictureHTML(index, current, scene) {
  const [locationLabel, amountLabel, amount] = scenePictures[index][current];
  const prop = artProps[scene.art];
  const propHTML = prop === 'coin' ? '¥' : `<span class="prop-${prop}"></span>`;
  return `<figure class="story-art" data-art="${scene.art}" aria-label="${locationLabel}，${amountLabel} ${amount}">
    <span class="art-caption">${locationLabel}</span><span class="art-shape one" aria-hidden="true">✦</span><span class="art-shape two" aria-hidden="true">✳</span>
    <div class="art-objects" aria-hidden="true"><div class="visual-card"><span>${amountLabel}</span><b class="${/[\u3400-\u9fff]/.test(amount) ? 'mixed' : ''}">${amount}</b></div><div class="visual-prop">${propHTML}</div></div>
    <span class="art-status" aria-hidden="true" hidden></span><span class="art-index" aria-hidden="true">${dayNumber(index)} / ${String(current + 1).padStart(2, '0')}</span>
  </figure>`;
}

function renderStory(index, direction = 0) {
  const story = STORIES[index];
  const state = progress[index];
  const current = state.scene;
  const scene = story.scenes[current];
  const last = current === story.scenes.length - 1;
  const nextLabel = last ? '进入模拟练习' : scene.next ?? '下一幕';
  storyRoot.innerHTML = `${chapterHeading(index, story.title, story.scenes.length, current)}
    <section class="story-stage arrive${direction < 0 ? ' reverse' : ''}" aria-labelledby="scene-title">${pictureHTML(index, current, scene)}<div class="story-copy">
      <h2 class="scene-title" id="scene-title" tabindex="-1">${scene.title}</h2><p class="scene-text">${scene.text}</p>
      <div class="choices" role="group" aria-label="选择你的行动">${scene.choices.map((choice, number) => `<button class="choice" type="button" data-choice="${number}" aria-pressed="false"><span class="choice-key" aria-hidden="true">${'ABC'[number]}</span><span>${choice.label}</span><span aria-hidden="true">↗</span></button>`).join('')}</div>
      <p class="feedback" role="status" hidden></p>
    </div></section><div class="scene-next" hidden><button class="btn primary" data-next type="button">${nextLabel}${last ? '' : '<span class="gesture-hint" aria-hidden="true">也可左滑插图</span>'}<span aria-hidden="true">→</span></button></div>
    <div class="under-stage">${current ? '<button class="story-back" data-back type="button">← 上一幕</button>' : ''}${state.done ? '<span>这天已经完成</span>' : ''}</div>`;

  const buttons = [...storyRoot.querySelectorAll('[data-choice]')];
  const art = storyRoot.querySelector('.story-art');
  const stamp = storyRoot.querySelector('.art-status');
  const feedback = storyRoot.querySelector('.feedback');
  const next = storyRoot.querySelector('.scene-next');

  function selectChoice(number, animate) {
    const choice = scene.choices[number];
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === number)));
    feedback.hidden = false;
    feedback.textContent = choice.feedback;
    next.hidden = false;
    stamp.hidden = !choice.value;
    stamp.textContent = choice.value ?? '';
    if (animate) {
      art.classList.remove('changed');
      stamp.classList.remove('toss');
      void art.offsetWidth;
      art.classList.add('changed');
      stamp.classList.add('toss');
    }
  }

  if (state.answers[current] !== null) selectChoice(state.answers[current], false);
  buttons.forEach((button, number) => button.addEventListener('click', () => {
    state.answers[current] = number;
    saveProgress();
    selectChoice(number, true);
  }));
  function forward() {
    if (state.answers[current] === null) return;
    if (last) {
      location.hash = `#practice/${index + 1}`;
      return;
    }
    state.scene += 1;
    saveProgress();
    renderStory(index, 1);
  }

  function back() {
    if (!current) return;
    state.scene -= 1;
    saveProgress();
    renderStory(index, -1);
  }

  storyRoot.querySelector('[data-next]').addEventListener('click', forward);
  storyRoot.querySelector('[data-back]')?.addEventListener('click', back);
  let swipe;
  art.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.pointerType !== 'touch') return;
    swipe = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  art.addEventListener('pointercancel', () => { swipe = undefined; });
  art.addEventListener('pointerup', event => {
    if (swipe?.id !== event.pointerId) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    swipe = undefined;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    if (dx < 0) forward();
    else back();
  });
  if (direction) {
    storyRoot.querySelector('#scene-title').focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

function renderStoryList() {
  const doneDays = progress.filter(item => item.done).length;
  const study = strategyProgress();
  const chapters = STORIES.map((story, index) => `<li><a href="#day/${index + 1}"><span class="course-no" lang="en">Day ${dayNumber(index)}</span><span>${story.title}</span><small>${progress[index].done ? '已完成' : story.label}</small></a></li>`).join('');
  const groups = STRATEGY_GROUPS.map(group => `<li><a href="#strategy/${group.lessons[0].slug}"><span>${group.title}</span><small>${group.lessons.map(lesson => lesson.summary).join(' · ')}</small></a></li>`).join('');
  storyRoot.innerHTML = `<header class="story-heading"><h1>课程目录</h1></header>
    <div class="course-map">
      <section class="course-track"><header><p>第一阶段 <span>${doneDays} / ${STORIES.length} 天</span></p><h2>认识股票</h2></header>
        <ul class="course-chapters">${chapters}</ul>
        <a class="course-continue" href="#day/${Math.max(0, todayIndex()) + 1}">${doneDays === STORIES.length ? '重温校园故事' : doneDays ? '继续校园故事' : '开始校园故事'} <span aria-hidden="true">→</span></a></section>
      <section class="course-track strategy-track"><header><p>第二阶段 <span>${study.completed} / ${study.total} 课</span></p><h2>选股与交易</h2></header>
        <ul class="course-groups">${groups}</ul>
        <a class="course-continue" href="#strategy">查看第二阶段课程 <span aria-hidden="true">→</span></a></section>
    </div>`;
}

function renderStoryPractice(index) {
  storyRoot.innerHTML = `${chapterHeading(index, '模拟练习')}<div id="story-practice"></div><div class="under-stage"><a class="story-back" href="#day/${index + 1}">← 回到故事</a></div>`;
  renderPractice(document.getElementById('story-practice'), STORIES[index].practice, {
    onDone() {
      progress[index].done = true;
      saveProgress();
    },
    nextLabel: index + 1 === STORIES.length ? '进入选股与交易课程' : '继续故事',
    onStory() { location.hash = index + 1 < STORIES.length ? `#day/${index + 2}` : '#strategy'; },
    onFull() { location.hash = '#practice'; },
  });
}

function renderResources() {
  storyRoot.innerHTML = `<section class="resources"><h1>延伸资料</h1>
    <article class="resource-card"><a href="https://b23.tv/9HJ7SOJ" target="_blank" rel="noopener noreferrer">《投资是怎样赚钱的？》有知有行 · 孟岩 ↗</a></article>
    <article class="resource-card"><a href="https://www.csrc.gov.cn/" target="_blank" rel="noopener noreferrer">中国证监会 · 查询证券公司名录 ↗</a></article>
    <article class="resource-card"><a href="https://www.sse.com.cn/lawandrules/sselawsrules/trade/" target="_blank" rel="noopener noreferrer">上海证券交易所 · 交易规则 ↗</a></article></section>`;
}

function showPage(focus = false) {
  const [page, number] = location.hash.slice(1).split('/');
  const index = /^[1-9]\d*$/.test(number ?? '') && STORIES[Number(number) - 1] ? Number(number) - 1 : null;
  let title = '今日学习';
  let activeNav = 'today';
  if (page === 'stories' || page === 'courses') {
    title = '课程目录';
    activeNav = 'stories';
    renderStoryList();
  } else if (page === 'strategy') {
    title = '选股与交易';
    activeNav = 'stories';
    renderStrategy(storyRoot, number);
  } else if (page === 'practice' && index !== null) {
    title = '模拟练习';
    activeNav = 'practice';
    renderStoryPractice(index);
  } else if (page === 'practice' || page === 'simulator') {
    title = '模拟交易';
    activeNav = 'practice';
    renderSimulator(storyRoot);
  } else if (page === 'resources' || page === 'glossary') {
    title = '延伸资料';
    activeNav = '';
    renderResources();
  } else {
    const day = page === 'day' && index !== null ? index : todayIndex();
    if (day >= 0) renderStory(day);
    else renderStrategy(storyRoot, strategyProgress().nextSlug);
  }
  document.title = `${title} · 第一股`;
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === activeNav) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (focus) {
    storyRoot.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

window.addEventListener('hashchange', () => showPage(true));
showPage();

const installSheet = document.getElementById('install-sheet');
const installTrigger = document.querySelector('.install-trigger');
const installConfirm = document.querySelector('.install-confirm');
let installEvent;

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installEvent = event;
  installConfirm.hidden = false;
});
window.addEventListener('appinstalled', () => {
  installEvent = undefined;
  installTrigger.hidden = true;
  installSheet.close();
});

if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) installTrigger.hidden = true;

installTrigger.addEventListener('click', () => {
  const appleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const android = /Android/.test(navigator.userAgent);
  const tip = installEvent ? '安装后点手机主屏幕上的「第一股」，就能继续故事。'
    : appleMobile ? '用 Safari 打开，点分享按钮，再选「添加到主屏幕」。'
      : android ? '打开浏览器菜单，选择「安装应用」或「添加到主屏幕」。'
        : '在手机浏览器打开这页，再从浏览器菜单添加到主屏幕。';
  document.getElementById('install-help').textContent = tip;
  installSheet.showModal();
});
document.querySelector('.install-close').addEventListener('click', () => installSheet.close());
installConfirm.addEventListener('click', async () => {
  const pendingInstall = installEvent;
  if (!pendingInstall) return;
  installEvent = undefined;
  installConfirm.hidden = true;
  installSheet.close();
  await pendingInstall.prompt();
});

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(error => console.warn('离线功能暂不可用', error));
}

const strategyLessons = STRATEGY_GROUPS.flatMap(group => group.lessons);
const strategyStorageKey = 'first-share-strategy-v1';
const strategyCompleted = new Set();

function readStrategyProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(strategyStorageKey));
    if (Array.isArray(saved)) {
      saved.forEach(slug => {
        if (strategyLessons.some(lesson => lesson.slug === slug)) strategyCompleted.add(slug);
      });
    }
  } catch { /* Keep this page usable when storage is unavailable. */ }
}

function strategyProgress() {
  readStrategyProgress();
  const next = strategyLessons.find(lesson => !strategyCompleted.has(lesson.slug));
  return { completed: strategyCompleted.size, total: strategyLessons.length, nextSlug: next?.slug ?? null };
}

function completeStrategyLesson(slug) {
  readStrategyProgress();
  strategyCompleted.add(slug);
  try { localStorage.setItem(strategyStorageKey, JSON.stringify([...strategyCompleted])); }
  catch { /* This session can continue in memory. */ }
}

function strategyLedger(rows) {
  return '<dl class="strategy-ledger">' + rows.map(([term, value]) =>
    `<div><dt>${term}</dt><dd>${value}</dd></div>`).join('') + '</dl>';
}

function allocationBar(percent, label, rest) {
  return `<div class="strategy-allocation" aria-hidden="true"><i style="width:${percent}%"></i></div>
    <div class="strategy-legend"><span><i></i>${label}</span><span>${rest}</span></div>`;
}

function securityLab(index) {
  const cards = [
    ['股东', '拥有公司的一小份。公司分红时，你可按持股数分钱。'],
    ['债权人', '你借钱给国家，按发行条款收取本金和利息。'],
    ['基金份额持有人', '你拥有投资组合的一小份，一起分享收益，也承担亏损。'],
  ];
  const [role, rights] = cards[index];
  return `<div class="strategy-ticket"><strong>${role}</strong><span>${rights}</span></div>`;
}

function fundLab(index) {
  const percent = [100, 40, 10][index];
  const loss = 1000 * (percent / 100) * 0.1;
  return `${allocationBar(percent, '校园零售股 ' + percent + '%', '其余持仓 ' + (100 - percent) + '%')}
    ${strategyLedger([['亏损', `${loss} 元`], ['剩余市值', `${1000 - loss} 元`]])}`;
}

function boardLab(index) {
  const boards = [
    ['无专项门槛', '按普通开户要求', 100, '每次加 100 股'],
    ['10 万元', '至少 24 个月', 100, '每次加 100 股'],
    ['50 万元', '至少 24 个月', 200, '可加 1 股'],
    ['50 万元', '至少 24 个月', 100, '可加 1 股'],
  ];
  const [threshold, experience, lot, rule] = boards[index];
  return `<div class="strategy-ticket"><span>最小买单 · 未含费用</span><strong>${(20 * lot).toLocaleString('zh-CN')} 元</strong><span>20 元 × ${lot} 股</span></div>
    ${strategyLedger([['20 日日均资产', threshold], ['交易经验', experience], ['加买数量', rule]])}`;
}

function screenLab(index) {
  const comparisons = [
    [['营收同比', '+12%', '+32%'], ['净利润', '800 万元', '900 万元'], ['经营现金净流入', '860 万元', '140 万元']],
    [['股价', '20 元', '12 元'], ['每股收益', '1 元', '1 元'], ['市盈率', '20 倍', '12 倍']],
    [['每股现金分红', '0.60 元', '0.60 元'], ['按示例股价计算的股息率', '3%', '5%'], ['经营现金净流入', '860 万元', '140 万元']],
  ];
  const notes = [
    '乙店增长快，赚到的利润却还没全变成现金。',
    '每股都赚 1 元，买乙店一股少花 8 元。',
    '分红相同，乙店股价低，算出的股息率较高。',
  ];
  return `<table class="strategy-table"><caption>同一财年 · 虚构数据</caption><thead><tr><th scope="col">指标</th><th scope="col">甲店</th><th scope="col">乙店</th></tr></thead>
    <tbody>${comparisons[index].map(([label, a, b]) => `<tr><th scope="row">${label}</th><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody></table><p class="strategy-note">${notes[index]}</p>`;
}

function trendLab(index) {
  const volume = [9, 10, 7, 11, 13, 8, 10, 12, 13, 9, 15, 12, 9, 13, 14, 18, 13, 11, 16, 15];
  const start = index === 0 ? 15 : 0;
  const window = strategyTrendCloses.slice(start);
  const x = i => 49 + i * 295 / (window.length - 1);
  const y = price => 107 - (price - 10) * 41;
  const points = window.map((price, i) => `${x(i)},${y(price)}`).join(' ');
  const volumeBars = volume.slice(start).map((amount, i) =>
    `<line x1="${x(i)}" x2="${x(i)}" y1="161" y2="${161 - amount * 1.6}" stroke-width="${index === 0 ? 10 : 6}"/>`).join('');
  const first = window[0], last = window[window.length - 1];
  const diff = (last / first - 1) * 100;
  const change = (diff >= 0 ? '+' : '−') + Math.abs(diff).toFixed(2) + '%';
  return `<svg class="strategy-chart" viewBox="0 0 370 193" role="img" aria-label="第 ${start + 1} 至 20 日，收盘价从 ${first.toFixed(2)} 到 ${last.toFixed(2)} 元，区间涨跌 ${change}。末日成交量 15 万股。">
    <text x="3" y="14">元</text>
    ${[10, 11, 12].map(price => `<line class="strategy-rule" x1="36" x2="351" y1="${y(price)}" y2="${y(price)}"/><text x="6" y="${y(price) + 4}">${price}</text>`).join('')}
    <polyline class="strategy-price-line" points="${points}" pathLength="1" /><circle cx="${x(window.length - 1)}" cy="${y(last)}" r="4" fill="var(--blue)"/>
    <g stroke="#576491">${volumeBars}</g><line class="strategy-rule" x1="36" x2="351" y1="161" y2="161"/><text x="0" y="136">万股</text><text x="11" y="151">10</text><line class="strategy-guide" x1="36" x2="351" y1="145" y2="145"/>
    <text x="35" y="182">第 ${start + 1} 日</text><text text-anchor="end" x="353" y="182">第 20 日</text></svg>
    ${strategyLedger([['首尾价格', `${first.toFixed(2)} → ${last.toFixed(2)} 元`], ['区间涨跌', change]])}`;
}

function candleLab(index) {
  const y = price => 122 - (price - 19) * 33;
  const [open, high, low, close] = strategyCandleDays[index];
  return `<svg class="strategy-chart" viewBox="0 0 370 159" role="img" aria-label="第 ${index + 1} 日开盘 ${open} 元、最高 ${high} 元、最低 ${low} 元、收盘 ${close} 元。">
    ${[19,20,21,22].map(price => `<line class="strategy-rule" x1="37" x2="355" y1="${y(price)}" y2="${y(price)}"/><text x="5" y="${y(price) + 4}">${price}</text>`).join('')}
    ${strategyCandleDays.map(([o, h, l, c], day) => {
      const x = 90 + day * 100, color = c >= o ? '#ad3738' : '#207449';
      return `<g opacity="${day === index ? 1 : .45}">${day === index ? `<rect x="${x - 36}" y="9" width="72" height="118" fill="var(--blue)" opacity=".075"/>` : ''}
        <line x1="${x}" x2="${x}" y1="${y(h)}" y2="${y(l)}" stroke="${color}" stroke-width="2"/>
        <rect class="strategy-candle" x="${x - 12}" y="${Math.min(y(o), y(c))}" width="24" height="${Math.max(2, Math.abs(y(o) - y(c)))}" fill="${color}"/></g>
        <text text-anchor="middle" x="${x}" y="150">第 ${day + 1} 日</text>`;
    }).join('')}</svg>
    ${strategyLedger([['开盘 / 收盘', `${open.toFixed(2)} / ${close.toFixed(2)} 元`], ['最高 / 最低', `${high.toFixed(2)} / ${low.toFixed(2)} 元`]])}`;
}

function entryLab(index) {
  const qty = [0, 100, 300][index];
  const cost = 20 * qty, loss = 3 * qty;
  const risk = loss / 10000 * 100;
  return `${allocationBar(cost / 100, `股票市值 ${cost.toLocaleString('zh-CN')} 元`, `现金 ${(10000 - cost).toLocaleString('zh-CN')} 元`)}
    ${strategyLedger([['预计亏损', `${qty} 股 × 3 元 ＝ ${loss} 元`], ['占总资金', `${risk}%`]])}`;
}

function exitLab(index) {
  const records = [
    ['贡献四成收入的客户解约了。', '估算少了多少收入，再判断是否减仓。'],
    ['这只股票的占比从 20% 升到 34%。', '超过小满设的 30% 上限，重新分配仓位。'],
    ['今天跌了 3%，还没有新公告。', '先查生意有何变化，再看自己能承受多少。'],
  ];
  return strategyLedger([['新消息', records[index][0]], ['下一步', records[index][1]]]);
}

const strategyLabs = {
  securities: securityLab, funds: fundLab, boards: boardLab, screen: screenLab,
  trend: trendLab, candles: candleLab, entry: entryLab, exit: exitLab,
};

function strategyLabHTML(lesson, index) {
  return strategyLabs[lesson.slug](index);
}

function renderStrategy(root, slug) {
  const progress = strategyProgress();
  const group = STRATEGY_GROUPS.find(item => item.lessons.some(lesson => lesson.slug === slug));
  if (!group) {
    const action = progress.nextSlug ? `<a class="strategy-main-link" href="#strategy/${progress.nextSlug}">${progress.completed ? '继续学习' : '开始第一课'} <span aria-hidden="true">→</span></a>`
      : '<a class="strategy-main-link" href="#practice">去模拟盘练习 <span aria-hidden="true">→</span></a>';
    root.innerHTML = `<section class="strategy">
      <a class="strategy-back" href="#stories">← 全部课程</a>
      <header class="strategy-index-heading"><div><p class="strategy-meta">第二阶段</p><h1>选股与交易基础</h1></div>
      <div class="strategy-continue"><span>已完成 ${progress.completed} / ${progress.total} 课</span>${action}</div></header>
      <div class="strategy-groups">${STRATEGY_GROUPS.map(item => `<section class="strategy-group"><header>${strategyCategoryMark(item.lessons[0].slug)}<h2>${item.title}</h2></header>
        ${item.lessons.map(lesson => `<a href="#strategy/${lesson.slug}"><span><strong>${lesson.title}</strong><small>${lesson.summary}</small></span><span class="strategy-status">${strategyCompleted.has(lesson.slug) ? '已完成' : '<span aria-hidden="true">↗</span>'}</span></a>`).join('')}
        </section>`).join('')}</div></section>`;
    return;
  }

  const lesson = group.lessons.find(item => item.slug === slug);
  const index = strategyLessons.indexOf(lesson);
  const next = strategyLessons[index + 1];
  const done = strategyCompleted.has(slug);
  const nextAction = next ? `<a class="strategy-main-link" href="#strategy/${next.slug}">下一课 · ${next.title} <span aria-hidden="true">→</span></a>`
    : '<a class="strategy-main-link" href="#practice">去模拟盘练习 <span aria-hidden="true">→</span></a>';
  const resources = lesson.sources.map(key => {
    const [name, url] = STRATEGY_SOURCES[key];
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${name} ↗</a>`;
  });
  root.innerHTML = `<article class="strategy">
    <a class="strategy-back" href="#strategy">← 选股与交易基础</a>
    <header class="strategy-lesson-heading"><p class="strategy-meta">${group.title} · 第 ${index + 1} / ${strategyLessons.length} 课</p><h1>${lesson.title}</h1></header>
    <div class="strategy-lesson-layout"><div class="strategy-reading"><div class="strategy-illustration-slot">${strategyIllustration(lesson.slug, 0)}</div><p class="strategy-lead">${lesson.lead}</p><p>${lesson.idea}</p></div>
      <section class="strategy-lab" aria-labelledby="strategy-lab-title"><h2 id="strategy-lab-title">${lesson.lab}</h2>${lesson.instruction ? `<p>${lesson.instruction}</p>` : ''}
        <div class="strategy-options" role="group" aria-label="${lesson.lab}">${lesson.options.map((opt, i) => `<button type="button" data-lab-option="${i}" aria-pressed="${i === 0}">${opt}</button>`).join('')}</div>
        <div class="strategy-result" aria-live="polite" aria-atomic="true">${strategyLabHTML(lesson, 0)}</div></section>
    </div>
    <section class="strategy-quiz" aria-labelledby="strategy-question"><p class="strategy-meta">课后练习</p><h2 id="strategy-question">${lesson.question}</h2>
      <div class="strategy-answers">${lesson.choices.map(([title], i) => `<button type="button" aria-pressed="${done && i === lesson.correct}" data-strategy-answer="${i}">${title}</button>`).join('')}</div>
      <p class="strategy-feedback" role="status">${done ? '本课已完成。' + lesson.choices[lesson.correct][1] : ''}</p>
      <div class="strategy-next"${done ? '' : ' hidden'}>${nextAction}<a href="#strategy">回到课程目录</a></div>
    </section><details class="strategy-details"><summary>了解更多</summary><p>${lesson.more}</p>
      ${resources.length ? `<div class="strategy-sources">${resources.join('')}</div>` : ''}</details></article>`;

  const options = root.querySelectorAll('[data-lab-option]');
  const result = root.querySelector('.strategy-result');
  const illustrationSlot = root.querySelector('.strategy-illustration-slot');
  options.forEach((button, i) => button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') return;
    options.forEach((option, number) => option.setAttribute('aria-pressed', String(number === i)));
    result.innerHTML = strategyLabHTML(lesson, i);
    illustrationSlot.innerHTML = strategyIllustration(lesson.slug, i);
    result.classList.remove('strategy-changing');
    void result.offsetWidth;
    result.classList.add('strategy-changing');
  }));
  const answers = root.querySelectorAll('[data-strategy-answer]');
  answers.forEach((button, i) => button.addEventListener('click', () => {
    answers.forEach((answer, number) => answer.setAttribute('aria-pressed', String(number === i)));
    const correct = i === lesson.correct;
    if (correct) {
      completeStrategyLesson(slug);
      root.querySelector('.strategy-next').hidden = false;
    }
    root.querySelector('.strategy-feedback').textContent = lesson.choices[i][1] + (correct ? ' 本课已完成。' : ' 再试一次。');
  }));
}

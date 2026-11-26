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
    ['股东', '公司股权', '按持股比例享有股东权利。', '可能收到分红，也可能以更高或更低的价格卖出。', '公司经营恶化时，股东可能损失全部投入。'],
    ['债权人', '国家债权', '按发行条款享有还本付息的权利。', '例如面值 100 元、年票息 2% 的固定利率国债，每年票息 2 元。', '记账式国债到期前在市场卖出，价格会随市场利率波动。'],
    ['份额持有人', '一份投资组合', '按份额分享合同约定的组合收益并承担风险。', '底层资产变化会影响净值，部分基金按合同分红。', '股票基金和债券基金都可能亏损，持有什么决定主要风险。'],
  ];
  const [role, claim, rights, income, risk] = cards[index];
  return `<div class="strategy-ticket"><span>持有人身份</span><strong>${role}</strong><span>${claim}</span></div>
    ${strategyLedger([['权利', rights], ['回报', income], ['风险', risk]])}`;
}

function fundLab(index) {
  const percent = [100, 40, 10][index];
  const loss = 1000 * (percent / 100) * 0.1;
  return `${allocationBar(percent, '校园零售股 ' + percent + '%', '其余持仓 ' + (100 - percent) + '%')}
    ${strategyLedger([['组合损失', `1,000 × ${percent}% × 10% ＝ ${loss} 元`], ['期末市值', `${1000 - loss} 元`]])}
    <p class="strategy-note">这是单一持仓下跌的简化情景，未计费用。若多个持仓一起跌，整个组合也会受到影响。</p>`;
}

function boardLab(index) {
  const boards = [
    ['普通主板 A 股无这一专项资产门槛', '普通账户依开户要求核验', 100, '100 股的整数倍'],
    ['10 万元', '24 个月以上', 100, '100 股的整数倍'],
    ['50 万元', '24 个月以上', 200, '从 200 股起，可每次多报 1 股'],
    ['50 万元', '24 个月以上', 100, '从 100 股起，可每次多报 1 股'],
  ];
  const [threshold, experience, lot, rule] = boards[index];
  return `<div class="strategy-ticket"><span>按 20 元买最小数量</span><strong>${(20 * lot).toLocaleString('zh-CN')} 元</strong><span>20 元 × ${lot} 股</span></div>
    ${strategyLedger([['日均资产要求', threshold], ['交易经验', experience], ['普通竞价买入数量', rule]])}`;
}

function screenLab(index) {
  const comparisons = [
    [['营收同比', '+12%', '+32%'], ['净利润', '800 万元', '900 万元'], ['经营现金净流入', '860 万元', '140 万元']],
    [['股价', '20 元', '12 元'], ['每股收益', '1 元', '1 元'], ['市盈率', '20 倍', '12 倍']],
    [['每股现金分红', '0.60 元', '0.60 元'], ['按示例股价计算的股息率', '3%', '5%'], ['经营现金净流入', '860 万元', '140 万元']],
  ];
  const notes = [
    '乙店增长较快，但经营现金净流入只有净利润的一小部分。可以从应收款和库存追查差额。',
    '市盈率＝股价 ÷ 每股收益。先看盈利能否持续，再理解两家公司为什么有价差。亏损公司的市盈率通常不适合这样比较。',
    '股息率＝每股年度现金分红 ÷ 股价。乙店的股息率较高，部分原因是股价较低。下一年的分红还需看现金来源。',
  ];
  return `<table class="strategy-table"><caption>同一财年 · 虚构数据</caption><thead><tr><th scope="col">指标</th><th scope="col">甲店</th><th scope="col">乙店</th></tr></thead>
    <tbody>${comparisons[index].map(([label, a, b]) => `<tr><th scope="row">${label}</th><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody></table><p class="strategy-note">${notes[index]}</p>`;
}

function trendLab(index) {
  const closes = [10, 10.2, 10.05, 10.4, 10.6, 10.3, 10.5, 10.8, 11, 10.85, 11.2, 11.4, 11.15, 11.55, 11.7, 11.9, 11.65, 11.75, 11.5, 11.4];
  const volume = [9, 10, 7, 11, 13, 8, 10, 12, 13, 9, 15, 12, 9, 13, 14, 18, 13, 11, 16, 15];
  const start = index === 0 ? 15 : 0;
  const window = closes.slice(start);
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
    ${strategyLedger([['起点 → 终点', `${first.toFixed(2)} → ${last.toFixed(2)} 元`], ['区间涨跌', change]])}`;
}

function candleLab(index) {
  const days = [[20.6, 21.2, 20.2, 20.5], [20, 22, 19.8, 20.4], [19.8, 20.5, 19.5, 20.1]];
  const y = price => 122 - (price - 19) * 33;
  const [open, high, low, close] = days[index];
  return `<svg class="strategy-chart" viewBox="0 0 370 159" role="img" aria-label="第 ${index + 1} 日开盘 ${open} 元、最高 ${high} 元、最低 ${low} 元、收盘 ${close} 元。">
    ${[19,20,21,22].map(price => `<line class="strategy-rule" x1="37" x2="355" y1="${y(price)}" y2="${y(price)}"/><text x="5" y="${y(price) + 4}">${price}</text>`).join('')}
    ${days.map(([o, h, l, c], day) => {
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
    ${strategyLedger([['跌到 17 元时', `账面减少 ${loss} 元`], ['对账户的影响', `总资产减少 ${risk}%`], ['对照 300 元情景预算', ['仍可继续观察', '用尽本次预算', '超出预算 600 元'][index]]])}
    <p class="strategy-note">计算忽略交易费用。真实价格还可能跌破 17 元，这个情景不能给最大亏损设限。</p>`;
}

function exitLab(index) {
  const records = [
    ['公司公告披露，贡献四成收入的客户终止续约。', '原来的收入预期需要重算。', '查合同金额和替代订单，重新估值；若买入理由失效，按计划考虑减仓或退出。'],
    ['同一持仓从账户的 20% 升到 34%。', '超过练习中自定的 30% 上限。', '核对全账户市值，考虑把部分资金移出，再按实际成交数量复算占比。'],
    ['股价当日下跌 3%，暂未发现新的经营公告。', '仅凭价格无法确认客户或回款变化。', '查公告与行业消息，核对自己的风险预算和用钱期限，再决定持有、减少或退出。'],
  ];
  return strategyLedger(['已知事实', '对照原计划', '下一步'].map((label, i) => [label, records[index][i]]));
}

const strategyLabs = {
  securities: securityLab, funds: fundLab, boards: boardLab, screen: screenLab,
  trend: trendLab, candles: candleLab, entry: entryLab, exit: exitLab,
};

function strategyLabHTML(lesson, index) {
  return strategyLabs[lesson.slug](index) + `<p class="strategy-note">${lesson.notes[index]}</p>`;
}

function renderStrategy(root, slug) {
  const progress = strategyProgress();
  const group = STRATEGY_GROUPS.find(item => item.lessons.some(lesson => lesson.slug === slug));
  if (!group) {
    const action = progress.nextSlug ? `<a class="strategy-main-link" href="#strategy/${progress.nextSlug}">${progress.completed ? '继续学习' : '开始第一课'} <span aria-hidden="true">→</span></a>`
      : '<a class="strategy-main-link" href="#practice">去模拟盘练习 <span aria-hidden="true">→</span></a>';
    root.innerHTML = `<section class="strategy">
      <a class="strategy-back" href="#stories">← 全部课程</a>
      <header class="strategy-index-heading"><div><p class="strategy-meta">第二阶段</p><h1>选股与交易基础</h1><p>跟小满和阿禾走进下课咖啡，从开分店的第一张凭证，一直读到两人写下的交易笔记。</p></div>
      <div class="strategy-continue"><span>已完成 ${progress.completed} / ${progress.total} 课</span>${action}</div></header>
      <div class="strategy-groups">${STRATEGY_GROUPS.map(item => `<section class="strategy-group"><header><h2>${item.title}</h2><p>${item.description}</p></header>
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
    <div class="strategy-lesson-layout"><div class="strategy-reading"><p class="strategy-lead">${lesson.lead}</p><p>${lesson.idea}</p></div>
      <section class="strategy-lab" aria-labelledby="strategy-lab-title"><h2 id="strategy-lab-title">${lesson.lab}</h2><p>${lesson.instruction}</p>
        <div class="strategy-options" role="group" aria-label="${lesson.lab}">${lesson.options.map((opt, i) => `<button type="button" data-lab-option="${i}" aria-pressed="${i === 0}">${opt}</button>`).join('')}</div>
        <div class="strategy-result" aria-live="polite" aria-atomic="true">${strategyLabHTML(lesson, 0)}</div></section>
    </div>
    <section class="strategy-quiz" aria-labelledby="strategy-question"><p class="strategy-meta">课后练习</p><h2 id="strategy-question">${lesson.question}</h2>
      <div class="strategy-answers">${lesson.choices.map(([title], i) => `<button type="button" aria-pressed="${done && i === lesson.correct}" data-strategy-answer="${i}">${title}</button>`).join('')}</div>
      <p class="strategy-feedback" role="status">${done ? '本课已完成。' + lesson.choices[lesson.correct][1] + lesson.ending : ''}</p>
      <div class="strategy-next"${done ? '' : ' hidden'}>${nextAction}<a href="#strategy">回到课程目录</a></div>
    </section>${resources.length ? `<div class="strategy-sources"><span>延伸阅读</span>${resources.join('')}</div>` : ''}</article>`;

  const options = root.querySelectorAll('[data-lab-option]');
  const result = root.querySelector('.strategy-result');
  options.forEach((button, i) => button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') return;
    options.forEach((option, number) => option.setAttribute('aria-pressed', String(number === i)));
    result.innerHTML = strategyLabHTML(lesson, i);
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
    root.querySelector('.strategy-feedback').textContent = lesson.choices[i][1] + (correct ? lesson.ending + ' 本课已完成。' : ' 可以再选一次。');
  }));
}

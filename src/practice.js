const PRACTICE_STEPS = {
  money: [{
    title: '同样的钱，能吃几顿？',
    description: '饭卡里有 ¥100。食堂涨价后，最多能买几顿？',
    figure: () => `<div class="practice-price-comparison"><div><span>原来的饭价</span><strong>¥15<small> / 顿</small></strong></div><div><span>现在的饭价</span><strong>¥18<small> / 顿</small></strong></div></div>`,
    actions: ['5 顿', '6 顿'], correct: 0,
    hint: '涨价后，6 顿要 ¥108。再算一次。',
    next: () => '原来够买 6 顿，现在最多 5 顿。100 元的购买力下降了。'
  }, {
    title: '试着买一小份下课咖啡',
    description: '这是虚构公司。用账户里的虚拟钱，按眼前的报价试买一次。',
    figure: account => `<dl class="practice-ledger"><div><dt>每股卖价</dt><dd>${simMoney(account.quote.ask)}</dd></div><div><dt>这次买入</dt><dd>100 股</dd></div><div><dt>${account.shares ? '你已持有' : '虚拟资金'}</dt><dd>${account.shares ? '100 股' : simMoney(account.available)}</dd></div></dl>`,
    actions: ['模拟买入 100 股'], correct: 0,
    next: account => {
      const { order } = account.submit('buy', account.quote.ask, 100);
      return `买到了 100 股，含费用花了 ${simMoney(order.amount + order.fee)} 虚拟钱。你现在持有这家虚构公司的一小份权益。`;
    }
  }],
  budget: [{
    title: '这笔钱够下一单吗？',
    description: '手上有 ¥8,000，下面两笔要先留好。',
    figure: () => `<dl class="practice-ledger"><div><dt>必要开支</dt><dd>¥4,800</dd></div><div><dt>突发开支备用</dt><dd>¥2,500</dd></div><div><dt>100 股 × ¥10 + ¥5 费用</dt><dd>¥1,005</dd></div></dl>`,
    actions: ['够，现在下单', '差 ¥305，先练模拟'], correct: 1,
    hint: '¥8,000 减掉两笔只剩 ¥700，和订单金额比一比。',
    success: '可动用 ¥700，这笔单还差 ¥305。先用虚拟资金练习。'
  }],
  ownership: [{
    title: '当了股东，每股能分到多少？',
    description: '下课咖啡还剩 ¥120,000 现金。公司决定拿一半出来分红。',
    figure: () => `<div class="practice-shares"><div class="practice-profit"><span>分给股东 ¥60,000</span><span>公司留存 ¥60,000</span></div><p>分红金额由全部 <strong>100,000</strong> 股平分</p></div>`,
    actions: ['¥1.20 / 股', '¥0.60 / 股'], correct: 1,
    hint: '只有一半现金用来分红。拿 ¥60,000 除以总股数。',
    success: '每股分到 ¥0.60。买股票就持有一部分公司，分红金额取决于公司的分配决定。'
  }],
  quote: [{
    title: '你最多愿付多少？',
    description: '买 100 股，每股最多出 ¥10.00。提交一笔限价单。',
    figure: account => practiceQuote(account),
    actions: ['报 ¥10.00', '报 ¥10.02'], correct: 0,
    hint: '¥10.02 超出了你的上限。按你愿付的最高价下单。',
    next: account => {
      account.submit('buy', 1000, 100);
      return '卖一比你的限价高 2 分，订单先挂着。';
    }
  }, {
    title: '等一笔新报价',
    description: '委托已提交。点一下，看看卖家降价后会发生什么。',
    figure: account => practiceQuote(account),
    actions: ['推进一笔行情'], correct: 0,
    next: account => {
      const { filled } = account.advance();
      const [order] = filled;
      return `成交 ${order.quantity} 股，每股 ${simMoney(order.price)}。含模拟费用，共扣款 ${simMoney(order.amount + order.fee)}。`;
    }
  }],
  broker: [{
    title: '从哪里下载券商 App？',
    description: '同学在群里发来开户链接。你会从哪里找 App？',
    figure: () => `<div class="practice-message"><span>班群消息</span><p>“扫我的二维码开户，有返现。”</p></div>`,
    actions: ['核验券商后，去官网找', '扫群里发的二维码'], correct: 0,
    hint: '群聊二维码的来源难核实。先查券商资质，再从官网找下载入口。',
    next: () => '认准持牌券商的官网入口，并核对应用发布者。'
  }, {
    title: '这笔单成交了吗？',
    description: '在券商 App 的「交易」页打开「当日委托」。',
    figure: () => `<dl class="practice-ledger"><div><dt>委托数量</dt><dd>100 股</dd></div><div><dt>成交数量</dt><dd>0 股</dd></div><div><dt>订单状态</dt><dd class="practice-order-mark">已报</dd></div></dl>`,
    actions: ['已经买到 100 股', '已提交，等成交'], correct: 1,
    hint: '成交数量还是 0 股。看看「已报」表示哪一步。',
    success: '「已报」表示订单已申报。成交数量有变化后，再核对成交价与持仓。'
  }]
};

function practiceQuote(account) {
  const order = account.orders[0];
  const { ask, bid } = account.quote;
  return `<dl class="practice-ledger">
    <div><dt>卖一 · 最低卖价</dt><dd>${simMoney(ask)}</dd></div>
    <div><dt>买一 · 最高买价</dt><dd>${simMoney(bid)}</dd></div>
    <div><dt>${order ? '我的委托' : '虚拟可用资金'}</dt><dd class="practice-order-mark">${order ? SIM_ORDER_STATUS[order.status] : simMoney(account.available)}</dd></div>
  </dl>`;
}

function renderPractice(root, type, { onDone, onStory, onFull, nextLabel = '继续故事' } = {}) {
  const steps = PRACTICE_STEPS[type];
  if (!Array.isArray(steps)) return;
  const account = type === 'quote' || type === 'money' ? new SimTradingAccount(8000) : null;
  let stepIndex = 0;
  let complete = false;
  let feedback = '';
  let isHint = false;

  root.innerHTML = `<section class="practice practice-${type}" aria-labelledby="practice-title"><div class="practice-live" aria-live="polite" aria-atomic="true"></div><div class="practice-view"></div></section>`;
  const view = root.querySelector('.practice-view');
  const live = root.querySelector('.practice-live');

  function draw(focusTarget) {
    const step = steps[stepIndex];
    const result = complete ? 'complete' : isHint ? 'retry' : feedback ? 'advance' : 'ready';
    const choices = step.actions.map((action, index) =>
      `<button class="practice-choice" type="button" data-practice-choice="${index}">${action}<span class="practice-arrow" aria-hidden="true">↗</span></button>`).join('');
    const storyButton = `<button class="practice-choice practice-primary" type="button" data-practice-nav="story">${nextLabel} <span aria-hidden="true">→</span></button>`;
    const fullButton = onFull
      ? '<button class="practice-choice" type="button" data-practice-nav="full">进入完整模拟盘</button>' : '';
    view.innerHTML = `<div class="practice-main" data-practice-state="${result}">
        <p class="practice-kicker">动手试一试${steps.length > 1 ? ` <span>${stepIndex + 1} / ${steps.length}</span>` : ''}</p>
        <h2 id="practice-title" tabindex="-1">${step.title}</h2>
        <p class="practice-description">${step.description}</p>
        <div class="practice-figure">${step.figure(account)}</div>
        <div class="practice-dock">
          ${feedback ? `<p class="practice-feedback${isHint ? ' practice-hint' : ''}">${feedback}</p>` : ''}
          <div class="practice-actions">${complete ? `${storyButton}${fullButton}` : choices}</div>
        </div>
    </div>`;
    if (focusTarget) view.querySelector(focusTarget)?.focus({ preventScroll: true });
  }

  view.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const { practiceNav, practiceChoice } = button.dataset;
    if (practiceNav === 'story') onStory?.(type);
    if (practiceNav === 'full') onFull?.(type);
    if (practiceChoice === undefined || complete) return;

    const step = steps[stepIndex];
    let focusTarget = `[data-practice-choice="${practiceChoice}"]`;
    isHint = Number(practiceChoice) !== step.correct;
    if (isHint) {
      feedback = step.hint;
    } else {
      feedback = step.next ? step.next(account) : step.success;
      complete = stepIndex === steps.length - 1;
      if (complete) focusTarget = '[data-practice-nav="story"]';
      else {
        stepIndex += 1;
        focusTarget = '#practice-title';
      }
    }
    live.textContent = feedback;
    draw(focusTarget);
    if (complete) onDone?.(type);
  });
  draw();
}

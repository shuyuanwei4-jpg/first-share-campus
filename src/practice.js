const PRACTICE_STEPS = {
  money: [{
    title: '给一周的午饭发餐票',
    description: '小满给饭卡充了 100 元，阿禾负责发餐票。一票换一顿，现在每顿 18 元。他们最多能拿几张票？',
    figure: () => `<div class="practice-price-comparison"><div><span>原来的饭价</span><strong>¥15<small> / 顿</small></strong></div><div><span>现在的饭价</span><strong>¥18<small> / 顿</small></strong></div></div>`,
    actions: ['5 顿', '6 顿'], correct: 0,
    hint: '涨价后，6 顿要 ¥108。再算一次。',
    next: () => '原来够买 6 顿，现在最多 5 顿。100 元的购买力下降了。'
  }, {
    title: '一张不换咖啡的凭证',
    description: '离开食堂时，阿禾指着校门口的小店：“刚才餐票换饭，这张凭证能换来什么？”用模拟账户按卖价买下虚构公司的一手股票，看看持仓。',
    figure: account => `<dl class="practice-ledger"><div><dt>每股卖价</dt><dd>${simMoney(account.quote.ask)}</dd></div><div><dt>这次买入</dt><dd>100 股</dd></div><div><dt>${account.shares ? '你已持有' : '虚拟资金'}</dt><dd>${account.shares ? '100 股' : simMoney(account.available)}</dd></div></dl>`,
    actions: ['模拟买入 100 股'], correct: 0,
    next: account => {
      const { order } = account.submit('buy', account.quote.ask, 100);
      return `买到了 100 股，含费用花了 ${simMoney(order.amount + order.fee)} 虚拟钱。你现在持有这家虚构公司的一小份权益。`;
    }
  }],
  budget: [{
    title: '只用第三个信封下单',
    description: '回到宿舍，小满请阿禾把 8,000 元分装好，再核对一张 100 股的模拟买单。封好生活费和应急金，剩下的钱够吗？',
    figure: () => `<dl class="practice-ledger"><div><dt>必要开支</dt><dd>¥4,800</dd></div><div><dt>突发开支备用</dt><dd>¥2,500</dd></div><div><dt>100 股 × ¥10 + ¥5 费用</dt><dd>¥1,005</dd></div></dl>`,
    actions: ['够，现在下单', '差 ¥305，先练模拟'], correct: 1,
    hint: '¥8,000 减掉两笔只剩 ¥700，和订单金额比一比。',
    success: '可动用 ¥700，这笔单还差 ¥305。先用虚拟资金练习。'
  }],
  ownership: [{
    title: '替学姐填一张分红小票',
    description: '下课咖啡决定分红。学姐让小满从 12 万元里拨出一半，让阿禾算每一股能分多少钱。小票上每股那一格该填多少？',
    figure: () => `<div class="practice-shares"><div class="practice-profit"><span>分给股东 ¥60,000</span><span>公司留存 ¥60,000</span></div><p>分红金额由全部 <strong>100,000</strong> 股平分</p></div>`,
    actions: ['¥1.20 / 股', '¥0.60 / 股'], correct: 1,
    hint: '只有一半现金用来分红。拿 ¥60,000 除以总股数。',
    success: '每股分到 ¥0.60。买股票就持有一部分公司，分红金额取决于公司的分配决定。'
  }],
  quote: [{
    title: '便签上的 10 元上限',
    description: '小满在便签上写下“买 100 股，每股最多 10 元”。阿禾打开模拟盘，卖一比便签上的数字高。请把两人约好的价格填进委托单。',
    figure: account => practiceQuote(account),
    actions: ['报 ¥10.00', '报 ¥10.02'], correct: 0,
    hint: '¥10.02 超出了你的上限。按你愿付的最高价下单。',
    next: account => {
      account.submit('buy', 1000, 100);
      return '卖一比你的限价高 2 分，订单先挂着。';
    }
  }, {
    title: '五分钟后，再看那张单',
    description: '两人把便签留在屏幕边。小满没有加价，阿禾让模拟时间走五分钟。新卖价能让这笔等待中的买单成交吗？',
    figure: account => practiceQuote(account),
    actions: ['推进一笔行情'], correct: 0,
    next: account => {
      const { filled } = account.advance();
      const [order] = filled;
      return `成交 ${order.quantity} 股，每股 ${simMoney(order.price)}。含模拟费用，共扣款 ${simMoney(order.amount + order.fee)}。`;
    }
  }],
  broker: [{
    title: '替小满找对下载入口',
    description: '周五收拾书包时，小满又收到了返现消息。阿禾想知道这家公司是不是持牌券商，手机上的 App 到底由谁发布。你会带他们去哪核实？',
    figure: () => `<div class="practice-message"><span>班群消息</span><p>“扫我的二维码开户，有返现。”</p></div>`,
    actions: ['核验券商后，去官网找', '扫群里发的二维码'], correct: 0,
    hint: '群聊二维码的来源难核实。先查券商资质，再从官网找下载入口。',
    next: () => '认准持牌券商的官网入口，并核对应用发布者。'
  }, {
    title: '这一声提示，是买到了吗？',
    description: '两人用模拟单走完流程。小满听见提示音，正要在周记写“买到 100 股”。阿禾抽出回单：“先念一下成交数量。”这行该怎么记？',
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

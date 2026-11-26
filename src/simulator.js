function simFee(side, amount) {
  const commission = Math.max(500, Math.round(amount * 0.0003));
  const tax = side === 'sell' ? Math.round(amount * 0.0005) : 0;
  return commission + tax;
}

class SimTradingAccount {
  constructor(budget) {
    this.startingCash = Math.round(budget * 100);
    this.cash = this.startingCash;
    this.shares = 0;
    this.boughtToday = 0;
    this.day = 1;
    this.tick = 12;
    this.previousClose = 1000;
    this.session = makeMarketSession(this.day, this.previousClose);
    this.orders = [];
  }

  get quote() {
    return this.session[this.tick];
  }

  get last() {
    return this.quote.last;
  }

  get history() {
    return this.session.slice(0, this.tick + 1);
  }

  get closed() {
    return this.tick === this.session.length - 1;
  }

  get pending() {
    return this.orders.filter(order => order.status === 'pending');
  }

  get available() {
    const held = this.pending
      .filter(order => order.side === 'buy')
      .reduce((sum, order) => sum + order.amount + order.fee, 0);
    return this.cash - held;
  }

  get sellable() {
    const held = this.pending
      .filter(order => order.side === 'sell')
      .reduce((sum, order) => sum + order.quantity, 0);
    return this.shares - this.boughtToday - held;
  }

  submit(side, limit, quantity) {
    if (this.closed) return { reason: '今天已经收盘。进入下一交易日后可以继续委托。' };
    if (!Number.isInteger(limit) || limit < 1 || limit > 99999) {
      return { reason: '输入 0.01 至 999.99 元的价格，最多保留两位小数。' };
    }
    if (!Number.isInteger(quantity) || quantity < 100 || quantity % 100 !== 0 || quantity > 10000) {
      return { reason: '数量从 100 股起，每次增加 100 股，本练习单笔最多 10,000 股。' };
    }
    const amount = limit * quantity;
    const fee = simFee(side, amount);
    if (side === 'buy' && amount + fee > this.available) {
      return { reason: '可用资金不足。买入委托需要覆盖限价金额和预计费用。' };
    }
    if (side === 'sell' && quantity > this.sellable) {
      const reason = this.boughtToday > 0
        ? '可卖股数不足。今天买入的股票到下一交易日才可卖。'
        : '可卖股数不足。先查看持仓，或撤销占用股数的卖单。';
      return { reason };
    }
    const order = {
      id: this.orders.length + 1, day: this.day, side, limit, quantity, amount, fee, status: 'pending'
    };
    this.orders.push(order);
    this.match(order);
    return { order };
  }

  match(order) {
    const isBuy = order.side === 'buy';
    const price = isBuy ? this.quote.ask : this.quote.bid;
    const crosses = isBuy ? order.limit >= price : order.limit <= price;
    if (!crosses) return false;
    const amount = price * order.quantity;
    const fee = simFee(order.side, amount);
    if (isBuy) {
      this.cash -= amount + fee;
      this.shares += order.quantity;
      this.boughtToday += order.quantity;
    } else {
      this.cash += amount - fee;
      this.shares -= order.quantity;
    }
    const point = this.quote;
    point.last = price;
    point.low = Math.min(point.low, price);
    point.high = Math.max(point.high, price);
    point.volume += order.quantity;
    Object.assign(order, { price, amount, fee, status: 'filled' });
    return true;
  }

  cancel(id) {
    const order = this.pending.find(item => item.id === id);
    if (order) order.status = 'canceled';
    return order;
  }

  advance() {
    if (this.closed) return { filled: [], expired: [] };
    this.tick += 1;
    const filled = [];
    for (const side of ['buy', 'sell']) {
      const orders = this.pending.filter(order => order.side === side);
      orders.sort((a, b) => (side === 'buy' ? b.limit - a.limit : a.limit - b.limit) || a.id - b.id);
      for (const order of orders) {
        if (this.match(order)) filled.push(order);
      }
    }
    const expired = this.closed ? this.pending : [];
    for (const order of expired) order.status = 'expired';
    return { filled, expired };
  }

  nextDay() {
    const filled = [];
    let expired = [];
    while (!this.closed) {
      const step = this.advance();
      filled.push(...step.filled);
      expired = step.expired;
    }
    this.previousClose = this.last;
    this.boughtToday = 0;
    this.day += 1;
    this.tick = 0;
    this.session = makeMarketSession(this.day, this.previousClose);
    return { filled, expired };
  }
}

const SIM_FORMAT = new Intl.NumberFormat('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const simNumber = cents => SIM_FORMAT.format(cents / 100);
const simMoney = cents => `¥${simNumber(cents)}`;
const simSide = side => side === 'buy' ? '买入' : '卖出';
const SIM_ORDER_STATUS = { pending: '待成交', filled: '已成交', canceled: '已撤单', expired: '已失效' };
let simAccount;

function renderSimulator(root, budget = 8000) {
  if (!simAccount) {
    const chosenBudget = Number.isFinite(budget) ? Math.max(0, Math.min(10000, budget)) : 8000;
    simAccount = new SimTradingAccount(chosenBudget);
  }
  let side = 'buy';
  let price = '';
  let quantity = '100';
  let status = '';
  let error = false;
  let historical = false;
  let playTimer = null;
  root.innerHTML = `<style>${SIMULATOR_CSS}</style><div class="sim-shell"><div class="sim-live" aria-live="polite" aria-atomic="true"></div><div class="sim-content"></div></div>`;
  const view = root.querySelector('.sim-content');
  const live = root.querySelector('.sim-live');

  function pausePlayback() {
    clearInterval(playTimer);
    playTimer = null;
    document.removeEventListener('visibilitychange', pauseWhenHidden);
    const button = view.querySelector('[data-market-play]');
    if (button) {
      button.textContent = '播放行情';
      button.setAttribute('aria-pressed', 'false');
    }
  }

  function pauseWhenHidden() {
    if (document.hidden) pausePlayback();
  }

  function setStatus(text, isError = false) {
    status = text;
    error = isError;
    live.textContent = text;
  }

  function selectedPrice() {
    return /^\d{1,3}(?:\.\d{1,2})?$/.test(price) ? Math.round(Number(price) * 100) : 0;
  }

  function updateEstimate() {
    const limit = selectedPrice();
    const count = Number(quantity);
    const estimate = view.querySelector('.sim-estimate');
    if (!limit || count < 100 || count > 10000 || count % 100 !== 0) {
      estimate.innerHTML = '<span>按限价试算</span><strong>—</strong>';
      return;
    }
    const value = limit * count;
    const fee = simFee(side, value);
    const total = side === 'buy' ? value + fee : value - fee;
    const totalLabel = side === 'buy' ? '预计扣款上限' : '预计到账下限';
    estimate.innerHTML = `<span>${totalLabel} <small>含费用 ${simMoney(fee)}</small></span><strong>${simMoney(total)}</strong>`;
  }

  function render(focusSelector) {
    const account = simAccount;
    const { ask, bid, time } = account.quote;
    const prices = account.history;
    const change = account.last - account.previousClose;
    const sign = change < 0 ? '−' : change > 0 ? '+' : '';
    const openDetails = [...view.querySelectorAll('.sim-foot details')].map(item => item.open);
    const marketValue = account.shares * account.last;
    const assets = account.cash + marketValue;
    const profit = assets - account.startingCash;
    const signedProfit = profit > 0 ? `+${simMoney(profit)}` : profit < 0 ? `−${simMoney(-profit)}` : simMoney(0);
    const actionTitle = side === 'buy' ? '最高愿付的价格' : '最低愿收的价格';
    const orders = account.orders.slice().reverse();
    const rows = orders.map(order => `<tr>
      <td>第 ${order.day} 日</td><td>${simSide(order.side)}</td><td>${simMoney(order.limit)}</td><td>${order.quantity} 股</td>
      <td>${order.price ? simMoney(order.price) : '—'}</td><td>${order.status === 'filled' ? simMoney(order.fee) : '—'}</td>
      <td><span class="sim-order-state ${order.status}">${SIM_ORDER_STATUS[order.status]}</span></td>
      <td>${order.status === 'pending' ? `<button type="button" class="sim-link" data-cancel="${order.id}" aria-label="撤销第 ${order.id} 笔${simSide(order.side)}委托">撤单</button>` : '—'}</td>
    </tr>`).join('');
    view.innerHTML = `
      <header class="sim-header">
        <div><h1>模拟交易</h1><p>用虚拟资金练习看盘、挂单、成交和撤单。</p></div>
        <div class="market-header-actions"><span class="sim-day">第 ${account.day} 日　${time}</span><button type="button" class="sim-tour-replay" data-tour-open>新手引导</button></div>
      </header>
      <div class="sim-account">
        <div><span>总资产</span><strong>${simMoney(assets)}</strong><small>现金 + 持仓市值</small></div>
        <div><span>可用资金</span><strong>${simMoney(account.available)}</strong><small>冻结 ${simMoney(account.cash - account.available)}</small></div>
        <div><span>持有股数</span><strong>${account.shares} <small>股</small></strong><small>当前可卖 ${account.sellable} 股</small></div>
        <div><span>账户盈亏</span><strong class="${profit < 0 ? 'sim-down' : profit > 0 ? 'sim-up' : ''}">${signedProfit}</strong><small>初始资金 ${simMoney(account.startingCash)}</small></div>
      </div>
      ${account.day === 1 && account.tick === 12 && account.orders.length === 0 ? '<aside class="sim-tip"><div><strong>练习第一笔限价单</strong><p>报 ¥10.00 买入 100 股，先看看委托为什么会等待，再前进 5 分钟。</p></div><button type="button" class="btn secondary sim-btn" data-example>填入示例</button></aside>' : ''}
      <div class="sim-market-grid">
        <section class="sim-card sim-market" aria-labelledby="sim-stock-title">
          <div class="market-ident"><div class="sim-stock-head"><span class="sim-stock-symbol" aria-hidden="true"></span><div><h2 id="sim-stock-title">下课咖啡</h2><span>SIM001 · 虚构股票</span></div></div>
          <div class="market-last"><span>最新成交价</span><strong>${simMoney(account.last)}</strong><span class="market-change ${change < 0 ? 'fall' : change > 0 ? 'rise' : ''}">较昨收 ${sign}${simNumber(Math.abs(change))}（${sign}${(Math.abs(change) / account.previousClose * 100).toFixed(2)}%）</span></div></div>
          <dl class="market-stats">
            <div><dt>昨收</dt><dd>${simNumber(account.previousClose)}</dd></div>
            <div><dt>最高</dt><dd>${simNumber(Math.max(...prices.map(p => p.high)))}</dd></div>
            <div><dt>最低</dt><dd>${simNumber(Math.min(...prices.map(p => p.low)))}</dd></div>
            <div><dt>总量（手）</dt><dd>${(prices.reduce((sum, point) => sum + point.volume, 0) / 100).toLocaleString('zh-CN')}</dd></div>
          </dl>
          <section class="sim-chart" aria-label="交互行情图"></section>
          <p class="sim-quotes-label" id="sim-quotes-label">${account.closed ? '下课咖啡 · 收盘前最后报价' : '下课咖啡 · 当前报价'}</p>
          <div class="sim-quotes" role="group" aria-labelledby="sim-quotes-label">
            <button type="button" data-quote="${ask}" aria-label="把卖一 ${simNumber(ask)} 元填入限价"><span>卖一 <small>最低卖价</small></span><strong>${simMoney(ask)}</strong></button>
            <button type="button" data-quote="${bid}" aria-label="把买一 ${simNumber(bid)} 元填入限价"><span>买一 <small>最高买价</small></span><strong>${simMoney(bid)}</strong></button>
          </div>
          <p class="sim-quotes-note">点报价可填入限价。${account.closed ? '本日已收盘。' : '每步推进 5 个交易分钟，午休自动跳过。'}</p>
          <div class="sim-market-actions">
            <button type="button" class="btn secondary sim-btn" data-market-play aria-pressed="${playTimer !== null}" ${account.closed ? 'disabled' : ''}>${playTimer !== null ? '暂停播放' : '播放行情'}</button>
            <button type="button" class="btn secondary sim-btn" data-step="tick" ${account.closed ? 'disabled' : ''}>前进 5 分钟</button>
            <button type="button" class="btn secondary sim-btn" data-step="day">下一交易日</button>
          </div>
        </section>
        <section class="sim-card sim-ticket" aria-labelledby="sim-ticket-title">
          <div class="sim-ticket-head"><h2 id="sim-ticket-title">限价委托</h2><span>每手 100 股</span></div>
          <p class="market-order-symbol">下课咖啡 · SIM001</p>
          <div class="sim-toggle" role="group" aria-label="交易方向">
            <button type="button" data-side="buy" aria-pressed="${side === 'buy'}">买入</button>
            <button type="button" data-side="sell" aria-pressed="${side === 'sell'}">卖出</button>
          </div>
          <form class="sim-form" data-order-form novalidate>
            <div class="sim-inputs">
              <label><span>限价（元 / 股）</span><input name="limit" value="${price}" type="number" inputmode="decimal" min="0.01" max="999.99" step="0.01" placeholder="${simNumber(side === 'buy' ? ask : bid)}" required><small>${actionTitle}</small></label>
              <label><span>数量（股）</span><input name="quantity" value="${quantity}" type="number" inputmode="numeric" min="100" max="10000" step="100" required><small>按 100 股递增</small></label>
            </div>
            <div class="sim-estimate"></div>
            <button class="btn primary sim-btn sim-submit" type="submit" ${account.closed ? 'disabled' : ''}>${account.closed ? '已收盘' : '提交' + simSide(side) + '委托'}</button>
          </form>
          ${status ? `<p class="sim-status${error ? ' sim-status-error' : ''}">${status}</p>` : ''}
        </section>
      </div>
      <section class="sim-card sim-history" aria-labelledby="sim-history-title">
        <div class="sim-ticket-head"><h2 id="sim-history-title">委托与成交</h2><span>${account.pending.length} 笔待成交</span></div>
        ${rows ? `<div class="sim-table-scroll" tabindex="0" aria-label="订单记录表格，可横向滚动"><table><thead><tr><th scope="col">委托日</th><th scope="col">方向</th><th scope="col">限价</th><th scope="col">数量</th><th scope="col">成交价</th><th scope="col">费用</th><th scope="col">状态</th><th scope="col">操作</th></tr></thead><tbody>${rows}</tbody></table></div>` : '<p class="sim-empty">提交一笔委托后，这里会显示状态和成交价格。</p>'}
      </section>
      <div class="sim-foot">
        <details><summary>模拟规则与费用</summary><p>虚构股票按五分钟更新成交价和成交量。9:30 的量为开盘成交量。只模拟最优一档，假设对手方数量充足，满足限价时按对手方报价一次成交。同方向按价格优先、同价按时间优先处理。跳到下一日会先走完当日行情，收盘后剩余委托失效，当天买入的股数到下一交易日可卖。练习简化了集合竞价、涨跌幅和申报范围等规则。</p><p>示例佣金为成交额的 0.03%，每笔最低 ¥5。卖出额外计 0.05% 的印花税，模拟省略过户费。实盘费用以当期规则和券商公示为准。刷新页面会重置本次模拟记录。</p></details>
        <details class="sim-reset"><summary>重置模拟资金</summary><form data-reset-form><label for="sim-budget">初始虚拟资金（0–10,000 元）</label><div><input id="sim-budget" name="budget" type="number" min="0" max="10000" step="1" value="${Math.trunc(account.startingCash / 100)}" required><button class="btn secondary sim-btn" type="submit">重置并开始</button></div><p>将清空当前持仓、委托和成交记录。</p></form></details>
      </div>`;
    renderMarketChart(view.querySelector('.sim-chart'), account, historical);
    view.querySelectorAll('.sim-foot details').forEach((item, index) => { item.open = Boolean(openDetails[index]); });
    updateEstimate();
    if (focusSelector) view.querySelector(focusSelector)?.focus({ preventScroll: true });
  }

  view.addEventListener('input', event => {
    if (event.target.name === 'limit') price = event.target.value;
    if (event.target.name === 'quantity') quantity = event.target.value;
    if (event.target.form?.matches('[data-order-form]')) updateEstimate();
  });

  function stepMarket(automatic = false) {
    if (!view.isConnected || document.hidden) {
      pausePlayback();
      return;
    }
    const keepPlayFocus = document.activeElement?.matches('[data-market-play]');
    historical = false;
    const { filled, expired } = simAccount.advance();
    const messages = [];
    if (filled.length) {
      messages.push(`第 ${filled[0].id} 笔委托以 ${simMoney(filled[0].price)} 成交。`);
      if (filled.length > 1) messages.push(`另有 ${filled.length - 1} 笔成交。`);
    }
    if (simAccount.closed) {
      pausePlayback();
      messages.push(`今天已收盘。${expired.length ? `${expired.length} 笔未成交委托已失效。` : ''}`);
    }
    if (messages.length || !automatic) setStatus(messages.join('') || `模拟行情已推进至 ${simAccount.quote.time}。`);
    let focusTarget = simAccount.closed ? '[data-step="day"]' : '[data-step="tick"]';
    if (automatic && !simAccount.closed) focusTarget = '[data-market-play]';
    if (automatic && !keepPlayFocus) focusTarget = undefined;
    render(focusTarget);
  }

  view.addEventListener('focusin', event => {
    if (!event.target.matches('[data-market-play]')) pausePlayback();
  });
  view.addEventListener('pointerdown', event => {
    if (!event.target.closest('[data-market-play]')) pausePlayback();
  });
  window.addEventListener('hashchange', pausePlayback, { once: true });

  view.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset;
    if ('tourOpen' in action) pausePlayback();
    if ('marketPlay' in action) {
      if (playTimer !== null) {
        pausePlayback();
      } else if (!simAccount.closed) {
        historical = false;
        playTimer = setInterval(() => stepMarket(true), 2000);
        document.addEventListener('visibilitychange', pauseWhenHidden);
        render('[data-market-play]');
      }
      return;
    }
    if (action.chartMode) {
      historical = action.chartMode === 'index';
      render(`[data-chart-mode="${action.chartMode}"]`);
      return;
    }
    if ('example' in action) {
      side = 'buy';
      price = '10.00';
      quantity = '100';
      setStatus('');
      render();
      view.querySelector('[name="limit"]').focus();
    }
    if (action.side) {
      side = action.side;
      price = ((side === 'buy' ? simAccount.quote.ask : simAccount.quote.bid) / 100).toFixed(2);
      setStatus('');
      render(`[data-side="${side}"]`);
    }
    if (action.quote) {
      price = (Number(action.quote) / 100).toFixed(2);
      view.querySelector('[name="limit"]').value = price;
      updateEstimate();
      view.querySelector('[name="limit"]').focus();
    }
    if (action.step === 'tick') {
      stepMarket();
    }
    if (action.step === 'day') {
      historical = false;
      const { filled, expired } = simAccount.nextDay();
      setStatus(`现在是第 ${simAccount.day} 个交易日，可卖 ${simAccount.sellable} 股。${filled.length ? `上一日收盘前有 ${filled.length} 笔委托成交。` : ''}${expired.length ? `${expired.length} 笔未成交委托已失效。` : ''}`);
      render('[data-step="day"]');
    }
    if (action.cancel) {
      const order = simAccount.cancel(Number(action.cancel));
      if (!order) return;
      const released = order.side === 'buy' ? `${simMoney(order.amount + order.fee)} 可用资金` : `${order.quantity} 股可卖数量`;
      setStatus(`已撤销第 ${order.id} 笔委托，释放 ${released}。`);
      render('[data-order-form] button[type="submit"]');
    }
  });

  view.addEventListener('submit', event => {
    event.preventDefault();
    if (event.target.matches('[data-reset-form]')) {
      const newBudget = event.target.elements.budget.valueAsNumber;
      if (!Number.isInteger(newBudget) || newBudget < 0 || newBudget > 10000) return;
      simAccount = new SimTradingAccount(newBudget);
      historical = false;
      side = 'buy';
      price = '';
      quantity = '100';
      setStatus(`模拟账户已重置，初始资金 ${simMoney(simAccount.startingCash)}。`);
      render('.sim-reset summary');
      return;
    }
    if (!event.target.matches('[data-order-form]')) return;
    const { order, reason } = simAccount.submit(side, selectedPrice(), Number(quantity));
    if (reason) {
      setStatus(reason, true);
    } else if (order.status === 'filled') {
      setStatus(`${simSide(side)}成交 ${order.quantity} 股，成交价 ${simMoney(order.price)}，费用 ${simMoney(order.fee)}。`);
    } else {
      const explanation = side === 'buy' ? '限价低于卖一' : '限价高于买一';
      setStatus(`${explanation}，委托正在等候。你可以推进行情，也可以撤单。`);
    }
    render('[data-order-form] button[type="submit"]');
  });

  render();
  setupSimulatorTour(root);
}

const SIMULATOR_CSS = `
.sim-shell { --sim-accent:var(--accent,#543bc1); --sim-lavender:var(--lav,#eeebff); --sim-ink:var(--ink,#212039); --sim-muted:var(--muted,#625f76); --sim-border:var(--line,#e8e6f0); color:var(--sim-ink); }
.sim-shell * { box-sizing:border-box; }
.sim-shell p { margin:0; }
.sim-shell h1,.sim-shell h2 { margin:0; }
.sim-shell h1 { font-size:var(--type-title); font-weight:600; line-height:1.3; }
.sim-shell h2 { font-size:var(--type-heading); font-weight:600; line-height:1.3; }
.sim-header { display:flex; justify-content:space-between; align-items:end; gap:15px; margin-bottom:24px; }
.sim-header p { color:var(--sim-muted); margin-top:10px; line-height:1.6; }
.sim-day { color:var(--sim-accent); background:var(--sim-lavender); padding:8px 12px; font-size:var(--type-caption); font-weight:600; white-space:nowrap; border-radius:999px; }
.sim-account { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); border:1px solid var(--sim-border); background:#fff; border-radius:17px; margin-bottom:18px; overflow:hidden; }
.sim-account > div { display:flex; flex-direction:column; gap:6px; padding:17px 20px; min-width:0; }
.sim-account > div + div { border-left:1px solid var(--sim-border); }
.sim-account span,.sim-account small { color:var(--sim-muted); font-size:var(--type-caption); }
.sim-account strong { font:600 var(--type-heading)/1.2 var(--body); white-space:nowrap; font-variant-numeric:tabular-nums; letter-spacing:-.035em; }
.sim-account strong.sim-up { color:#9e333c; }
.sim-account strong.sim-down { color:#087371; }
.sim-market-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; align-items:start; }
.sim-card { padding:22px; border:1px solid var(--sim-border); border-radius:18px; background:#fff; min-width:0; }
.sim-stock-head { display:flex; align-items:center; gap:11px; }
.sim-stock-head span,.sim-ticket-head>span { color:var(--sim-muted); font-size:var(--type-caption); }
.sim-stock-symbol { width:41px; height:41px; border-radius:13px; display:grid; place-items:center; background:var(--sim-lavender); position:relative; }
.sim-stock-symbol::before { content:''; width:14px; height:10px; border:2px solid var(--sim-accent); border-top-width:1px; border-radius:2px 2px 5px 5px; transform:translate(-1px,1px); }
.sim-stock-symbol::after { content:''; width:5px; height:6px; border:1.5px solid var(--sim-accent); border-left:0; border-radius:0 3px 3px 0; position:absolute; left:26px; top:18px; }
.sim-print { display:flex; align-items:baseline; gap:9px; margin:17px 0 14px; }
.sim-print strong { font:600 var(--type-heading)/1.2 var(--body); letter-spacing:-.035em; font-variant-numeric:tabular-nums; }
.sim-print span { color:var(--sim-muted); font-size:var(--type-caption); }
.sim-shell p.sim-quotes-label { font-size:var(--type-caption); font-weight:600; color:var(--sim-ink); margin-bottom:6px; }
.sim-shell p.sim-quotes-note { font-size:var(--type-caption); color:var(--sim-muted); line-height:1.6; margin-top:7px; }
.sim-quotes { display:grid; gap:5px; }
.sim-quotes button { display:flex; justify-content:space-between; gap:7px; width:100%; padding:9px 11px; background:#f7f5fb; color:var(--sim-ink); border:1px solid transparent; border-radius:8px; text-align:left; font:inherit; font-size:var(--type-body); cursor:pointer; }
.sim-quotes button:hover,.sim-quotes button:focus-visible { border-color:#b6a9e9; background:var(--sim-lavender); }
.sim-quotes small { font-size:var(--type-caption); color:var(--sim-muted); margin-left:5px; }
.sim-quotes strong { font-variant-numeric:tabular-nums; }
.sim-shell p.sim-event { font-size:var(--type-caption); color:var(--sim-muted); line-height:1.6; margin:12px 0; min-height:2em; }
.sim-market-actions { display:flex; flex-wrap:wrap; gap:7px; }
.sim-shell .sim-btn { font:inherit; font-size:var(--type-body); font-weight:600; padding:9px 12px; border-radius:9px; min-height:37px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; }
.sim-shell .sim-btn.secondary { border:1px solid var(--sim-border); background:#fff; color:var(--sim-accent); }
.sim-shell .sim-btn.secondary:hover { background:var(--sim-lavender); }
.sim-shell .sim-btn.primary { border:1px solid var(--sim-accent); background:var(--sim-accent); color:#fff; }
.sim-shell .sim-btn.primary:hover { background:#4934b4; }
.sim-ticket-head { display:flex; justify-content:space-between; gap:10px; align-items:baseline; }
.sim-toggle { display:flex; gap:4px; padding:3px; border-radius:9px; background:#f6f4fa; margin:15px 0; }
.sim-toggle button { flex:1; border:1px solid transparent; border-radius:7px; background:transparent; color:var(--sim-muted); min-height:33px; font:inherit; font-size:var(--type-body); font-weight:600; cursor:pointer; }
.sim-toggle button[aria-pressed="true"] { color:var(--sim-accent); background:#fff; border-color:var(--sim-border); }
.sim-inputs { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.sim-shell label { display:grid; gap:5px; color:var(--sim-ink); font-size:var(--type-caption); font-weight:600; min-width:0; }
.sim-shell input { width:100%; min-width:0; padding:8px 10px; border:1px solid #dcd5e9; border-radius:8px; color:var(--sim-ink); background:#fff; font:inherit; font-size:var(--type-body); min-height:37px; }
.sim-shell input::placeholder { color:#847b94; }
.sim-shell label small { color:var(--sim-muted); font-size:var(--type-caption); font-weight:400; }
.sim-estimate { display:flex; justify-content:space-between; align-items:baseline; gap:7px; font-size:var(--type-caption); margin:14px 0 10px; min-height:20px; }
.sim-estimate small { display:block; color:var(--sim-muted); font-size:var(--type-caption); }
.sim-estimate strong { white-space:nowrap; font-variant-numeric:tabular-nums; }
.sim-shell .sim-submit { width:100%; }
.sim-shell p.sim-status { margin-top:11px; padding:9px 10px; border-radius:8px; background:var(--sim-lavender); color:#402c9b; font-size:var(--type-caption); line-height:1.6; }
.sim-shell p.sim-status-error { background:#fcecf1; color:#8c1942; }
.sim-tip { display:flex; justify-content:space-between; gap:12px; align-items:center; line-height:1.6; margin:15px 0; padding:12px 14px; background:var(--sim-lavender); border-radius:12px; color:#4a3890; font-size:var(--type-caption); }
.sim-tip button { white-space:nowrap; }
.sim-history { margin-top:16px; padding-bottom:14px; }
.sim-table-scroll { overflow-x:auto; }
.sim-shell table { border-collapse:collapse; width:100%; margin-top:11px; font-size:var(--type-caption); font-variant-numeric:tabular-nums; text-align:left; }
.sim-shell th,.sim-shell td { padding:9px 9px 9px 0; white-space:nowrap; border-bottom:1px solid var(--sim-border); }
.sim-shell th { font-weight:600; color:var(--sim-muted); }
.sim-shell tr:last-child td { border-bottom:0; }
.sim-shell .sim-empty { margin:12px 0 7px; color:var(--sim-muted); font-size:var(--type-caption); }
.sim-order-state { color:var(--sim-muted); }
.sim-order-state.pending { color:#7d541a; }
.sim-order-state.filled { color:#326c54; }
.sim-link { background:none; border:none; padding:3px 5px; color:var(--sim-accent); text-decoration:underline; text-underline-offset:2px; cursor:pointer; font:inherit; }
.sim-foot { display:grid; grid-template-columns:1fr auto; gap:20px; padding-top:14px; color:var(--sim-muted); font-size:var(--type-caption); line-height:1.65; }
.sim-foot summary { cursor:pointer; color:var(--sim-accent); font-weight:600; }
.sim-foot details p { margin:8px 0; max-width:66ch; }
.sim-reset form { display:grid; gap:5px; padding-top:8px; }
.sim-reset form>div { display:flex; align-items:center; gap:8px; }
.sim-reset input { max-width:136px; }
.sim-reset button { white-space:nowrap; }
.sim-shell :where(button,input,summary,[tabindex]):focus-visible { outline:2px solid #6b50da; outline-offset:2px; }
.sim-live { position:absolute; width:1px; height:1px; margin:-1px; padding:0; overflow:hidden; clip-path:inset(50%); white-space:nowrap; }
@media (max-width:720px) {
  .sim-account { grid-template-columns:repeat(2,minmax(0,1fr)); }
  .sim-account > div:nth-child(3) { border-left:0; }
  .sim-account > div:nth-child(n+3) { border-top:1px solid var(--sim-border); }
  .sim-account > div { padding:12px 14px; }
  .sim-market-grid { grid-template-columns:1fr; }
  .sim-card { padding:16px; }
  .sim-foot { grid-template-columns:1fr; gap:10px; }
}
@media (max-width:400px) {
  .sim-header { align-items:start; flex-direction:column; }
  .sim-tip { align-items:start; flex-direction:column; }
}
`;

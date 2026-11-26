const simulatorTourSteps = [
  {
    target: '.sim-account', title: '先看还能用多少钱',
    text: '总资产包括现金和持仓市值。挂买单会冻结一部分现金，剩下的可用资金才可以继续下单。持仓旁能看到今天可卖的股数，盈亏则和初始资金比较。'
  },
  {
    target: '.sim-tip', title: '试填第一笔订单',
    text: '点「填入示例」会把价格和股数写进委托单。你可以先改数字、看费用，点提交时才会发出模拟委托。'
  },
  {
    target: '.market-stats', title: '今天的价格处在什么位置？',
    text: '涨跌幅用最新成交价和昨收相比。最高、最低圈出今天到现在的价格范围，总量则是今天累计成交的手数，本例每手 100 股。'
  },
  {
    target: '.sim-chart', detail: '.market-chart-plot', title: '顺着时间读折线',
    text: '从左到右看价格怎样变化。量柱越高，这段时间成交越多。点「上证历史」可看真实交易日的指数收盘点位。拖动滑块可查看任一点的数值。'
  },
  {
    target: '.sim-quotes', title: '买一和卖一怎么用？',
    text: '买一是买家愿出的最高价，卖一是卖家愿收的最低价。点任一报价就能填入限价框。最新成交价记录的是刚刚成交的价格，下一笔可能不同。'
  },
  {
    target: '.sim-market-actions', title: '让行情往前走',
    text: '单步前进可以仔细看一个时点。「播放行情」会连续推进，再点一次即可暂停。「下一交易日」会走完当天行情，收盘时剩余挂单失效，今天买的股票到下个交易日可卖。'
  },
  {
    target: '.sim-ticket', detail: '.sim-inputs', title: '给这一笔设个限价',
    text: '选买入时填写最高愿付价，选卖出时填写最低愿收价。数量按 100 股一手填写。看清含费用的预计金额，再点「提交买入委托」或「提交卖出委托」。'
  },
  {
    target: '.sim-history', title: '提交以后，来这里核对',
    text: '「待成交」表示还在等合适的对手价，此时可以撤单，释放占用的资金或股数。「已成交」记录实际价格和费用，可以和下单时的估算对照。'
  },
  {
    target: '.sim-foot', title: '查看规则，或重新练习',
    text: '展开「模拟规则与费用」查看撮合方式和收费。想换一笔起始资金，可以展开「重置模拟资金」，输入金额再确认。重置会清空本次持仓和委托。'
  },
];

const simulatorTourKey = 'first-share-simulator-tour-v1';
let simulatorTourSeen = false;

function setupSimulatorTour(root) {
  const shell = root.querySelector('.sim-shell');
  const dialog = document.createElement('dialog');
  dialog.className = 'sim-tour';
  dialog.setAttribute('aria-labelledby', 'sim-tour-title');
  dialog.setAttribute('aria-describedby', 'sim-tour-text');
  dialog.innerHTML = `
    <div class="sim-tour-frame" aria-hidden="true"></div>
    <section class="sim-tour-card">
      <div class="sim-tour-meta"><span>新手引导 <b data-tour-count></b></span><button type="button" class="sim-tour-skip" data-tour-exit>跳过引导</button></div>
      <div class="sim-tour-track" aria-hidden="true"><i></i></div>
      <h2 id="sim-tour-title" tabindex="-1" aria-describedby="sim-tour-text"></h2>
      <p id="sim-tour-text"></p>
      <div class="sim-tour-actions"><button type="button" data-tour-prev>上一步</button><button type="button" data-tour-next>下一步</button></div>
    </section>`;
  shell.append(dialog);
  const card = dialog.querySelector('.sim-tour-card');
  const frame = dialog.querySelector('.sim-tour-frame');
  const title = dialog.querySelector('h2');
  const previous = dialog.querySelector('[data-tour-prev]');
  const next = dialog.querySelector('[data-tour-next]');
  let steps, current, originY, listeners;

  function highlightedElement() {
    const step = steps[current];
    if (step.detail && window.innerHeight < 640) return shell.querySelector(step.detail);
    return shell.querySelector(step.target);
  }

  function positionCard() {
    const rect = highlightedElement().getBoundingClientRect();
    const width = dialog.clientWidth;
    const height = dialog.clientHeight;
    const gap = 14;
    const margin = 10;
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;
    const clamp = (n, max) => Math.max(margin, Math.min(n, max - margin));
    let left = clamp(rect.left, width - cardWidth);
    let top;
    if (rect.right + gap + cardWidth <= width - margin) {
      left = rect.right + gap;
      top = clamp(rect.top, height - cardHeight);
    } else if (rect.left - gap - cardWidth >= margin) {
      left = rect.left - gap - cardWidth;
      top = clamp(rect.top, height - cardHeight);
    } else if (rect.bottom + gap + cardHeight <= height - margin) {
      top = rect.bottom + gap;
    } else if (rect.top >= gap + cardHeight + margin) {
      top = rect.top - gap - cardHeight;
    } else {
      top = height - cardHeight - margin;
    }
    card.style.left = left + 'px';
    card.style.top = clamp(top, height - cardHeight) + 'px';
    frame.style.left = rect.left - 3 + 'px';
    frame.style.top = rect.top - 3 + 'px';
    frame.style.width = rect.width + 6 + 'px';
    frame.style.height = rect.height + 6 + 'px';
  }

  function showStep(index) {
    current = index;
    const step = steps[index];
    dialog.querySelector('[data-tour-count]').textContent = `${index + 1} / ${steps.length}`;
    dialog.querySelector('.sim-tour-track i').style.width = `${100 * (index + 1) / steps.length}%`;
    title.textContent = step.title;
    dialog.querySelector('#sim-tour-text').textContent = step.text;
    previous.disabled = index === 0;
    next.textContent = index === steps.length - 1 ? '完成引导' : '下一步';
    const header = document.querySelector('.top');
    const headerHeight = getComputedStyle(header).position === 'sticky' ? header.offsetHeight : 0;
    const target = highlightedElement();
    window.scrollBy({ top: target.getBoundingClientRect().top - headerHeight - 16, behavior: 'instant' });
    positionCard();
    card.scrollTop = 0;
    title.focus({ preventScroll: true });
  }

  function openTour() {
    if (!shell.isConnected || dialog.open) return;
    steps = simulatorTourSteps.filter(step => shell.querySelector(step.target));
    if (!steps.length) return;
    originY = window.scrollY;
    dialog.showModal();
    showStep(0);
    listeners = new AbortController();
    const options = { signal: listeners.signal };
    window.addEventListener('resize', positionCard, options);
    window.addEventListener('scroll', positionCard, { ...options, passive: true });
    window.addEventListener('hashchange', () => listeners.abort(), options);
  }

  function finishTour() {
    listeners.abort();
    simulatorTourSeen = true;
    try { localStorage.setItem(simulatorTourKey, 'seen'); } catch { /* Remember within this visit. */ }
    dialog.close();
    window.scrollTo({ top: originY, behavior: 'instant' });
    shell.querySelector('[data-tour-open]').focus({ preventScroll: true });
  }

  function advance() {
    if (current === steps.length - 1) finishTour();
    else showStep(current + 1);
  }

  shell.addEventListener('click', event => {
    if (event.target.closest('[data-tour-open]')) openTour();
  });
  previous.addEventListener('click', () => showStep(current - 1));
  next.addEventListener('click', advance);
  dialog.querySelector('[data-tour-exit]').addEventListener('click', finishTour);
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    finishTour();
  });
  dialog.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft' && current > 0) {
      event.preventDefault();
      showStep(current - 1);
    } else if (event.key === 'ArrowRight' && current < steps.length - 1) {
      event.preventDefault();
      showStep(current + 1);
    }
  });
  try { simulatorTourSeen ||= localStorage.getItem(simulatorTourKey) === 'seen'; } catch { /* Use memory. */ }
  if (!simulatorTourSeen) requestAnimationFrame(openTour);
}

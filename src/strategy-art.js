const strategyTrendCloses = [10, 10.2, 10.05, 10.4, 10.6, 10.3, 10.5, 10.8, 11, 10.85, 11.2, 11.4, 11.15, 11.55, 11.7, 11.9, 11.65, 11.75, 11.5, 11.4];
// Prices in each row follow the order open, high, low, close.
const strategyCandleDays = [[20.6, 21.2, 20.2, 20.5], [20, 22, 19.8, 20.4], [19.8, 20.5, 19.5, 20.1]];

function drawCertificate(index) {
  const emblems = [
    '<path d="M49 54h44v26q0 15-22 15T49 80z" fill="var(--paper)"/><path d="M94 59h7q15 9-3 20h-7M42 98h60M60 47q-7-8 2-14m12 14q-7-8 2-14" fill="none"/>',
    '<path d="m37 55 34-20 34 20zm6 38h57v6H43z" fill="var(--paper)"/><path d="M47 58h8v32h-8zm19 0h8v32h-8zm19 0h8v32h-8z" fill="var(--paper)"/>',
    '<path d="m37 60 10 34h49l11-34z" fill="var(--paper)"/><path d="m52 60 16-22q4-6 8 0l17 22M56 71l3 13m12-14v14m16-14-3 14" fill="none"/>',
  ];
  return `<g transform="rotate(8 75 75)"><path d="M24 53h77v60H24z" fill="var(--orange)"/><path d="M31 45h79v59H31z" fill="var(--lime)"/>
    <path d="M38 33h78v67H38z" fill="#ffcf41"/>${emblems[index]}</g>`;
}

function drawFundBasket(index) {
  const blueCards = [10,4,1][index];
  const card = n => `<rect x="${24 + (n%5)*19}" y="${28 + Math.floor(n/5)*26}" width="16" height="22" rx="1.5" fill="${n < blueCards ? 'var(--blue)' : 'var(--paper)'}"/>`;
  return `<path d="m25 81 45-58q4-5 8 0l44 58" stroke-width="6" stroke="#111" fill="none"/>
    <path d="m25 81 45-58q4-5 8 0l44 58" stroke-width="2.5" stroke="#ffcf41" fill="none"/>
    ${Array.from({length:10},(_,n)=>card(n)).join('')}
    <path d="m16 84 12 36h91l15-36z" fill="#ffcf41"/><rect x="13" y="77" width="122" height="10" rx="3" fill="var(--paper)"/>
    <path d="m40 97 3 14m17-14 1 14m17-14-1 14m17-14-3 14m17-14-4 14" fill="none" stroke-width="4"/>`;
}

function drawPermissionKey(index) {
  const teeth = ['l0 8h9v-8','v13h9V85h7v9h8v-9','v9h8v7h9V85h7v7h7v-7','v14h9V85h7v8h9v-8'][index];
  return `<g transform="rotate(-23 77 68)"><rect x="81" y="32" width="44" height="62" rx="4" fill="var(--paper)"/><path d="M86 40h33m-31 9h23m-23 7h14" fill="none" stroke-width="2"/>
    <path d="M39 56a22 22 0 1 0 21 29h23${teeth}h13V72H60Q56 55 39 56z" fill="#ffcf41"/>
    <circle cx="38" cy="77" r="8" fill="var(--paper)"/></g>`;
}

function drawCompanyBooks(index) {
  const values = [[860,140], [20,12], [3,5]][index];
  const max = Math.max(...values);
  const heights = values.map(value => 43*value/max);
  return `<g transform="rotate(8 76 80)"><rect x="13" y="43" width="122" height="75" rx="3" fill="var(--orange)"/>
    <path d="M19 36q29-9 54 3 26-12 54-3v73q-27-8-54 3-25-12-54-3z" fill="var(--paper)"/>
    <path d="M73 40v68m-46-8h32m25 0h31" fill="none" stroke-width="2"/>
    <rect x="33" y="${96-heights[0]}" width="19" height="${heights[0]}" fill="var(--blue)"/>
    <rect x="91" y="${96-heights[1]}" width="19" height="${heights[1]}" fill="var(--orange)"/>
    <path d="M23 35h13v16l-6-4-7 4zm89-2h12v16l-6-4-6 4z" fill="var(--lime)"/></g>`;
}

function drawTimeWindow(index) {
  const x = i => 21 + i*5.6;
  const y = price => 95 - (price-10)*26;
  const line = strategyTrendCloses.map((price,i)=>`${x(i).toFixed(1)},${y(price).toFixed(1)}`).join(' ');
  const start = index === 0 ? 15 : 0;
  const paper = index === 0 ? '<path d="M18 36h84v67H18z" fill="#ffcf41"/><path d="m93 103 9-10v10z" fill="var(--orange)"/><path d="M28 49h40m-40 9h22" fill="none" stroke-width="2"/>' : '';
  return `<g transform="rotate(5 74 76)"><rect x="12" y="31" width="125" height="88" rx="3" fill="var(--paper)"/>
    <path d="M18 51h114m-114 23h114m-114 23h114" stroke="#c0c0b8" stroke-width="1" fill="none"/>
    <polyline points="${line}" stroke="var(--blue)" fill="none" stroke-width="3"/>
    ${paper}<circle cx="${x(start)}" cy="${y(strategyTrendCloses[start])}" r="3" fill="var(--orange)"/><circle cx="${x(19)}" cy="${y(11.4)}" r="3" fill="var(--blue)"/></g>`;
}

function drawCandleSheet(index) {
  const y = value => 109 - (value-19)*24;
  const candles = strategyCandleDays.map(([open,high,low,close],day)=>{
    const x = 39+day*34;
    const ink = close>=open ? '#c94346' : '#19764e';
    return `<g opacity="${day===index ? 1 : .38}"><path d="M${x} ${y(high)}V${y(low)}" stroke="${ink}" stroke-width="3"/>
      <rect x="${x-7}" y="${y(Math.max(close,open))}" width="14" height="${Math.abs(y(close)-y(open))}" stroke="${ink}" fill="${ink}"/></g>`;
  }).join('');
  return `<g transform="rotate(-4 75 76)"><path d="M18 28h115v93l-7-3-8 3-8-3-8 3-8-3-8 3-8-3-8 3-8-3-8 3-8-3-8 3-8-3-6 3z" fill="var(--paper)"/>
    <rect x="${24+index*34}" y="40" width="30" height="66" rx="2" stroke="none" fill="#c1d1ff"/>
    <path d="M28 54h94m-94 22h94m-94 22h94" fill="none" stroke="#c4c3bb" stroke-width="1"/>${candles}
    <path d="M28 24v10m16-10v10m16-10v10m16-10v10m16-10v10m16-10v10m16-10v10" stroke-width="3"/></g>`;
}

function drawRiskGauge(index) {
  const angle = [-90,-30,90][index];
  return `<path d="M16 100a59 59 0 0 1 118 0v15H16z" fill="var(--paper)"/>
    <path d="M26 98a49 49 0 0 1 24.5-42.4" stroke="var(--lime)" stroke-width="12" fill="none"/>
    <path d="M50.5 55.6A49 49 0 0 1 124 98" stroke="var(--orange)" stroke-width="12" fill="none"/>
    <path d="M25 99h8m16-46 5 9m21-17v7m29 3-4 7m23 36h-8" fill="none"/>
    <g transform="rotate(${angle} 75 99)"><path d="m72 99 3-46 4 46z" fill="#111"/></g>
    <circle cx="75" cy="99" r="6" fill="var(--blue)"/>`;
}

function drawExitCase(index) {
  const contract = '<path d="M34 25h62l19 21v73H34l7-24-8-7 8-12-8-9z" fill="var(--paper)"/><path d="M96 26v22h18M48 52h31m-31 12h45m-45 12h21" fill="none"/><g transform="rotate(-16 89 92)"><rect x="58" y="80" width="62" height="25" fill="var(--orange)"/><path d="M67 93h42" stroke-width="4"/></g>';
  const holding = '<circle cx="74" cy="74" r="47" fill="var(--paper)"/><path d="M74 74V27a47 47 0 0 1 39.68 72.18z" fill="var(--blue)"/><path d="M74 74 118.7 88.52" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="5 3"/>';
  const day = '<path d="M26 35h96v84H26z" fill="var(--paper)"/><path d="M26 35h96v20H26z" fill="var(--lime)"/><path d="M43 27v16m19-16v16m20-16v16m19-16v16M42 66h20m-20 9h11" fill="none"/><path d="m53 75 43 20m-16 2 18-1-8-16" fill="none" stroke-width="5" stroke="#19764e"/>';
  return [contract,holding,day][index];
}

// The caption names the current instrument or observation. The paper slip and
// adjacent object change together when the learner tries another example.
const strategyArtViews = {
  securities: { color: '#ff865d', draw: drawCertificate, states: [
    ['公司股票','持有人身份','股东','持股享有公司权益'],
    ['固定利率国债示例','100 元面值 · 年票息','2 元','年票面利率 2%'],
    ['基金份额','持有人身份','份额持有人','按份分享组合收益'],
  ] },
  funds: { color: '#b9f227', draw: drawFundBasket, states: [
    ['零售股下跌 10%','10 张蓝纸 · 组合少了','100 元','10 张里有 10 张零售股'],
    ['零售股下跌 10%','4 张蓝纸 · 组合少了','40 元','10 张里有 4 张零售股'],
    ['零售股下跌 10%','1 张蓝纸 · 组合少了','10 元','10 张里有 1 张零售股'],
  ] },
  boards: { color: '#a7d7ea', draw: drawPermissionKey, states: [
    ['沪深主板','20 元 × 100 股','2,000 元','普通主板 A 股无专项资产门槛'],
    ['创业板','20 元 × 100 股','2,000 元','开通时日均资产 10 万元'],
    ['科创板','20 元 × 200 股','4,000 元','开通时日均资产 50 万元'],
    ['北交所','20 元 × 100 股','2,000 元','开通时日均资产 50 万元'],
  ] },
  screen: { color: '#ff865d', draw: drawCompanyBooks, states: [
    ['甲店与乙店','经营现金净流入 · 万元','860 / 140','两家同业，同一财年'],
    ['甲店与乙店','市盈率 · 倍','20 / 12','两家公司每股收益都为 1 元'],
    ['甲店与乙店','股息率','3% / 5%','两家公司每股分红都为 0.60 元'],
  ] },
  trend: { color: '#8295fe', draw: drawTimeWindow, states: [
    ['收盘价','近 5 日涨跌','−4.20%','从 11.90 元到 11.40 元'],
    ['收盘价','近 20 日涨跌','+14.00%','从 10.00 元到 11.40 元'],
  ] },
  candles: { color: '#eeb5d1', draw: drawCandleSheet, states: [
    ['日 K 线 · 第 1 日','开盘 → 收盘（元）','20.60 → 20.50','最高 21.20 元，最低 20.20 元'],
    ['日 K 线 · 第 2 日','开盘 → 收盘（元）','20.00 → 20.40','最高 22.00 元，最低 19.80 元'],
    ['日 K 线 · 第 3 日','开盘 → 收盘（元）','19.80 → 20.10','最高 20.50 元，最低 19.50 元'],
  ] },
  entry: { color: '#b9f227', draw: drawRiskGauge, states: [
    ['20 元跌到 17 元','没有买入，亏损','0 元','小满最多愿亏 300 元'],
    ['20 元跌到 17 元','买 100 股会亏','300 元','刚好是小满愿亏的金额'],
    ['20 元跌到 17 元','买 300 股会亏','900 元','比小满愿亏的多 600 元'],
  ] },
  exit: { color: '#eeb5d1', draw: drawExitCase, states: [
    ['客户解约','该客户占公司收入','40%','重新估算续单与收入'],
    ['持仓占比升高','仓位从 20% 升到','34%','练习中自定的上限为 30%'],
    ['单日回落','当天股价变化','−3%','暂未发现新的经营公告'],
  ] },
};

function strategyCategoryMark(slug, index = 0, className = 'strategy-category-mark') {
  if (!Object.hasOwn(strategyArtViews, slug)) return '';
  const view = strategyArtViews[slug];
  const selected = Number.isInteger(index) && view.states[index] ? index : 0;
  return `<svg class="${className}" viewBox="0 0 150 140" aria-hidden="true" focusable="false"><g stroke="#111" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${view.draw(selected)}</g></svg>`;
}

function strategyIllustration(slug, index = 0) {
  if (!Object.hasOwn(strategyArtViews, slug)) return '';
  const view = strategyArtViews[slug];
  const selected = Number.isInteger(index) && view.states[index] ? index : 0;
  const [caption, label, value, note] = view.states[selected];
  return `<figure class="story-art strategy-illustration" data-lesson-art="${slug}" style="--art-color:${view.color}" role="img" aria-label="${caption}。${label}：${value}。${note}。">
    <span class="art-caption" aria-hidden="true">${caption}</span>
    <div class="strategy-art-arrangement" aria-hidden="true">
      <div class="visual-card strategy-art-slip"><span>${label}</span><b>${value}</b></div>
      ${strategyCategoryMark(slug, selected, 'strategy-art-object')}
    </div>
    <figcaption class="strategy-art-note" aria-hidden="true">${note}</figcaption>
  </figure>`;
}

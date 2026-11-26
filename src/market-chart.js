function renderMarketChart(container, account, historical) {
  const points = historical ? HISTORICAL_INDEX : account.history;
  const values = points.map(point => point.last);
  if (!historical) values.push(account.previousClose);
  const padding = Math.max(1, Math.ceil((Math.max(...values) - Math.min(...values)) * 0.12));
  const top = Math.max(...values) + padding;
  const bottom = Math.min(...values) - padding;
  const maxVolume = Math.max(...points.map(point => point.volume));
  const count = points.length;
  const x = index => 5 + 490 * index / Math.max(1, count - 1);
  const y = value => 5 + 106 * (top - value) / (top - bottom);
  const line = points.map((point, i) => `${x(i).toFixed(1)},${y(point.last).toFixed(1)}`).join(' ');
  const barWidth = Math.min(12, 300 / count);
  const bars = points.map((point, i) => {
    const height = point.volume / maxVolume * 30;
    return `<rect x="${x(i) - barWidth / 2}" y="${154 - height}" width="${barWidth}" height="${height}"/>`;
  }).join('');
  const lastPoint = count - 1;
  const firstLabel = points[0].time;
  const centerLabel = count >= 3 ? points[Math.floor(lastPoint / 2)].time : '';
  const lastLabel = count > 1 ? points[lastPoint].time : '';
  const title = historical ? '上证指数 · 2024 年 9 月' : '下课咖啡 · 当日分时';
  container.innerHTML = `
    <div class="market-chart-switch" role="group" aria-label="选择行情图">
      <button type="button" data-chart-mode="sim" aria-pressed="${!historical}">模拟分时</button>
      <button type="button" data-chart-mode="index" aria-pressed="${historical}">上证历史</button>
    </div>
    <div class="market-chart-title"><h3>${title}</h3><span>${historical ? '每日收盘 / 点' : '成交价 / 元'}</span></div>
    <div class="market-chart-plot">
      <div class="market-chart-scale" aria-hidden="true"><span>${simNumber(top)}</span><span>${simNumber((top + bottom) / 2)}</span><span>${simNumber(bottom)}</span></div>
      <svg data-chart-plot viewBox="0 0 500 158" preserveAspectRatio="none" aria-hidden="true">
        <path class="market-gridline" d="M0 5H500 M0 58H500 M0 111H500 M0 154H500"/>
        ${historical ? '' : `<path class="market-baseline" d="M0 ${y(account.previousClose)}H500"/>`}
        <polygon class="market-fill" points="${x(0)},111 ${line} ${x(lastPoint)},111"/>
        <polyline class="market-line" points="${line}"/>
        <g class="market-volume">${bars}</g>
        <line class="market-cross" y1="2" y2="154"/>
        <circle class="market-point" r="3.5"/>
      </svg>
      <div class="market-time-scale" aria-hidden="true"><span>${firstLabel}</span><span>${centerLabel}</span><span>${lastLabel}</span></div>
    </div>
    <div class="market-reading"><span data-chart-reading></span><span data-chart-volume></span></div>
    <input class="market-scrubber" type="range" min="0" max="${lastPoint}" value="${lastPoint}" step="1" aria-label="${historical ? '选择交易日' : '选择分时时刻'}" ${count === 1 ? 'disabled' : ''}>
    <p class="market-chart-note">${historical ? `收盘点位与每日成交量，数据来自<a href="${HISTORICAL_SOURCE}" target="_blank" rel="noopener noreferrer">腾讯证券</a>。此图仅供读盘。` : '蓝线是成交价，虚线是昨收，灰柱是每段成交量。拖动滑块可逐点查看。'}</p>`;
  const scrubber = container.querySelector('.market-scrubber');
  const plot = container.querySelector('[data-chart-plot]');
  const cross = plot.querySelector('.market-cross');
  const marker = plot.querySelector('.market-point');
  function inspect(index) {
    const point = points[index];
    const xPosition = x(index);
    cross.setAttribute('x1', xPosition);
    cross.setAttribute('x2', xPosition);
    marker.setAttribute('cx', xPosition);
    marker.setAttribute('cy', y(point.last));
    const priceText = historical ? `${simNumber(point.last)} 点` : simMoney(point.last);
    const volumeText = historical ? `${(point.volume / 1e8).toFixed(2)} 亿手` : `${point.volume.toLocaleString('zh-CN')} 股`;
    container.querySelector('[data-chart-reading]').textContent = `${point.time}　${priceText}`;
    container.querySelector('[data-chart-volume]').textContent = `成交量 ${volumeText}`;
    scrubber.value = index;
    scrubber.setAttribute('aria-valuetext', `${point.time}，${priceText}，成交量 ${volumeText}`);
  }
  scrubber.addEventListener('input', () => inspect(Number(scrubber.value)));
  plot.addEventListener('click', event => {
    const bounds = plot.getBoundingClientRect();
    const position = ((event.clientX - bounds.left) / bounds.width * 500 - 5) / 490;
    inspect(Math.min(lastPoint, Math.max(0, Math.round(position * lastPoint))));
  });
  inspect(lastPoint);
}

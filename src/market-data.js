// 上证综合指数（000001），腾讯证券日线。原字段为日期、开、收、高、低、成交量（手）。
const HISTORICAL_SOURCE = 'https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=sh000001,day,2024-09-02,2024-09-30,30,qfq';
const HISTORICAL_INDEX = [
  ['09-02', 281104, 340714193], ['09-03', 280298, 275736139], ['09-04', 278428, 257453500],
  ['09-05', 278831, 242040948], ['09-06', 276581, 253645375], ['09-09', 273649, 261468847],
  ['09-10', 274419, 262159015], ['09-11', 272180, 242264900], ['09-12', 271712, 240084315],
  ['09-13', 270409, 251270038], ['09-18', 271728, 247817132], ['09-19', 273602, 315208389],
  ['09-20', 273681, 285644627], ['09-23', 274892, 257642154], ['09-24', 286313, 477619545],
  ['09-25', 289631, 568259816], ['09-26', 300095, 576319261], ['09-27', 308753, 492287163],
  ['09-30', 333650, 1102337917],
].map(([time, last, volume]) => ({ time, last, volume }));

function tradingTime(tick) {
  const minutes = 570 + tick * 5 + (tick > 24 ? 90 : 0);
  return [Math.floor(minutes / 60), minutes % 60].map(n => String(n).padStart(2, '0')).join(':');
}

function makeMarketSession(day, previousClose) {
  // 固定首日上午的走势，与第四天课程的第一笔限价单共用同一份报价。
  const firstMorning = [998, 1000, 1002, 1004, 1003, 1005, 1004, 1003, 1000, 999, 1000, 1002, 1001, 998];
  let seed = (day * 2654435761) >>> 0;
  function random() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  let last = previousClose;
  return Array.from({ length: 49 }, (_, tick) => {
    const opening = tick === 0;
    const flow = 0.3 * Math.sin(day + tick / 5);
    const volatility = opening ? 0.012 : 0.0045;
    const move = previousClose * volatility * (random() * 2 - 1 + flow);
    const prior = last;
    last = day === 1 && tick < firstMorning.length ? firstMorning[tick] : Math.max(5, Math.min(99990, last + Math.round(move)));
    const spread = random() < 0.2 ? 2 : 1;
    const activeSession = 1 + 2 * Math.pow(Math.abs(tick - 24) / 24, 2);
    // Simulated volume is measured in shares, including the opening auction at 09:30.
    const volume = Math.round((8 + random() * 46 + Math.abs(last - prior) * 2) * activeSession) * 100;
    return { time: tradingTime(tick), last, volume, high: last, low: last,
      bid: last - 1, ask: last + (day === 1 && (tick === 12 || tick === 13) ? 1 : spread) };
  });
}

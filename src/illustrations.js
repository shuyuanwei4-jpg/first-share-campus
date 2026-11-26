// Keep the scene geometry separate from the OpenMoji objects used in the exercises.
const campusPlaces = { canteen: '食堂', dorm: '宿舍', cafe: '下课咖啡', market: '二手书摊', desk: '自习桌', library: '图书馆' };
const campusObjects = {
  meal: '套餐', coffee: '咖啡', card: '饭卡', wallet: '钱包', coin: '硬币', bill: '纸币', receipt: '小票',
  book: '书', books: '书堆', bag: '书包', notebook: '笔记本', pencil: '铅笔', phone: '手机', laptop: '电脑',
  ticket: '票券', chart: '上涨折线', down: '下跌折线', bars: '柱状图', magnifier: '放大镜', calendar: '日历',
  clock: '时钟', key: '钥匙', puzzle: '拼图', seedling: '幼苗', basket: '篮子', bank: '银行',
  shield: '盾牌', scale: '天平', envelope: '信封', calculator: '算盘', lightbulb: '灯泡',
  scissors: '剪刀', folder: '文件夹', check: '勾号', warning: '提醒', tool: '扳手', print: '打印机', tag: '价签',
};
const campusSprite = './assets/campus-stickers.svg#sticker-';
const campusInk = '#28343b';
const campusSkin = '#ffd3ae';

function campusEscape(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
}

function campusSticker(key) {
  if (!Object.hasOwn(campusObjects, key)) return '';
  return `<svg class="campus-sticker" viewBox="0 0 72 72" aria-hidden="true" focusable="false"><use href="${campusSprite}${key}"/></svg>`;
}

function campusBunting() {
  return `<path d="M252 13q112 57 245-2" fill="none"/>
    <path d="m277 24 6 18 13-13z" fill="#f5ad5d"/><path d="m312 33 9 17 12-14z" fill="#2e897b"/>
    <path d="m355 37 11 16 10-16z" fill="#f48369"/><path d="m401 34 12 12 7-17z" fill="#f8cd59"/>
    <path d="m448 24 13 9 4-17z" fill="#7a89cf"/>`;
}

function campusBooks(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="m2 0 54-3 1 9-54 3q-4-3-1-9z" fill="#ee906c"/><path d="m10 0 44-2v4L9 5" fill="#fff5d9" stroke-width="1.2"/>
    <path d="m-3-8 49-5 2 8-50 6q-4-4-1-9z" fill="#558b85"/><path d="m4-8 39-4 1 3L5-4" fill="#fff4dc" stroke-width="1.2"/>
    <path d="m9-18 43 2-1 8-44-2z" fill="#ffcc5c"/><path d="m16-16 32 1v4l-33-1" fill="#fff4dc" stroke-width="1.2"/></g>`;
}

function campusPlant(x, y, size) {
  return `<g transform="translate(${x} ${y}) scale(${size})"><path d="M-3-15q-3-16-17-24-9 17 14 24m7-4q1-19 14-27 10 16-12 27" fill="#51876b"/>
    <path d="M0-10q-5-19 0-40 10 12 0 33m-1 8 10-19m-12 15-11-15" fill="#96b56e"/>
    <path d="m-16-11 5 24h23l5-24z" fill="#d57a5e"/><path d="M-18-13h37v6h-37z" fill="#f6a07d"/></g>`;
}

const campusRooms = {
  canteen: {
    wall:'#ffedbc', table:'#87bba4', front:'#43897e', actors:[42,72,1.03,450,78,.96],
    backdrop() { return `
      <path d="M0 91h480v95H0z" fill="#d4e9ce" stroke="none"/>
      <path d="M0 108h480M0 138h480M0 168h480M21 92v16m35-16v16m35-16v16m35-16v16m35-16v16m35-16v16m35-16v16m35-16v16m35-16v16m35-16v16m35-16v16m35-16v16" fill="none" stroke="#a2c3ac" />
      <path d="M24 6h135v57H24z" fill="#377978"/><path d="M30 12h123v45H30z" stroke="#e5edcb" fill="none" stroke-width="1.2"/>
      <text x="43" y="35" fill="#fff6d7" stroke="none" font-size="16" font-weight="600">今日套餐</text>
      <path d="M43 46h42m12 0h15m9 0h17" stroke="#d2e4c9" stroke-width="2"/>
      <path d="M193 3h269v84H193z" fill="#c1d9cc"/><path d="M201 9h253v70H201z" fill="#eff5de"/>
      <path d="M209 68h236v8H209z" fill="#699e91"/><path d="M227 60q1-12 22-13 13 0 18 13z" fill="#fbbd74"/>
      <path d="M224 61h47l-6 6h-36z" fill="#fff6d6"/><circle cx="247" cy="45" r="3" fill="#ed8a65"/>
      <path d="M287 47h46v19h-46z" fill="#90b5b2"/><path d="M284 46q3-8 26-8t27 8z" fill="#c5d7cf"/><path d="M309 37v-4h7v4m22 14h8m-69 0h8" fill="none"/>
      <path d="M375 11v24q9 9 0 15-9-6 0-15m21-24v18m-6 0h12v15h-12z" fill="#ead6a3"/>`; },
    foreground() { return `<path d="m-13 221 56-8 22 20-59 11z" fill="#ffedcd"/><path d="m-5 223 43-5 13 13-44 7z" fill="#dc8a69"/>
      <path d="m409 224 31-7m-27 13 31-7" stroke="#ffefbd" stroke-width="3"/>`; },
  },
  dorm: {
    wall:'#e8e2f3',table:'#f5c08b',front:'#c68b6a',actors:[23,80,1.02,445,83,.91],
    backdrop() { return `
      <path d="M0 25h190v94H0z" fill="#c7cee6"/><path d="M0 39q28-17 53 0t46-5 39 2 47 0v26H0z" fill="#a5afda"/>
      <path d="M0 59h201v11H0z" fill="#ecd4ab"/><path d="M10 22h7v140h-7zm171 0h8v132h-8z" fill="#a78165"/>
      <path d="M142 66v64m23-64v64m-23-50h23m-23 16h23m-23 17h23" fill="none" stroke="#806e68" stroke-width="4"/>
      <path d="M244 3h167v93H244z" fill="#fff1da"/><path d="M251 10h153v79H251z" fill="#9acfd8"/>
      <circle cx="365" cy="31" r="12" fill="#fff2b9" stroke="none"/><path d="m252 83 21-14 17 5 24-22 28 23 30-8 31 13v9H252z" fill="#a9c4a9" stroke="none"/>
      <path d="M325 9v80m-74-44h153" stroke="#fcf1da" stroke-width="5"/><path d="M223 0h36l-3 43-9 19-14 35h-12l10-54z" fill="#c1b8da"/>
      <path d="m231 52 17 4m-7-41-7 33" stroke="#897fa9" fill="none"/>
      ${campusPlant(438,111,.68)}`; },
    foreground() { return `${campusBooks(8,230,.83)}<path d="m406 231 27-9 10 2-30 9-9 1z" fill="#e46748"/>`; },
  },
  cafe: {
    wall:'#d6eadc',table:'#e9b993',front:'#c88b68',actors:[32,78,.99,453,76,1.00],
    backdrop() { return `
      <path d="M0-3h480v29H0z" fill="#fff1cf"/><path d="M0 20h480v12q-9 11-20 0-12 12-24 0-12 12-24 0-12 12-24 0-12 12-24 0-12 12-24 0-12 12-24 0-12 12-24 0-12 12-24 0-12 12-24 0-12 12-24 0-12 12-24 0-12 12-24 0-12 12-24 0-12 12-24 0-12 12-24 0-12 12-24 0-12 12-24 0-12 12-24 0-12 12-24 0-12 12-28 0z" fill="#ffc69c"/>
      <path d="M18-2h22l-2 23H15zm48 0h22l-2 23H63zm48 0h22l-1 23h-24zm48 0h22l-1 23h-24zm48 0h22v23h-25zm48 0h22l1 23h-25zm48 0h22l2 23h-25zm48 0h22l3 23h-25zm48 0h22l4 23h-25zm48 0h22l5 23h-25z" stroke="none" fill="#eb876f"/>
      <path d="M163 49h157v43H163z" fill="#236e66"/><path d="M168 54h147v33H168z" fill="none" stroke="#c5dfbc" stroke-width="1"/>
      <text x="241" y="76" text-anchor="middle" font-size="19" font-weight="600" stroke="none" fill="#fff7de">下课咖啡</text>
      <path d="M0 117h134v9H0z" fill="#ae826b"/><path d="M15 114V79q0-7 7-7h68q7 0 7 8v34z" fill="#e8876d"/>
      <path d="M23 81h65v12H23z" fill="#f7ba92"/><circle cx="33" cy="87" r="3" fill="#fff6d5"/><path d="M39 99h34v14H39z" fill="#334f4d"/><path d="M47 103h15v9H47z" fill="#fff5db"/>
      <path d="M349 89h113v6H349z" fill="#b38c75"/><path d="M361 66h18v23h-18zm25-5h22v28h-22zm30 10h16v18h-16z" fill="#f1c781"/>
      <path d="M360 67h20m5-5h24m5 10h20"/>`; },
    foreground() { return `<path d="m-6 216 66-1-13 31h-53z" fill="#f8dcb7"/><path d="m1 220 52-1m-54 7 51-1m-45-11-6 26m16-25-7 27m18-27-7 27" fill="none" stroke="#d0a584" stroke-width="1.4"/>
      <path d="m413 220 31-2 3 13-31 2z" fill="#fff3d3"/><path d="m418 224 19-1m-18 5 14-1" stroke="#967d69" stroke-width="1.4"/>`; },
  },
  market: {
    wall:'#d3ebed',table:'#fbd49d',front:'#d59868',actors:[37,79,.98,455,71,1.03],
    backdrop() { return `
      <path d="M0 82h480v67H0z" fill="#b3ceaa" stroke="none"/><path d="M233 85V52h51v33m46-1V43h54v42m29 0V40h34v43" fill="#f3dcbe" stroke="#a1b4ab" stroke-width="1.4"/>
      <path d="M242 60h8v9h-8zm13 0h8v9h-8zm83-6h8v9h-8zm15 0h8v9h-8zm68-4h9v9h-9z" fill="#9fbcc0" stroke="none"/>
      <path d="M23 19h181l27 35H0z" fill="#ffeece"/><path d="M44 19h24L57 54H26zm52 0h24l-1 35H85zm52 0h23l12 35h-32zm50 0h6l27 35h-19z" fill="#65998c" stroke="none"/>
      <path d="M0 54h232v11H0z" fill="#f7ce82"/><path d="M15 65h6v91h-6zm195 0h6v86h-6z" fill="#b88661"/>
      <path d="m55 70 79-2 1 25-78 2z" fill="#fff3d9"/><text x="96" y="87" text-anchor="middle" font-size="13" stroke="none" fill="#344944" font-weight="600">校园书摊</text>
      ${campusBunting()}${campusPlant(464,128,.9)}`; },
    foreground() { return `${campusBooks(3,231,1.02)}${campusBooks(406,221,.9)}`; },
  },
  desk: {
    wall:'#dce4f5',table:'#bdd7c9',front:'#83aea4',actors:[25,83,1.00,451,80,.97],
    backdrop() { return `
      <path d="M21-4h220v104H21z" fill="#e5ebd8"/><path d="M28 1h206v92H28z" fill="#a8cddd"/>
      <path d="M36 91V66h25V49h28v42m14 0V59h28V39h23v52m21 0V65h35v26" fill="#93b4c2" stroke="none"/>
      <path d="M31 31q15-14 25-3 8-12 22 1m78-15q8-8 15-2 6-9 16 0" fill="none" stroke="#f7efdb" stroke-width="3"/>
      <path d="M130 0v92M28 44h206" stroke="#f1efdd" stroke-width="5"/><path d="M15 101h231v7H15z" fill="#c9b5a1"/>
      <path d="M313 16h105v63H313z" fill="#a5acbd"/><path d="m323 25 32 3-4 35-32-3z" fill="#f9efd0"/><path d="m371 37 30-4 4 28-31 3z" fill="#f1b99c"/>
      <path d="m328 38 17 2m-17 7 13 2m49-1 13-1" fill="none" stroke="#9a927e" stroke-width="1.3"/>
      <circle cx="338" cy="28" r="2.6" fill="#cb6c61"/>${campusPlant(453,134,1.15)}`; },
    foreground() { return `<path d="m5 225 29-8 26 12-29 9z" fill="#fff3d5"/><path d="m19 226 16-4m-8 8 15-4" stroke="#b2a792" stroke-width="1.2"/>${campusBooks(411,228,.7)}`; },
  },
  library: {
    wall:'#f1dfd7',table:'#c5cef0',front:'#8e9cbc',actors:[33,78,1.04,445,84,.95],
    backdrop() { return `
      <path d="M-8 1h197v141H-8zm317 0h187v141H309z" fill="#bb927b"/>
      <path d="M-2 8h183v120H-2zm318 0h168v120H316z" fill="#ead5b7"/>
      ${[0, 323].map(offset => `<g transform="translate(${offset} 0)">
        <path d="M3 21h14v36H3zm40-7h12v43H43zm48 11h10v32H91zm42-10h13v42h-13z" fill="#819f99"/>
        <path d="M21 15h13v42H21zm42 13 9-3 13 30-9 3zm42-8h13v37h-13zm46 1h13v36h-13z" fill="#e29b80"/>
        <path d="M6 27h8m10-5h7m16 5h4m44 6h5m8-5h7m21-6h6" stroke="#fcf2d8" fill="none" stroke-width="2"/>
        <path d="M-3 58h183v7H-3z" fill="#b58e73"/><path d="M4 85h16v36H4zm36-7h12v43H40zm46-2h14v45H86zm33 3h10v42h-10z" fill="#96b1b0"/>
        <path d="M22 75h14v46H22zm34 10h15v36H56zm80-11 13-3 12 46-13 4z" fill="#eabb72"/></g>`).join('')}
      <path d="M219 57q17-11 34-3m-29 8 12 9 11-15" fill="none" stroke="#bda39a"/><circle cx="236" cy="54" r="22" fill="#bcd6cf"/>
      <path d="m222 41 10 3 4 9-6 5 2 9m13-27-3 12 9 6m-28 20q20 8 35-12m-18 17v8m-13 1h25" fill="none" stroke="#688c81" stroke-width="3"/>`; },
    foreground() { return `${campusBooks(5,227,.89)}<path d="m413 224 21-7 12 8-26 8z" fill="#fff2d5"/><path d="m419 224 12-4m-8 7 11-4" stroke="#a3978a" stroke-width="1.2"/>`; },
  },
};

// Each character faces the object in the middle of the counter. Mirroring the
// second figure lets the same four hand poses work on either side of the table.
function campusStudent(student, x, y, scale, action) {
  const man = student === 'man';
  const shirt = man ? '#3d948b' : '#ffc464';
  const hair = man ? '#9d5442' : '#34464e';
  const sleeve = man ? '#a8cfac' : '#fff0c0';
  const poses = {
    trade: ['M86 89q8 6 18 20l27-11 5 9-31 17q-6 3-11-2L74 104z', 'M129 98l10-6q6-2 4 2l-4 3 9-1q5 1 1 4l-8 5-7 2z'],
    point: ['M88 90q10 9 17 13l24-22 7 6-25 31q-5 6-12 2L76 104z', 'M128 84l7-10 12-4q5-1 3 2l-8 5 6 1q2 2-1 4l-11 7z'],
    read: ['M87 92l16 18 21-3 4 9-25 7q-5 2-10-3l-19-17z', 'M123 108l10-5q6-2 4 1l-3 3 9-1q5 0 2 4l-10 5-9 1z'],
    think: ['M88 92l13 12-9-24 9-3 15 34q2 6-5 9l-8 3q-5 1-9-3l-21-19z', 'M91 81l-10-5-1-5q1-4 4-1l3 3-2-9q-.8-5 2-3l8 9 6 9z'],
  };
  const [arm, hand] = poses[action];
  const backHair = man
    ? '<path d="M35 25q-15-12-22-3-8 8-4 22 2 9-2 14 15 1 23-13l4-10z" fill="'+hair+'"/><path d="m29 24 7 4-5 10-6-4z" fill="#efad57"/>'
    : '<path d="M33 26q-7-8 2-16 6-8 15-5 8-10 20-6 13-4 22 6 12 0 15 13 5 8 0 17l-9 14-53-7z" fill="'+hair+'"/>';
  const fringe = man
    ? '<path d="M32 43Q22 28 31 14 44-5 65-1 88-1 100 22 88 20 78 13q-7 18-20 20 2-6 1-10-6 12-14 16l-2 10-5 1z" fill="'+hair+'"/><path d="M35 19q7-10 17-13m15 3q9 2 14 8" fill="none" stroke="#c58063"/>'
    : '<path d="M32 44q-10-12-5-22 3-5 10-6 1-10 13-10 6-8 16-4 8-6 16 1 9-2 13 7 9 1 9 13-12 2-21-3-2 7-8 11l-3-10q-6 8-16 9l-5-4-4 18-8 5z" fill="'+hair+'"/><path d="M40 18q4-8 14-6m7-5 10 2m14 2 7 7" fill="none" stroke="#60727a"/>';
  return `<g transform="translate(${x} ${y}) scale(${man ? scale : -scale} ${scale})" stroke-width="2.2">
    ${backHair}
    <path d="M15 157l3-30q2-38 15-48l20-9 17 1 18 13q8 10 12 36l2 38z" fill="${shirt}"/>
    ${man ? '<path d="m25 100 10-17 10-7-3 25-13 29-10-1z" fill="#254e58"/><path d="m16 118 14 2-1 31H8q-3-18 8-33z" fill="#e89973"/><path d="m12 137 15 2" fill="none"/>'
    : '<path d="m41 79 14-6 16-1 12 9-22 21z" fill="#fff0bf"/><path d="m37 100 34 12m-37-3 43 15m-45-4 46 15m-48-5 46 16" stroke="#db865d" fill="none" stroke-width="3"/>'}
    <path d="m50 60-1 14q7 10 19 5l6-8-4-16z" fill="${campusSkin}"/>
    <path d="M34 39q-2-17 14-28 17-10 31-2 16 8 19 26l3 9 5 6q1 4-6 4-2 15-15 19-18 4-32-8-10-9-11-20z" fill="${campusSkin}"/>
    ${fringe}
    <path d="M47 43q-9-9-12-1-2 8 9 12" fill="${campusSkin}"/><path d="M38 44q2-3 5 2" fill="none" stroke="#b78067" stroke-width="1.5"/>
    <path d="m80 35 7-1m6 2 4 2" fill="none" stroke-width="1.8"/>
    <path d="m91 43 2 5-3 1" stroke="#a47462" stroke-width="1.2" fill="none"/>
    <ellipse cx="85" cy="42" rx="1.8" ry="2.7" fill="${campusInk}" stroke="none"/><ellipse cx="97" cy="43" rx="1.2" ry="2.3" fill="${campusInk}" stroke="none"/>
    ${man ? '<ellipse cx="74" cy="50" rx="6" ry="2.7" fill="#edaf96" stroke="none"/>'
      : '<path d="M68 38l11 3m-.5-2 11 1 .2 6q-1 4-6 4-6-.8-6-6zm12 3 4 .5m0-3 8 1v5q-1 4-5 3-3 0-4-4z" fill="none" stroke-width="1.6"/>'}
    <path d="${action === 'think' ? 'M83 59q4-2 8-1' : 'M81 58q6 5 12-1'}" fill="none" stroke-width="1.7"/>
    <path d="m49 74 8 9 14-6" fill="none"/><path d="${arm}" fill="${shirt}"/><path d="${hand}" fill="${campusSkin}"/>
    <path d="m78 88-6 14 9 8" fill="none" stroke="${sleeve}" stroke-width="2.3"/>
    <path d="m38 104-4 25 14 9-6 8-22-12q-4-3-3-8l4-24" fill="${shirt}"/>
    <path d="m46 137 10 4q6 3 2 5l-5-1 2 5q-2 2-6-1l-8-6z" fill="${campusSkin}"/>
    </g>`;
}

function campusPlacedSticker(key, x, y, size, angle) {
  return `<g class="campus-cutout" transform="rotate(${angle} ${x+size/2} ${y+size/2})"><use x="${x}" y="${y}" width="${size}" height="${size}" href="${campusSprite}${key}"/></g>`;
}

function campusFocusObject(key, action) {
  if (!key) return '';
  if (action === 'think') {
    return `<g fill="#fffaf0" stroke="${campusInk}" stroke-width="1.7"><circle cx="160" cy="135" r="3"/><ellipse cx="174" cy="127" rx="5" ry="4"/>
      <path d="M186 117q-11-12-1-23 3-19 21-19 12-13 28-7 21-8 31 8 19 1 21 18 12 13 1 25-1 20-20 21-12 10-28 4-19 7-31-5-19 0-22-22z"/></g>
      ${campusPlacedSticker(key,196,67,79,-4)}`;
  }
  if (action === 'read') {
    return `<g stroke="${campusInk}" stroke-width="1.8" stroke-linejoin="round">
      <path d="m172 177 54 1 15 6 14-8 42-5-11 52-43 7-23-5-55 1z" fill="#659487"/>
      <path d="M178 169q31-5 63 10 25-18 54-14l-14 48q-22-1-44 10-32-11-65-6z" fill="#fff3d6"/>
      <path d="m241 179-4 43m16-35 27-8m-27 15 23-7" fill="none" stroke="#baa681" stroke-width="1.5"/></g>
      ${campusPlacedSticker(key,191,132,94,-7)}`;
  }
  if (action === 'point') {
    return `<g stroke="${campusInk}" stroke-width="1.7" stroke-linejoin="round"><path d="m199 129 80-5 7 93-80 5z" fill="#fff6d8"/>
      <path d="m217 124 39-3 2 12-39 3z" fill="#e3bd7e"/><path d="m217 208 54-4" stroke="#b7a992" fill="none"/></g>
      ${campusPlacedSticker(key,196,131,87,-5)}`;
  }
  return campusPlacedSticker(key,185,133,100,-5);
}

function campusIllustration({ place = 'desk', props = [], detail = '', caption = '', action = 'read' } = {}) {
  if (!Object.hasOwn(campusRooms, place)) place = 'desk';
  if (!['read', 'point', 'trade', 'think'].includes(action)) action = 'read';
  const room = campusRooms[place];
  const keys = props.filter(key => Object.hasOwn(campusObjects, key)).slice(0, 3);
  const [x1,y1,scale1,x2,y2,scale2] = room.actors;
  const propNames = keys.map(key => campusObjects[key]).join('、');
  const alt = `小满和阿禾在${campusPlaces[place]}${propNames ? '，桌前摆着'+propNames : ''}。`;
  const companionPose = { read:'point', point:'read', trade:'trade', think:'point' }[action];
  return `<figure class="campus-illustration" data-place="${place}">
    <div class="campus-panel">
      <svg class="campus-drawing" viewBox="0 0 480 280" role="img" aria-label="${campusEscape(alt)}" focusable="false" xmlns="http://www.w3.org/2000/svg">
        <rect width="480" height="280" fill="${room.wall}"/>
        <g stroke="${campusInk}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">
          ${room.backdrop()}
          ${campusStudent('man',x1,y1,scale1,action)}
          ${campusStudent('he',x2,y2,scale2,companionPose)}
          <path d="M-5 212q122-6 258-4t232-1v77H-5z" fill="${room.front}"/>
          <path d="M-5 212q122-6 258-4t232-1v33q-160 6-288 3T-5 248z" fill="${room.table}"/>
          ${room.foreground()}
          <path d="M79 230q19-2 33-1m190 5 15-1m41-18 27-1" fill="none" stroke="${campusInk}" opacity=".25" stroke-width="1.5"/>
        </g>
        ${keys[1] ? campusPlacedSticker(keys[1],123,181,67,-11) : ''}
        ${keys[2] ? campusPlacedSticker(keys[2],289,177,61,9) : ''}
        ${campusFocusObject(keys[0],action)}
      </svg>
      ${detail ? `<span class="campus-detail">${campusEscape(detail)}</span>` : ''}
    </div>
    ${caption ? `<figcaption class="campus-caption">${campusEscape(caption)}</figcaption>` : ''}
  </figure>`;
}

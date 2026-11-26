const STORIES = [
  {
    title: '一百块能换来什么',
    label: '认识钱',
    practice: 'money',
    scenes: [
      {
        title: '午饭要不要加杯咖啡？',
        text: '周一中午，小满端着空餐盘，饭卡里刚好有 100 元。身后的室友阿禾指指价目牌：“套餐 15 元，咖啡 10 元。”帮小满点餐，看看明天还能用多少钱。',
        art: { place: 'canteen', action: 'trade', props: ['card', 'meal', 'coffee'], detail: '饭卡余额 ¥100', caption: '食堂窗口还有最后一份番茄炒蛋。' },
        choices: [
          { label: '拿一份套餐', feedback: '收银机响了一声，扣了 15 元。小满端走一份午饭，卡里还留着 85 元。', value: '饭卡还剩 ¥85', props: ['meal', 'card'] },
          { label: '套餐再加一杯咖啡', feedback: '托盘上多了杯咖啡，小票也多了一行。15 加 10 共花 25 元，卡里还剩 75 元。', value: '饭卡还剩 ¥75', props: ['coffee', 'meal', 'card'] },
        ],
        next: '翻出旧菜单',
      },
      {
        title: '两张菜单，一样的 100 元',
        text: '坐下来，阿禾翻出上学期的菜单照片：“那时套餐一份 15 元。”两人把旧价签盖上，试算每份涨到 18 元时，整整 100 元最多能买几份。',
        art: { place: 'canteen', action: 'point', props: ['tag', 'meal', 'calculator'], detail: '¥15 换成 ¥18', caption: '旧菜单的照片上，还印着上学期的日期。' },
        choices: [
          { label: '够买 5 份', feedback: '阿禾摆出五张餐票，共 90 元，剩下 10 元买不了第六份。从能吃六顿变成五顿，同一百元的购买力变小了。', value: '5 顿，还剩 ¥10', props: ['meal', 'ticket', 'coin'] },
          { label: '仍然够 6 份', feedback: '小满在第六张餐票旁写下 18 × 6＝108。差 8 元买不了第六份，最多只能拿走五份。', value: '第六顿差 ¥8', props: ['calculator', 'ticket', 'bill'] },
        ],
        next: '去明信片摊',
      },
      {
        title: '一张还没卖出去的明信片',
        text: '回宿舍路上，阿禾拿出自己画的校门明信片。“印一批还缺 100 元。卖得好，下学期分你 120 元；卖不动，可能只拿回 60 元。”小满想起下周还要吃饭。你会怎么接话？',
        art: { place: 'market', action: 'think', props: ['print', 'bill', 'calendar'], detail: '印刷费 ¥100', caption: '第一张试印样张背面，写着印厂的报价。' },
        choices: [
          { label: '先留足下周饭钱', feedback: '小满把饭卡塞回口袋。饭钱下周就要花，明信片却要下学期才回款。两笔钱赶不上同一顿饭。', value: '下周要用 ¥100', props: ['card', 'calendar', 'meal'] },
          { label: '问清成本、销量和结款时间', feedback: '阿禾翻到印厂报价那一页。卖出多少张能回本，多久能结款，决定了这 100 元要等多久、能拿回多少。', value: '下学期约 ¥60～120', props: ['notebook', 'print', 'clock'] },
          { label: '先把赚到的 20 元记进账本', feedback: '阿禾把还没卖出的那摞样张推过来。这次可能赚 20 元，也可能亏 40 元，小满把“收入”一栏先留空了。', value: '卖不动可能亏 ¥40', props: ['print', 'down', 'notebook'] },
        ],
        next: '路过下课咖啡',
      },
      {
        title: '一杯咖啡，还是一小份店？',
        text: '两人在校门口停下来。虚构的「下课咖啡」准备开分店，学姐拿出一张股东凭证：“如果出钱认一股，你就拥有这家店的一小部分。”小满看着正在冒热气的咖啡机，先问哪件事？',
        art: { place: 'cafe', action: 'point', props: ['ticket', 'coffee', 'notebook'], detail: '一股咖啡店', caption: '吧台上同时放着饮品价目表和认股说明。' },
        choices: [
          { label: '一杯能赚多少？客人少了会怎样？', feedback: '学姐掏出进货单。卖咖啡收的钱要先付豆子、工资和房租，剩下多少才关系到股东能分享什么。经营不顺，出的钱也可能亏掉。', value: '先算一杯的成本', props: ['coffee', 'receipt', 'calculator'] },
          { label: '明天这张凭证能卖多少钱？', feedback: '学姐摊开手：“明天谁愿意出多少，我也不知道。”小满先抄下房租和豆价，打算回来看这门生意。', value: '明天的出价未知', props: ['tag', 'coffee', 'book'] },
        ],
      },
    ],
  },
  {
    title: '留够下学期的钱',
    label: '算预算',
    practice: 'budget',
    scenes: [
      {
        title: '三个信封分 8,000 元',
        text: '周二晚，小满把存款写在宿舍白板上。阿禾拿来三个信封，第一个留 4,800 元付必要开支，第二个留 2,500 元应急。第三个信封能放多少？',
        art: { place: 'dorm', action: 'point', props: ['envelope', 'bill', 'notebook'], detail: '存款 ¥8,000', caption: '第一个信封里夹着房租、餐费和考试报名清单。' },
        choices: [
          { label: '放进去 700 元', feedback: '从 8,000 元里先拿走 4,800 元，再拿走 2,500 元。第三个信封里能放 700 元，这部分钱才暂时没有用途。', value: '第三封 ¥700', props: ['envelope', 'coin', 'calculator'] },
          { label: '放进去 3,200 元', feedback: '小满才放好第一个信封，阿禾把“应急”那只递过来。3,200 元还得再留 2,500 元，第三封只剩 700 元。', value: '还要留 ¥2,500', props: ['shield', 'envelope', 'bill'] },
        ],
        next: '试填一张订单',
      },
      {
        title: '订单还差 305 元',
        text: '阿禾打开模拟盘，把一只沪深主板普通 A 股的价格按每股 10 元算。普通买单一手是 100 股，这笔示例佣金还要 5 元。小满面前只有第三个信封里的 700 元。',
        art: { place: 'desk', action: 'think', props: ['receipt', 'coin', 'envelope'], detail: '每手 100 股', caption: '阿禾把空白买单放在应急信封旁边。' },
        choices: [
          { label: '把买 100 股的钱算清楚', feedback: '10 × 100＋5＝1,005 元。小满数完信封里的 700 元，发现还差 305 元。', value: '价款加费用 ¥1,005', props: ['calculator', 'receipt', 'coin'] },
          { label: '从应急信封借 305 元', feedback: '阿禾在信封上划掉 2,500，改成 2,195。这样够下单，可下一次急用钱，手边就少了 305 元。', value: '应急金剩 ¥2,195', props: ['envelope', 'bill', 'warning'] },
          { label: '收好信封，只用虚拟钱试', feedback: '小满没有拆信封，在模拟盘填了一手。这里能练挂单、成交和撤单，真实账户里的 700 元仍可随时用。', value: '实际投入 ¥0', props: ['laptop', 'envelope', 'shield'] },
        ],
        next: '接一通维修电话',
      },
      {
        title: '维修点来电，今天取机',
        text: '小满的电脑黑屏了，维修点报了 600 元，取机时付款。阿禾提议把两种安排各演一遍，从完整的 2,500 元应急金付，或把钱全放在股票里。',
        art: { place: 'dorm', action: 'trade', props: ['laptop', 'tool', 'receipt'], detail: '维修报价 ¥600', caption: '明早的作业还在那台电脑里。' },
        choices: [
          { label: '拆开应急信封，当天付款', feedback: '小满付了 600 元，电脑拿回来了，信封里还有 1,900 元。这笔钱一直能取用，修电脑不用看股价。', value: '应急金还剩 ¥1,900', props: ['tool', 'laptop', 'envelope'] },
          { label: '等卖出股票，再取钱维修', feedback: '阿禾翻翻日历。得等开市、卖单成交、资金可以转出。如果急着卖的时候股价跌了，拿回来的钱还会变少。', value: '取款时间待定', props: ['clock', 'chart', 'tool'] },
        ],
      },
    ],
  },
  {
    title: '下课咖啡怎么分钱',
    label: '理解股票',
    practice: 'ownership',
    scenes: [
      {
        title: '吧台上，两张很像的券',
        text: '周三，小满和阿禾回到下课咖啡。学姐在吧台上摊开一张咖啡券和一张股东凭证：“店里一共 10 万股。你们想先翻开哪张？”',
        art: { place: 'cafe', action: 'read', props: ['ticket', 'coffee', 'card'], detail: '总股数 10 万股', caption: '两张纸差不多大，一张可以当场兑饮品。' },
        choices: [
          { label: '翻开咖啡券', feedback: '小满交出券，换来一杯热咖啡。券上的承诺到这里就兑现了，店里今后赚多少钱，和这张券无关。', value: '咖啡券 → 一杯饮品', props: ['coffee', 'ticket'] },
          { label: '翻开股东凭证', feedback: '阿禾把自己的那一股圈出来。十万股里的这一股对应十万分之一股权，店的经营好坏会影响它的价值。', value: '股权占 1 / 100,000', props: ['ticket', 'notebook', 'coffee'] },
        ],
        next: '去柜台后翻账本',
      },
      {
        title: '年末的 12 万元怎么用？',
        text: '学姐拿出教学账本。全年卖饮品收进 100 万元，付过房租、工资、豆子、税和设备款，还剩 12 万元现金。假设公司具备分红条件，请你们替股东想想这笔钱的用处。',
        art: { place: 'cafe', action: 'think', props: ['notebook', 'bill', 'coffee'], detail: '剩余现金 ¥120,000', caption: '学姐用红笔圈出账本里的最后一行。' },
        choices: [
          { label: '拿一半分给股东', feedback: '用来分的 6 万元摊到 10 万股，每股分 0.60 元。小满数了数，店里还留着另外 6 万元。', value: '每股分 ¥0.60', props: ['coin', 'ticket', 'notebook'] },
          { label: '把钱留下，试着开新店', feedback: '阿禾把钱挪进“新店”一栏。这次股东收不到现金。新店赚钱可能提高股权价值，亏损也得由公司承担。', value: '本次分红 ¥0', props: ['seedling', 'coffee', 'bill'] },
          { label: '先还一笔快到期的债', feedback: '学姐取来借款合同。把到期款支付后，账上能分或能再投资的现金会相应减少。', value: '现金先用于还债', props: ['receipt', 'bank', 'calendar'] },
        ],
        next: '算一股的总回报',
      },
      {
        title: '收到了分红，钱袋却变轻了',
        text: '阿禾画了一个持股小实验。小满花 10 元买入一股，收到 0.60 元现金分红，最后以 9 元卖出。先忽略税费，把卖出的钱和分红都放回钱包，一共赚了还是亏了？',
        art: { place: 'desk', action: 'trade', props: ['wallet', 'ticket', 'coin'], detail: '买 ¥10，卖 ¥9', caption: '桌上有一张卖出回单，也有一张分红凭条。' },
        choices: [
          { label: '钱包里少了 0.40 元', feedback: '阿禾把卖出的 9 元和分红的 0.60 元合起来。一共收回 9.60 元，比起点的 10 元少 0.40 元。', value: '净亏 ¥0.40', props: ['wallet', 'down', 'coin'] },
          { label: '收到分红，赚了 0.60 元', feedback: '小满把被压住的卖出回单抽出来。股价少的 1 元，也要一起算进去。收到 9.60 元，实际亏 0.40 元。', value: '总共收回 ¥9.60', props: ['receipt', 'coin', 'calculator'] },
        ],
        next: '换两张买入价签',
      },
      {
        title: '两张价签，同一笔分红',
        text: '小满给同一股贴上 10 元和 20 元两张假设买价。阿禾给两边各放 0.60 元分红：“只看这一年的这笔分红，哪边占买价的比例更大？”',
        art: { place: 'cafe', action: 'point', props: ['tag', 'coin', 'scale'], detail: '每股都分 ¥0.60', caption: '一张分红凭条，分别放到两张买入小票旁边。' },
        choices: [
          { label: '10 元买入是 6%，20 元买入是 3%', feedback: '0.60 ÷ 10＝6%，0.60 ÷ 20＝3%。股息率要用分红除以买价。以后分多少、能卖多少钱，还会变化。', value: '两份股息率 6% / 3%', props: ['scale', 'coin', 'tag'] },
          { label: '同样分 0.60 元，两边比例一样', feedback: '阿禾让小满再看一眼分母。20 元那边付的钱是两倍，0.60 元只占它的 3%，10 元那边则是 6%。', value: '买价翻倍，比例减半', props: ['calculator', 'tag', 'coin'] },
        ],
      },
    ],
  },
  {
    title: '校园二手摊的出价',
    label: '看懂报价',
    practice: 'quote',
    scenes: [
      {
        title: '旧书摊上的四张价签',
        text: '周四午休，小满和阿禾逛旧书摊。同一本教材，两位买家举着 19 元和 20 元的牌子，卖家则贴着 22 元和 24 元。想让第一本书成交，该先看哪两张？',
        art: { place: 'market', action: 'point', props: ['books', 'tag', 'bill'], detail: '买 19 / 20　卖 22 / 24', caption: '同版的教材摞在一起，四个价钱都用铅笔写着。' },
        choices: [
          { label: '愿付 20 元的买家和肯收 22 元的卖家', feedback: '小满把这两张牌移到一起，还差 2 元。股票里，把当前最高的买价叫“买一”，最低的卖价叫“卖一”。', value: '买一 ¥20 / 卖一 ¥22', props: ['tag', 'book', 'scale'] },
          { label: '愿付 19 元的买家和要 24 元的卖家', feedback: '这两人差 5 元。阿禾又找出出价 20 元的人和要价 22 元的人，他们之间只差 2 元，更可能先谈拢。', value: '这两张相差 ¥5', props: ['calculator', 'tag', 'books'] },
        ],
        next: '在价签上写出价',
      },
      {
        title: '小满给教材留个价',
        text: '22 元的教材还摆在摊位上。阿禾递来一张空白价签：“写下你最多肯付的钱，我来当卖家。”你替小满填多少？',
        art: { place: 'market', action: 'trade', props: ['pencil', 'tag', 'book'], detail: '卖家要价 ¥22', caption: '卖家说，价钱合适的话，这本书现在就能拿走。' },
        choices: [
          { label: '最多愿付 21 元', feedback: '卖家摇摇头，小满的标签留在摊位上。可以等有人降到 21 元，也可以拿走标签，撤回出价。', value: '¥21，暂未成交', props: ['clock', 'tag', 'book'] },
          { label: '最多愿付 23 元', feedback: '卖家已经挂出 22 元的报价。小满付 22 元就能拿书，写下的 23 元是愿意接受的最高价。', value: '实际成交 ¥22', props: ['book', 'receipt', 'bill'] },
        ],
        next: '把书摊换成模拟盘',
      },
      {
        title: '把书摊的价签搬进模拟盘',
        text: '回到自习桌，阿禾打开下课咖啡的虚构行情。最新成交 10.01 元，买一 10.00 元，卖一 10.02 元。“假设卖一有足够的股数，你想怎么买 100 股？”',
        art: { place: 'desk', action: 'point', props: ['laptop', 'tag', 'receipt'], detail: '卖一 ¥10.02', caption: '屏幕中间的最新价，来自上一笔已经完成的交易。' },
        choices: [
          { label: '按 10.00 元挂单', feedback: '小满的价格还够不到卖一。买单先等待，等出现不高于 10.00 元的卖单，才有机会成交。', value: '¥10.00，等待卖家', props: ['clock', 'receipt', 'laptop'] },
          { label: '最多愿付 10.05 元', feedback: '在这个简化例子中，卖一的 100 股仍报 10.02 元，买单按 10.02 元成交。10.05 元只设定了上限。', value: '模拟成交 ¥10.02', props: ['receipt', 'check', 'coin'] },
        ],
        next: '看持仓里的两个数字',
      },
      {
        title: '持有 100 股，可卖却是 0',
        text: '阿禾给小满看另一笔已经成交的普通 A 股买单。当天下午，持仓栏写着 100 股，可卖栏写着 0 股。“这两行能同时成立吗？”小满翻开交易日历。',
        art: { place: 'desk', action: 'read', props: ['calendar', 'receipt', 'laptop'], detail: '持有 100 / 可卖 0', caption: '持仓栏和可卖栏，用的是同一个账户。' },
        choices: [
          { label: '在下一交易日再看可卖数量', feedback: '两行都对。这是普通 A 股的 T+1 卖出规则。如果周五买入，遇到周末，就等下一次开市。', value: '下一交易日才可卖', props: ['calendar', 'check', 'receipt'] },
          { label: '今天再按一次卖出', feedback: '屏幕仍显示可卖 0 股。今天新买的这一手已在持仓里，要到下一交易日才能卖。', value: '今天可卖 0 股', props: ['clock', 'phone', 'receipt'] },
        ],
      },
    ],
  },
  {
    title: '打开券商 App 的一天',
    label: '认识券商',
    practice: 'broker',
    scenes: [
      {
        title: '班群里那张“开户返现”的图',
        text: '周五早上，小满在班群看见一张二维码。发图的人说：“下我的 App，再扫我的收款码转钱，有返现。”阿禾把手指从转账键移开：“我们先核实谁在收钱。”',
        art: { place: 'dorm', action: 'think', props: ['phone', 'warning', 'card'], detail: '群聊里的收款码', caption: '二维码旁印着一个人的名字。' },
        choices: [
          { label: '去证监会查名录，再找券商官网', feedback: '小满核对持牌券商全称，从官网进入官方应用商店，再核对开发者。资金划转也应在官方渠道核验。', value: '核对官网与开发者', props: ['magnifier', 'shield', 'phone'] },
          { label: '先扫私人收款码试转 1 元', feedback: '阿禾指给小满看收款人。这笔钱会进私人账户。两人关掉页面，去查券商官方的本人银行卡银证转账流程。', value: '私人账户，停止转款', props: ['warning', 'card', 'shield'] },
        ],
        next: '看官方开户页',
      },
      {
        title: '开户页底下那行小字',
        text: '阿禾找到持牌券商的官网，和小满看官方 App 的开户说明。本人证件和支持的银行卡、身份核验、风险测评、协议都有各自的步骤。小满的手停在“阅读费用说明”上。',
        art: { place: 'library', action: 'read', props: ['phone', 'card', 'magnifier'], detail: '开户与交易收费', caption: '阿禾翻到协议里的收费表，小满暂时把银行卡收了起来。' },
        choices: [
          { label: '翻开收费表，看看一笔单花多少钱', feedback: '用模拟例子算，1,000 元一笔、最低佣金 5 元，光佣金就占 0.5%。再看卖出税费等项目，真实收费以券商公示为准。', value: '¥5 ÷ ¥1,000＝0.5%', props: ['calculator', 'receipt', 'magnifier'] },
          { label: '先把开户页收起来，继续用模拟盘', feedback: '小满把开户说明收藏起来。等日后确认需要并了解风险，再按券商要求办理，现在用虚拟资金也能练。', value: '今天继续用虚拟资金', props: ['laptop', 'notebook', 'shield'] },
        ],
        next: '在行情里找一家公司',
      },
      {
        title: '搜索结果里有两个相似的名字',
        text: '小满回到模拟盘，练习正式 App 里的路径。阿禾递来写有公司名字、市场和代码的便签。搜索结果看起来很像，你会怎样替小满选对证券？',
        art: { place: 'desk', action: 'point', props: ['phone', 'notebook', 'magnifier'], detail: '下课咖啡 SIM001', caption: 'SIM001 是这门课给虚构公司编的练习代码。' },
        choices: [
          { label: '让市场和代码都对上，再进买入页', feedback: '小满先对清市场和证券代码，再检查买入页的限价、股数、预计费用和可用资金。确认前还能返回核对。', value: '核对市场、代码和订单', props: ['magnifier', 'receipt', 'check'] },
          { label: '点名字排在前面的那一家', feedback: '阿禾把便签放到结果旁，一个字很像，两串代码却不同。两人对上市场和代码，再继续操作。', value: '同名近似，代码不同', props: ['tag', 'magnifier', 'phone'] },
        ],
        next: '找回刚刚的委托',
      },
      {
        title: '叮一声之后，订单去哪了？',
        text: '小满按下模拟委托的提交键，手机叮了一声。“已经买到了吗？”阿禾想知道实际成交几股、什么价，还有几股在排队。你带他们去哪里找？',
        art: { place: 'desk', action: 'read', props: ['phone', 'receipt', 'notebook'], detail: '已报：委托已提交', caption: '两人准备把真正发生的那笔成交抄进周记。' },
        choices: [
          { label: '先看当日委托，再翻当日成交', feedback: '小满在委托页看到剩余数量，成交页看到实际价格和股数，最后去持仓页核对可卖数量。未成交的部分可按规则撤单。', value: '委托 → 成交 → 持仓', props: ['receipt', 'notebook', 'check'] },
          { label: '回行情页，照抄最新价', feedback: '行情上的数字是市场最近一笔交易。小满要写自己的周记，还得翻“当日成交”看自己那笔实际价格与数量。', value: '查自己的成交回报', props: ['magnifier', 'receipt', 'phone'] },
        ],
      },
    ],
  },
];

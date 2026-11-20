// Load Inter fonts
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Medium" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Bold" });

const page = figma.currentPage;

// 1. Color Palette: Warm Coffee, Espresso & Soft Latte
const C = {
  bgCanvas: { r: 247/255, g: 244/255, b: 238/255 },     // #F7F4EE Warm Latte Foam
  cardBg: { r: 1, g: 1, b: 1 },                         // #FFFFFF Pure White
  cardBorder: { r: 232/255, g: 226/255, b: 218/255 },   // #E8E2DA Toasted Oat
  cardBorderHover: { r: 210/255, g: 200/255, b: 190/255 },
  subtleCardBg: { r: 252/255, g: 250/255, b: 247/255 }, // #FCFAF7
  
  // Espresso Dark Roast (Top bar & Sidebars)
  espressoDark: { r: 35/255, g: 28/255, b: 24/255 },    // #231C18 Deep Roasted Coffee
  espressoSidebar: { r: 43/255, g: 35/255, b: 30/255 }, // #2B231E Espresso
  espressoActive: { r: 59/255, g: 48/255, b: 42/255 },  // #3B302A
  
  // Caramel / Warm Roasted Accents
  caramel: { r: 194/255, g: 125/255, b: 66/255 },       // #C27D42 Warm Caramel
  caramelLight: { r: 251/255, g: 242/255, b: 233/255 }, // #FBF2E9
  caramelDark: { r: 156/255, g: 94/255, b: 44/255 },    // #9C5E2C
  
  // Text Colors
  textDark: { r: 38/255, g: 31/255, b: 27/255 },        // #261F1B Espresso Black
  textMuted: { r: 115/255, g: 102/255, b: 94/255 },     // #73665E Warm Mocha Taupe
  textLight: { r: 168/255, g: 154/255, b: 144/255 },    // #A89A90 Warm Gray
  textOnDark: { r: 247/255, g: 244/255, b: 238/255 },
  textOnDarkMuted: { r: 180/255, g: 170/255, b: 162/255 },

  // Buttons
  btnPrimaryBg: { r: 43/255, g: 35/255, b: 30/255 },    // #2B231E
  btnPrimaryHover: { r: 59/255, g: 48/255, b: 42/255 },
  btnCaramelBg: { r: 194/255, g: 125/255, b: 66/255 },  // #C27D42
  
  // Statuses
  pendingBg: { r: 254/255, g: 243/255, b: 226/255 },    // #FEF3E2 Warm Amber Latte
  pendingText: { r: 166/255, g: 90/255, b: 24/255 },    // #A65A18
  pendingBorder: { r: 245/255, g: 214/255, b: 178/255 },
  
  acceptedBg: { r: 234/255, g: 242/255, b: 249/255 },   // #EAF2F9 Steel Cold Brew
  acceptedText: { r: 37/255, g: 99/255, b: 153/255 },   // #256399
  acceptedBorder: { r: 200/255, g: 221/255, b: 239/255 },
  
  doneBg: { r: 235/255, g: 245/255, b: 238/255 },       // #EBF5EE Warm Sage Herb
  doneText: { r: 39/255, g: 110/255, b: 68/255 },       // #276E44
  doneBorder: { r: 198/255, g: 228/255, b: 207/255 },
  
  alertBg: { r: 254/255, g: 238/255, b: 235/255 },      // #FEEFEB Terracotta
  alertText: { r: 194/255, g: 54/255, b: 36/255 },      // #C23624
  alertBorder: { r: 248/255, g: 196/255, b: 188/255 }
};

function fill(c, opacity = 1) {
  return [{ type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity }];
}

function stroke(c, weight = 1) {
  return { strokes: fill(c), strokeWeight: weight };
}

function createText(text, fontSize = 14, style = 'Regular', color = C.textDark) {
  const t = figma.createText();
  t.fontName = { family: 'Inter', style };
  t.fontSize = fontSize;
  t.characters = String(text);
  t.fills = fill(color);
  return t;
}

function createBadge(text, bgCol, textCol, borderCol) {
  const b = figma.createFrame();
  b.layoutMode = 'HORIZONTAL';
  b.primaryAxisSizingMode = 'AUTO';
  b.counterAxisSizingMode = 'AUTO';
  b.paddingLeft = 10;
  b.paddingRight = 10;
  b.paddingTop = 4;
  b.paddingBottom = 4;
  b.cornerRadius = 12;
  b.fills = fill(bgCol);
  if (borderCol) {
    b.strokes = fill(borderCol);
    b.strokeWeight = 1;
  }
  const t = createText(text, 11, 'Semi Bold', textCol);
  b.appendChild(t);
  return b;
}

function createButton(text, bgCol, textCol, height = 40, borderCol = null) {
  const btn = figma.createFrame();
  btn.layoutMode = 'HORIZONTAL';
  btn.primaryAxisAlignItems = 'CENTER';
  btn.counterAxisAlignItems = 'CENTER';
  btn.paddingLeft = 18;
  btn.paddingRight = 18;
  btn.resize(180, height);
  btn.primaryAxisSizingMode = 'AUTO';
  btn.counterAxisSizingMode = 'FIXED';
  btn.cornerRadius = 8;
  btn.fills = bgCol ? fill(bgCol) : [];
  if (borderCol) {
    btn.strokes = fill(borderCol);
    btn.strokeWeight = 1;
  }
  const t = createText(text, 13, 'Semi Bold', textCol);
  btn.appendChild(t);
  return btn;
}

function createTopHeader(activeTabTitle = 'Общая диспетчерская') {
  const header = figma.createFrame();
  header.name = 'Top Header';
  header.resize(1440, 56);
  header.fills = fill(C.espressoDark);
  header.layoutMode = 'HORIZONTAL';
  header.counterAxisAlignItems = 'CENTER';
  header.paddingLeft = 24;
  header.paddingRight = 24;
  header.itemSpacing = 20;

  // Brand
  const brand = figma.createFrame();
  brand.layoutMode = 'HORIZONTAL';
  brand.counterAxisAlignItems = 'CENTER';
  brand.itemSpacing = 10;
  brand.fills = [];
  const logoText = createText('ШИФР-СВЯЗЬ', 16, 'Bold', C.textOnDark);
  brand.appendChild(logoText);
  
  const offlineBadge = createBadge('● 100% OFF-LINE (LAN)', C.caramelDark, C.textOnDark);
  brand.appendChild(offlineBadge);
  header.appendChild(brand);

  // Center Info: Station and dispatch route
  const centerBox = figma.createFrame();
  centerBox.layoutMode = 'HORIZONTAL';
  centerBox.counterAxisAlignItems = 'CENTER';
  centerBox.itemSpacing = 8;
  centerBox.fills = [];
  centerBox.layoutGrow = 1;
  centerBox.primaryAxisAlignItems = 'CENTER';
  
  const stationText = createText('Участок: ст. Москва-Павелецкая — ст. Домодедово (Пульт №2)', 13, 'Medium', C.textOnDarkMuted);
  centerBox.appendChild(stationText);
  header.appendChild(centerBox);

  // Right Side: Shift alert & User Profile
  const rightBox = figma.createFrame();
  rightBox.layoutMode = 'HORIZONTAL';
  rightBox.counterAxisAlignItems = 'CENTER';
  rightBox.itemSpacing = 16;
  rightBox.fills = [];

  const alertLink = createBadge('⚠️ Передача смены: 1 задача ждёт', C.pendingBg, C.pendingText, C.pendingBorder);
  rightBox.appendChild(alertLink);

  const userBox = figma.createFrame();
  userBox.layoutMode = 'HORIZONTAL';
  userBox.counterAxisAlignItems = 'CENTER';
  userBox.itemSpacing = 8;
  userBox.fills = [];

  const avatar = figma.createFrame();
  avatar.resize(32, 32);
  avatar.cornerRadius = 16;
  avatar.fills = fill(C.caramel);
  avatar.layoutMode = 'HORIZONTAL';
  avatar.primaryAxisAlignItems = 'CENTER';
  avatar.counterAxisAlignItems = 'CENTER';
  const avText = createText('МА', 12, 'Bold', C.textOnDark);
  avatar.appendChild(avText);
  userBox.appendChild(avatar);

  const uName = createText('Москаленко М.Д. (Смена А)', 13, 'Medium', C.textOnDark);
  userBox.appendChild(uName);
  rightBox.appendChild(userBox);

  header.appendChild(rightBox);
  return header;
}

function createLeftNav() {
  const nav = figma.createFrame();
  nav.name = 'Navigation Bar';
  nav.resize(64, 844);
  nav.fills = fill(C.espressoDark);
  nav.layoutMode = 'VERTICAL';
  nav.counterAxisAlignItems = 'CENTER';
  nav.paddingTop = 20;
  nav.itemSpacing = 24;

  const items = [
    { label: 'Чат', icon: '💬', active: true },
    { label: 'Смена', icon: '📋', active: false, badge: '1' },
    { label: 'Карта', icon: '🚆', active: false },
    { label: 'Тревоги', icon: '⚠️', active: false },
    { label: 'Журнал', icon: '📑', active: false }
  ];

  for (const it of items) {
    const btn = figma.createFrame();
    btn.resize(44, 44);
    btn.cornerRadius = 10;
    btn.fills = it.active ? fill(C.caramel) : fill(C.espressoSidebar);
    btn.layoutMode = 'HORIZONTAL';
    btn.primaryAxisAlignItems = 'CENTER';
    btn.counterAxisAlignItems = 'CENTER';
    const ic = createText(it.icon, 18, 'Regular', C.textOnDark);
    btn.appendChild(ic);
    nav.appendChild(btn);
  }
  return nav;
}

function createChannelsSidebar() {
  const bar = figma.createFrame();
  bar.name = 'Channels Sidebar';
  bar.resize(260, 844);
  bar.fills = fill(C.espressoSidebar);
  bar.layoutMode = 'VERTICAL';
  bar.paddingLeft = 16;
  bar.paddingRight = 16;
  bar.paddingTop = 20;
  bar.itemSpacing = 20;

  // Search input
  const search = figma.createFrame();
  search.resize(228, 36);
  search.cornerRadius = 8;
  search.fills = fill(C.espressoDark);
  search.layoutMode = 'HORIZONTAL';
  search.counterAxisAlignItems = 'CENTER';
  search.paddingLeft = 12;
  const sText = createText('🔍 Поиск по каналам...', 12, 'Regular', C.textOnDarkMuted);
  search.appendChild(sText);
  bar.appendChild(search);

  // Section 1: Work Channels
  const sec1 = figma.createFrame();
  sec1.layoutMode = 'VERTICAL';
  sec1.itemSpacing = 6;
  sec1.fills = [];
  const h1 = createText('РАБОЧИЕ КАНАЛЫ (LAN)', 11, 'Semi Bold', C.caramel);
  sec1.appendChild(h1);

  const channels = [
    { name: '# общая-диспетчерская', active: true, unread: 0 },
    { name: '# аварии-инциденты', active: false, unread: 2, isAlert: true },
    { name: '# перегон-бирюлево', active: false, unread: 0 },
    { name: '# график-движения-мск', active: false, unread: 0 }
  ];

  for (const ch of channels) {
    const chRow = figma.createFrame();
    chRow.resize(228, 36);
    chRow.cornerRadius = 8;
    chRow.fills = ch.active ? fill(C.espressoActive) : [];
    chRow.layoutMode = 'HORIZONTAL';
    chRow.counterAxisAlignItems = 'CENTER';
    chRow.paddingLeft = 10;
    chRow.paddingRight = 10;
    chRow.itemSpacing = 8;

    const t = createText(ch.name, 13, ch.active ? 'Semi Bold' : 'Regular', ch.active ? C.textOnDark : C.textOnDarkMuted);
    t.layoutGrow = 1;
    chRow.appendChild(t);

    if (ch.unread > 0) {
      const b = createBadge(String(ch.unread), ch.isAlert ? C.alertBg : C.caramel, ch.isAlert ? C.alertText : C.textOnDark);
      chRow.appendChild(b);
    }
    sec1.appendChild(chRow);
  }
  bar.appendChild(sec1);

  // Section 2: Direct shift contacts
  const sec2 = figma.createFrame();
  sec2.layoutMode = 'VERTICAL';
  sec2.itemSpacing = 6;
  sec2.fills = [];
  const h2 = createText('СВЯЗЬ СО СМЕНАМИ', 11, 'Semi Bold', C.caramel);
  sec2.appendChild(h2);

  const contacts = [
    { name: '@ Интулов А.А. (Смена Б)', status: '🟢 на дежурстве' },
    { name: '@ Дежурный ст. Коломенское', status: '🟢 на посту' },
    { name: '@ Дежурный ст. Расторгуево', status: '⚪ офлайн' },
    { name: '@ Администратор ИБ', status: '🟢 в сети' }
  ];

  for (const ct of contacts) {
    const ctRow = figma.createFrame();
    ctRow.resize(228, 34);
    ctRow.cornerRadius = 6;
    ctRow.fills = [];
    ctRow.layoutMode = 'VERTICAL';
    ctRow.itemSpacing = 2;
    ctRow.paddingLeft = 10;

    const t = createText(ct.name, 12, 'Medium', C.textOnDark);
    const st = createText(ct.status, 10, 'Regular', C.textOnDarkMuted);
    ctRow.appendChild(t);
    ctRow.appendChild(st);
    sec2.appendChild(ctRow);
  }
  bar.appendChild(sec2);

  return bar;
}

const createdFrames = [];

// ==========================================
// SCREEN 1: 01_Авторизация в закрытом контуре
// ==========================================
{
  const screen1 = figma.createFrame();
  screen1.name = '01 — Авторизация в закрытом контуре';
  screen1.resize(1440, 900);
  screen1.x = 0;
  screen1.y = 0;
  screen1.fills = fill(C.bgCanvas);
  page.appendChild(screen1);
  createdFrames.push(screen1.id);

  // Decorative network indicator header
  const topBar = figma.createFrame();
  topBar.resize(1440, 48);
  topBar.fills = fill(C.espressoDark);
  topBar.layoutMode = 'HORIZONTAL';
  topBar.primaryAxisAlignItems = 'CENTER';
  topBar.counterAxisAlignItems = 'CENTER';
  topBar.itemSpacing = 16;
  const netLabel = createText('🔒 ЗАЩИЩЕННЫЙ КОНТУР • ООО «ЖЕЛДОРЦТИ» • ВНЕШНИЙ ИНТЕРНЕТ: ОТКЛЮЧЕН • SELF-HOSTED 192.168.10.15', 12, 'Semi Bold', C.caramelLight);
  topBar.appendChild(netLabel);
  screen1.appendChild(topBar);

  // Centered Login Card
  const card = figma.createFrame();
  card.name = 'Login Card';
  card.resize(480, 600);
  card.x = (1440 - 480) / 2;
  card.y = 120;
  card.cornerRadius = 16;
  card.fills = fill(C.cardBg);
  card.strokes = fill(C.cardBorder);
  card.strokeWeight = 1;
  card.layoutMode = 'VERTICAL';
  card.paddingLeft = 40;
  card.paddingRight = 40;
  card.paddingTop = 40;
  card.paddingBottom = 40;
  card.itemSpacing = 20;

  // Logo + Title
  const brandRow = figma.createFrame();
  brandRow.layoutMode = 'HORIZONTAL';
  brandRow.counterAxisAlignItems = 'CENTER';
  brandRow.itemSpacing = 12;
  brandRow.fills = [];
  
  const logoBadge = figma.createFrame();
  logoBadge.resize(44, 44);
  logoBadge.cornerRadius = 10;
  logoBadge.fills = fill(C.caramel);
  logoBadge.layoutMode = 'HORIZONTAL';
  logoBadge.primaryAxisAlignItems = 'CENTER';
  logoBadge.counterAxisAlignItems = 'CENTER';
  const logoIco = createText('🚆', 22);
  logoBadge.appendChild(logoIco);
  brandRow.appendChild(logoBadge);

  const titleCol = figma.createFrame();
  titleCol.layoutMode = 'VERTICAL';
  titleCol.itemSpacing = 2;
  titleCol.fills = [];
  titleCol.appendChild(createText('ШИФР-СВЯЗЬ', 22, 'Bold', C.textDark));
  titleCol.appendChild(createText('Защищенный мессенджер диспетчеров', 12, 'Regular', C.textMuted));
  brandRow.appendChild(titleCol);
  card.appendChild(brandRow);

  // Shift selection segmented control
  const segLabel = createText('Выберите рабочую смену:', 12, 'Semi Bold', C.textMuted);
  card.appendChild(segLabel);

  const segBox = figma.createFrame();
  segBox.resize(400, 42);
  segBox.cornerRadius = 8;
  segBox.fills = fill(C.subtleCardBg);
  segBox.strokes = fill(C.cardBorder);
  segBox.strokeWeight = 1;
  segBox.layoutMode = 'HORIZONTAL';
  segBox.paddingLeft = 4;
  segBox.paddingRight = 4;
  segBox.paddingTop = 4;
  segBox.paddingBottom = 4;
  segBox.itemSpacing = 4;

  const seg1 = figma.createFrame();
  seg1.resize(194, 34);
  seg1.cornerRadius = 6;
  seg1.fills = fill(C.btnPrimaryBg);
  seg1.layoutMode = 'HORIZONTAL';
  seg1.primaryAxisAlignItems = 'CENTER';
  seg1.counterAxisAlignItems = 'CENTER';
  seg1.appendChild(createText('Смена А (Москаленко)', 12, 'Semi Bold', C.textOnDark));
  segBox.appendChild(seg1);

  const seg2 = figma.createFrame();
  seg2.resize(194, 34);
  seg2.cornerRadius = 6;
  seg2.fills = [];
  seg2.layoutMode = 'HORIZONTAL';
  seg2.primaryAxisAlignItems = 'CENTER';
  seg2.counterAxisAlignItems = 'CENTER';
  seg2.appendChild(createText('Смена Б (Интулов)', 12, 'Medium', C.textMuted));
  segBox.appendChild(seg2);
  card.appendChild(segBox);

  // Form Fields
  function makeFormField(labelText, valText) {
    const f = figma.createFrame();
    f.layoutMode = 'VERTICAL';
    f.itemSpacing = 6;
    f.fills = [];
    f.resize(400, 64);
    f.primaryAxisSizingMode = 'AUTO';
    f.appendChild(createText(labelText, 12, 'Semi Bold', C.textDark));
    
    const inp = figma.createFrame();
    inp.resize(400, 42);
    inp.cornerRadius = 8;
    inp.fills = fill(C.subtleCardBg);
    inp.strokes = fill(C.cardBorder);
    inp.strokeWeight = 1;
    inp.layoutMode = 'HORIZONTAL';
    inp.counterAxisAlignItems = 'CENTER';
    inp.paddingLeft = 14;
    inp.appendChild(createText(valText, 13, 'Regular', C.textDark));
    f.appendChild(inp);
    return f;
  }

  card.appendChild(makeFormField('Учетная запись диспетчера', 'dispatcher-01 (Москаленко М.Д.)'));
  card.appendChild(makeFormField('Пароль / Токен закрытого контура', '••••••••••••••••'));

  // Enter button
  const enterBtn = figma.createFrame();
  enterBtn.resize(400, 48);
  enterBtn.cornerRadius = 8;
  enterBtn.fills = fill(C.btnPrimaryBg);
  enterBtn.layoutMode = 'HORIZONTAL';
  enterBtn.primaryAxisAlignItems = 'CENTER';
  enterBtn.counterAxisAlignItems = 'CENTER';
  enterBtn.appendChild(createText('Войти на рабочий пульт', 14, 'Semi Bold', C.textOnDark));
  card.appendChild(enterBtn);

  // Compliance note
  const compNote = createText('✓ Локальное шифрование TLS 1.3 • База данных PostgreSQL On-Premise\n✓ Полное соответствие требованиям ИБ ООО «ЖелдорЦТИ»', 11, 'Regular', C.textMuted);
  card.appendChild(compNote);

  screen1.appendChild(card);
}

// ==========================================
// SCREEN 2: 02_Главная диспетчерская (Чат)
// ==========================================
{
  const screen2 = figma.createFrame();
  screen2.name = '02 — Главная диспетчерская (Рабочий чат)';
  screen2.resize(1440, 900);
  screen2.x = 1540;
  screen2.y = 0;
  screen2.fills = fill(C.bgCanvas);
  page.appendChild(screen2);
  createdFrames.push(screen2.id);

  // Top header
  screen2.appendChild(createTopHeader('Общая диспетчерская'));

  // Workspace row
  const ws = figma.createFrame();
  ws.resize(1440, 844);
  ws.y = 56;
  ws.fills = [];
  ws.layoutMode = 'HORIZONTAL';

  // Left Nav + Channels
  ws.appendChild(createLeftNav());
  ws.appendChild(createChannelsSidebar());

  // Main Chat Feed
  const chatArea = figma.createFrame();
  chatArea.name = 'Chat Area';
  chatArea.resize(1116, 844);
  chatArea.fills = fill(C.bgCanvas);
  chatArea.layoutMode = 'VERTICAL';

  // Chat Header Bar
  const chatHead = figma.createFrame();
  chatHead.resize(1116, 64);
  chatHead.fills = fill(C.cardBg);
  chatHead.strokes = fill(C.cardBorder);
  chatHead.strokeWeight = 1;
  chatHead.layoutMode = 'HORIZONTAL';
  chatHead.counterAxisAlignItems = 'CENTER';
  chatHead.paddingLeft = 24;
  chatHead.paddingRight = 24;
  chatHead.itemSpacing = 16;

  const chTitleCol = figma.createFrame();
  chTitleCol.layoutMode = 'VERTICAL';
  chTitleCol.itemSpacing = 2;
  chTitleCol.fills = [];
  chTitleCol.layoutGrow = 1;
  chTitleCol.appendChild(createText('# общая-диспетчерская', 16, 'Bold', C.textDark));
  chTitleCol.appendChild(createText('Оперативная координация движения • Локальный протокол №21-LAN', 12, 'Regular', C.textMuted));
  chatHead.appendChild(chTitleCol);

  const shiftBtn = createButton('📋 Передача смены', C.caramel, C.textOnDark, 38);
  chatHead.appendChild(shiftBtn);
  chatArea.appendChild(chatHead);

  // Pinned Warning Banner
  const alertBanner = figma.createFrame();
  alertBanner.resize(1116, 44);
  alertBanner.fills = fill(C.pendingBg);
  alertBanner.strokes = fill(C.pendingBorder);
  alertBanner.strokeWeight = 1;
  alertBanner.layoutMode = 'HORIZONTAL';
  alertBanner.counterAxisAlignItems = 'CENTER';
  alertBanner.paddingLeft = 24;
  alertBanner.paddingRight = 24;
  alertBanner.itemSpacing = 12;
  const alertTxt = createText('⏳ Внимание: до конца дежурства Смены А осталось 25 мин. Открыта карточка «Уточнить готовность участка №4» для передачи Смене Б.', 12, 'Semi Bold', C.pendingText);
  alertBanner.appendChild(alertTxt);
  chatArea.appendChild(alertBanner);

  // Messages Scroll Area
  const msgList = figma.createFrame();
  msgList.name = 'Message List';
  msgList.resize(1116, 660);
  msgList.layoutGrow = 1;
  msgList.fills = fill(C.bgCanvas);
  msgList.layoutMode = 'VERTICAL';
  msgList.paddingLeft = 32;
  msgList.paddingRight = 32;
  msgList.paddingTop = 24;
  msgList.paddingBottom = 24;
  msgList.itemSpacing = 18;

  function makeMessage(sender, time, text, isOutgoing = false, tagText = null) {
    const row = figma.createFrame();
    row.resize(1052, 70);
    row.primaryAxisSizingMode = 'AUTO';
    row.counterAxisSizingMode = 'AUTO';
    row.fills = [];
    row.layoutMode = 'HORIZONTAL';
    row.itemSpacing = 12;
    if (isOutgoing) {
      row.primaryAxisAlignItems = 'MAX';
    }

    const bubble = figma.createFrame();
    bubble.primaryAxisSizingMode = 'AUTO';
    bubble.counterAxisSizingMode = 'AUTO';
    bubble.paddingLeft = 16;
    bubble.paddingRight = 16;
    bubble.paddingTop = 12;
    bubble.paddingBottom = 12;
    bubble.cornerRadius = 12;
    bubble.layoutMode = 'VERTICAL';
    bubble.itemSpacing = 6;
    bubble.fills = isOutgoing ? fill(C.caramelLight) : fill(C.cardBg);
    bubble.strokes = fill(isOutgoing ? C.caramelDark : C.cardBorder);
    bubble.strokeWeight = 1;

    const head = figma.createFrame();
    head.layoutMode = 'HORIZONTAL';
    head.counterAxisAlignItems = 'CENTER';
    head.itemSpacing = 8;
    head.fills = [];
    head.appendChild(createText(sender, 12, 'Bold', isOutgoing ? C.caramelDark : C.textDark));
    head.appendChild(createText(time, 11, 'Regular', C.textMuted));
    if (tagText) {
      head.appendChild(createBadge(tagText, C.pendingBg, C.pendingText));
    }
    bubble.appendChild(head);

    const body = createText(text, 13, 'Regular', C.textDark);
    bubble.appendChild(body);

    row.appendChild(bubble);
    return row;
  }

  msgList.appendChild(makeMessage('Дежурный ст. Расторгуево (Сидоров В.Н.)', '08:45', 'Поезд №123 (грузовой состав) задерживается на 14 минут из-за путевых работ на 3-м стрелочном переводе.', false, 'Задержка: +14 мин'));
  msgList.appendChild(makeMessage('Диспетчер Москаленко М.Д. (Смена А)', '08:48', 'Принято. Внесли корректировку в график движения, путь №2 на станции Коломенское держим свободным.', true));
  msgList.appendChild(makeMessage('Диспетчер Интулов А.А. (Смена Б)', '09:12', 'Смена Б прибыла на дежурство в полном составе. Готовы принять оперативную обстановку по участку.', false));
  msgList.appendChild(makeMessage('Диспетчер Москаленко М.Д. (Смена А)', '09:16', 'Отлично. Сформировал карточку передачи по участку №4 в модуле смены. Проверь и подтверди приём.', true));

  chatArea.appendChild(msgList);

  // Input bar
  const inputBar = figma.createFrame();
  inputBar.resize(1116, 76);
  inputBar.fills = fill(C.cardBg);
  inputBar.strokes = fill(C.cardBorder);
  inputBar.strokeWeight = 1;
  inputBar.layoutMode = 'HORIZONTAL';
  inputBar.counterAxisAlignItems = 'CENTER';
  inputBar.paddingLeft = 24;
  inputBar.paddingRight = 24;
  inputBar.itemSpacing = 16;

  const inpField = figma.createFrame();
  inpField.layoutGrow = 1;
  inpField.resize(920, 44);
  inpField.cornerRadius = 8;
  inpField.fills = fill(C.subtleCardBg);
  inpField.strokes = fill(C.cardBorder);
  inpField.strokeWeight = 1;
  inpField.layoutMode = 'HORIZONTAL';
  inpField.counterAxisAlignItems = 'CENTER';
  inpField.paddingLeft = 16;
  inpField.appendChild(createText('Введите оперативное сообщение в канал #общая-диспетчерская...', 13, 'Regular', C.textMuted));
  inputBar.appendChild(inpField);

  const sendBtn = createButton('Отправить ➤', C.btnPrimaryBg, C.textOnDark, 44);
  inputBar.appendChild(sendBtn);

  chatArea.appendChild(inputBar);
  ws.appendChild(chatArea);
  screen2.appendChild(ws);
}

// ==============================================================
// SCREEN 3: 03_Передача смены (Создание задачи — Ждёт приёма)
// ==============================================================
{
  const screen3 = figma.createFrame();
  screen3.name = '03 — Передача смены (Создание задачи)';
  screen3.resize(1440, 900);
  screen3.x = 3080;
  screen3.y = 0;
  screen3.fills = fill(C.bgCanvas);
  page.appendChild(screen3);
  createdFrames.push(screen3.id);

  screen3.appendChild(createTopHeader('Передача смены'));

  // Main Container
  const container = figma.createFrame();
  container.resize(1360, 800);
  container.x = 40;
  container.y = 80;
  container.fills = [];
  container.layoutMode = 'VERTICAL';
  container.itemSpacing = 24;

  // View Title & Subtitle
  const headCol = figma.createFrame();
  headCol.layoutMode = 'VERTICAL';
  headCol.itemSpacing = 4;
  headCol.fills = [];
  headCol.appendChild(createText('Передача смены', 28, 'Bold', C.textDark));
  headCol.appendChild(createText('Исходящая смена передаёт задачу с ближайшим действием. Входящая подтверждает приём и отмечает выполнение.', 14, 'Regular', C.textMuted));
  container.appendChild(headCol);

  // Two columns row
  const cols = figma.createFrame();
  cols.resize(1360, 680);
  cols.layoutMode = 'HORIZONTAL';
  cols.itemSpacing = 32;
  cols.fills = [];

  // Left Column: Outgoing Shift Form
  const formCard = figma.createFrame();
  formCard.resize(520, 600);
  formCard.cornerRadius = 16;
  formCard.fills = fill(C.cardBg);
  formCard.strokes = fill(C.cardBorder);
  formCard.strokeWeight = 1;
  formCard.layoutMode = 'VERTICAL';
  formCard.paddingLeft = 28;
  formCard.paddingRight = 28;
  formCard.paddingTop = 28;
  formCard.paddingBottom = 28;
  formCard.itemSpacing = 20;

  formCard.appendChild(createText('Исходящая смена', 18, 'Bold', C.textDark));

  function makeField(label, val, height = 44) {
    const f = figma.createFrame();
    f.layoutMode = 'VERTICAL';
    f.itemSpacing = 6;
    f.fills = [];
    f.resize(464, height + 24);
    f.appendChild(createText(label, 12, 'Semi Bold', C.textDark));
    
    const inp = figma.createFrame();
    inp.resize(464, height);
    inp.cornerRadius = 8;
    inp.fills = fill(C.subtleCardBg);
    inp.strokes = fill(C.cardBorder);
    inp.strokeWeight = 1;
    inp.layoutMode = 'HORIZONTAL';
    inp.counterAxisAlignItems = height > 50 ? 'MIN' : 'CENTER';
    inp.paddingLeft = 14;
    inp.paddingTop = height > 50 ? 10 : 0;
    inp.appendChild(createText(val, 13, 'Regular', C.textDark));
    f.appendChild(inp);
    return f;
  }

  formCard.appendChild(makeField('Задача *', 'Уточнить готовность участка'));
  formCard.appendChild(makeField('Ближайшее действие *', 'Связаться с дежурным и зафиксировать ответ в рабочем журнале.', 80));
  formCard.appendChild(makeField('Получатель *', 'Диспетчер смены Б (Интулов А.А.)'));

  const submitBtn = createButton('Передать задачу', C.btnPrimaryBg, C.textOnDark, 44);
  formCard.appendChild(submitBtn);

  cols.appendChild(formCard);

  // Right Column: Handover Journal
  const journalCard = figma.createFrame();
  journalCard.resize(808, 600);
  journalCard.cornerRadius = 16;
  journalCard.fills = fill(C.cardBg);
  journalCard.strokes = fill(C.cardBorder);
  journalCard.strokeWeight = 1;
  journalCard.layoutMode = 'VERTICAL';
  journalCard.paddingLeft = 28;
  journalCard.paddingRight = 28;
  journalCard.paddingTop = 28;
  journalCard.paddingBottom = 28;
  journalCard.itemSpacing = 20;

  // Journal Header
  const jHead = figma.createFrame();
  jHead.resize(752, 32);
  jHead.layoutMode = 'HORIZONTAL';
  jHead.counterAxisAlignItems = 'CENTER';
  jHead.fills = [];
  
  const jTitle = createText('Журнал передачи', 18, 'Bold', C.textDark);
  jTitle.layoutGrow = 1;
  jHead.appendChild(jTitle);

  const jCounter = createBadge('Ждут приёма: 1', C.pendingBg, C.pendingText, C.pendingBorder);
  jHead.appendChild(jCounter);
  journalCard.appendChild(jHead);

  // Task Item Card (Pending state)
  const taskBox = figma.createFrame();
  taskBox.resize(752, 180);
  taskBox.cornerRadius = 12;
  taskBox.fills = fill(C.subtleCardBg);
  taskBox.strokes = fill(C.cardBorder);
  taskBox.strokeWeight = 1;
  taskBox.layoutMode = 'VERTICAL';
  taskBox.paddingLeft = 20;
  taskBox.paddingRight = 20;
  taskBox.paddingTop = 18;
  taskBox.paddingBottom = 18;
  taskBox.itemSpacing = 12;

  const tRow1 = figma.createFrame();
  tRow1.resize(712, 24);
  tRow1.layoutMode = 'HORIZONTAL';
  tRow1.counterAxisAlignItems = 'CENTER';
  tRow1.fills = [];
  
  const tName = createText('Уточнить готовность участка', 16, 'Bold', C.textDark);
  tName.layoutGrow = 1;
  tRow1.appendChild(tName);

  const tBadge = createBadge('Ждёт приёма', C.pendingBg, C.pendingText, C.pendingBorder);
  tRow1.appendChild(tBadge);
  taskBox.appendChild(tRow1);

  const tDesc = createText('Связаться с дежурным и зафиксировать ответ в рабочем журнале.', 13, 'Regular', C.textDark);
  taskBox.appendChild(tDesc);

  const tRec = createText('Получатель: Диспетчер смены Б', 12, 'Medium', C.textMuted);
  taskBox.appendChild(tRec);

  const tAudit = createText('• 09:20 — Смена А передала задачу', 11, 'Regular', C.textLight);
  taskBox.appendChild(tAudit);

  // Confirmation action button
  const confirmBtn = createButton('Подтвердить приём', null, C.btnPrimaryBg, 38, C.btnPrimaryBg);
  taskBox.appendChild(confirmBtn);

  journalCard.appendChild(taskBox);

  // Bottom utility button
  const btmRow = figma.createFrame();
  btmRow.resize(752, 40);
  btmRow.layoutMode = 'HORIZONTAL';
  btmRow.primaryAxisAlignItems = 'MAX';
  btmRow.counterAxisAlignItems = 'CENTER';
  btmRow.fills = [];
  
  const resetBtn = createButton('Сбросить демо', null, C.textMuted, 36, C.cardBorder);
  btmRow.appendChild(resetBtn);
  journalCard.appendChild(btmRow);

  cols.appendChild(journalCard);
  container.appendChild(cols);
  screen3.appendChild(container);
}

// ==============================================================
// SCREEN 4: 04_Передача смены (Подтверждение приёма — Принята)
// ==============================================================
{
  const screen4 = figma.createFrame();
  screen4.name = '04 — Передача смены (Подтверждение приёма)';
  screen4.resize(1440, 900);
  screen4.x = 4620;
  screen4.y = 0;
  screen4.fills = fill(C.bgCanvas);
  page.appendChild(screen4);
  createdFrames.push(screen4.id);

  screen4.appendChild(createTopHeader('Передача смены — Принято'));

  const container = figma.createFrame();
  container.resize(1360, 800);
  container.x = 40;
  container.y = 80;
  container.fills = [];
  container.layoutMode = 'VERTICAL';
  container.itemSpacing = 24;

  const headCol = figma.createFrame();
  headCol.layoutMode = 'VERTICAL';
  headCol.itemSpacing = 4;
  headCol.fills = [];
  headCol.appendChild(createText('Передача смены', 28, 'Bold', C.textDark));
  headCol.appendChild(createText('Исходящая смена передаёт задачу с ближайшим действием. Входящая подтверждает приём и отмечает выполнение.', 14, 'Regular', C.textMuted));
  container.appendChild(headCol);

  const cols = figma.createFrame();
  cols.resize(1360, 680);
  cols.layoutMode = 'HORIZONTAL';
  cols.itemSpacing = 32;
  cols.fills = [];

  // Left Form
  const formCard = figma.createFrame();
  formCard.resize(520, 600);
  formCard.cornerRadius = 16;
  formCard.fills = fill(C.cardBg);
  formCard.strokes = fill(C.cardBorder);
  formCard.strokeWeight = 1;
  formCard.layoutMode = 'VERTICAL';
  formCard.paddingLeft = 28;
  formCard.paddingRight = 28;
  formCard.paddingTop = 28;
  formCard.paddingBottom = 28;
  formCard.itemSpacing = 20;

  formCard.appendChild(createText('Исходящая смена', 18, 'Bold', C.textDark));

  function makeField2(label, val, height = 44) {
    const f = figma.createFrame();
    f.layoutMode = 'VERTICAL';
    f.itemSpacing = 6;
    f.fills = [];
    f.resize(464, height + 24);
    f.appendChild(createText(label, 12, 'Semi Bold', C.textDark));
    
    const inp = figma.createFrame();
    inp.resize(464, height);
    inp.cornerRadius = 8;
    inp.fills = fill(C.subtleCardBg);
    inp.strokes = fill(C.cardBorder);
    inp.strokeWeight = 1;
    inp.layoutMode = 'HORIZONTAL';
    inp.counterAxisAlignItems = height > 50 ? 'MIN' : 'CENTER';
    inp.paddingLeft = 14;
    inp.paddingTop = height > 50 ? 10 : 0;
    inp.appendChild(createText(val, 13, 'Regular', C.textMuted));
    f.appendChild(inp);
    return f;
  }

  formCard.appendChild(makeField2('Задача *', 'Например, уточнить готовность участка'));
  formCard.appendChild(makeField2('Ближайшее действие *', 'Что сделать и с кем связаться', 80));
  formCard.appendChild(makeField2('Получатель *', 'Диспетчер смены Б'));

  const submitBtn = createButton('Передать задачу', C.btnPrimaryBg, C.textOnDark, 44);
  formCard.appendChild(submitBtn);
  cols.appendChild(formCard);

  // Right Journal (Accepted state)
  const journalCard = figma.createFrame();
  journalCard.resize(808, 600);
  journalCard.cornerRadius = 16;
  journalCard.fills = fill(C.cardBg);
  journalCard.strokes = fill(C.cardBorder);
  journalCard.strokeWeight = 1;
  journalCard.layoutMode = 'VERTICAL';
  journalCard.paddingLeft = 28;
  journalCard.paddingRight = 28;
  journalCard.paddingTop = 28;
  journalCard.paddingBottom = 28;
  journalCard.itemSpacing = 20;

  const jHead = figma.createFrame();
  jHead.resize(752, 32);
  jHead.layoutMode = 'HORIZONTAL';
  jHead.counterAxisAlignItems = 'CENTER';
  jHead.fills = [];
  
  const jTitle = createText('Журнал передачи', 18, 'Bold', C.textDark);
  jTitle.layoutGrow = 1;
  jHead.appendChild(jTitle);

  const jCounter = createBadge('В работе: 1 • Ждут приёма: 0', C.acceptedBg, C.acceptedText, C.acceptedBorder);
  jHead.appendChild(jCounter);
  journalCard.appendChild(jHead);

  // Accepted Task Box
  const taskBox = figma.createFrame();
  taskBox.resize(752, 200);
  taskBox.cornerRadius = 12;
  taskBox.fills = fill(C.subtleCardBg);
  taskBox.strokes = fill(C.acceptedBorder);
  taskBox.strokeWeight = 1.5;
  taskBox.layoutMode = 'VERTICAL';
  taskBox.paddingLeft = 20;
  taskBox.paddingRight = 20;
  taskBox.paddingTop = 18;
  taskBox.paddingBottom = 18;
  taskBox.itemSpacing = 12;

  const tRow1 = figma.createFrame();
  tRow1.resize(712, 24);
  tRow1.layoutMode = 'HORIZONTAL';
  tRow1.counterAxisAlignItems = 'CENTER';
  tRow1.fills = [];
  
  const tName = createText('Уточнить готовность участка', 16, 'Bold', C.textDark);
  tName.layoutGrow = 1;
  tRow1.appendChild(tName);

  const tBadge = createBadge('Принята в работу', C.acceptedBg, C.acceptedText, C.acceptedBorder);
  tRow1.appendChild(tBadge);
  taskBox.appendChild(tRow1);

  const tDesc = createText('Связаться с дежурным и зафиксировать ответ в рабочем журнале.', 13, 'Regular', C.textDark);
  taskBox.appendChild(tDesc);

  const tRec = createText('Ответственный исполнитель: Диспетчер Интулов А.А. (Смена Б)', 12, 'Medium', C.acceptedText);
  taskBox.appendChild(tRec);

  const tAudit1 = createText('• 09:20 — Диспетчер Москаленко (Смена А) передал задачу', 11, 'Regular', C.textLight);
  const tAudit2 = createText('• 09:22 — Диспетчер Интулов (Смена Б) подтвердил приём задачи', 11, 'Medium', C.acceptedText);
  taskBox.appendChild(tAudit1);
  taskBox.appendChild(tAudit2);

  const completeBtn = createButton('✓ Отметить выполнение', C.btnPrimaryBg, C.textOnDark, 38);
  taskBox.appendChild(completeBtn);

  journalCard.appendChild(taskBox);

  const btmRow = figma.createFrame();
  btmRow.resize(752, 40);
  btmRow.layoutMode = 'HORIZONTAL';
  btmRow.primaryAxisAlignItems = 'MAX';
  btmRow.counterAxisAlignItems = 'CENTER';
  btmRow.fills = [];
  const resetBtn = createButton('Сбросить демо', null, C.textMuted, 36, C.cardBorder);
  btmRow.appendChild(resetBtn);
  journalCard.appendChild(btmRow);

  cols.appendChild(journalCard);
  container.appendChild(cols);
  screen4.appendChild(container);
}

// ==============================================================
// SCREEN 5: 05_Передача смены (Выполнено и Аудит-лог)
// ==============================================================
{
  const screen5 = figma.createFrame();
  screen5.name = '05 — Передача смены (Завершено и Аудит)';
  screen5.resize(1440, 900);
  screen5.x = 6160;
  screen5.y = 0;
  screen5.fills = fill(C.bgCanvas);
  page.appendChild(screen5);
  createdFrames.push(screen5.id);

  screen5.appendChild(createTopHeader('Передача смены — Завершено'));

  const container = figma.createFrame();
  container.resize(1360, 800);
  container.x = 40;
  container.y = 80;
  container.fills = [];
  container.layoutMode = 'VERTICAL';
  container.itemSpacing = 24;

  const headCol = figma.createFrame();
  headCol.layoutMode = 'VERTICAL';
  headCol.itemSpacing = 4;
  headCol.fills = [];
  headCol.appendChild(createText('Передача смены', 28, 'Bold', C.textDark));
  headCol.appendChild(createText('Исходящая смена передаёт задачу с ближайшим действием. Входящая подтверждает приём и отмечает выполнение.', 14, 'Regular', C.textMuted));
  container.appendChild(headCol);

  const cols = figma.createFrame();
  cols.resize(1360, 680);
  cols.layoutMode = 'HORIZONTAL';
  cols.itemSpacing = 32;
  cols.fills = [];

  // Left Summary Report Card
  const repCard = figma.createFrame();
  repCard.resize(520, 600);
  repCard.cornerRadius = 16;
  repCard.fills = fill(C.cardBg);
  repCard.strokes = fill(C.cardBorder);
  repCard.strokeWeight = 1;
  repCard.layoutMode = 'VERTICAL';
  repCard.paddingLeft = 28;
  repCard.paddingRight = 28;
  repCard.paddingTop = 28;
  repCard.paddingBottom = 28;
  repCard.itemSpacing = 18;

  repCard.appendChild(createText('Итоги передачи дежурства', 18, 'Bold', C.textDark));
  repCard.appendChild(createText('Акт передачи ответственности зафиксирован в локальной БД PostgreSQL.', 12, 'Regular', C.textMuted));

  function makeStatPill(title, val) {
    const p = figma.createFrame();
    p.resize(464, 52);
    p.cornerRadius = 10;
    p.fills = fill(C.subtleCardBg);
    p.strokes = fill(C.cardBorder);
    p.strokeWeight = 1;
    p.layoutMode = 'HORIZONTAL';
    p.counterAxisAlignItems = 'CENTER';
    p.paddingLeft = 16;
    p.paddingRight = 16;
    
    const t = createText(title, 13, 'Medium', C.textDark);
    t.layoutGrow = 1;
    p.appendChild(t);
    p.appendChild(createText(val, 14, 'Bold', C.caramelDark));
    return p;
  }

  repCard.appendChild(makeStatPill('Всего задач передано', '2'));
  repCard.appendChild(makeStatPill('Подтверждено в регламентный срок', '100% (2 из 2)'));
  repCard.appendChild(makeStatPill('Время реагирования на передачу', '2 мин (норма: < 10 мин)'));
  repCard.appendChild(makeStatPill('Смена-сдатчик', 'Москаленко М.Д.'));
  repCard.appendChild(makeStatPill('Смена-приёмщик', 'Интулов А.А.'));

  const exportBtn = createButton('📄 Экспорт протокола передачи (PDF)', C.btnPrimaryBg, C.textOnDark, 44);
  repCard.appendChild(exportBtn);

  cols.appendChild(repCard);

  // Right Column: Completed Journal
  const journalCard = figma.createFrame();
  journalCard.resize(808, 600);
  journalCard.cornerRadius = 16;
  journalCard.fills = fill(C.cardBg);
  journalCard.strokes = fill(C.cardBorder);
  journalCard.strokeWeight = 1;
  journalCard.layoutMode = 'VERTICAL';
  journalCard.paddingLeft = 28;
  journalCard.paddingRight = 28;
  journalCard.paddingTop = 28;
  journalCard.paddingBottom = 28;
  journalCard.itemSpacing = 16;

  const jHead = figma.createFrame();
  jHead.resize(752, 32);
  jHead.layoutMode = 'HORIZONTAL';
  jHead.counterAxisAlignItems = 'CENTER';
  jHead.fills = [];
  
  const jTitle = createText('Журнал передачи (Архив смены)', 18, 'Bold', C.textDark);
  jTitle.layoutGrow = 1;
  jHead.appendChild(jTitle);

  const jCounter = createBadge('Все задачи выполнены ✓', C.doneBg, C.doneText, C.doneBorder);
  jHead.appendChild(jCounter);
  journalCard.appendChild(jHead);

  // Task Box 1: Done
  const tBox1 = figma.createFrame();
  tBox1.resize(752, 175);
  tBox1.cornerRadius = 12;
  tBox1.fills = fill(C.subtleCardBg);
  tBox1.strokes = fill(C.doneBorder);
  tBox1.strokeWeight = 1;
  tBox1.layoutMode = 'VERTICAL';
  tBox1.paddingLeft = 20;
  tBox1.paddingRight = 20;
  tBox1.paddingTop = 16;
  tBox1.paddingBottom = 16;
  tBox1.itemSpacing = 8;

  const row1 = figma.createFrame();
  row1.resize(712, 24);
  row1.layoutMode = 'HORIZONTAL';
  row1.counterAxisAlignItems = 'CENTER';
  row1.fills = [];
  const t1Name = createText('Уточнить готовность участка', 15, 'Bold', C.textDark);
  t1Name.layoutGrow = 1;
  row1.appendChild(t1Name);
  row1.appendChild(createBadge('Выполнена', C.doneBg, C.doneText, C.doneBorder));
  tBox1.appendChild(row1);

  tBox1.appendChild(createText('Связаться с дежурным и зафиксировать ответ в рабочем журнале.', 13, 'Regular', C.textDark));
  tBox1.appendChild(createText('• 09:20 — Смена А передала задачу', 11, 'Regular', C.textLight));
  tBox1.appendChild(createText('• 09:22 — Смена Б подтвердила приём', 11, 'Regular', C.textLight));
  tBox1.appendChild(createText('• 09:35 — Смена Б выполнила: Готовность участка №4 подтверждена дежурным ст. Коломенское.', 11, 'Semi Bold', C.doneText));

  journalCard.appendChild(tBox1);

  // Task Box 2: Previous Done
  const tBox2 = figma.createFrame();
  tBox2.resize(752, 140);
  tBox2.cornerRadius = 12;
  tBox2.fills = fill(C.subtleCardBg);
  tBox2.strokes = fill(C.doneBorder);
  tBox2.strokeWeight = 1;
  tBox2.layoutMode = 'VERTICAL';
  tBox2.paddingLeft = 20;
  tBox2.paddingRight = 20;
  tBox2.paddingTop = 16;
  tBox2.paddingBottom = 16;
  tBox2.itemSpacing = 8;

  const row2 = figma.createFrame();
  row2.resize(712, 24);
  row2.layoutMode = 'HORIZONTAL';
  row2.counterAxisAlignItems = 'CENTER';
  row2.fills = [];
  const t2Name = createText('Контроль температурного режима стрелочных переводов', 15, 'Bold', C.textDark);
  t2Name.layoutGrow = 1;
  row2.appendChild(t2Name);
  row2.appendChild(createBadge('Выполнена', C.doneBg, C.doneText, C.doneBorder));
  tBox2.appendChild(row2);

  tBox2.appendChild(createText('Обогрев стрелок включен штатно, температура в пределах нормы (-4°C).', 13, 'Regular', C.textDark));
  tBox2.appendChild(createText('• 08:30 — Смена А передала | 08:32 — Смена Б приняла | 08:50 — Выполнено', 11, 'Regular', C.textLight));

  journalCard.appendChild(tBox2);

  // Bottom reset button
  const btmRow = figma.createFrame();
  btmRow.resize(752, 40);
  btmRow.layoutMode = 'HORIZONTAL';
  btmRow.primaryAxisAlignItems = 'MAX';
  btmRow.counterAxisAlignItems = 'CENTER';
  btmRow.fills = [];
  const resetBtn = createButton('Сбросить демо / Начать новую смену', null, C.textMuted, 36, C.cardBorder);
  btmRow.appendChild(resetBtn);
  journalCard.appendChild(btmRow);

  cols.appendChild(journalCard);
  container.appendChild(cols);
  screen5.appendChild(container);
}

return {
  status: "success",
  createdFramesCount: createdFrames.length,
  frameIds: createdFrames
};

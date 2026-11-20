// Pre-load Inter fonts
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Medium" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Bold" });

const page = figma.currentPage;

// Clear existing frames
for (const child of [...page.children]) {
  child.remove();
}

// Warm Coffee / Latte / Espresso Palette
const C = {
  bgCanvas: { r: 247/255, g: 244/255, b: 238/255 },     // #F7F4EE Warm Latte
  cardBg: { r: 1, g: 1, b: 1 },                         // #FFFFFF
  cardBorder: { r: 230/255, g: 224/255, b: 216/255 },   // #E6E0D8
  subtleCardBg: { r: 252/255, g: 250/255, b: 247/255 }, // #FCFAF7
  
  // Espresso Dark Roast
  espressoDark: { r: 35/255, g: 28/255, b: 24/255 },    // #231C18
  espressoSidebar: { r: 43/255, g: 35/255, b: 30/255 }, // #2B231E
  espressoActive: { r: 64/255, g: 52/255, b: 45/255 },  // #40342D
  
  // Caramel / Accents
  caramel: { r: 194/255, g: 125/255, b: 66/255 },       // #C27D42
  caramelLight: { r: 251/255, g: 242/255, b: 233/255 }, // #FBF2E9
  caramelDark: { r: 156/255, g: 94/255, b: 44/255 },    // #9C5E2C
  
  // Text
  textDark: { r: 38/255, g: 31/255, b: 27/255 },        // #261F1B
  textMuted: { r: 115/255, g: 102/255, b: 94/255 },     // #73665E
  textLight: { r: 168/255, g: 154/255, b: 144/255 },    // #A89A90
  textOnDark: { r: 247/255, g: 244/255, b: 238/255 },
  textOnDarkMuted: { r: 180/255, g: 170/255, b: 162/255 },

  // Buttons
  btnPrimaryBg: { r: 43/255, g: 35/255, b: 30/255 },
  
  // Statuses
  pendingBg: { r: 254/255, g: 243/255, b: 226/255 },
  pendingText: { r: 166/255, g: 90/255, b: 24/255 },
  pendingBorder: { r: 245/255, g: 214/255, b: 178/255 },
  
  acceptedBg: { r: 234/255, g: 242/255, b: 249/255 },
  acceptedText: { r: 37/255, g: 99/255, b: 153/255 },
  acceptedBorder: { r: 200/255, g: 221/255, b: 239/255 },
  
  doneBg: { r: 235/255, g: 245/255, b: 238/255 },
  doneText: { r: 39/255, g: 110/255, b: 68/255 },
  doneBorder: { r: 198/255, g: 228/255, b: 207/255 },
  
  alertBg: { r: 254/255, g: 238/255, b: 235/255 },
  alertText: { r: 194/255, g: 54/255, b: 36/255 },
  alertBorder: { r: 248/255, g: 196/255, b: 188/255 }
};

function fill(c, opacity = 1) {
  return [{ type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity }];
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
  b.cornerRadius = 10;
  b.fills = fill(bgCol);
  if (borderCol) {
    b.strokes = fill(borderCol);
    b.strokeWeight = 1;
  }
  b.appendChild(createText(text, 11, 'Semi Bold', textCol));
  return b;
}

function createButton(text, bgCol, textCol, height = 40, borderCol = null, minWidth = 140) {
  const btn = figma.createFrame();
  btn.layoutMode = 'HORIZONTAL';
  btn.primaryAxisAlignItems = 'CENTER';
  btn.counterAxisAlignItems = 'CENTER';
  btn.primaryAxisSizingMode = 'AUTO';
  btn.counterAxisSizingMode = 'FIXED';
  btn.resize(minWidth, height);
  btn.paddingLeft = 18;
  btn.paddingRight = 18;
  btn.cornerRadius = 8;
  btn.fills = bgCol ? fill(bgCol) : [];
  if (borderCol) {
    btn.strokes = fill(borderCol);
    btn.strokeWeight = 1;
  }
  btn.appendChild(createText(text, 13, 'Semi Bold', textCol));
  return btn;
}

function createTopHeader(activeTitle = 'Общая диспетчерская') {
  const header = figma.createFrame();
  header.name = 'Top Header';
  header.layoutMode = 'HORIZONTAL';
  header.primaryAxisSizingMode = 'FIXED';
  header.counterAxisSizingMode = 'FIXED';
  header.resize(1440, 56);
  header.fills = fill(C.espressoDark);
  header.counterAxisAlignItems = 'CENTER';
  header.paddingLeft = 24;
  header.paddingRight = 24;
  header.itemSpacing = 24;

  const brand = figma.createFrame();
  brand.layoutMode = 'HORIZONTAL';
  brand.counterAxisAlignItems = 'CENTER';
  brand.itemSpacing = 10;
  brand.fills = [];
  brand.appendChild(createText('ШИФР-СВЯЗЬ', 16, 'Bold', C.textOnDark));
  brand.appendChild(createBadge('● 100% OFF-LINE (LAN)', C.caramelDark, C.textOnDark));
  header.appendChild(brand);

  const centerBox = figma.createFrame();
  centerBox.layoutMode = 'HORIZONTAL';
  centerBox.counterAxisAlignItems = 'CENTER';
  centerBox.primaryAxisAlignItems = 'CENTER';
  centerBox.fills = [];
  centerBox.layoutGrow = 1;
  centerBox.appendChild(createText('Участок: ст. Москва-Павелецкая — ст. Домодедово (Пульт №2)', 13, 'Medium', C.textOnDarkMuted));
  header.appendChild(centerBox);

  const rightBox = figma.createFrame();
  rightBox.layoutMode = 'HORIZONTAL';
  rightBox.counterAxisAlignItems = 'CENTER';
  rightBox.itemSpacing = 16;
  rightBox.fills = [];
  rightBox.appendChild(createBadge('⚠️ Передача смены: 1 ждёт', C.pendingBg, C.pendingText, C.pendingBorder));

  const userBox = figma.createFrame();
  userBox.layoutMode = 'HORIZONTAL';
  userBox.counterAxisAlignItems = 'CENTER';
  userBox.itemSpacing = 8;
  userBox.fills = [];
  
  const av = figma.createFrame();
  av.resize(30, 30);
  av.cornerRadius = 15;
  av.fills = fill(C.caramel);
  av.layoutMode = 'HORIZONTAL';
  av.primaryAxisAlignItems = 'CENTER';
  av.counterAxisAlignItems = 'CENTER';
  av.appendChild(createText('МА', 11, 'Bold', C.textOnDark));
  userBox.appendChild(av);

  userBox.appendChild(createText('Москаленко М.Д. (Смена А)', 13, 'Medium', C.textOnDark));
  rightBox.appendChild(userBox);
  header.appendChild(rightBox);

  return header;
}

const createdFrames = [];

// SCREEN 1: LOGIN
{
  const s1 = figma.createFrame();
  s1.name = '01 — Авторизация в закрытом контуре';
  s1.resize(1440, 900);
  s1.x = 0;
  s1.y = 0;
  s1.fills = fill(C.bgCanvas);
  page.appendChild(s1);
  createdFrames.push(s1.id);

  const banner = figma.createFrame();
  banner.resize(1440, 44);
  banner.fills = fill(C.espressoDark);
  banner.layoutMode = 'HORIZONTAL';
  banner.primaryAxisAlignItems = 'CENTER';
  banner.counterAxisAlignItems = 'CENTER';
  banner.appendChild(createText('🔒 ЗАЩИЩЕННЫЙ ЛОКАЛЬНЫЙ КОНТУР • ООО «ЖЕЛДОРЦТИ» • ВНЕШНИЙ ИНТЕРНЕТ: ОТКЛЮЧЕН • SELF-HOSTED 192.168.10.15', 12, 'Semi Bold', C.caramelLight));
  s1.appendChild(banner);

  const card = figma.createFrame();
  card.resize(460, 580);
  card.x = (1440 - 460) / 2;
  card.y = 130;
  card.cornerRadius = 16;
  card.fills = fill(C.cardBg);
  card.strokes = fill(C.cardBorder);
  card.strokeWeight = 1;
  card.layoutMode = 'VERTICAL';
  card.paddingLeft = 36;
  card.paddingRight = 36;
  card.paddingTop = 36;
  card.paddingBottom = 36;
  card.itemSpacing = 20;

  const bRow = figma.createFrame();
  bRow.layoutMode = 'HORIZONTAL';
  bRow.counterAxisAlignItems = 'CENTER';
  bRow.itemSpacing = 12;
  bRow.fills = [];
  const badgeIco = figma.createFrame();
  badgeIco.resize(42, 42);
  badgeIco.cornerRadius = 10;
  badgeIco.fills = fill(C.caramel);
  badgeIco.layoutMode = 'HORIZONTAL';
  badgeIco.primaryAxisAlignItems = 'CENTER';
  badgeIco.counterAxisAlignItems = 'CENTER';
  badgeIco.appendChild(createText('🚆', 20));
  bRow.appendChild(badgeIco);

  const titBox = figma.createFrame();
  titBox.layoutMode = 'VERTICAL';
  titBox.itemSpacing = 2;
  titBox.fills = [];
  titBox.appendChild(createText('ШИФР-СВЯЗЬ', 20, 'Bold', C.textDark));
  titBox.appendChild(createText('Защищенный мессенджер диспетчеров', 12, 'Regular', C.textMuted));
  bRow.appendChild(titBox);
  card.appendChild(bRow);

  const segWrap = figma.createFrame();
  segWrap.layoutMode = 'VERTICAL';
  segWrap.itemSpacing = 6;
  segWrap.fills = [];
  segWrap.appendChild(createText('Выберите рабочую смену:', 12, 'Semi Bold', C.textDark));

  const seg = figma.createFrame();
  seg.resize(388, 38);
  seg.cornerRadius = 8;
  seg.fills = fill(C.subtleCardBg);
  seg.strokes = fill(C.cardBorder);
  seg.strokeWeight = 1;
  seg.layoutMode = 'HORIZONTAL';
  seg.paddingLeft = 4;
  seg.paddingRight = 4;
  seg.paddingTop = 4;
  seg.paddingBottom = 4;
  seg.itemSpacing = 4;

  const bA = figma.createFrame();
  bA.resize(188, 30);
  bA.cornerRadius = 6;
  bA.fills = fill(C.btnPrimaryBg);
  bA.layoutMode = 'HORIZONTAL';
  bA.primaryAxisAlignItems = 'CENTER';
  bA.counterAxisAlignItems = 'CENTER';
  bA.appendChild(createText('Смена А (Москаленко)', 12, 'Semi Bold', C.textOnDark));
  seg.appendChild(bA);

  const bB = figma.createFrame();
  bB.resize(188, 30);
  bB.cornerRadius = 6;
  bB.fills = [];
  bB.layoutMode = 'HORIZONTAL';
  bB.primaryAxisAlignItems = 'CENTER';
  bB.counterAxisAlignItems = 'CENTER';
  bB.appendChild(createText('Смена Б (Интулов)', 12, 'Medium', C.textMuted));
  seg.appendChild(bB);
  segWrap.appendChild(seg);
  card.appendChild(segWrap);

  function field(lbl, val) {
    const f = figma.createFrame();
    f.layoutMode = 'VERTICAL';
    f.itemSpacing = 6;
    f.fills = [];
    f.appendChild(createText(lbl, 12, 'Semi Bold', C.textDark));
    const inp = figma.createFrame();
    inp.resize(388, 42);
    inp.cornerRadius = 8;
    inp.fills = fill(C.subtleCardBg);
    inp.strokes = fill(C.cardBorder);
    inp.strokeWeight = 1;
    inp.layoutMode = 'HORIZONTAL';
    inp.counterAxisAlignItems = 'CENTER';
    inp.paddingLeft = 14;
    inp.appendChild(createText(val, 13, 'Regular', C.textDark));
    f.appendChild(inp);
    return f;
  }

  card.appendChild(field('Учетная запись диспетчера', 'dispatcher-01 (Москаленко М.Д.)'));
  card.appendChild(field('Пароль / Ключ закрытого контура', '••••••••••••••••'));

  const enter = figma.createFrame();
  enter.resize(388, 46);
  enter.cornerRadius = 8;
  enter.fills = fill(C.btnPrimaryBg);
  enter.layoutMode = 'HORIZONTAL';
  enter.primaryAxisAlignItems = 'CENTER';
  enter.counterAxisAlignItems = 'CENTER';
  enter.appendChild(createText('Войти на рабочий пульт', 14, 'Semi Bold', C.textOnDark));
  card.appendChild(enter);

  card.appendChild(createText('✓ Локальное шифрование TLS 1.3 • База данных PostgreSQL On-Premise\n✓ Полное соответствие требованиям ИБ ООО «ЖелдорЦТИ»', 11, 'Regular', C.textMuted));
  s1.appendChild(card);
}

// SCREEN 2: MAIN WORKSPACE CHAT
{
  const s2 = figma.createFrame();
  s2.name = '02 — Главная диспетчерская (Рабочий чат)';
  s2.resize(1440, 900);
  s2.x = 1540;
  s2.y = 0;
  s2.fills = fill(C.bgCanvas);
  page.appendChild(s2);
  createdFrames.push(s2.id);

  s2.appendChild(createTopHeader('Общая диспетчерская'));

  // Left icon bar (absolute placed)
  const nav = figma.createFrame();
  nav.name = 'Left Nav';
  nav.x = 0;
  nav.y = 56;
  nav.resize(64, 844);
  nav.fills = fill(C.espressoDark);
  nav.layoutMode = 'VERTICAL';
  nav.counterAxisAlignItems = 'CENTER';
  nav.paddingTop = 20;
  nav.itemSpacing = 20;

  const icons = ['💬', '📋', '🚆', '⚠️', '📑'];
  for (let i = 0; i < icons.length; i++) {
    const icBox = figma.createFrame();
    icBox.resize(44, 44);
    icBox.cornerRadius = 10;
    icBox.fills = i === 0 ? fill(C.caramel) : fill(C.espressoSidebar);
    icBox.layoutMode = 'HORIZONTAL';
    icBox.primaryAxisAlignItems = 'CENTER';
    icBox.counterAxisAlignItems = 'CENTER';
    icBox.appendChild(createText(icons[i], 18));
    nav.appendChild(icBox);
  }
  s2.appendChild(nav);

  // Channels Sidebar (absolute placed)
  const side = figma.createFrame();
  side.name = 'Channels';
  side.x = 64;
  side.y = 56;
  side.resize(260, 844);
  side.fills = fill(C.espressoSidebar);
  side.layoutMode = 'VERTICAL';
  side.paddingLeft = 16;
  side.paddingRight = 16;
  side.paddingTop = 20;
  side.itemSpacing = 20;

  const search = figma.createFrame();
  search.resize(228, 36);
  search.cornerRadius = 8;
  search.fills = fill(C.espressoDark);
  search.layoutMode = 'HORIZONTAL';
  search.counterAxisAlignItems = 'CENTER';
  search.paddingLeft = 12;
  search.appendChild(createText('🔍 Поиск по каналам...', 12, 'Regular', C.textOnDarkMuted));
  side.appendChild(search);

  const chSec = figma.createFrame();
  chSec.layoutMode = 'VERTICAL';
  chSec.itemSpacing = 6;
  chSec.fills = [];
  chSec.appendChild(createText('РАБОЧИЕ КАНАЛЫ (LAN)', 11, 'Semi Bold', C.caramel));

  const chList = [
    { name: '# общая-диспетчерская', active: true, unread: 0 },
    { name: '# аварии-инциденты', active: false, unread: 2, alert: true },
    { name: '# перегон-бирюлево', active: false, unread: 0 },
    { name: '# график-движения-мск', active: false, unread: 0 }
  ];
  for (const ch of chList) {
    const r = figma.createFrame();
    r.resize(228, 34);
    r.cornerRadius = 8;
    r.fills = ch.active ? fill(C.espressoActive) : [];
    r.layoutMode = 'HORIZONTAL';
    r.counterAxisAlignItems = 'CENTER';
    r.paddingLeft = 10;
    r.paddingRight = 10;
    r.itemSpacing = 6;
    const t = createText(ch.name, 12, ch.active ? 'Semi Bold' : 'Regular', ch.active ? C.textOnDark : C.textOnDarkMuted);
    t.layoutGrow = 1;
    r.appendChild(t);
    if (ch.unread > 0) {
      r.appendChild(createBadge(String(ch.unread), C.alertBg, C.alertText));
    }
    chSec.appendChild(r);
  }
  side.appendChild(chSec);

  const ctSec = figma.createFrame();
  ctSec.layoutMode = 'VERTICAL';
  ctSec.itemSpacing = 6;
  ctSec.fills = [];
  ctSec.appendChild(createText('СВЯЗЬ СО СМЕНАМИ', 11, 'Semi Bold', C.caramel));
  const contacts = [
    { name: '@ Интулов А.А. (Смена Б)', st: '🟢 на дежурстве' },
    { name: '@ Дежурный ст. Коломенское', st: '🟢 на посту' },
    { name: '@ Дежурный ст. Расторгуево', st: '⚪ офлайн' },
    { name: '@ Администратор ИБ', st: '🟢 в сети' }
  ];
  for (const ct of contacts) {
    const r = figma.createFrame();
    r.resize(228, 32);
    r.fills = [];
    r.layoutMode = 'VERTICAL';
    r.itemSpacing = 2;
    r.paddingLeft = 10;
    r.appendChild(createText(ct.name, 12, 'Medium', C.textOnDark));
    r.appendChild(createText(ct.st, 10, 'Regular', C.textOnDarkMuted));
    ctSec.appendChild(r);
  }
  side.appendChild(ctSec);
  s2.appendChild(side);

  // Main Chat Area (absolute placed)
  const chatArea = figma.createFrame();
  chatArea.name = 'Chat Area';
  chatArea.x = 324;
  chatArea.y = 56;
  chatArea.resize(1116, 844);
  chatArea.fills = fill(C.bgCanvas);
  chatArea.layoutMode = 'VERTICAL';

  // Chat Header Bar
  const chHead = figma.createFrame();
  chHead.resize(1116, 60);
  chHead.primaryAxisSizingMode = 'FIXED';
  chHead.counterAxisSizingMode = 'FIXED';
  chHead.fills = fill(C.cardBg);
  chHead.strokes = fill(C.cardBorder);
  chHead.strokeWeight = 1;
  chHead.layoutMode = 'HORIZONTAL';
  chHead.counterAxisAlignItems = 'CENTER';
  chHead.paddingLeft = 24;
  chHead.paddingRight = 24;
  
  const chTitleBox = figma.createFrame();
  chTitleBox.layoutMode = 'VERTICAL';
  chTitleBox.itemSpacing = 2;
  chTitleBox.fills = [];
  chTitleBox.layoutGrow = 1;
  chTitleBox.appendChild(createText('# общая-диспетчерская', 16, 'Bold', C.textDark));
  chTitleBox.appendChild(createText('Оперативная координация движения • Локальный протокол №21-LAN', 12, 'Regular', C.textMuted));
  chHead.appendChild(chTitleBox);

  const shiftBtn = createButton('📋 Модуль передачи смены', C.caramel, C.textOnDark, 38);
  chHead.appendChild(shiftBtn);
  chatArea.appendChild(chHead);

  // Warning Banner
  const alertBanner = figma.createFrame();
  alertBanner.resize(1116, 40);
  alertBanner.primaryAxisSizingMode = 'FIXED';
  alertBanner.counterAxisSizingMode = 'FIXED';
  alertBanner.fills = fill(C.pendingBg);
  alertBanner.strokes = fill(C.pendingBorder);
  alertBanner.strokeWeight = 1;
  alertBanner.layoutMode = 'HORIZONTAL';
  alertBanner.counterAxisAlignItems = 'CENTER';
  alertBanner.paddingLeft = 24;
  alertBanner.paddingRight = 24;
  alertBanner.appendChild(createText('⏳ Внимание: до конца дежурства Смены А осталось 25 мин. Открыта карточка «Уточнить готовность участка №4» для передачи Смене Б.', 12, 'Semi Bold', C.pendingText));
  chatArea.appendChild(alertBanner);

  // Messages Scroll Feed
  const msgs = figma.createFrame();
  msgs.name = 'Messages';
  msgs.resize(1116, 668);
  msgs.layoutGrow = 1;
  msgs.fills = fill(C.bgCanvas);
  msgs.layoutMode = 'VERTICAL';
  msgs.paddingLeft = 32;
  msgs.paddingRight = 32;
  msgs.paddingTop = 20;
  msgs.paddingBottom = 20;
  msgs.itemSpacing = 16;

  function msgBubble(author, time, text, isOut = false, badgeText = null) {
    const wrap = figma.createFrame();
    wrap.layoutMode = 'HORIZONTAL';
    wrap.fills = [];
    wrap.primaryAxisSizingMode = 'FIXED';
    wrap.counterAxisSizingMode = 'AUTO';
    wrap.resize(1052, 60);
    if (isOut) wrap.primaryAxisAlignItems = 'MAX';

    const b = figma.createFrame();
    b.layoutMode = 'VERTICAL';
    b.itemSpacing = 6;
    b.paddingLeft = 16;
    b.paddingRight = 16;
    b.paddingTop = 10;
    b.paddingBottom = 10;
    b.cornerRadius = 12;
    b.fills = isOut ? fill(C.caramelLight) : fill(C.cardBg);
    b.strokes = fill(isOut ? C.caramelDark : C.cardBorder);
    b.strokeWeight = 1;

    const topRow = figma.createFrame();
    topRow.layoutMode = 'HORIZONTAL';
    topRow.counterAxisAlignItems = 'CENTER';
    topRow.itemSpacing = 8;
    topRow.fills = [];
    topRow.appendChild(createText(author, 12, 'Bold', isOut ? C.caramelDark : C.textDark));
    topRow.appendChild(createText(time, 11, 'Regular', C.textMuted));
    if (badgeText) topRow.appendChild(createBadge(badgeText, C.pendingBg, C.pendingText));
    b.appendChild(topRow);

    b.appendChild(createText(text, 13, 'Regular', C.textDark));
    wrap.appendChild(b);
    return wrap;
  }

  msgs.appendChild(msgBubble('Дежурный ст. Расторгуево (Сидоров В.Н.)', '08:45', 'Поезд №123 (грузовой состав) задерживается на 14 минут из-за путевых работ на 3-м стрелочном переводе.', false, 'Задержка: +14 мин'));
  msgs.appendChild(msgBubble('Диспетчер Москаленко М.Д. (Смена А)', '08:48', 'Принято. Внесли корректировку в график движения, путь №2 на станции Коломенское держим свободным.', true));
  msgs.appendChild(msgBubble('Диспетчер Интулов А.А. (Смена Б)', '09:12', 'Смена Б прибыла на дежурство в полном составе. Готовы принять оперативную обстановку по участку.', false));
  msgs.appendChild(msgBubble('Диспетчер Москаленко М.Д. (Смена А)', '09:16', 'Отлично. Сформировал карточку передачи по участку №4 в модуле смены. Проверь и подтверди приём.', true));
  chatArea.appendChild(msgs);

  // Bottom input bar
  const inpBar = figma.createFrame();
  inpBar.resize(1116, 76);
  inpBar.primaryAxisSizingMode = 'FIXED';
  inpBar.counterAxisSizingMode = 'FIXED';
  inpBar.fills = fill(C.cardBg);
  inpBar.strokes = fill(C.cardBorder);
  inpBar.strokeWeight = 1;
  inpBar.layoutMode = 'HORIZONTAL';
  inpBar.counterAxisAlignItems = 'CENTER';
  inpBar.paddingLeft = 24;
  inpBar.paddingRight = 24;
  inpBar.itemSpacing = 16;

  const fld = figma.createFrame();
  fld.layoutGrow = 1;
  fld.resize(920, 44);
  fld.cornerRadius = 8;
  fld.fills = fill(C.subtleCardBg);
  fld.strokes = fill(C.cardBorder);
  fld.strokeWeight = 1;
  fld.layoutMode = 'HORIZONTAL';
  fld.counterAxisAlignItems = 'CENTER';
  fld.paddingLeft = 16;
  fld.appendChild(createText('Введите оперативное сообщение в канал #общая-диспетчерская...', 13, 'Regular', C.textMuted));
  inpBar.appendChild(fld);

  inpBar.appendChild(createButton('Отправить ➤', C.btnPrimaryBg, C.textOnDark, 44));
  chatArea.appendChild(inpBar);

  s2.appendChild(chatArea);
}

// Helper for Shift Handover Screens
function buildShiftScreen(name, xPos, activeTitle, taskState) {
  const s = figma.createFrame();
  s.name = name;
  s.resize(1440, 900);
  s.x = xPos;
  s.y = 0;
  s.fills = fill(C.bgCanvas);
  page.appendChild(s);
  createdFrames.push(s.id);

  s.appendChild(createTopHeader(activeTitle));

  // Main container (absolute position)
  const cont = figma.createFrame();
  cont.name = 'Container';
  cont.x = 40;
  cont.y = 80;
  cont.resize(1360, 780);
  cont.fills = [];

  // Title Box
  const tBox = figma.createFrame();
  tBox.x = 0;
  tBox.y = 0;
  tBox.resize(1360, 60);
  tBox.layoutMode = 'VERTICAL';
  tBox.itemSpacing = 4;
  tBox.fills = [];
  tBox.appendChild(createText('Передача смены', 28, 'Bold', C.textDark));
  tBox.appendChild(createText('Исходящая смена передаёт задачу с ближайшим действием. Входящая подтверждает приём и отмечает выполнение.', 14, 'Regular', C.textMuted));
  cont.appendChild(tBox);

  // Left Card: Outgoing form (absolute)
  const leftCard = figma.createFrame();
  leftCard.x = 0;
  leftCard.y = 70;
  leftCard.resize(520, 650);
  leftCard.cornerRadius = 16;
  leftCard.fills = fill(C.cardBg);
  leftCard.strokes = fill(C.cardBorder);
  leftCard.strokeWeight = 1;
  leftCard.layoutMode = 'VERTICAL';
  leftCard.paddingLeft = 28;
  leftCard.paddingRight = 28;
  leftCard.paddingTop = 28;
  leftCard.paddingBottom = 28;
  leftCard.itemSpacing = 20;

  leftCard.appendChild(createText('Исходящая смена', 18, 'Bold', C.textDark));

  function inputField(lbl, val, h = 44) {
    const f = figma.createFrame();
    f.layoutMode = 'VERTICAL';
    f.itemSpacing = 6;
    f.fills = [];
    f.appendChild(createText(lbl, 12, 'Semi Bold', C.textDark));
    const inp = figma.createFrame();
    inp.resize(464, h);
    inp.cornerRadius = 8;
    inp.fills = fill(C.subtleCardBg);
    inp.strokes = fill(C.cardBorder);
    inp.strokeWeight = 1;
    inp.layoutMode = 'HORIZONTAL';
    inp.counterAxisAlignItems = h > 50 ? 'MIN' : 'CENTER';
    inp.paddingLeft = 14;
    inp.paddingTop = h > 50 ? 10 : 0;
    inp.appendChild(createText(val, 13, 'Regular', taskState === 'pending' ? C.textDark : C.textMuted));
    f.appendChild(inp);
    return f;
  }

  leftCard.appendChild(inputField('Задача *', taskState === 'pending' ? 'Уточнить готовность участка' : 'Например, уточнить готовность участка'));
  leftCard.appendChild(inputField('Ближайшее действие *', taskState === 'pending' ? 'Связаться с дежурным и зафиксировать ответ в рабочем журнале.' : 'Что сделать и с кем связаться', 80));
  leftCard.appendChild(inputField('Получатель *', 'Диспетчер смены Б (Интулов А.А.)'));

  leftCard.appendChild(createButton('Передать задачу', C.btnPrimaryBg, C.textOnDark, 44));
  cont.appendChild(leftCard);

  // Right Card: Journal (absolute)
  const rightCard = figma.createFrame();
  rightCard.x = 552;
  rightCard.y = 70;
  rightCard.resize(808, 650);
  rightCard.cornerRadius = 16;
  rightCard.fills = fill(C.cardBg);
  rightCard.strokes = fill(C.cardBorder);
  rightCard.strokeWeight = 1;
  rightCard.layoutMode = 'VERTICAL';
  rightCard.paddingLeft = 28;
  rightCard.paddingRight = 28;
  rightCard.paddingTop = 28;
  rightCard.paddingBottom = 28;
  rightCard.itemSpacing = 18;

  // Journal Header
  const jHead = figma.createFrame();
  jHead.resize(752, 32);
  jHead.layoutMode = 'HORIZONTAL';
  jHead.counterAxisAlignItems = 'CENTER';
  jHead.fills = [];
  const jt = createText('Журнал передачи', 18, 'Bold', C.textDark);
  jt.layoutGrow = 1;
  jHead.appendChild(jt);

  let counterBadge;
  if (taskState === 'pending') {
    counterBadge = createBadge('Ждут приёма: 1', C.pendingBg, C.pendingText, C.pendingBorder);
  } else if (taskState === 'accepted') {
    counterBadge = createBadge('В работе: 1 • Ждут приёма: 0', C.acceptedBg, C.acceptedText, C.acceptedBorder);
  } else {
    counterBadge = createBadge('Все задачи выполнены ✓', C.doneBg, C.doneText, C.doneBorder);
  }
  jHead.appendChild(counterBadge);
  rightCard.appendChild(jHead);

  // Task Box
  const tBoxItem = figma.createFrame();
  tBoxItem.resize(752, taskState === 'done' ? 175 : 195);
  tBoxItem.cornerRadius = 12;
  tBoxItem.fills = fill(C.subtleCardBg);
  tBoxItem.strokes = fill(taskState === 'accepted' ? C.acceptedBorder : (taskState === 'done' ? C.doneBorder : C.cardBorder));
  tBoxItem.strokeWeight = taskState === 'accepted' ? 1.5 : 1;
  tBoxItem.layoutMode = 'VERTICAL';
  tBoxItem.paddingLeft = 20;
  tBoxItem.paddingRight = 20;
  tBoxItem.paddingTop = 16;
  tBoxItem.paddingBottom = 16;
  tBoxItem.itemSpacing = 10;

  const tHeadRow = figma.createFrame();
  tHeadRow.resize(712, 24);
  tHeadRow.layoutMode = 'HORIZONTAL';
  tHeadRow.counterAxisAlignItems = 'CENTER';
  tHeadRow.fills = [];
  const tn = createText('Уточнить готовность участка', 16, 'Bold', C.textDark);
  tn.layoutGrow = 1;
  tHeadRow.appendChild(tn);

  if (taskState === 'pending') {
    tHeadRow.appendChild(createBadge('Ждёт приёма', C.pendingBg, C.pendingText, C.pendingBorder));
  } else if (taskState === 'accepted') {
    tHeadRow.appendChild(createBadge('Принята в работу', C.acceptedBg, C.acceptedText, C.acceptedBorder));
  } else {
    tHeadRow.appendChild(createBadge('Выполнена', C.doneBg, C.doneText, C.doneBorder));
  }
  tBoxItem.appendChild(tHeadRow);

  tBoxItem.appendChild(createText('Связаться с дежурным и зафиксировать ответ в рабочем журнале.', 13, 'Regular', C.textDark));
  tBoxItem.appendChild(createText('Получатель: Диспетчер смены Б (Интулов А.А.)', 12, 'Medium', C.textMuted));

  if (taskState === 'pending') {
    tBoxItem.appendChild(createText('• 09:20 — Диспетчер Москаленко (Смена А) передал задачу', 11, 'Regular', C.textLight));
    tBoxItem.appendChild(createButton('Подтвердить приём', null, C.btnPrimaryBg, 38, C.btnPrimaryBg));
  } else if (taskState === 'accepted') {
    tBoxItem.appendChild(createText('• 09:20 — Диспетчер Москаленко (Смена А) передал задачу', 11, 'Regular', C.textLight));
    tBoxItem.appendChild(createText('• 09:22 — Диспетчер Интулов (Смена Б) подтвердил приём задачи', 11, 'Medium', C.acceptedText));
    tBoxItem.appendChild(createButton('✓ Отметить выполнение', C.btnPrimaryBg, C.textOnDark, 38));
  } else {
    tBoxItem.appendChild(createText('• 09:20 — Диспетчер Москаленко (Смена А) передал задачу', 11, 'Regular', C.textLight));
    tBoxItem.appendChild(createText('• 09:22 — Диспетчер Интулов (Смена Б) подтвердил приём', 11, 'Regular', C.textLight));
    tBoxItem.appendChild(createText('• 09:35 — Диспетчер Интулов (Смена Б) выполнил: готовность участка подтверждена.', 11, 'Semi Bold', C.doneText));
  }
  rightCard.appendChild(tBoxItem);

  if (taskState === 'done') {
    const tBox2 = figma.createFrame();
    tBox2.resize(752, 130);
    tBox2.cornerRadius = 12;
    tBox2.fills = fill(C.subtleCardBg);
    tBox2.strokes = fill(C.doneBorder);
    tBox2.strokeWeight = 1;
    tBox2.layoutMode = 'VERTICAL';
    tBox2.paddingLeft = 20;
    tBox2.paddingRight = 20;
    tBox2.paddingTop = 14;
    tBox2.paddingBottom = 14;
    tBox2.itemSpacing = 6;

    const row2 = figma.createFrame();
    row2.resize(712, 22);
    row2.layoutMode = 'HORIZONTAL';
    row2.counterAxisAlignItems = 'CENTER';
    row2.fills = [];
    const t2n = createText('Контроль температурного режима стрелочных переводов', 15, 'Bold', C.textDark);
    t2n.layoutGrow = 1;
    row2.appendChild(t2n);
    row2.appendChild(createBadge('Выполнена', C.doneBg, C.doneText, C.doneBorder));
    tBox2.appendChild(row2);

    tBox2.appendChild(createText('Обогрев стрелок включен штатно, температура в пределах нормы (-4°C).', 13, 'Regular', C.textDark));
    tBox2.appendChild(createText('• 08:30 — Смена А передала | 08:32 — Смена Б приняла | 08:50 — Выполнено', 11, 'Regular', C.textLight));
    rightCard.appendChild(tBox2);
  }

  const btm = figma.createFrame();
  btm.resize(752, 40);
  btm.layoutMode = 'HORIZONTAL';
  btm.primaryAxisAlignItems = 'MAX';
  btm.counterAxisAlignItems = 'CENTER';
  btm.fills = [];
  btm.appendChild(createButton(taskState === 'done' ? 'Сбросить демо / Начать новую смену' : 'Сбросить демо', null, C.textMuted, 36, C.cardBorder));
  rightCard.appendChild(btm);

  cont.appendChild(rightCard);
  s.appendChild(cont);
}

buildShiftScreen('03 — Передача смены (Создание задачи)', 3080, 'Передача смены — Создание', 'pending');
buildShiftScreen('04 — Передача смены (Подтверждение приёма)', 4620, 'Передача смены — Принято', 'accepted');
buildShiftScreen('05 — Передача смены (Завершено и Аудит)', 6160, 'Передача смены — Завершено', 'done');

return {
  status: "perfect_success",
  framesCount: createdFrames.length,
  frameIds: createdFrames
};

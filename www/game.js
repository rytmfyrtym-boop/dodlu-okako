/* =========================================================
   DOODLE GARDEN v2 — жизни, рекорды, боссы, скины, продажа,
   розыгрыши и админ-панель
   ========================================================= */

const STORAGE_KEY = 'doodle_garden_save_v1';
const ADMIN_CODE = '232308';
const INF_COINS = 999999999;

if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    r = Math.min(r || 0, w / 2, h / 2);
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
  };
}

const RARITY = {
  common: { label: 'ОБЫЧНЫЙ', color: '#94a3b8' },
  rare:   { label: 'РЕДКИЙ',  color: '#3b82f6' },
  epic:   { label: 'ЭПИК',    color: '#a855f7' },
  legend: { label: 'ЛЕГЕНДА', color: '#f59e0b' },
  secret: { label: 'СЕКРЕТ',  color: '#ff2d95' }
};

/* Бонусы скинов (все реализованы в движке):
   gardenMult, jumpMult, coinMult, speedMult, gravMult, bossDmg, startShield,
   neonTrail, extraLife, multiShot, invuln, bossHeal, magnetBonus, pierce, shieldOnBoss */
const SKINS = [
  { id: 'classic',   name: 'Классический',   emoji: '🟢', color: '#4ade80', belly: '#bbf7d0', rarity: 'common', bonusText: 'Классика жанра', bonus: {} },
  { id: 'gardener',  name: 'Садовник',       emoji: '👒', color: '#22c55e', belly: '#dcfce7', rarity: 'common', bonusText: '+15% доход сада', bonus: { gardenMult: 0.15 } },
  { id: 'cactus',    name: 'Кактус',         emoji: '🌵', color: '#15803d', belly: '#86efac', rarity: 'common', bonusText: '+10% к прыжку', bonus: { jumpMult: 0.10 } },
  { id: 'bee',       name: 'Пчёлка-Дуд',     emoji: '🐝', color: '#eab308', belly: '#fef08a', rarity: 'common', bonusText: '+10% ококи, мягче падение', bonus: { coinMult: 0.10, gravMult: -0.05 } },
  { id: 'cat',       name: 'Кот-Дуд',        emoji: '🐱', color: '#fb923c', belly: '#fed7aa', rarity: 'rare',   bonusText: '+1 жизнь, +18% ококи', bonus: { coinMult: 0.18, extraLife: 1 } },
  { id: 'ninja',     name: 'Ниндзя',         emoji: '🥷', color: '#334155', belly: '#94a3b8', rarity: 'rare',   bonusText: 'Тройной выстрел, +20% скорость', bonus: { speedMult: 0.20, multiShot: 3 } },
  { id: 'ghost',     name: 'Призрак',        emoji: '👻', color: '#e2e8f0', belly: '#ffffff', rarity: 'rare',   bonusText: 'Дольше неуязвим после удара', bonus: { gravMult: -0.10, invuln: 70 } },
  { id: 'vampire',   name: 'Вампир',         emoji: '🧛', color: '#991b1b', belly: '#fca5a5', rarity: 'rare',   bonusText: '+1 урон боссам, жизнь за босса', bonus: { bossDmg: 1, bossHeal: 1 } },
  { id: 'astro',     name: 'Космонавт',      emoji: '👨‍🚀', color: '#38bdf8', belly: '#e0f2fe', rarity: 'epic',   bonusText: 'Низкая гравитация, +12% ококи', bonus: { gravMult: -0.15, coinMult: 0.12 } },
  { id: 'robot',     name: 'Киборг',         emoji: '🤖', color: '#64748b', belly: '#38bdf8', rarity: 'epic',   bonusText: 'Щит на старте и за каждого босса', bonus: { startShield: true, shieldOnBoss: true } },
  { id: 'cyber',     name: 'Неон-Панк',      emoji: '⚡', color: '#c084fc', belly: '#f0abfc', rarity: 'epic',   bonusText: '+28% ококи и неон-след', bonus: { coinMult: 0.28, neonTrail: true } },
  { id: 'wizard',    name: 'Архимаг',        emoji: '🧙', color: '#6366f1', belly: '#c7d2fe', rarity: 'epic',   bonusText: 'Мощный магнит, +25% сад, +1 урон', bonus: { gardenMult: 0.25, bossDmg: 1, magnetBonus: 70 } },
  { id: 'samurai',   name: 'Самурай',        emoji: '⚔️', color: '#dc2626', belly: '#fecaca', rarity: 'epic',   bonusText: 'Пробивающие выстрелы, +15% прыжок', bonus: { jumpMult: 0.15, bossDmg: 1, pierce: true } },
  { id: 'slimeking', name: 'Король Слаймов', emoji: '🧪', color: '#10b981', belly: '#a7f3d0', rarity: 'epic',   bonusText: '+30% сад, +5% прыжок', bonus: { gardenMult: 0.30, jumpMult: 0.05 } },
  { id: 'dragon',    name: 'Дракончик',      emoji: '🐉', color: '#ef4444', belly: '#fde047', rarity: 'legend', bonusText: 'Огненные выстрелы, +20% прыжок, +30% ококи', bonus: { jumpMult: 0.20, coinMult: 0.30, pierce: true } },
  { id: 'king',      name: 'Золотой Король', emoji: '👑', color: '#facc15', belly: '#fef08a', rarity: 'legend', bonusText: '+55% сад и +45% ококи', bonus: { gardenMult: 0.55, coinMult: 0.45 } },
  { id: 'diamond',   name: 'Алмазный Дуд',   emoji: '💎', color: '#22d3ee', belly: '#cffafe', rarity: 'legend', bonusText: '+1 жизнь, щит, +40% ококи, +35% сад', bonus: { startShield: true, coinMult: 0.40, gardenMult: 0.35, extraLife: 1 } },
  { id: 'galaxy',    name: 'Бог Галактики',  emoji: '🌌', color: '#a855f7', belly: '#38bdf8', rarity: 'legend', bonusText: '+1 жизнь, щит, тройной выстрел, +2 урон, +50% ококи', bonus: { startShield: true, coinMult: 0.50, bossDmg: 2, neonTrail: true, extraLife: 1, multiShot: 3 } },

  { id: 'femboy',    name: 'Фембой',         emoji: '🎀', color: '#f9a8d4', belly: '#fdf2f8', rarity: 'legend', bonusText: '+1 жизнь, +35% ококи и сад, мягкое падение', bonus: { coinMult: 0.35, gardenMult: 0.35, gravMult: -0.10, extraLife: 1, invuln: 60 } },
  { id: 'paimon',    name: 'Паймон-Дуд (Геншин)', emoji: '🧚', color: '#e2e8f0', belly: '#fde68a', rarity: 'epic', bonusText: 'Парит, мощный магнит, +30% ококи', bonus: { gravMult: -0.20, magnetBonus: 120, coinMult: 0.30 } },

  // СЕКРЕТНЫЕ скины: выпадают только в казино (Секрет-кейс, слоты 777) или от админа
  { id: 'nikita',    name: 'Никита Фем',     emoji: '💖', color: '#ff2d95', belly: '#ffd1ea', rarity: 'secret', bonusText: '+4 жизни, ×5 ококи и сад, 5 пуль, +6 урон, парение (ТОП-1)', bonus: { extraLife: 4, startShield: true, coinMult: 4, gardenMult: 4, bossDmg: 6, multiShot: 5, pierce: true, neonTrail: true, magnetBonus: 250, jumpMult: 0.28, gravMult: -0.28, speedMult: 0.20, invuln: 150, bossHeal: 1, shieldOnBoss: true } },
  { id: 'gemeni',    name: 'Gemeni-Дуд',     emoji: '✨', color: '#38bdf8', belly: '#e0f2fe', rarity: 'secret', bonusText: '+3 жизни, ×4 ококи, ×4 сад, парение, +4 урон', bonus: { extraLife: 3, startShield: true, coinMult: 3, gardenMult: 3, bossDmg: 4, multiShot: 3, pierce: true, neonTrail: true, magnetBonus: 200, gravMult: -0.25, shieldOnBoss: true, bossHeal: 1 } },
  { id: 'admin',     name: 'АДМИН',          emoji: '🛡️', color: '#facc15', belly: '#ffffff', rarity: 'secret', adminOnly: true, bonusText: 'ВСЁ НА МАКСИМУМ: ×9 ококи и сад, +8 жизней, +12 урон', bonus: { extraLife: 8, startShield: true, coinMult: 8, gardenMult: 8, bossDmg: 12, multiShot: 7, pierce: true, neonTrail: true, magnetBonus: 350, jumpMult: 0.30, gravMult: -0.30, speedMult: 0.30, invuln: 220, bossHeal: 1, shieldOnBoss: true } }
];

const SEEDS = {
  common: { id: 'common', name: 'Росток Дуда',      emoji: '🌱', grownEmoji: '🟢', growSec: 18,  baseIncome: 1.5, cost: 35,   rarity: 'common' },
  rare:   { id: 'rare',   name: 'Синий Дуд-Цветок', emoji: '🫐', grownEmoji: '🔵', growSec: 40,  baseIncome: 5,   cost: 140,  rarity: 'rare' },
  epic:   { id: 'epic',   name: 'Неоновый Дуд',     emoji: '🔮', grownEmoji: '🟣', growSec: 80,  baseIncome: 15,  cost: 450,  rarity: 'epic' },
  legend: { id: 'legend', name: 'Золотой Дуд-Бог',  emoji: '🌟', grownEmoji: '👑', growSec: 150, baseIncome: 45,  cost: 1400, rarity: 'legend' }
};

const UPGRADES = [
  { id: 'magnet',   name: 'Магнит ококов',  icon: '🧲', desc: 'Притягивает ококи и семена',  baseCost: 100, maxLv: 5 },
  { id: 'jetpack',  name: 'Турбо-Ранец',    icon: '🚀', desc: 'Дольше полёт на джетпаке',    baseCost: 130, maxLv: 5 },
  { id: 'springs',  name: 'Супер-Пружины',  icon: '🌀', desc: 'Чаще появляются пружинки',    baseCost: 90,  maxLv: 5 },
  { id: 'coinMult', name: 'Золотая жила',   icon: '💰', desc: '+25% ококов за уровень',      baseCost: 180, maxLv: 5 },
  { id: 'garden',   name: 'Удобрение сада', icon: '💧', desc: '+30% пассивного дохода сада', baseCost: 220, maxLv: 5 }
];

const PLOT_UNLOCK_COSTS = [0, 0, 0, 120, 320, 750, 1500, 3000, 6000];

const CASES = {
  common: { cost: 120,  weights: { common: 62, rare: 30, epic: 7,  legend: 1 } },
  epic:   { cost: 450,  weights: { common: 15, rare: 45, epic: 31, legend: 9 } },
  legend: { cost: 1400, weights: { common: 0,  rare: 0,  epic: 60, legend: 40 } },
  secret: { cost: 25000, weights: { common: 0, rare: 0, epic: 34, legend: 56, secret: 10 } }
};

const BOSS_TEMPLATES = [
  { name: 'Гигантский Слизень', emoji: '🟢', hp: 10, reward: 180, speed: 1.6, fireRate: 120 },
  { name: 'Король НЛО',         emoji: '🛸', hp: 15, reward: 300, speed: 2.1, fireRate: 105 },
  { name: 'Неоновый Дракон',    emoji: '🐲', hp: 22, reward: 480, speed: 2.5, fireRate: 90 },
  { name: 'Тёмный Дуд-Лорд',    emoji: '😈', hp: 30, reward: 750, speed: 2.9, fireRate: 80 }
];

const BOT_NAMES = ['Dud_Master', 'ОкокоКороль', 'FemBoyFan', 'ПрыгунТоп', 'Садовод228', 'NeonDud', 'Кактусёнок', 'GemeniFan'];

const PETS = [
  { id: 'drone',  name: 'Мини-Дрон',       emoji: '🤖', cost: 400,  desc: 'Сам стреляет во врагов и боссов' },
  { id: 'bee',    name: 'Магнит-Пчёлка',   emoji: '🐝', cost: 600,  desc: 'Мощный магнит (+120) и +15% ококи' },
  { id: 'angel',  name: 'Ангел-Хранитель', emoji: '👼', cost: 1200, desc: 'Даёт щит каждые 25 сек в забеге' },
  { id: 'dragon', name: 'Мини-Дракон',     emoji: '🐉', cost: 3000, desc: 'Стреляет + +30% ококи + Fever быстрее' }
];

/* ---------- Sound ---------- */
const Sound = {
  ctx: null,
  enabled: true,
  init() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },
  beep(freq, dur, type = 'sine', vol = 0.12, slide = 0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, this.ctx.currentTime);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), this.ctx.currentTime + dur);
    g.gain.setValueAtTime(vol, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    o.connect(g);
    g.connect(this.ctx.destination);
    o.start();
    o.stop(this.ctx.currentTime + dur);
  },
  jump()   { this.beep(320, 0.11, 'sine', 0.10, 220); },
  spring() { this.beep(260, 0.24, 'triangle', 0.14, 600); },
  coin()   { this.beep(880, 0.08, 'sine', 0.10, 320); },
  break()  { this.beep(160, 0.12, 'sawtooth', 0.09, -90); },
  shoot()  { this.beep(520, 0.08, 'square', 0.07, -260); },
  hit()    { this.beep(120, 0.25, 'sawtooth', 0.14, -70); },
  win()    { this.beep(523, 0.12, 'triangle', 0.12); setTimeout(() => this.beep(659, 0.12, 'triangle', 0.12), 110); setTimeout(() => this.beep(784, 0.2, 'triangle', 0.14), 220); }
};

/* ---------- Save State ---------- */
function defaultGiveaways() {
  return [{
    id: 'g_start',
    title: 'Стартовый розыгрыш от админа',
    prize: 5000,
    bots: BOT_NAMES.slice(0, 5),
    joined: false,
    ended: false,
    winner: null
  }];
}

function defaultState() {
  return {
    coins: 120,
    bestScore: 0,
    equippedSkin: 'classic',
    unlockedSkins: ['classic'],
    seeds: { common: 2, rare: 0, epic: 0, legend: 0 },
    selectedSeed: 'common',
    plots: Array.from({ length: 9 }, (_, i) => ({
      unlocked: i < 3, seedId: null, plantedAt: 0, growBonusSec: 0, grown: false, level: 1, tier: 1
    })),
    gardenBank: 0,
    upgrades: { magnet: 0, jetpack: 0, springs: 0, coinMult: 0, garden: 0 },
    sound: true,
    tilt: false,
    inf: false,
    god: false,
    rebirth: 0,
    ownedPets: [],
    equippedPet: null,
    daily: { streak: 0, lastClaim: '' },
    quests: { date: '', list: [] },
    giveaways: defaultGiveaways(),
    lastSaved: Date.now()
  };
}

let state = defaultState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = Object.assign(defaultState(), parsed);
      state.seeds = Object.assign(defaultState().seeds, parsed.seeds || {});
      state.upgrades = Object.assign(defaultState().upgrades, parsed.upgrades || {});
      state.daily = Object.assign(defaultState().daily, parsed.daily || {});
      state.quests = Object.assign(defaultState().quests, parsed.quests || {});
      if (!Array.isArray(state.plots) || state.plots.length !== 9) state.plots = defaultState().plots;
      state.plots.forEach(p => { if (!p.tier) p.tier = 1; });
      if (!Array.isArray(state.ownedPets)) state.ownedPets = [];
      if (!Array.isArray(state.giveaways)) state.giveaways = defaultGiveaways();
    }
  } catch (e) { console.warn('Load failed', e); }
  Sound.enabled = state.sound;
  ensureTodayQuests();
  processOfflineIncome();
}

function saveState() {
  if (state.inf) state.coins = INF_COINS;
  state.lastSaved = Date.now();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

function getEquippedSkin() {
  return SKINS.find(s => s.id === state.equippedSkin) || SKINS[0];
}

function getGardenIncomePerSec() {
  let total = 0;
  for (const p of state.plots) {
    if (p.unlocked && p.grown && p.seedId && SEEDS[p.seedId]) {
      total += SEEDS[p.seedId].baseIncome * (1 + (p.level - 1) * 0.6) * Math.pow(3, (p.tier || 1) - 1);
    }
  }
  const skinMult = 1 + (getEquippedSkin().bonus.gardenMult || 0);
  const upgMult = 1 + (state.upgrades.garden || 0) * 0.30;
  const rebMult = 1 + (state.rebirth || 0);
  return total * skinMult * upgMult * rebMult;
}

function processOfflineIncome() {
  const now = Date.now();
  const elapsedSec = Math.min(8 * 3600, Math.max(0, (now - (state.lastSaved || now)) / 1000));
  for (const p of state.plots) {
    if (p.unlocked && p.seedId && !p.grown) {
      const done = (now - p.plantedAt) / 1000 + (p.growBonusSec || 0);
      if (done >= SEEDS[p.seedId].growSec) p.grown = true;
    }
  }
  const earned = Math.floor(getGardenIncomePerSec() * elapsedSec);
  if (elapsedSec > 15 && earned >= 5) {
    state.gardenBank += earned;
    document.getElementById('offline-amount').textContent = `+${earned} ококи`;
    document.getElementById('modal-offline').classList.remove('hidden');
  }
}

/* ---------- UI Helpers ---------- */
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2400);
}

function fmt(n) {
  n = Math.floor(n);
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e4) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
}

function updateTopHUD() {
  if (state.inf) state.coins = INF_COINS;
  document.getElementById('ui-coins').textContent = state.inf ? '∞' : fmt(state.coins);
  document.getElementById('ui-income').textContent = `+${getGardenIncomePerSec().toFixed(1)}/с`;
  document.getElementById('ui-best').textContent = fmt(state.bestScore);
  document.getElementById('btn-sound').textContent = state.sound ? '🔊' : '🔇';
  document.getElementById('garden-bank').textContent = fmt(state.gardenBank);
  const cb = document.getElementById('casino-balance');
  if (cb) cb.textContent = state.inf ? '∞' : fmt(state.coins);
}

/* ---------- Doodle drawing ---------- */
function drawDoodle(ctx, x, y, w, h, skin, facing = 1, hasShield = false, hasJetpack = false) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);

  if (hasShield) {
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.85, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.9)';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
    ctx.fill();
    ctx.stroke();
  }

  if (hasJetpack) {
    ctx.fillStyle = '#f97316';
    ctx.fillRect(-w * 0.62, -6, 10, 22);
    ctx.fillRect(w * 0.62 - 10, -6, 10, 22);
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(-w * 0.58, 16);
    ctx.lineTo(-w * 0.45, 32 + Math.random() * 10);
    ctx.lineTo(-w * 0.35, 16);
    ctx.fill();
  }

  ctx.scale(facing, 1);

  ctx.fillStyle = skin.color;
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, 14);
  ctx.fill();

  ctx.fillStyle = skin.belly;
  ctx.beginPath();
  ctx.ellipse(2, 6, w * 0.3, h * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = skin.color;
  ctx.beginPath();
  ctx.roundRect(w * 0.25, -8, 14, 10, 5);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(4, -8, 3.2, 0, Math.PI * 2);
  ctx.arc(13, -8, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(5, -9, 1.1, 0, Math.PI * 2);
  ctx.arc(14, -9, 1.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = skin.color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-8, h / 2); ctx.lineTo(-10, h / 2 + 6);
  ctx.moveTo(0, h / 2);  ctx.lineTo(0, h / 2 + 6);
  ctx.moveTo(8, h / 2);  ctx.lineTo(10, h / 2 + 6);
  ctx.stroke();

  if (skin.id !== 'classic') {
    ctx.scale(facing, 1);
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(skin.emoji, 0, -h / 2 - 2);
  }

  ctx.restore();
}

function updateStartPreview() {
  const skin = getEquippedSkin();
  document.getElementById('start-skin-name').textContent = skin.name;
  document.getElementById('start-skin-bonus').textContent = skin.bonusText;
  const c = document.getElementById('preview-canvas');
  const cx = c.getContext('2d');
  cx.clearRect(0, 0, c.width, c.height);
  drawDoodle(cx, 26, 28, 44, 44, skin, 1, !!skin.bonus.startShield, false);
}

/* ---------- Selling ---------- */
function seedSellPrice(id) { return Math.floor(SEEDS[id].cost * 0.5); }

function plantSellPrice(p) {
  const s = SEEDS[p.seedId];
  let v = s.cost * 0.6;
  for (let l = 1; l < p.level; l++) v += Math.floor(s.cost * 0.8 * Math.pow(1.6, l - 1)) * 0.5;
  return Math.floor(v);
}

function growingSellPrice(p) { return Math.floor(SEEDS[p.seedId].cost * 0.3); }

function sellSeed(all) {
  const sid = state.selectedSeed;
  const have = state.seeds[sid] || 0;
  if (have <= 0) { showToast('Нет таких семян для продажи'); return; }
  const n = all ? have : 1;
  const gain = n * seedSellPrice(sid);
  state.seeds[sid] = have - n;
  state.coins += gain;
  Sound.coin();
  showToast(`Продано: ${n} шт. за ${gain} ококи`);
  saveState(); updateTopHUD(); renderGarden();
}

/* ---------- Garden ---------- */
function renderGarden() {
  const seedsBar = document.getElementById('seeds-bar');
  seedsBar.innerHTML = '';
  Object.values(SEEDS).forEach(s => {
    const count = state.seeds[s.id] || 0;
    const btn = document.createElement('button');
    btn.className = 'seed-chip' + (state.selectedSeed === s.id ? ' selected' : '');
    btn.style.borderColor = state.selectedSeed === s.id ? '#4ade80' : RARITY[s.rarity].color;
    btn.innerHTML = `<span>${s.emoji}</span><span>${s.name}</span><strong>×${count}</strong>`;
    btn.onclick = () => { state.selectedSeed = s.id; renderGarden(); };
    seedsBar.appendChild(btn);
  });

  const sid = state.selectedSeed;
  const cnt = state.seeds[sid] || 0;
  const pr = seedSellPrice(sid);
  document.getElementById('btn-sell-seed').textContent = `💸 Продать 1 (+${pr})`;
  document.getElementById('btn-sell-all-seeds').textContent = `💸 Продать все ×${cnt} (+${cnt * pr})`;

  const grid = document.getElementById('garden-grid');
  grid.innerHTML = '';
  const now = Date.now();

  state.plots.forEach((p, idx) => {
    const card = document.createElement('div');
    const tierCls = p.unlocked && p.grown && (p.tier || 1) > 1 ? ` tier-${p.tier}` : '';
    card.className = 'plot-card' + (!p.unlocked ? ' locked' : '') + tierCls;
    card.dataset.idx = idx;

    if (!p.unlocked) {
      const cost = PLOT_UNLOCK_COSTS[idx];
      card.innerHTML = `
        <div class="plot-emoji">🔒</div>
        <div class="plot-name">Грядка #${idx + 1}</div>
        <div class="plot-sub">Открыть за ${cost} ококи</div>`;
      card.onclick = () => {
        if (state.coins >= cost) {
          state.coins -= cost;
          p.unlocked = true;
          Sound.win();
          showToast(`Грядка #${idx + 1} открыта!`);
          saveState(); updateTopHUD(); renderGarden();
        } else showToast(`Нужно ${cost} ококи`);
      };
    } else if (!p.seedId) {
      card.innerHTML = `
        <div class="plot-emoji">🟫</div>
        <div class="plot-name">Пустая грядка</div>
        <div class="plot-sub">Нажми, чтобы посадить</div>`;
      card.onclick = () => {
        const s2 = state.selectedSeed;
        if ((state.seeds[s2] || 0) <= 0) { showToast('Нет этих семян! Купи в Магазине или выбей в игре'); return; }
        state.seeds[s2]--;
        p.seedId = s2;
        p.plantedAt = Date.now();
        p.growBonusSec = 0;
        p.grown = false;
        p.level = 1;
        Sound.coin();
        saveState(); updateTopHUD(); renderGarden();
      };
    } else if (!p.grown) {
      const s = SEEDS[p.seedId];
      const elapsed = (now - p.plantedAt) / 1000 + (p.growBonusSec || 0);
      const pct = Math.min(100, (elapsed / s.growSec) * 100);
      const rem = Math.max(0, Math.ceil(s.growSec - elapsed));
      card.innerHTML = `
        <div class="plot-emoji">${s.emoji}</div>
        <div class="plot-name">${s.name}</div>
        <div class="plot-sub">💧 Полить (-5с) • <span class="plot-rem">${rem}</span>с</div>
        <div class="plot-progress"><div class="plot-progress-fill" style="width:${pct}%"></div></div>
        <button class="plot-sell-btn">🗑 Продать +${growingSellPrice(p)}</button>`;
      card.onclick = () => {
        p.growBonusSec = (p.growBonusSec || 0) + 5;
        Sound.jump();
        addQuestProgress('garden', 1);
        tickGarden();
      };
      card.querySelector('.plot-sell-btn').onclick = (e) => {
        e.stopPropagation();
        state.coins += growingSellPrice(p);
        p.seedId = null; p.grown = false; p.level = 1; p.growBonusSec = 0; p.tier = 1;
        Sound.coin(); saveState(); updateTopHUD(); renderGarden();
      };
    } else {
      const s = SEEDS[p.seedId];
      const tier = p.tier || 1;
      const tierBadge = tier === 3 ? '🌈 ' : tier === 2 ? '🌟 ' : '';
      const inc = (s.baseIncome * (1 + (p.level - 1) * 0.6) * Math.pow(3, tier - 1)).toFixed(1);
      const upgCost = Math.floor(s.cost * 0.8 * Math.pow(1.6, p.level - 1));
      card.innerHTML = `
        <div class="plot-emoji">${tierBadge}${s.grownEmoji}</div>
        <div class="plot-name">${tier === 3 ? 'Радужный ' : tier === 2 ? 'Мега ' : ''}${s.name}</div>
        <div class="plot-income">+${inc}/с • Ур.${p.level}</div>
        <button class="plot-upgrade-btn">⬆ ${upgCost} ококи</button>
        <button class="plot-sell-btn">💸 Продать +${plantSellPrice(p)}</button>`;
      card.querySelector('.plot-upgrade-btn').onclick = (e) => {
        e.stopPropagation();
        if (state.coins >= upgCost) {
          state.coins -= upgCost;
          p.level++;
          Sound.win();
          addQuestProgress('garden', 1);
          saveState(); updateTopHUD(); renderGarden();
        } else showToast(`Нужно ${upgCost} ококи`);
      };
      card.querySelector('.plot-sell-btn').onclick = (e) => {
        e.stopPropagation();
        const gain = plantSellPrice(p);
        state.coins += gain;
        p.seedId = null; p.grown = false; p.level = 1; p.growBonusSec = 0; p.tier = 1;
        Sound.coin();
        showToast(`Дуд продан за ${gain} ококи`);
        saveState(); updateTopHUD(); renderGarden();
      };
    }
    grid.appendChild(card);
  });
}

function mergeGarden() {
  for (let i = 0; i < state.plots.length; i++) {
    const a = state.plots[i];
    if (!a.unlocked || !a.grown || !a.seedId || (a.tier || 1) >= 3) continue;
    for (let j = i + 1; j < state.plots.length; j++) {
      const b = state.plots[j];
      if (b.unlocked && b.grown && b.seedId === a.seedId && (b.tier || 1) === (a.tier || 1)) {
        a.tier = (a.tier || 1) + 1;
        a.level = Math.max(a.level, b.level);
        b.seedId = null; b.grown = false; b.level = 1; b.growBonusSec = 0; b.tier = 1;
        Sound.win();
        showToast(`🌟 Слияние! Получен ${a.tier === 3 ? 'Радужный' : 'Мега'} Дуд!`);
        saveState(); updateTopHUD(); renderGarden();
        return;
      }
    }
  }
  showToast('Нужны 2 выросших одинаковых Дуда одного ранга');
}

/* Обновляет прогресс роста без перерисовки (чтобы нажатия не терялись) */
function tickGarden() {
  const now = Date.now();
  let needRender = false;
  state.plots.forEach((p, idx) => {
    if (!(p.unlocked && p.seedId && !p.grown)) return;
    const s = SEEDS[p.seedId];
    const elapsed = (now - p.plantedAt) / 1000 + (p.growBonusSec || 0);
    if (elapsed >= s.growSec) { p.grown = true; needRender = true; return; }
    const card = document.querySelector(`.plot-card[data-idx="${idx}"]`);
    if (!card) return;
    const fill = card.querySelector('.plot-progress-fill');
    const rem = card.querySelector('.plot-rem');
    if (fill) fill.style.width = `${Math.min(100, (elapsed / s.growSec) * 100)}%`;
    if (rem) rem.textContent = Math.max(0, Math.ceil(s.growSec - elapsed));
  });
  if (needRender) { saveState(); renderGarden(); }
}

/* ---------- Skins & Cases ---------- */
function renderSkins() {
  document.getElementById('skin-count').textContent = `${state.unlockedSkins.length}/${SKINS.length}`;
  const grid = document.getElementById('skins-grid');
  grid.innerHTML = '';
  const heads = { common: '⚪ Обычные', rare: '🔵 Редкие', epic: '🟣 Эпические', legend: '🟠 Легендарные', secret: '🔮 СЕКРЕТНЫЕ (казино и админ)' };
  const sortedSkins = ['common', 'rare', 'epic', 'legend', 'secret'].flatMap(r => SKINS.filter(s => s.rarity === r));
  let lastRar = null;
  sortedSkins.forEach(s => {
    if (s.rarity !== lastRar) {
      lastRar = s.rarity;
      const h = document.createElement('div');
      h.className = 'skin-cat';
      h.textContent = heads[s.rarity];
      grid.appendChild(h);
    }
    const owned = state.unlockedSkins.includes(s.id);
    const eq = state.equippedSkin === s.id;
    const card = document.createElement('div');
    card.className = `skin-card rarity-${s.rarity}` + (!owned ? ' locked' : '') + (eq ? ' equipped' : '');
    const hide = s.rarity === 'secret' && !owned;
    card.innerHTML = `
      <div class="skin-avatar" style="background:${s.color}33; border: 2px solid ${s.color}">${hide ? '❓' : s.emoji}</div>
      <div class="skin-name">${hide ? '???' : s.name}</div>
      <div class="skin-bonus">${owned ? (eq ? '✅ Выбран' : s.bonusText) : (hide ? '🔒 Секрет' : '🔒 В кейсах')}</div>`;
    card.onclick = () => {
      if (!owned) { showToast(hide ? 'Секретный скин... ищи в казино 😉' : 'Выбей этот скин в кейсах выше!'); return; }
      state.equippedSkin = s.id;
      Sound.coin();
      saveState(); updateTopHUD(); updateStartPreview(); renderSkins();
      showToast(`${s.name}: ${s.bonusText}`);
    };
    grid.appendChild(card);
  });
}

function rollSkin(caseKey) {
  const cfg = CASES[caseKey];
  if (state.coins < cfg.cost) { showToast(`Не хватает ококов! Нужно ${cfg.cost} ококи`); return; }
  state.coins -= cfg.cost;
  saveState(); updateTopHUD();

  const r = Math.random() * 100;
  let acc = 0, chosenRarity = 'common';
  for (const [rar, w] of Object.entries(cfg.weights)) {
    acc += w;
    if (r <= acc) { chosenRarity = rar; break; }
  }
  const pool = SKINS.filter(s => s.rarity === chosenRarity && !s.adminOnly);
  const winner = pool[Math.floor(Math.random() * pool.length)];

  const modal = document.getElementById('modal-case');
  const track = document.getElementById('roulette-track');
  const resBox = document.getElementById('case-result');
  resBox.classList.add('hidden');
  document.getElementById('case-modal-title').textContent = 'Крутим кейс...';
  modal.classList.remove('hidden');

  const items = [];
  const winIndex = 24;
  const fillers = SKINS.filter(s => s.rarity !== 'secret');
  for (let i = 0; i < 32; i++) items.push(i === winIndex ? winner : fillers[Math.floor(Math.random() * fillers.length)]);

  track.style.transition = 'none';
  track.style.transform = 'translateX(0px)';
  track.innerHTML = items.map(it => `
    <div class="roulette-item" style="border-bottom-color:${RARITY[it.rarity].color}">
      <div>${it.emoji}</div><span>${it.name}</span>
    </div>`).join('');

  requestAnimationFrame(() => requestAnimationFrame(() => {
    const itemW = 92;
    const winCenter = winIndex * itemW + itemW / 2;
    const viewW = document.querySelector('.roulette-window').clientWidth;
    const offset = winCenter - viewW / 2 + (Math.random() * 24 - 12);
    track.style.transition = 'transform 2.6s cubic-bezier(0.12, 0.85, 0.18, 1)';
    track.style.transform = `translateX(-${offset}px)`;
  }));

  setTimeout(() => {
    Sound.win();
    document.getElementById('case-modal-title').textContent = 'Твоя награда!';
    const badge = document.getElementById('result-rarity');
    badge.textContent = RARITY[winner.rarity].label;
    badge.style.background = RARITY[winner.rarity].color;
    document.getElementById('result-name').textContent = `${winner.emoji} ${winner.name}`;
    document.getElementById('result-bonus').textContent = winner.bonusText;
    const note = document.getElementById('result-note');
    if (state.unlockedSkins.includes(winner.id)) {
      const refund = Math.floor(cfg.cost * 0.6);
      state.coins += refund;
      note.textContent = `Дубликат! Компенсация: +${refund} ококи`;
    } else {
      state.unlockedSkins.push(winner.id);
      state.equippedSkin = winner.id;
      note.textContent = '🎉 Новый скин разблокирован и надет!';
    }
    resBox.classList.remove('hidden');
    saveState(); updateTopHUD(); updateStartPreview(); renderSkins();
  }, 2700);
}

/* ---------- Shop & Rebirth & Pets ---------- */
function getRebirthCost() {
  return 5000 * Math.pow((state.rebirth || 0) + 1, 2);
}

function doRebirth() {
  const cost = getRebirthCost();
  if (state.coins < cost) { showToast(`Нужно ${fmt(cost)} ококи для перерождения`); return; }
  const keep = {
    unlockedSkins: state.unlockedSkins,
    equippedSkin: state.equippedSkin,
    ownedPets: state.ownedPets,
    equippedPet: state.equippedPet,
    bestScore: state.bestScore,
    daily: state.daily,
    quests: state.quests,
    giveaways: state.giveaways,
    inf: state.inf,
    god: state.god,
    sound: state.sound,
    tilt: state.tilt,
    rebirth: (state.rebirth || 0) + 1
  };
  state = Object.assign(defaultState(), keep);
  Sound.win();
  showToast(`♻️ Перерождение #${state.rebirth}! Навсегда ×${1 + state.rebirth} к ококам и саду!`);
  saveState(); updateTopHUD(); updateStartPreview(); renderGarden(); renderShop();
}

function renderShop() {
  const rebBox = document.getElementById('rebirth-box');
  if (rebBox) {
    const rCost = getRebirthCost();
    const curMult = 1 + (state.rebirth || 0);
    rebBox.innerHTML = `
      <h4>♻️ Перерождение (Престиж: ${state.rebirth || 0})</h4>
      <p>Текущий множитель: <b>×${curMult}</b> к саду и ококам в игре.<br>Сбросит сад и улучшения, оставит скины и питомцев.</p>
      <button id="btn-rebirth" class="buy-btn">Переродиться за ${fmt(rCost)} ококи (×${curMult + 1})</button>`;
    rebBox.querySelector('#btn-rebirth').onclick = doRebirth;
  }

  const petsList = document.getElementById('pets-list');
  if (petsList) {
    petsList.innerHTML = '';
    PETS.forEach(pt => {
      const owned = state.ownedPets.includes(pt.id);
      const eq = state.equippedPet === pt.id;
      const el = document.createElement('div');
      el.className = 'shop-item';
      el.innerHTML = `
        <div class="shop-left">
          <div class="shop-icon">${pt.emoji}</div>
          <div>
            <div class="shop-title">${pt.name}</div>
            <div class="shop-desc">${pt.desc}</div>
          </div>
        </div>
        <button class="buy-btn" ${eq ? 'disabled' : ''}>${eq ? '✅ Надет' : (owned ? 'Надеть' : pt.cost + ' ококи')}</button>`;
      el.querySelector('.buy-btn').onclick = () => {
        if (owned) {
          state.equippedPet = pt.id;
          Sound.coin();
          saveState(); renderShop();
          showToast(`Питомец выбран: ${pt.name}`);
        } else if (state.coins >= pt.cost) {
          state.coins -= pt.cost;
          state.ownedPets.push(pt.id);
          state.equippedPet = pt.id;
          Sound.win();
          saveState(); updateTopHUD(); renderShop();
          showToast(`Куплен и надет питомец: ${pt.name}!`);
        } else showToast(`Нужно ${pt.cost} ококи`);
      };
      petsList.appendChild(el);
    });
  }

  const upgList = document.getElementById('upgrades-list');
  upgList.innerHTML = '';
  UPGRADES.forEach(u => {
    const lv = state.upgrades[u.id] || 0;
    const maxed = lv >= u.maxLv;
    const cost = Math.floor(u.baseCost * Math.pow(1.75, lv));
    const el = document.createElement('div');
    el.className = 'shop-item';
    el.innerHTML = `
      <div class="shop-left">
        <div class="shop-icon">${u.icon}</div>
        <div>
          <div class="shop-title">${u.name} <small>(Ур. ${lv}/${u.maxLv})</small></div>
          <div class="shop-desc">${u.desc}</div>
        </div>
      </div>
      <button class="buy-btn" ${maxed ? 'disabled' : ''}>${maxed ? 'МАКС' : cost + ' ококи'}</button>`;
    el.querySelector('.buy-btn').onclick = () => {
      if (maxed) return;
      if (state.coins >= cost) {
        state.coins -= cost;
        state.upgrades[u.id] = lv + 1;
        Sound.win();
        saveState(); updateTopHUD(); renderShop();
        showToast(`${u.name} улучшен!`);
      } else showToast(`Нужно ${cost} ококи`);
    };
    upgList.appendChild(el);
  });

  const seedList = document.getElementById('seed-shop-list');
  seedList.innerHTML = '';
  Object.values(SEEDS).forEach(s => {
    const el = document.createElement('div');
    el.className = 'shop-item';
    el.innerHTML = `
      <div class="shop-left">
        <div class="shop-icon">${s.emoji}</div>
        <div>
          <div class="shop-title">${s.name}</div>
          <div class="shop-desc">Доход: +${s.baseIncome}/с • Рост: ${s.growSec}с • Продажа: ${seedSellPrice(s.id)}</div>
        </div>
      </div>
      <button class="buy-btn">${s.cost} ококи</button>`;
    el.querySelector('.buy-btn').onclick = () => {
      if (state.coins >= s.cost) {
        state.coins -= s.cost;
        state.seeds[s.id] = (state.seeds[s.id] || 0) + 1;
        Sound.coin();
        saveState(); updateTopHUD(); renderGarden();
        showToast(`Куплено семя: ${s.name}`);
      } else showToast(`Нужно ${s.cost} ококи`);
    };
    seedList.appendChild(el);
  });
}

/* ---------- Daily & Quests ---------- */
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function ensureTodayQuests() {
  const today = todayKey();
  if (!state.quests || state.quests.date !== today || !Array.isArray(state.quests.list) || state.quests.list.length === 0) {
    state.quests = {
      date: today,
      list: [
        { id: 'coins',  title: 'Собери 300 ококов в забеге',       target: 300, prog: 0, rewardCoins: 250, rewardSeed: null,   claimed: false },
        { id: 'kills',  title: 'Победи 5 врагов или босса',        target: 5,   prog: 0, rewardCoins: 200, rewardSeed: 'rare', claimed: false },
        { id: 'garden', title: 'Полей или улучши сад 5 раз',       target: 5,   prog: 0, rewardCoins: 200, rewardSeed: null,   claimed: false }
      ]
    };
  }
}

function addQuestProgress(type, amount) {
  ensureTodayQuests();
  const q = state.quests.list.find(x => x.id === type);
  if (!q || q.claimed) return;
  const prev = q.prog;
  q.prog = Math.min(q.target, q.prog + amount);
  if (prev < q.target && q.prog >= q.target) {
    showToast(`🎯 Квест выполнен: ${q.title}! Забери в 🎯`);
  }
}

function claimDaily() {
  const today = todayKey();
  if (state.daily.lastClaim === today) { showToast('Награда за сегодня уже получена!'); return; }
  const yest = new Date(Date.now() - 86400000);
  const yKey = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, '0')}-${String(yest.getDate()).padStart(2, '0')}`;
  state.daily.streak = state.daily.lastClaim === yKey ? ((state.daily.streak % 7) + 1) : 1;
  state.daily.lastClaim = today;

  const day = state.daily.streak;
  const bonusCoins = day * 150;
  state.coins += bonusCoins;
  Sound.win();
  if (day === 7) {
    const res = grantSkin('epic');
    showToast(`🔥 7-й день! +${bonusCoins} ококи${skinDropText(res)}`);
  } else {
    state.seeds.rare = (state.seeds.rare || 0) + 1;
    showToast(`📅 День ${day}: +${bonusCoins} ококи и 1 редкое семя!`);
  }
  saveState(); updateTopHUD(); renderSkins(); updateStartPreview(); renderQuests();
}

function renderQuests() {
  ensureTodayQuests();
  const today = todayKey();
  const claimedToday = state.daily.lastClaim === today;
  const nextDay = claimedToday ? state.daily.streak : ((state.daily.streak % 7) + 1);
  const dBox = document.getElementById('daily-box');
  dBox.innerHTML = `
    <h4>📅 Ежедневный вход (Серия: ${state.daily.streak || 0}/7)</h4>
    <p>${claimedToday ? 'Сегодняшняя награда уже получена! Возвращайся завтра.' : `День ${nextDay}: +${nextDay * 150} ококи ${nextDay === 7 ? '+ БЕСПЛАТНЫЙ ЭПИК КЕЙС!' : '+ редкое семя'}`}</p>
    <button id="btn-claim-daily" class="buy-btn" ${claimedToday ? 'disabled' : ''}>${claimedToday ? '✅ Получено' : '🎁 Забрать награду'}</button>`;
  const db = dBox.querySelector('#btn-claim-daily');
  if (db) db.onclick = claimDaily;

  const qList = document.getElementById('quests-list');
  qList.innerHTML = '';
  state.quests.list.forEach(q => {
    const done = q.prog >= q.target;
    const el = document.createElement('div');
    el.className = 'shop-item';
    el.innerHTML = `
      <div class="shop-left">
        <div class="shop-icon">${q.claimed ? '✅' : (done ? '🎁' : '🎯')}</div>
        <div>
          <div class="shop-title">${q.title}</div>
          <div class="shop-desc">Прогресс: ${q.prog}/${q.target} • Награда: +${q.rewardCoins} ококи${q.rewardSeed ? ' + редкое семя' : ''}</div>
        </div>
      </div>
      <button class="buy-btn" ${(!done || q.claimed) ? 'disabled' : ''}>${q.claimed ? 'Забрано' : (done ? 'Забрать' : `${q.prog}/${q.target}`)}</button>`;
    el.querySelector('.buy-btn').onclick = () => {
      if (!done || q.claimed) return;
      q.claimed = true;
      state.coins += q.rewardCoins;
      if (q.rewardSeed) state.seeds[q.rewardSeed] = (state.seeds[q.rewardSeed] || 0) + 1;
      Sound.win();
      showToast(`🎉 Награда получена: +${q.rewardCoins} ококи!`);
      saveState(); updateTopHUD(); renderGarden(); renderQuests();
    };
    qList.appendChild(el);
  });
}

/* ---------- Giveaways (розыгрыши) ---------- */
function renderGiveaways() {
  const box = document.getElementById('giveaway-list');
  box.innerHTML = '';
  if (!state.giveaways.length) {
    box.innerHTML = '<div class="giveaway-note">Пока нет розыгрышей. Загляни позже!</div>';
    return;
  }
  state.giveaways.slice().reverse().forEach(g => {
    const total = g.bots.length + (g.joined ? 1 : 0);
    const el = document.createElement('div');
    el.className = 'giveaway-card';
    let action = '';
    if (g.ended) {
      const me = g.winner === 'Ты';
      action = `<div class="giveaway-win">${me ? '🏆 Ты выиграл ' + g.prize + ' ококов!' : '🏁 Победитель: ' + g.winner}</div>`;
    } else if (g.joined) {
      action = `<button class="buy-btn" disabled>✅ Ты участвуешь</button>`;
    } else {
      action = `<button class="buy-btn" data-join="${g.id}">🎟 Участвовать</button>`;
    }
    el.innerHTML = `
      <div class="giveaway-title">🎁 ${g.title}</div>
      <div class="giveaway-meta">Приз: <b>${g.prize} ококи</b> • Участников: ${total}</div>
      ${action}`;
    const jb = el.querySelector('[data-join]');
    if (jb) jb.onclick = () => {
      g.joined = true;
      Sound.coin();
      showToast('Ты участвуешь в розыгрыше! Жди итогов от админа');
      saveState(); renderGiveaways();
    };
    box.appendChild(el);
  });
}

/* ---------- Admin / code ---------- */
let adminReal = false;

function openCodeModal() {
  document.getElementById('code-input').value = '';
  document.getElementById('modal-code').classList.remove('hidden');
  setTimeout(() => document.getElementById('code-input').focus(), 50);
}

function submitCode() {
  const v = document.getElementById('code-input').value.trim();
  if (!v) { showToast('Введите код'); return; }
  document.getElementById('modal-code').classList.add('hidden');
  adminReal = (v === ADMIN_CODE);
  renderAdmin();
  document.getElementById('modal-admin').classList.remove('hidden');
  if (adminReal) { Sound.win(); showToast('🔓 Добро пожаловать, админ'); }
}

function renderAdmin() {
  const body = document.getElementById('admin-body');
  const activeG = state.giveaways.filter(g => !g.ended);
  body.innerHTML = `
    <div class="admin-sec">
      <div class="admin-label">💰 Ококи</div>
      <button class="admin-btn" data-act="inf">∞ Бесконечные ококи: ${state.inf ? 'ВКЛ ✅' : 'ВЫКЛ'}</button>
      <div class="admin-row">
        <input id="adm-amount" class="admin-input" type="number" value="10000" />
        <button class="admin-btn" data-act="give">Выдать</button>
      </div>
    </div>
    <div class="admin-sec">
      <div class="admin-label">🎭 Скины и семена</div>
      <button class="admin-btn" data-act="skins">Открыть ВСЕ скины</button>
      <button class="admin-btn" data-act="seeds">Выдать по 10 семян каждого вида</button>
    </div>
    <div class="admin-sec">
      <div class="admin-label">❤️ Игра</div>
      <button class="admin-btn" data-act="god">Бессмертие: ${state.god ? 'ВКЛ ✅' : 'ВЫКЛ'}</button>
    </div>
    <div class="admin-sec">
      <div class="admin-label">🎁 Розыгрыши</div>
      <input id="adm-gtitle" class="admin-input" type="text" placeholder="Название розыгрыша" />
      <div class="admin-row">
        <input id="adm-gprize" class="admin-input" type="number" value="1000" />
        <button class="admin-btn" data-act="gcreate">Создать</button>
      </div>
      ${activeG.map(g => `<button class="admin-btn" data-act="gdraw" data-id="${g.id}">🎲 Провести: ${g.title} (${g.prize})</button>`).join('')}
    </div>
    <div class="admin-sec">
      <button class="admin-btn danger" data-act="reset">🗑 Сбросить весь прогресс</button>
    </div>`;
  body.querySelectorAll('[data-act]').forEach(btn => {
    btn.onclick = () => adminAction(btn.dataset.act, btn.dataset.id);
  });
}

function adminAction(act, id) {
  if (!adminReal) { triggerPrank(); return; }
  switch (act) {
    case 'inf':
      state.inf = !state.inf;
      if (!state.inf) state.coins = 1000;
      break;
    case 'give': {
      const n = Math.max(0, Math.floor(Number(document.getElementById('adm-amount').value) || 0));
      state.coins += n;
      showToast(`+${n} ококи`);
      break;
    }
    case 'skins':
      state.unlockedSkins = SKINS.map(s => s.id);
      showToast('Все скины открыты!');
      break;
    case 'seeds':
      Object.keys(SEEDS).forEach(k => state.seeds[k] = (state.seeds[k] || 0) + 10);
      showToast('+10 семян каждого вида');
      break;
    case 'god':
      state.god = !state.god;
      break;
    case 'gcreate': {
      const title = (document.getElementById('adm-gtitle').value || '').trim() || 'Розыгрыш от админа';
      const prize = Math.max(1, Math.floor(Number(document.getElementById('adm-gprize').value) || 1000));
      const nBots = 4 + Math.floor(Math.random() * 4);
      const bots = BOT_NAMES.slice().sort(() => Math.random() - 0.5).slice(0, nBots);
      state.giveaways.push({ id: 'g_' + Date.now(), title, prize, bots, joined: false, ended: false, winner: null });
      showToast('Розыгрыш создан! Он виден в Кредитах');
      break;
    }
    case 'gdraw': {
      const g = state.giveaways.find(x => x.id === id);
      if (g && !g.ended) {
        const pool = g.bots.slice();
        if (g.joined) pool.push('Ты');
        g.winner = pool[Math.floor(Math.random() * pool.length)];
        g.ended = true;
        if (g.winner === 'Ты') {
          state.coins += g.prize;
          Sound.win();
          showToast(`🏆 Ты выиграл ${g.prize} ококи!`);
        } else showToast(`Победитель: ${g.winner}`);
      }
      break;
    }
    case 'reset':
      if (!confirm('Точно сбросить весь прогресс?')) return;
      state = defaultState();
      Sound.enabled = state.sound;
      break;
  }
  saveState(); updateTopHUD(); updateStartPreview();
  renderGarden(); renderSkins(); renderShop(); renderGiveaways(); renderAdmin();
}

let prankTimers = [];
function triggerPrank() {
  const el = document.getElementById('prank');
  const txt = document.getElementById('prank-text');
  const closeBtn = document.getElementById('prank-close');
  prankTimers.forEach(clearTimeout);
  prankTimers = [];
  closeBtn.classList.add('hidden');
  el.classList.remove('final');
  el.classList.add('flashing');
  txt.textContent = 'ИДИ НАХУЙ';
  el.classList.remove('hidden');
  let i = 0;
  const beepLoop = setInterval(() => { Sound.beep(i++ % 2 ? 440 : 880, 0.12, 'square', 0.08); }, 180);
  prankTimers.push(setTimeout(() => {
    clearInterval(beepLoop);
    el.classList.remove('flashing');
    el.classList.add('final');
    txt.textContent = 'РАЗРАБОТЧИК:\nНИКИТА ФЕМ';
    txt.style.whiteSpace = 'pre-line';
    closeBtn.classList.remove('hidden');
  }, 5000));
}

/* ---------- Hidden casino (только игровые ококи) ---------- */
const RL_RED = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
const SLOT_SYMBOLS = [
  { s: '🍒', w: 27, m: 5 },
  { s: '🍋', w: 23, m: 8 },
  { s: '🔔', w: 19, m: 12 },
  { s: '⭐', w: 15, m: 20 },
  { s: '💎', w: 10, m: 40 },
  { s: '7️⃣', w: 6,  m: 100 }
];
const DUP_REFUND = { epic: 400, legend: 1500, secret: 30000 };
let casinoTab = 'roulette';
let casinoBusy = false;
let secretAutoTimer = null;

function stopSecretAuto() {
  if (secretAutoTimer) {
    clearInterval(secretAutoTimer);
    secretAutoTimer = null;
    const ab = document.getElementById('btn-secret-auto');
    if (ab) ab.textContent = '⚡ Авто-открытие: ВЫКЛ';
  }
}

function openSecretFast() {
  const cfg = CASES.secret;
  if (state.coins < cfg.cost) {
    stopSecretAuto();
    casinoLog('Не хватает ококов — авто-открытие остановлено', 'lose');
    return;
  }
  state.coins -= cfg.cost;
  const r = Math.random() * 100;
  let acc = 0, chosenRarity = 'epic';
  for (const [rar, w] of Object.entries(cfg.weights)) {
    acc += w;
    if (r <= acc) { chosenRarity = rar; break; }
  }
  const pool = SKINS.filter(s => s.rarity === chosenRarity && !s.adminOnly);
  const winner = pool[Math.floor(Math.random() * pool.length)];
  if (state.unlockedSkins.includes(winner.id)) {
    const refund = Math.floor(cfg.cost * 0.6);
    state.coins += refund;
    Sound.coin();
    casinoLog(`📦 ${winner.emoji} ${winner.name} (дубль +${refund} ококи)`, '');
  } else {
    state.unlockedSkins.push(winner.id);
    state.equippedSkin = winner.id;
    Sound.win();
    casinoLog(`🎉 ВЫПАЛ НОВЫЙ: ${winner.emoji} ${winner.name} (${RARITY[winner.rarity].label})!`, 'win');
  }
  saveState(); updateTopHUD(); updateStartPreview(); renderSkins();
}

function toggleSecretAuto() {
  if (secretAutoTimer) {
    stopSecretAuto();
    return;
  }
  if (state.coins < CASES.secret.cost) {
    showToast(`Нужно ${CASES.secret.cost} ококи`);
    return;
  }
  const ab = document.getElementById('btn-secret-auto');
  if (ab) ab.textContent = '⏹ Авто-открытие: ВКЛ';
  openSecretFast();
  if (state.coins >= CASES.secret.cost) {
    secretAutoTimer = setInterval(openSecretFast, 650);
  } else {
    stopSecretAuto();
  }
}

function casinoLog(msg, cls) {
  const el = document.getElementById('casino-log');
  el.textContent = msg;
  el.className = 'casino-log ' + (cls || '');
}

function getBet() {
  const b = Math.floor(Number(document.getElementById('bet-input').value) || 0);
  const max = state.inf ? 1000000 : state.coins;
  if (b < 10) { showToast('Минимальная ставка 10 ококов'); return 0; }
  if (b > max) { showToast('Не хватает ококов'); return 0; }
  return b;
}

function grantSkin(rarity) {
  const pool = SKINS.filter(s => s.rarity === rarity && !s.adminOnly);
  const sk = pool[Math.floor(Math.random() * pool.length)];
  if (!sk) return null;
  if (state.unlockedSkins.includes(sk.id)) {
    const refund = DUP_REFUND[rarity] || 300;
    state.coins += refund;
    return { skin: sk, dup: true, refund };
  }
  state.unlockedSkins.push(sk.id);
  return { skin: sk, dup: false };
}

function skinDropText(res) {
  if (!res) return '';
  return res.dup
    ? ` | Дубль ${res.skin.name}: +${res.refund} ококи`
    : ` | 🎉 СКИН: ${res.skin.emoji} ${res.skin.name}!`;
}

function renderCasino() {
  document.querySelectorAll('[data-ctab]').forEach(b => b.classList.toggle('active', b.dataset.ctab === casinoTab));
  document.getElementById('bet-row').classList.toggle('hidden', casinoTab === 'secret');
  const body = document.getElementById('casino-body');
  casinoLog('');
  if (casinoTab === 'roulette') {
    body.innerHTML = `
      <div id="rl-wheel" class="rl-wheel">?</div>
      <div class="rl-bets">
        <button class="b-red" data-rl="red">🔴 Красное ×2</button>
        <button class="b-black" data-rl="black">⚫ Чёрное ×2</button>
        <button class="b-green" data-rl="green">🟢 Зеро ×36 + скин</button>
      </div>`;
    body.querySelectorAll('[data-rl]').forEach(b => b.onclick = () => spinRoulette(b.dataset.rl));
  } else if (casinoTab === 'slots') {
    body.innerHTML = `
      <div class="slot-reels">
        <div class="slot-reel" id="reel0">🍒</div>
        <div class="slot-reel" id="reel1">🍋</div>
        <div class="slot-reel" id="reel2">🔔</div>
      </div>
      <div class="slot-pay">3 одинаковых: 🍒×5 🍋×8 🔔×12 ⭐×20 💎×40 7️⃣×100 • Пара — возврат ставки<br>⭐⭐⭐ — шанс на эпик, 💎💎💎 — легендарный скин, 7️⃣7️⃣7️⃣ — СЕКРЕТНЫЙ скин!</div>
      <button id="btn-spin-slots" class="play-btn">🎰 Крутить</button>`;
    document.getElementById('btn-spin-slots').onclick = spinSlots;
  } else {
    body.innerHTML = `
      <div class="secret-box">
        <div class="big">🗝️</div>
        <h3>Секрет-кейс</h3>
        <p>Цена: ${CASES.secret.cost} ококов. Гарантированно эпик или выше, а с шансом 10% выпадает СЕКРЕТНЫЙ скин с огромными бонусами!</p>
        <button id="btn-secret-case" class="play-btn">Открыть за ${CASES.secret.cost} ококи</button>
        <button id="btn-secret-auto" class="secondary-btn">${secretAutoTimer ? '⏹ Авто-открытие: ВКЛ' : '⚡ Авто-открытие: ВЫКЛ'}</button>
      </div>`;
    document.getElementById('btn-secret-case').onclick = () => rollSkin('secret');
    document.getElementById('btn-secret-auto').onclick = toggleSecretAuto;
  }
}

function spinRoulette(color) {
  if (casinoBusy) return;
  const bet = getBet();
  if (!bet) return;
  casinoBusy = true;
  state.coins -= bet;
  saveState(); updateTopHUD();
  const wheel = document.getElementById('rl-wheel');
  const btns = document.querySelectorAll('[data-rl]');
  btns.forEach(b => b.disabled = true);
  casinoLog('Крутится...');

  const colorOf = n => n === 0 ? 'green' : RL_RED.includes(n) ? 'red' : 'black';
  let final = Math.floor(Math.random() * 37);
  if (color === 'green' && final !== 0 && Math.random() < 0.015) {
    final = 0;
  } else if ((color === 'red' || color === 'black') && colorOf(final) !== color && Math.random() < 0.08) {
    final = Math.floor(Math.random() * 37);
  }
  let ticks = 0;
  const iv = setInterval(() => {
    const n = Math.floor(Math.random() * 37);
    wheel.textContent = n;
    wheel.className = 'rl-wheel ' + colorOf(n);
    Sound.beep(300 + (ticks % 5) * 60, 0.05, 'square', 0.04);
    if (++ticks > 24) {
      clearInterval(iv);
      wheel.textContent = final;
      wheel.className = 'rl-wheel ' + colorOf(final);
      const res = colorOf(final);
      let msg, cls;
      if (res === color) {
        const mult = color === 'green' ? 36 : 2;
        const win = bet * mult;
        state.coins += win;
        msg = `✅ Выпало ${final}! Выигрыш +${win} ококи`;
        cls = 'win';
        Sound.win();
        if (color === 'green') msg += skinDropText(grantSkin('legend'));
      } else {
        msg = `❌ Выпало ${final}. Проигрыш −${bet}`;
        cls = 'lose';
        Sound.hit();
      }
      casinoLog(msg, cls);
      saveState(); updateTopHUD(); renderSkins(); updateStartPreview();
      btns.forEach(b => b.disabled = false);
      casinoBusy = false;
    }
  }, 80);
}

function rollSlotSymbol() {
  const total = SLOT_SYMBOLS.reduce((a, s) => a + s.w, 0);
  let r = Math.random() * total;
  for (const s of SLOT_SYMBOLS) { r -= s.w; if (r <= 0) return s; }
  return SLOT_SYMBOLS[0];
}

function spinSlots() {
  if (casinoBusy) return;
  const bet = getBet();
  if (!bet) return;
  casinoBusy = true;
  state.coins -= bet;
  saveState(); updateTopHUD();
  const btn = document.getElementById('btn-spin-slots');
  btn.disabled = true;
  casinoLog('Крутится...');
  const result = [rollSlotSymbol(), rollSlotSymbol(), rollSlotSymbol()];
  if (result[0].s === result[1].s && result[2].s !== result[0].s && Math.random() < 0.10) {
    result[2] = result[0];
  } else if (result[1].s === result[2].s && result[0].s !== result[1].s && Math.random() < 0.10) {
    result[0] = result[1];
  } else if (result[0].s === result[2].s && result[1].s !== result[0].s && Math.random() < 0.10) {
    result[1] = result[0];
  } else if (result[0].s !== result[1].s && result[1].s !== result[2].s && result[0].s !== result[2].s && Math.random() < 0.12) {
    result[2] = result[0];
  }
  const reels = [0, 1, 2].map(i => document.getElementById('reel' + i));
  const stopAt = [12, 20, 28];
  let tick = 0;
  const iv = setInterval(() => {
    tick++;
    reels.forEach((el, i) => {
      if (tick < stopAt[i]) el.textContent = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)].s;
      else if (tick === stopAt[i]) { el.textContent = result[i].s; Sound.coin(); }
    });
    if (tick >= stopAt[2]) {
      clearInterval(iv);
      const [a, b, c] = result;
      let msg, cls;
      if (a.s === b.s && b.s === c.s) {
        const win = bet * a.m;
        state.coins += win;
        msg = `🎉 ДЖЕКПОТ ${a.s}${a.s}${a.s}! +${win} ококи`;
        cls = 'win';
        Sound.win();
        if (a.s === '7️⃣') msg += skinDropText(grantSkin('secret'));
        else if (a.s === '💎') msg += skinDropText(grantSkin('legend'));
        else if (a.s === '⭐') msg += skinDropText(grantSkin('epic'));
      } else if (a.s === b.s || b.s === c.s || a.s === c.s) {
        state.coins += bet;
        msg = '🤝 Пара — ставка возвращена';
        cls = '';
      } else {
        msg = `❌ Не повезло. Проигрыш −${bet}`;
        cls = 'lose';
        Sound.hit();
      }
      casinoLog(msg, cls);
      saveState(); updateTopHUD(); renderSkins(); updateStartPreview();
      btn.disabled = false;
      casinoBusy = false;
    }
  }, 80);
}

function openCasino() {
  casinoTab = 'roulette';
  renderCasino();
  updateTopHUD();
  document.getElementById('modal-casino').classList.remove('hidden');
}

document.getElementById('credit-gemeni').addEventListener('click', openCasino);
document.getElementById('btn-casino-close').onclick = () => {
  if (casinoBusy) return;
  stopSecretAuto();
  document.getElementById('modal-casino').classList.add('hidden');
};
document.querySelectorAll('[data-ctab]').forEach(b => b.onclick = () => {
  if (casinoBusy) return;
  stopSecretAuto();
  casinoTab = b.dataset.ctab;
  renderCasino();
});
document.querySelectorAll('[data-bet]').forEach(b => b.onclick = () => {
  const inp = document.getElementById('bet-input');
  let v = Math.floor(Number(inp.value) || 10);
  if (b.dataset.bet === 'half') v = Math.max(10, Math.floor(v / 2));
  else if (b.dataset.bet === 'x2') v = v * 2;
  else v = state.inf ? 1000000 : Math.max(10, Math.floor(state.coins));
  inp.value = v;
});

/* ---------- Game engine ---------- */
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let W = 390, H = 700;

function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  W = rect.width || 390;
  H = rect.height || 640;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

const BIOMES = [
  { min: 0,    name: '🌿 Сад',    top: '#0f172a', bot: '#1e3a2f', grid: 'rgba(74,222,128,0.07)' },
  { min: 1500, name: '☁️ Облака', top: '#0c4a6e', bot: '#38bdf8', grid: 'rgba(255,255,255,0.08)' },
  { min: 3500, name: '🌌 Космос', top: '#090d16', bot: '#1e1b4b', grid: 'rgba(168,85,247,0.08)' },
  { min: 6000, name: '⚡ Неон',   top: '#1e0536', bot: '#4c1d95', grid: 'rgba(244,114,182,0.1)' }
];

let game = null;
const keys = { left: false, right: false };
let tiltVx = 0;
let recordTimer = null;

function startGame() {
  Sound.init();
  resizeCanvas();
  const skin = getEquippedSkin();
  const b = skin.bonus;
  const maxLives = 3 + (b.extraLife || 0);

  game = {
    running: true, paused: false,
    score: 0, runCoins: 0, runSeeds: 0,
    cameraY: 0,
    lives: maxLives, maxLives,
    invuln: 0, shootCd: 0,
    prevBest: state.bestScore,
    recordShown: false, newRecord: false,
    player: {
      x: W / 2 - 22, y: H - 140, w: 44, h: 44,
      vx: 0, vy: -13, facing: 1,
      shield: !!b.startShield, jetpack: 0
    },
    platforms: [], items: [], enemies: [], bullets: [], bossBullets: [], meteors: [],
    boss: null, nextBossScore: 800, bossTier: 0,
    particles: [],
    highestPlatY: H - 50,
    lastType: 'normal',
    combo: 0, comboTimer: 0, fever: 0, feverTimer: 0,
    eventTimer: 900, eventType: null, eventDuration: 0,
    petShootCd: 40, petShieldCd: 1500
  };

  game.platforms.push({ x: W / 2 - 50, y: H - 70, w: 100, h: 16, type: 'normal', vx: 0, broken: false, hasSpring: false });
  while (game.highestPlatY > -H) spawnPlatformRow();

  document.getElementById('overlay-start').classList.add('hidden');
  document.getElementById('overlay-gameover').classList.add('hidden');
  document.getElementById('record-banner').classList.add('hidden');
  document.getElementById('boss-hud').classList.add('hidden');
  document.getElementById('fever-hud').classList.remove('hidden');
  document.getElementById('event-banner').classList.add('hidden');
  document.getElementById('game-hud').classList.remove('hidden');
  document.getElementById('touch-controls').classList.remove('hidden');
  document.getElementById('btn-pause').textContent = '⏸';
}

function spawnPlatformRow() {
  const diff = Math.min(1, game.score / 6000);
  // Максимальный зазор строго меньше высоты самого слабого прыжка (~189px)
  const gap = 56 + Math.random() * (30 + diff * 30);
  const y = game.highestPlatY - gap;
  game.highestPlatY = y;

  const w = Math.max(60, 86 - diff * 18);
  const x = 10 + Math.random() * (W - w - 20);

  // Гарантия проходимости: после ломающейся или двигающейся платформы идёт надёжная
  let type = 'normal', vx = 0;
  const r = Math.random();
  if (game.lastType === 'normal') {
    if (r < 0.14 + diff * 0.16) { type = 'moving'; vx = (Math.random() < 0.5 ? -1 : 1) * (1 + diff * 1.3); }
    else if (r < 0.26 + diff * 0.12) { type = 'break'; }
  }
  game.lastType = type;

  const springChance = 0.08 + (state.upgrades.springs || 0) * 0.025;
  const hasSpring = type === 'normal' && Math.random() < springChance;

  game.platforms.push({ x, y, w, h: 15, type, vx, broken: false, hasSpring });

  const cx = x + w / 2;
  const ry = Math.random();
  if (ry < 0.45) game.items.push({ x: cx, y: y - 26, type: 'coin', collected: false });
  else if (type === 'normal') {
    const rr = Math.random();
    if (rr < 0.05) game.items.push({ x: cx, y: y - 28, type: 'seed', collected: false });
    else if (rr < 0.085) game.items.push({ x: cx, y: y - 28, type: 'jetpack', collected: false });
    else if (rr < 0.115) game.items.push({ x: cx, y: y - 28, type: 'shield', collected: false });
    else if (rr < 0.135) game.items.push({ x: cx, y: y - 28, type: 'heart', collected: false });
  }

  // Враги: не во время босса, и не сразу над платформой, чтобы не перекрывать приземление
  if (!game.boss && game.score > 400 && Math.random() < 0.05 + diff * 0.05) {
    game.enemies.push({
      x: 30 + Math.random() * (W - 70), y: y - 75, w: 36, h: 32,
      vx: (Math.random() < 0.5 ? -1 : 1) * 1.1, alive: true
    });
  }
}

function shootBullet() {
  if (!game || !game.running || game.paused || game.shootCd > 0) return;
  const b = getEquippedSkin().bonus;
  Sound.shoot();
  game.shootCd = 12;
  const p = game.player;
  const n = b.multiShot || 1;
  const spread = Array.from({ length: n }, (_, i) => (i - (n - 1) / 2) * 2.6);
  for (const vx of spread) {
    game.bullets.push({ x: p.x + p.w / 2, y: p.y, vx, vy: -14, pierce: !!b.pierce });
  }
}

function addParticles(x, y, color, count = 8) {
  for (let i = 0; i < count; i++) {
    game.particles.push({ x, y, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, life: 1, color });
  }
}

function heartsString() {
  if (state.god) return '❤️ ∞';
  let s = '';
  for (let i = 0; i < game.maxLives; i++) s += i < game.lives ? '❤️' : '🖤';
  return s;
}

function hurtPlayer() {
  const p = game.player;
  const b = getEquippedSkin().bonus;
  if (game.invuln > 0 || p.jetpack > 0 || game.feverTimer > 0) return false;
  if (p.shield) {
    p.shield = false;
    game.invuln = 45;
    Sound.break();
    addParticles(p.x + p.w / 2, p.y + p.h / 2, '#38bdf8', 12);
    return true;
  }
  Sound.hit();
  addParticles(p.x + p.w / 2, p.y + p.h / 2, '#ef4444', 14);
  if (!state.god) game.lives--;
  game.invuln = 90 + (b.invuln || 0);
  if (game.lives <= 0) endGame();
  return true;
}

function respawnAfterFall() {
  const p = game.player;
  const b = getEquippedSkin().bonus;
  if (!state.god) game.lives--;
  Sound.hit();
  if (game.lives <= 0) { endGame(); return; }
  const py = game.cameraY + H * 0.55;
  const px = Math.max(10, Math.min(W - 100, p.x - 25));
  game.platforms.push({ x: px, y: py, w: 100, h: 15, type: 'normal', vx: 0, broken: false, hasSpring: true });
  p.x = px + 28;
  p.y = py - p.h - 2;
  p.vx = 0; p.vy = 0;
  p.jetpack = 0;
  game.invuln = 100 + (b.invuln || 0);
  game.bossBullets = [];
  showToast(`💔 Жизнь потеряна! Осталось: ${state.god ? '∞' : game.lives}`);
}

function endGame() {
  if (!game || !game.running) return;
  game.running = false;
  Sound.hit();

  const isRecord = game.score > game.prevBest && game.score > 0;
  let bonus = 0;
  if (isRecord) {
    bonus = 50 + Math.floor(game.score / 20);
    game.runCoins += bonus;
    state.bestScore = game.score;
  }
  state.coins += game.runCoins;
  saveState();
  updateTopHUD();

  document.getElementById('go-score').textContent = fmt(game.score);
  document.getElementById('go-best').textContent = fmt(state.bestScore);
  document.getElementById('go-coins').textContent = `+${fmt(game.runCoins)}`;
  document.getElementById('go-seeds').textContent = `+${game.runSeeds}`;
  const rec = document.getElementById('go-record');
  if (isRecord) {
    rec.textContent = `🏆 НОВЫЙ РЕКОРД! Поздравляем! Бонус +${bonus} ококи`;
    rec.classList.remove('hidden');
    Sound.win();
  } else rec.classList.add('hidden');

  document.getElementById('overlay-gameover').classList.remove('hidden');
  document.getElementById('touch-controls').classList.add('hidden');
  document.getElementById('boss-hud').classList.add('hidden');
  document.getElementById('fever-hud').classList.add('hidden');
  document.getElementById('event-banner').classList.add('hidden');
  document.getElementById('record-banner').classList.add('hidden');
}

function showRecordBanner() {
  const el = document.getElementById('record-banner');
  el.classList.remove('hidden');
  Sound.win();
  addParticles(game.player.x + 22, game.player.y, '#facc15', 30);
  clearTimeout(recordTimer);
  recordTimer = setTimeout(() => el.classList.add('hidden'), 3000);
}

function addCombo(feverGain) {
  if (!game) return;
  game.combo++;
  game.comboTimer = 210;
  if (game.feverTimer <= 0) {
    const mult = state.equippedPet === 'dragon' ? 1.5 : 1;
    game.fever = Math.min(100, game.fever + feverGain * mult);
    if (game.fever >= 100) {
      game.fever = 0;
      game.feverTimer = 360;
      Sound.win();
      showToast('🔥 FEVER MODE! ×3 ококи и полёт!');
    }
  }
}

function damageBoss(dmg, coinMult) {
  if (!game || !game.boss) return;
  const bs = game.boss;
  const b = getEquippedSkin().bonus;
  bs.hp -= dmg;
  Sound.coin();
  addParticles(bs.x + bs.w / 2, bs.y + bs.h / 2, '#f97316', 8);
  document.getElementById('boss-hp-fill').style.width = `${Math.max(0, (bs.hp / bs.maxHp) * 100)}%`;

  if (bs.hp <= 0) {
    const reward = Math.round(bs.reward * coinMult);
    game.runCoins += reward;
    addQuestProgress('coins', reward);
    addQuestProgress('kills', 1);
    const dropSeed = game.bossTier >= 2 ? 'epic' : 'rare';
    state.seeds[dropSeed] = (state.seeds[dropSeed] || 0) + 1;
    game.runSeeds++;
    addParticles(bs.x + bs.w / 2, bs.y + bs.h / 2, '#facc15', 26);
    Sound.win();
    let extra = '';
    if (b.bossHeal && game.lives < game.maxLives) { game.lives++; extra += ' +❤️'; }
    if (b.shieldOnBoss) { game.player.shield = true; extra += ' +🛡️'; }
    showToast(`🏆 Босс повержен! +${reward} ококи и семя!${extra}`);
    game.boss = null;
    game.bossBullets = [];
    game.bossTier++;
    game.nextBossScore = game.score + 900;
    document.getElementById('boss-hud').classList.add('hidden');
  }
}

function updateGame() {
  if (!game || !game.running || game.paused) return;
  const p = game.player;
  const skin = getEquippedSkin();
  const b = skin.bonus;

  if (game.invuln > 0) game.invuln--;
  if (game.shootCd > 0) game.shootCd--;

  const speed = 6.2 * (1 + (b.speedMult || 0));
  const grav = 0.42 * (1 + (b.gravMult || 0));
  const jumpV = -12.6 * (1 + (b.jumpMult || 0));

  if (keys.left) { p.vx = -speed; p.facing = -1; }
  else if (keys.right) { p.vx = speed; p.facing = 1; }
  else if (state.tilt && Math.abs(tiltVx) > 0.2) {
    p.vx = Math.max(-speed, Math.min(speed, tiltVx));
    p.facing = p.vx >= 0 ? 1 : -1;
  } else p.vx *= 0.82;

  p.x += p.vx;
  if (p.x + p.w < 0) p.x = W;
  if (p.x > W) p.x = -p.w;

  if (p.jetpack > 0) {
    p.jetpack--;
    p.vy = -15.5;
    if (p.jetpack % 3 === 0) addParticles(p.x + p.w / 2, p.y + p.h, '#facc15', 2);
  } else if (game.feverTimer > 0) {
    p.vy = -13.5;
    if (game.feverTimer % 2 === 0) addParticles(p.x + p.w / 2, p.y + p.h, '#ec4899', 2);
  } else p.vy += grav;
  p.y += p.vy;

  // Combo & Fever timers
  if (game.comboTimer > 0) {
    game.comboTimer--;
    if (game.comboTimer <= 0) game.combo = 0;
  }
  if (game.feverTimer > 0) game.feverTimer--;

  // Random In-Run Events
  if (game.eventDuration > 0) {
    game.eventDuration--;
    if (game.eventType === 'gold' && game.eventDuration % 12 === 0) {
      game.items.push({ x: 20 + Math.random() * (W - 40), y: game.cameraY - 20, type: 'coin', collected: false, vy: 3.5 });
    } else if (game.eventType === 'meteors' && game.eventDuration % 28 === 0) {
      game.meteors.push({ x: 20 + Math.random() * (W - 40), y: game.cameraY - 30, vy: 5.5, r: 16 });
    }
    if (game.eventDuration <= 0) {
      if (game.eventType === 'meteors') {
        game.runCoins += 150;
        addQuestProgress('coins', 150);
        Sound.win();
        showToast('☄️ Шторм пережит! +150 ококи!');
      }
      game.eventType = null;
      document.getElementById('event-banner').classList.add('hidden');
    }
  } else {
    game.eventTimer--;
    if (game.eventTimer <= 0 && game.score >= 300) {
      const types = [
        { t: 'gold', label: '💰 ЗОЛОТОЙ ДОЖДЬ!' },
        { t: 'springs', label: '🌀 ПРУЖИННОЕ БЕЗУМИЕ!' },
        { t: 'meteors', label: '☄️ МЕТЕОРИТНЫЙ ШТОРМ!' }
      ];
      const pick = types[Math.floor(Math.random() * types.length)];
      game.eventType = pick.t;
      game.eventDuration = 600;
      game.eventTimer = 1500;
      const eb = document.getElementById('event-banner');
      eb.textContent = pick.label;
      eb.classList.remove('hidden');
      Sound.win();
    }
  }

  // Pet abilities
  if (state.equippedPet) {
    if (state.equippedPet === 'drone' || state.equippedPet === 'dragon') {
      game.petShootCd--;
      if (game.petShootCd <= 0 && (game.enemies.length > 0 || game.boss)) {
        game.petShootCd = 70;
        Sound.shoot();
        game.bullets.push({ x: p.x + p.w / 2 + 28, y: p.y - 10, vx: 0, vy: -14, pierce: state.equippedPet === 'dragon' });
      }
    }
    if (state.equippedPet === 'angel') {
      game.petShieldCd--;
      if (game.petShieldCd <= 0) {
        game.petShieldCd = 1500;
        if (!p.shield) { p.shield = true; Sound.win(); showToast('👼 Ангел подарил щит!'); }
      }
    }
  }

  if (b.neonTrail && Math.random() < 0.4) addParticles(p.x + p.w / 2, p.y + p.h / 2, skin.color, 1);

  if (p.y < game.cameraY + H * 0.4) {
    game.cameraY = p.y - H * 0.4;
    const hScore = Math.floor(-game.cameraY / 4);
    if (hScore > game.score) game.score = hScore;
  }

  // Поздравление при побитии рекорда прямо в забеге
  if (!game.recordShown && game.prevBest >= 100 && game.score > game.prevBest) {
    game.recordShown = true;
    showRecordBanner();
  }

  while (game.highestPlatY > game.cameraY - H) spawnPlatformRow();

  // Платформы
  for (const pl of game.platforms) {
    if (pl.type === 'moving') {
      pl.x += pl.vx;
      if (pl.x < 8 || pl.x + pl.w > W - 8) pl.vx *= -1;
    }
    if (pl.broken) continue;
    if (p.vy > 0 &&
        p.x + p.w - 8 > pl.x && p.x + 8 < pl.x + pl.w &&
        p.y + p.h >= pl.y && p.y + p.h <= pl.y + pl.h + p.vy + 4) {
      if (pl.type === 'break') {
        pl.broken = true;
        Sound.break();
        addParticles(pl.x + pl.w / 2, pl.y, '#a16207', 8);
      } else if (pl.hasSpring || (game.eventType === 'springs' && pl.type === 'normal')) {
        p.vy = jumpV * 1.6;
        Sound.spring();
        addParticles(pl.x + pl.w / 2, pl.y, '#38bdf8', 10);
      } else {
        p.vy = jumpV;
        Sound.jump();
        addParticles(p.x + p.w / 2, p.y + p.h, '#4ade80', 4);
      }
    }
  }

  // Предметы
  const petMag = state.equippedPet === 'bee' ? 120 : 0;
  const petCoin = state.equippedPet === 'bee' ? 0.15 : (state.equippedPet === 'dragon' ? 0.30 : 0);
  const magRange = game.feverTimer > 0 ? 9999 : (45 + (state.upgrades.magnet || 0) * 32 + (b.magnetBonus || 0) + petMag);
  const hasMagnet = game.feverTimer > 0 || (state.upgrades.magnet || 0) > 0 || !!b.magnetBonus || petMag > 0;
  const comboMult = 1 + Math.min(4, Math.floor(game.combo / 5));
  const feverMult = game.feverTimer > 0 ? 3 : 1;
  const rebMult = 1 + (state.rebirth || 0);
  const coinMult = (1 + (b.coinMult || 0) + (state.upgrades.coinMult || 0) * 0.25 + petCoin) * rebMult;
  for (const it of game.items) {
    if (it.collected) continue;
    if (it.vy) it.y += it.vy;
    const dx = (p.x + p.w / 2) - it.x;
    const dy = (p.y + p.h / 2) - it.y;
    const dist = Math.hypot(dx, dy);
    if (hasMagnet && (it.type === 'coin' || it.type === 'seed') && dist < magRange) {
      it.x += dx * 0.16;
      it.y += dy * 0.16;
    }
    if (dist < 30) {
      it.collected = true;
      if (it.type === 'coin') {
        const gained = Math.max(1, Math.round(5 * coinMult * comboMult * feverMult));
        game.runCoins += gained;
        addQuestProgress('coins', gained);
        addCombo(12);
        Sound.coin();
        addParticles(it.x, it.y, '#fde047', 6);
      } else if (it.type === 'seed') {
        const sr = Math.random();
        const sid = sr < 0.65 ? 'common' : sr < 0.9 ? 'rare' : 'epic';
        state.seeds[sid] = (state.seeds[sid] || 0) + 1;
        game.runSeeds++;
        Sound.win();
        addParticles(it.x, it.y, '#4ade80', 10);
      } else if (it.type === 'jetpack') {
        p.jetpack = 110 + (state.upgrades.jetpack || 0) * 28;
        Sound.spring();
      } else if (it.type === 'shield') {
        p.shield = true;
        Sound.win();
      } else if (it.type === 'heart') {
        if (game.lives < game.maxLives) {
          game.lives++;
          showToast('❤️ +1 жизнь!');
        } else game.runCoins += Math.round(10 * coinMult);
        Sound.win();
        addParticles(it.x, it.y, '#f43f5e', 10);
      }
    }
  }

  // Пули игрока
  const dmg = 1 + (b.bossDmg || 0);
  for (const bl of game.bullets) {
    bl.x += bl.vx || 0;
    bl.y += bl.vy;
    for (const en of game.enemies) {
      if (!en.alive) continue;
      if (bl.x > en.x && bl.x < en.x + en.w && bl.y > en.y && bl.y < en.y + en.h) {
        en.alive = false;
        if (!bl.pierce) bl.y = -999999;
        const gained = Math.round(15 * coinMult);
        game.runCoins += gained;
        addQuestProgress('coins', gained);
        addQuestProgress('kills', 1);
        addCombo(20);
        Sound.coin();
        addParticles(en.x + en.w / 2, en.y + en.h / 2, '#f43f5e', 12);
      }
    }
    for (const mt of game.meteors) {
      if (Math.hypot(bl.x - mt.x, bl.y - mt.y) < mt.r + 8) {
        mt.y = 999999999;
        if (!bl.pierce) bl.y = -999999;
        addParticles(mt.x, mt.y, '#fb923c', 10);
      }
    }
    if (game.boss && bl.x > game.boss.x && bl.x < game.boss.x + game.boss.w &&
        bl.y > game.boss.y && bl.y < game.boss.y + game.boss.h) {
      bl.y = -999999;
      addCombo(8);
      damageBoss(dmg, coinMult);
    }
  }

  // Появление босса
  if (!game.boss && game.score >= game.nextBossScore) {
    const tpl = BOSS_TEMPLATES[game.bossTier % BOSS_TEMPLATES.length];
    const scale = 1 + Math.floor(game.bossTier / BOSS_TEMPLATES.length) * 0.6;
    game.boss = {
      name: tpl.name, emoji: tpl.emoji,
      hp: Math.round(tpl.hp * scale), maxHp: Math.round(tpl.hp * scale),
      reward: Math.round(tpl.reward * scale),
      x: W / 2 - 42, y: game.cameraY + 115, w: 84, h: 72,
      vx: tpl.speed, fireCd: tpl.fireRate + 40, fireRate: tpl.fireRate
    };
    game.enemies = [];
    document.getElementById('boss-name').textContent = `${tpl.emoji} БОСС: ${tpl.name}`;
    document.getElementById('boss-hp-fill').style.width = '100%';
    document.getElementById('boss-hud').classList.remove('hidden');
    showToast(`⚠️ Босс: ${tpl.name}! Стреляй ⚡ или прыгай сверху`);
  }

  if (game.boss) {
    const bs = game.boss;
    bs.y = game.cameraY + 115;
    bs.x += bs.vx;
    if (bs.x < 14 || bs.x + bs.w > W - 14) bs.vx *= -1;
    bs.fireCd--;
    if (bs.fireCd <= 0) {
      bs.fireCd = bs.fireRate;
      game.bossBullets.push({ x: bs.x + bs.w / 2, y: bs.y + bs.h, vy: 4.2 });
    }
    if (p.x + p.w - 6 > bs.x && p.x + 6 < bs.x + bs.w && p.y + p.h > bs.y && p.y < bs.y + bs.h) {
      if (p.vy > 0 && p.y + p.h - p.vy <= bs.y + 24) {
        p.vy = jumpV * 1.3;
        damageBoss(dmg * 2, coinMult);
      } else if (p.jetpack > 0) {
        damageBoss(dmg, coinMult);
      } else if (hurtPlayer()) {
        p.vy = Math.max(p.vy, 4);
        if (!game.running) return;
      }
    }
  }

  // Снаряды босса
  for (const bb of game.bossBullets) {
    bb.y += bb.vy;
    if (bb.x > p.x + 6 && bb.x < p.x + p.w - 6 && bb.y > p.y + 6 && bb.y < p.y + p.h - 6) {
      bb.y = 999999999;
      hurtPlayer();
      if (!game.running) return;
    }
  }
  game.bossBullets = game.bossBullets.filter(bb => bb.y < game.cameraY + H + 40);

  // Враги
  for (const en of game.enemies) {
    if (!en.alive) continue;
    en.x += en.vx;
    if (en.x < 10 || en.x + en.w > W - 10) en.vx *= -1;
    if (p.x + p.w - 6 > en.x && p.x + 6 < en.x + en.w && p.y + p.h > en.y && p.y < en.y + en.h) {
      if (p.vy > 0 && p.y + p.h - p.vy <= en.y + 14) {
        en.alive = false;
        p.vy = jumpV * 1.2;
        const gained = Math.round(15 * coinMult);
        game.runCoins += gained;
        addQuestProgress('coins', gained);
        addQuestProgress('kills', 1);
        addCombo(20);
        Sound.spring();
        addParticles(en.x + en.w / 2, en.y + en.h / 2, '#f43f5e', 12);
      } else if (p.jetpack > 0 || game.feverTimer > 0) {
        en.alive = false;
        addQuestProgress('kills', 1);
        addParticles(en.x + en.w / 2, en.y + en.h / 2, '#f43f5e', 10);
      } else if (game.invuln <= 0) {
        en.alive = false;
        hurtPlayer();
        if (!game.running) return;
      }
    }
  }

  // Метеориты
  for (const mt of game.meteors) {
    mt.y += mt.vy;
    if (Math.hypot((p.x + p.w / 2) - mt.x, (p.y + p.h / 2) - mt.y) < mt.r + 18) {
      mt.y = 999999999;
      hurtPlayer();
      if (!game.running) return;
    }
  }

  for (const pt of game.particles) { pt.x += pt.vx; pt.y += pt.vy; pt.life -= 0.04; }
  game.particles = game.particles.filter(pt => pt.life > 0);

  const cutY = game.cameraY + H + 80;
  game.platforms = game.platforms.filter(pl => pl.y < cutY);
  game.items = game.items.filter(it => !it.collected && it.y < cutY);
  game.enemies = game.enemies.filter(en => en.alive && en.y < cutY);
  game.meteors = game.meteors.filter(mt => mt.y < cutY);
  game.bullets = game.bullets.filter(bl => bl.y > game.cameraY - 40);

  // Падение — теряем жизнь и возрождаемся на пружине
  if (p.y > game.cameraY + H + 40) {
    respawnAfterFall();
    if (!game.running) return;
  }

  document.getElementById('hud-score').textContent = fmt(game.score);
  document.getElementById('hud-coins').textContent = fmt(game.runCoins);
  document.getElementById('hud-lives').textContent = heartsString();
  const biome = [...BIOMES].reverse().find(bm => game.score >= bm.min) || BIOMES[0];
  document.getElementById('hud-biome').textContent = biome.name;
  document.getElementById('hud-powerups').textContent = (p.shield ? '🛡️ ' : '') + (p.jetpack > 0 ? '🚀' : '');

  const fHud = document.getElementById('fever-hud');
  const fFill = document.getElementById('fever-fill');
  const cTxt = document.getElementById('combo-text');
  if (game.feverTimer > 0) {
    fHud.classList.add('active');
    cTxt.textContent = `🔥 FEVER ×3!`;
    fFill.style.width = `${(game.feverTimer / 360) * 100}%`;
  } else {
    fHud.classList.remove('active');
    cTxt.textContent = `COMBO ×${comboMult}${game.combo > 0 ? ' (' + game.combo + ')' : ''}`;
    fFill.style.width = `${game.fever}%`;
  }
}

function drawGame() {
  const score = game ? game.score : 0;
  const biome = [...BIOMES].reverse().find(bm => score >= bm.min) || BIOMES[0];

  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, biome.top);
  grad.addColorStop(1, biome.bot);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  if (game && game.feverTimer > 0) {
    ctx.fillStyle = 'rgba(236, 72, 153, 0.14)';
    ctx.fillRect(0, 0, W, H);
  }

  ctx.strokeStyle = biome.grid;
  ctx.lineWidth = 1;
  const camY = game ? game.cameraY : 0;
  const step = 32;
  const offY = -(camY % step);
  for (let x = 0; x < W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = offY; y < H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  if (!game) return;
  ctx.save();
  ctx.translate(0, -game.cameraY);

  for (const pl of game.platforms) {
    if (pl.broken) continue;
    ctx.fillStyle = pl.type === 'normal' ? '#22c55e' : pl.type === 'moving' ? '#38bdf8' : '#b45309';
    ctx.beginPath();
    ctx.roundRect(pl.x, pl.y, pl.w, pl.h, 7);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(pl.x + 6, pl.y + 2, pl.w - 12, 3);
    if (pl.hasSpring) {
      ctx.fillStyle = '#facc15';
      ctx.fillRect(pl.x + pl.w / 2 - 10, pl.y - 8, 20, 8);
    }
  }

  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const it of game.items) {
    if (it.collected) continue;
    const icon = it.type === 'coin' ? '🪙' : it.type === 'seed' ? '🌱' : it.type === 'jetpack' ? '🚀' : it.type === 'heart' ? '❤️' : '🛡️';
    ctx.fillText(icon, it.x, it.y);
  }

  for (const en of game.enemies) {
    if (!en.alive) continue;
    ctx.font = '28px sans-serif';
    ctx.fillText('👾', en.x + en.w / 2, en.y + en.h / 2);
  }

  for (const mt of game.meteors) {
    ctx.font = '30px sans-serif';
    ctx.fillText('☄️', mt.x, mt.y);
  }

  if (game.boss) {
    const bs = game.boss;
    ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.beginPath();
    ctx.arc(bs.x + bs.w / 2, bs.y + bs.h / 2, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '54px sans-serif';
    ctx.fillText(bs.emoji, bs.x + bs.w / 2, bs.y + bs.h / 2 + 4);
  }

  for (const bb of game.bossBullets) {
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(bb.x, bb.y, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(bb.x, bb.y, 3, 0, Math.PI * 2); ctx.fill();
  }

  const pierce = !!getEquippedSkin().bonus.pierce;
  for (const bl of game.bullets) {
    ctx.fillStyle = pierce ? '#fb923c' : '#fde047';
    ctx.beginPath(); ctx.arc(bl.x, bl.y, pierce ? 6 : 5, 0, Math.PI * 2); ctx.fill();
  }

  for (const pt of game.particles) {
    ctx.globalAlpha = pt.life;
    ctx.fillStyle = pt.color;
    ctx.beginPath(); ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  const blink = game.invuln > 0 && Math.floor(game.invuln / 5) % 2 === 0;
  if (!blink) {
    drawDoodle(ctx, game.player.x, game.player.y, game.player.w, game.player.h, getEquippedSkin(), game.player.facing, game.player.shield, game.player.jetpack > 0);
  }

  if (state.equippedPet) {
    const ptObj = PETS.find(x => x.id === state.equippedPet);
    if (ptObj) {
      const t = Date.now() * 0.004;
      const px = game.player.x + game.player.w / 2 + Math.cos(t) * 36;
      const py = game.player.y - 10 + Math.sin(t * 1.4) * 8;
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ptObj.emoji, px, py);
    }
  }

  ctx.restore();
}

function loop() {
  updateGame();
  drawGame();
  requestAnimationFrame(loop);
}

/* ---------- Events & init ---------- */
function switchTab(tab) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(bt => bt.classList.remove('active'));
  document.getElementById(`screen-${tab}`).classList.add('active');
  document.querySelector(`.nav-btn[data-tab="${tab}"]`).classList.add('active');

  if (tab !== 'play' && game && game.running) game.paused = true;
  if (tab === 'play' && game && game.running) {
    game.paused = false;
    document.getElementById('btn-pause').textContent = '⏸';
  }
  if (tab === 'garden') renderGarden();
  if (tab === 'skins') renderSkins();
  if (tab === 'shop') renderShop();
  if (tab === 'credits') renderGiveaways();
  if (tab === 'play') { resizeCanvas(); updateStartPreview(); }
}

document.querySelectorAll('.nav-btn').forEach(btn => { btn.onclick = () => switchTab(btn.dataset.tab); });

document.getElementById('btn-start-game').onclick = startGame;
document.getElementById('btn-restart').onclick = startGame;
document.getElementById('btn-to-garden').onclick = () => switchTab('garden');
document.getElementById('btn-pause').onclick = () => {
  if (!game || !game.running) return;
  game.paused = !game.paused;
  document.getElementById('btn-pause').textContent = game.paused ? '▶' : '⏸';
};

document.getElementById('btn-sound').onclick = () => {
  state.sound = !state.sound;
  Sound.enabled = state.sound;
  saveState(); updateTopHUD();
};

document.getElementById('chk-tilt').onchange = (e) => { state.tilt = e.target.checked; saveState(); };

document.getElementById('btn-collect-all').onclick = () => {
  const amt = Math.floor(state.gardenBank);
  if (amt <= 0) { showToast('Пока нечего собирать'); return; }
  state.coins += amt;
  state.gardenBank -= amt;
  Sound.win();
  showToast(`Собрано +${fmt(amt)} ококи из сада!`);
  saveState(); updateTopHUD();
};

document.getElementById('btn-sell-seed').onclick = () => sellSeed(false);
document.getElementById('btn-sell-all-seeds').onclick = () => sellSeed(true);
document.getElementById('btn-merge-garden').onclick = mergeGarden;

document.getElementById('btn-quests').onclick = () => {
  renderQuests();
  document.getElementById('modal-quests').classList.remove('hidden');
};
document.getElementById('btn-quests-close').onclick = () => document.getElementById('modal-quests').classList.add('hidden');

document.querySelectorAll('.case-btn').forEach(btn => { btn.onclick = () => rollSkin(btn.dataset.case); });
document.getElementById('btn-close-case').onclick = () => document.getElementById('modal-case').classList.add('hidden');

document.getElementById('btn-claim-offline').onclick = () => {
  const amt = Math.floor(state.gardenBank);
  state.coins += amt;
  state.gardenBank = 0;
  Sound.win();
  document.getElementById('modal-offline').classList.add('hidden');
  saveState(); updateTopHUD();
};

// Двойной тап по «никита фембой» -> ввод кода
let nikitaTaps = 0, nikitaTimer = null;
document.getElementById('credit-nikita').addEventListener('click', () => {
  nikitaTaps++;
  clearTimeout(nikitaTimer);
  nikitaTimer = setTimeout(() => { nikitaTaps = 0; }, 600);
  if (nikitaTaps >= 2) { nikitaTaps = 0; openCodeModal(); }
});
document.getElementById('btn-code-ok').onclick = submitCode;
document.getElementById('code-input').addEventListener('keydown', e => { if (e.key === 'Enter') submitCode(); });
document.getElementById('btn-code-cancel').onclick = () => document.getElementById('modal-code').classList.add('hidden');
document.getElementById('btn-admin-close').onclick = () => document.getElementById('modal-admin').classList.add('hidden');
document.getElementById('prank-close').onclick = () => {
  document.getElementById('prank').classList.add('hidden');
  document.getElementById('modal-admin').classList.add('hidden');
};

window.addEventListener('keydown', e => {
  if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
  if (e.key === ' ' || e.key === 'ArrowUp') shootBullet();
});
window.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
});

function bindHold(id, prop) {
  const el = document.getElementById(id);
  const on = (e) => { e.preventDefault(); keys[prop] = true; };
  const off = (e) => { e.preventDefault(); keys[prop] = false; };
  el.addEventListener('touchstart', on, { passive: false });
  el.addEventListener('touchend', off, { passive: false });
  el.addEventListener('touchcancel', off, { passive: false });
  el.addEventListener('mousedown', on);
  el.addEventListener('mouseup', off);
  el.addEventListener('mouseleave', off);
}
bindHold('ctrl-left', 'left');
bindHold('ctrl-right', 'right');
document.getElementById('ctrl-shoot').addEventListener('touchstart', e => { e.preventDefault(); shootBullet(); }, { passive: false });
document.getElementById('ctrl-shoot').addEventListener('mousedown', e => { e.preventDefault(); shootBullet(); });

window.addEventListener('deviceorientation', e => { if (typeof e.gamma === 'number') tiltVx = e.gamma * 0.35; });
window.addEventListener('resize', resizeCanvas);

setInterval(() => {
  const rate = getGardenIncomePerSec();
  if (rate > 0) state.gardenBank += rate;
  updateTopHUD();
  if (document.getElementById('screen-garden').classList.contains('active')) tickGarden();
  else {
    const now = Date.now();
    for (const p of state.plots) {
      if (p.unlocked && p.seedId && !p.grown &&
          (now - p.plantedAt) / 1000 + (p.growBonusSec || 0) >= SEEDS[p.seedId].growSec) p.grown = true;
    }
  }
}, 1000);

setInterval(saveState, 10000);

loadState();
document.getElementById('chk-tilt').checked = !!state.tilt;
resizeCanvas();
updateTopHUD();
updateStartPreview();
renderGarden();
renderSkins();
renderShop();
renderGiveaways();
requestAnimationFrame(loop);

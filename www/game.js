/* =========================================================
   DOODLE GARDEN — Full Game Engine, Garden, Skins & Cases
   ========================================================= */

const STORAGE_KEY = 'doodle_garden_save_v1';

const RARITY = {
  common: { label: 'ОБЫЧНЫЙ', color: '#94a3b8' },
  rare:   { label: 'РЕДКИЙ',  color: '#3b82f6' },
  epic:   { label: 'ЭПИК',    color: '#a855f7' },
  legend: { label: 'ЛЕГЕНДА', color: '#f59e0b' }
};

const SKINS = [
  { id: 'classic',   name: 'Классический',   emoji: '🟢', color: '#4ade80', belly: '#bbf7d0', rarity: 'common', bonusText: 'Классика жанра', bonus: {} },
  { id: 'gardener',  name: 'Садовник',       emoji: '👒', color: '#22c55e', belly: '#dcfce7', rarity: 'common', bonusText: '+15% доход сада', bonus: { gardenMult: 0.15 } },
  { id: 'cactus',    name: 'Кактус',         emoji: '🌵', color: '#15803d', belly: '#86efac', rarity: 'common', bonusText: '+10% к прыжку', bonus: { jumpMult: 0.10 } },
  { id: 'bee',       name: 'Пчёлка-Дуд',     emoji: '🐝', color: '#eab308', belly: '#fef08a', rarity: 'common', bonusText: '+10% ококи в игре', bonus: { coinMult: 0.10 } },
  { id: 'cat',       name: 'Кот-Дуд',        emoji: '🐱', color: '#fb923c', belly: '#fed7aa', rarity: 'rare',   bonusText: '+18% ококи в игре', bonus: { coinMult: 0.18 } },
  { id: 'ninja',     name: 'Ниндзя',         emoji: '🥷', color: '#334155', belly: '#94a3b8', rarity: 'rare',   bonusText: '+20% скорость', bonus: { speedMult: 0.20 } },
  { id: 'ghost',     name: 'Призрак',        emoji: '👻', color: '#e2e8f0', belly: '#ffffff', rarity: 'rare',   bonusText: 'Плавнее падение', bonus: { gravMult: -0.10 } },
  { id: 'vampire',   name: 'Вампир',         emoji: '🧛', color: '#991b1b', belly: '#fca5a5', rarity: 'rare',   bonusText: '+25% урон по боссам', bonus: { bossDmg: 1 } },
  { id: 'astro',     name: 'Космонавт',      emoji: '👨‍🚀', color: '#38bdf8', belly: '#e0f2fe', rarity: 'epic',   bonusText: 'Низкая гравитация +15%', bonus: { gravMult: -0.15, coinMult: 0.12 } },
  { id: 'robot',     name: 'Киборг',         emoji: '🤖', color: '#64748b', belly: '#38bdf8', rarity: 'epic',   bonusText: 'Авто-щит на старте', bonus: { startShield: true } },
  { id: 'cyber',     name: 'Неон-Панк',      emoji: '⚡', color: '#c084fc', belly: '#f0abfc', rarity: 'epic',   bonusText: '+28% ококи и неон-след', bonus: { coinMult: 0.28, neonTrail: true } },
  { id: 'wizard',    name: 'Архимаг',        emoji: '🧙', color: '#6366f1', belly: '#c7d2fe', rarity: 'epic',   bonusText: '+25% сад и урон боссам', bonus: { gardenMult: 0.25, bossDmg: 1 } },
  { id: 'samurai',   name: 'Самурай',        emoji: '⚔️', color: '#dc2626', belly: '#fecaca', rarity: 'epic',   bonusText: '+15% прыжок и +1 урон', bonus: { jumpMult: 0.15, bossDmg: 1 } },
  { id: 'slimeking', name: 'Король Слаймов', emoji: '🧪', color: '#10b981', belly: '#a7f3d0', rarity: 'epic',   bonusText: '+30% доход сада', bonus: { gardenMult: 0.30 } },
  { id: 'dragon',    name: 'Дракончик',      emoji: '🐉', color: '#ef4444', belly: '#fde047', rarity: 'legend', bonusText: '+20% прыжок и +30% ококи', bonus: { jumpMult: 0.20, coinMult: 0.30 } },
  { id: 'king',      name: 'Золотой Король', emoji: '👑', color: '#facc15', belly: '#fef08a', rarity: 'legend', bonusText: '+55% сад и +45% ококи', bonus: { gardenMult: 0.55, coinMult: 0.45 } },
  { id: 'diamond',   name: 'Алмазный Дуд',   emoji: '💎', color: '#22d3ee', belly: '#cffafe', rarity: 'legend', bonusText: 'Щит +40% ококи +35% сад', bonus: { startShield: true, coinMult: 0.40, gardenMult: 0.35 } },
  { id: 'galaxy',    name: 'Бог Галактики',  emoji: '🌌', color: '#a855f7', belly: '#38bdf8', rarity: 'legend', bonusText: 'Щит +50% ококи +2 урон', bonus: { startShield: true, coinMult: 0.50, bossDmg: 2, neonTrail: true } }
];

const SEEDS = {
  common: { id: 'common', name: 'Росток Дуда',     emoji: '🌱', grownEmoji: '🟢', growSec: 18,  baseIncome: 1.5, cost: 35,   rarity: 'common' },
  rare:   { id: 'rare',   name: 'Синий Дуд-Цветок',emoji: '🫐', grownEmoji: '🔵', growSec: 40,  baseIncome: 5,   cost: 140,  rarity: 'rare' },
  epic:   { id: 'epic',   name: 'Неоновый Дуд',    emoji: '🔮', grownEmoji: '🟣', growSec: 80,  baseIncome: 15,  cost: 450,  rarity: 'epic' },
  legend: { id: 'legend', name: 'Золотой Дуд-Бог', emoji: '🌟', grownEmoji: '👑', growSec: 150, baseIncome: 45,  cost: 1400, rarity: 'legend' }
};

const UPGRADES = [
  { id: 'magnet',   name: 'Магнит ококов',   icon: '🧲', desc: 'Притягивает ококи и семена', baseCost: 100, maxLv: 5 },
  { id: 'jetpack',  name: 'Турбо-Ранец',     icon: '🚀', desc: 'Дольше полёт на джетпаке',   baseCost: 130, maxLv: 5 },
  { id: 'springs',  name: 'Супер-Пружины',   icon: '🌀', desc: 'Чаще появляются пружинки',   baseCost: 90,  maxLv: 5 },
  { id: 'coinMult', name: 'Золотая жила',    icon: '💰', desc: '+25% ококов за уровень',     baseCost: 180, maxLv: 5 },
  { id: 'garden',   name: 'Удобрение сада',  icon: '💧', desc: '+30% пассивного дохода сада',baseCost: 220, maxLv: 5 }
];

const PLOT_UNLOCK_COSTS = [0, 0, 0, 120, 320, 750, 1500, 3000, 6000];

const CASES = {
  common: { cost: 120,  weights: { common: 62, rare: 30, epic: 7,  legend: 1 } },
  epic:   { cost: 450,  weights: { common: 15, rare: 45, epic: 31, legend: 9 } },
  legend: { cost: 1400, weights: { common: 0,  rare: 0,  epic: 60, legend: 40 } }
};

const BOSS_TEMPLATES = [
  { name: 'Гигантский Слизень', emoji: '🟢', hp: 10, reward: 180, speed: 1.6, fireRate: 110 },
  { name: 'Король НЛО',         emoji: '🛸', hp: 15, reward: 300, speed: 2.1, fireRate: 95 },
  { name: 'Неоновый Дракон',    emoji: '🐲', hp: 22, reward: 480, speed: 2.5, fireRate: 80 },
  { name: 'Тёмный Дуд-Лорд',    emoji: '😈', hp: 30, reward: 750, speed: 2.9, fireRate: 70 }
];

/* ---------- Sound Engine (Web Audio API) ---------- */
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
function defaultState() {
  return {
    coins: 120,
    bestScore: 0,
    equippedSkin: 'classic',
    unlockedSkins: ['classic'],
    seeds: { common: 2, rare: 0, epic: 0, legend: 0 },
    selectedSeed: 'common',
    plots: Array.from({ length: 9 }, (_, i) => ({
      unlocked: i < 3,
      seedId: null,
      plantedAt: 0,
      growBonusSec: 0,
      grown: false,
      level: 1
    })),
    gardenBank: 0,
    upgrades: { magnet: 0, jetpack: 0, springs: 0, coinMult: 0, garden: 0 },
    sound: true,
    tilt: false,
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
      if (!Array.isArray(state.plots) || state.plots.length !== 9) state.plots = defaultState().plots;
    }
  } catch (e) { console.warn('Load failed', e); }
  Sound.enabled = state.sound;
  processOfflineIncome();
}

function saveState() {
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
      total += SEEDS[p.seedId].baseIncome * (1 + (p.level - 1) * 0.6);
    }
  }
  const skinMult = 1 + (getEquippedSkin().bonus.gardenMult || 0);
  const upgMult = 1 + (state.upgrades.garden || 0) * 0.30;
  return total * skinMult * upgMult;
}

function processOfflineIncome() {
  const now = Date.now();
  const elapsedSec = Math.min(8 * 3600, Math.max(0, (now - (state.lastSaved || now)) / 1000));
  // Check growing plots
  for (const p of state.plots) {
    if (p.unlocked && p.seedId && !p.grown) {
      const need = SEEDS[p.seedId].growSec;
      const done = (now - p.plantedAt) / 1000 + (p.growBonusSec || 0);
      if (done >= need) p.grown = true;
    }
  }
  const rate = getGardenIncomePerSec();
  const earned = Math.floor(rate * elapsedSec);
  if (elapsedSec > 15 && earned >= 5) {
    state.gardenBank += earned;
    const modal = document.getElementById('modal-offline');
    document.getElementById('offline-amount').textContent = `+${earned} ококи`;
    modal.classList.remove('hidden');
  }
}

/* ---------- UI Helpers ---------- */
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2200);
}

function fmt(n) {
  n = Math.floor(n);
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e4) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
}

function updateTopHUD() {
  document.getElementById('ui-coins').textContent = fmt(state.coins);
  document.getElementById('ui-income').textContent = `+${getGardenIncomePerSec().toFixed(1)}/с`;
  document.getElementById('ui-best').textContent = fmt(state.bestScore);
  document.getElementById('btn-sound').textContent = state.sound ? '🔊' : '🔇';
  document.getElementById('garden-bank').textContent = fmt(state.gardenBank);
}

/* ---------- Draw Doodle Helper ---------- */
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

  // Body
  ctx.fillStyle = skin.color;
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, 14);
  ctx.fill();

  // Belly
  ctx.fillStyle = skin.belly;
  ctx.beginPath();
  ctx.ellipse(2, 6, w * 0.3, h * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Snout
  ctx.fillStyle = skin.color;
  ctx.beginPath();
  ctx.roundRect(w * 0.25, -8, 14, 10, 5);
  ctx.fill();

  // Eyes
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

  // Cute legs
  ctx.strokeStyle = skin.color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-8, h / 2); ctx.lineTo(-10, h / 2 + 6);
  ctx.moveTo(0, h / 2);  ctx.lineTo(0, h / 2 + 6);
  ctx.moveTo(8, h / 2);  ctx.lineTo(10, h / 2 + 6);
  ctx.stroke();

  // Skin badge / hat emoji
  if (skin.id !== 'classic') {
    ctx.scale(facing, 1);
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(skin.emoji, 0, -h / 2 - 2);
  }

  ctx.restore();
}

function updateStartPreview() {
  const skin = getEquippedSkin();
  document.getElementById('start-skin-name').textContent = skin.name;
  document.getElementById('start-skin-bonus').textContent = skin.bonusText;
  const c = document.getElementById('preview-canvas');
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  drawDoodle(ctx, 26, 28, 44, 44, skin, 1, !!skin.bonus.startShield, false);
}

/* ---------- Garden UI & Logic ---------- */
function renderGarden() {
  // Seeds bar
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

  // Grid
  const grid = document.getElementById('garden-grid');
  grid.innerHTML = '';
  const now = Date.now();

  state.plots.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'plot-card' + (!p.unlocked ? ' locked' : '');

    if (!p.unlocked) {
      const cost = PLOT_UNLOCK_COSTS[idx];
      card.innerHTML = `
        <div class="plot-emoji">🔒</div>
        <div class="plot-name">Грядка #${idx + 1}</div>
        <div class="plot-sub">Открыть за ${cost} ококи</div>
      `;
      card.onclick = () => {
        if (state.coins >= cost) {
          state.coins -= cost;
          p.unlocked = true;
          Sound.win();
          showToast(`Грядка #${idx + 1} открыта!`);
          saveState(); updateTopHUD(); renderGarden();
        } else {
          showToast(`Нужно ${cost} ококи`);
        }
      };
    } else if (!p.seedId) {
      card.innerHTML = `
        <div class="plot-emoji">🟫</div>
        <div class="plot-name">Пустая грядка</div>
        <div class="plot-sub">Нажми, чтобы посадить</div>
      `;
      card.onclick = () => {
        const sid = state.selectedSeed;
        if ((state.seeds[sid] || 0) <= 0) {
          showToast('Нет этих семян! Купи в Магазине или выбей в игре');
          return;
        }
        state.seeds[sid]--;
        p.seedId = sid;
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
      if (rem <= 0) p.grown = true;
      card.innerHTML = `
        <div class="plot-emoji">${s.emoji}</div>
        <div class="plot-name">${s.name}</div>
        <div class="plot-sub">💧 Полить (-5с) • ${rem}с</div>
        <div class="plot-progress"><div class="plot-progress-fill" style="width:${pct}%"></div></div>
      `;
      card.onclick = () => {
        p.growBonusSec = (p.growBonusSec || 0) + 5;
        Sound.jump();
        renderGarden();
      };
    } else {
      const s = SEEDS[p.seedId];
      const inc = (s.baseIncome * (1 + (p.level - 1) * 0.6)).toFixed(1);
      const upgCost = Math.floor(s.cost * 0.8 * Math.pow(1.6, p.level - 1));
      card.innerHTML = `
        <div class="plot-emoji">${s.grownEmoji}</div>
        <div class="plot-name">${s.name}</div>
        <div class="plot-income">+${inc}/с • Ур.${p.level}</div>
        <button class="plot-upgrade-btn">⬆ ${upgCost} ококи</button>
      `;
      card.querySelector('.plot-upgrade-btn').onclick = (e) => {
        e.stopPropagation();
        if (state.coins >= upgCost) {
          state.coins -= upgCost;
          p.level++;
          Sound.win();
          saveState(); updateTopHUD(); renderGarden();
        } else {
          showToast(`Нужно ${upgCost} ококи`);
        }
      };
    }

    grid.appendChild(card);
  });
}

/* ---------- Skins & Cases ---------- */
function renderSkins() {
  document.getElementById('skin-count').textContent = `${state.unlockedSkins.length}/${SKINS.length}`;
  const grid = document.getElementById('skins-grid');
  grid.innerHTML = '';

  SKINS.forEach(s => {
    const owned = state.unlockedSkins.includes(s.id);
    const eq = state.equippedSkin === s.id;
    const card = document.createElement('div');
    card.className = `skin-card rarity-${s.rarity}` + (!owned ? ' locked' : '') + (eq ? ' equipped' : '');
    card.innerHTML = `
      <div class="skin-avatar" style="background:${s.color}33; border: 2px solid ${s.color}">${s.emoji}</div>
      <div class="skin-name">${s.name}</div>
      <div class="skin-bonus">${owned ? (eq ? '✅ Выбран' : s.bonusText) : '🔒 В кейсах'}</div>
    `;
    card.onclick = () => {
      if (!owned) {
        showToast('Выбей этот скин в кейсах выше!');
        return;
      }
      state.equippedSkin = s.id;
      Sound.coin();
      saveState();
      updateTopHUD();
      updateStartPreview();
      renderSkins();
      showToast(`Выбран скин: ${s.name}`);
    };
    grid.appendChild(card);
  });
}

function rollSkin(caseKey) {
  const cfg = CASES[caseKey];
  if (state.coins < cfg.cost) {
    showToast(`Не хватает ококов! Нужно ${cfg.cost} ококи`);
    return;
  }
  state.coins -= cfg.cost;
  saveState(); updateTopHUD();

  // Weighted rarity
  const r = Math.random() * 100;
  let acc = 0, chosenRarity = 'common';
  for (const [rar, w] of Object.entries(cfg.weights)) {
    acc += w;
    if (r <= acc) { chosenRarity = rar; break; }
  }
  const pool = SKINS.filter(s => s.rarity === chosenRarity);
  const winner = pool[Math.floor(Math.random() * pool.length)];

  // Roulette animation
  const modal = document.getElementById('modal-case');
  const track = document.getElementById('roulette-track');
  const resBox = document.getElementById('case-result');
  resBox.classList.add('hidden');
  document.getElementById('case-modal-title').textContent = 'Крутим кейс...';
  modal.classList.remove('hidden');

  const items = [];
  const winIndex = 24;
  for (let i = 0; i < 32; i++) {
    items.push(i === winIndex ? winner : SKINS[Math.floor(Math.random() * SKINS.length)]);
  }

  track.style.transition = 'none';
  track.style.transform = 'translateX(0px)';
  track.innerHTML = items.map(it => `
    <div class="roulette-item" style="border-bottom-color:${RARITY[it.rarity].color}">
      <div>${it.emoji}</div>
      <span>${it.name}</span>
    </div>
  `).join('');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const itemW = 92;
      const winCenter = winIndex * itemW + itemW / 2;
      const viewW = document.querySelector('.roulette-window').clientWidth;
      const offset = winCenter - viewW / 2 + (Math.random() * 24 - 12);
      track.style.transition = 'transform 2.6s cubic-bezier(0.12, 0.85, 0.18, 1)';
      track.style.transform = `translateX(-${offset}px)`;
    });
  });

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

/* ---------- Shop ---------- */
function renderShop() {
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
      <button class="buy-btn" ${maxed ? 'disabled' : ''}>${maxed ? 'МАКС' : cost + ' ококи'}</button>
    `;
    el.querySelector('.buy-btn').onclick = () => {
      if (maxed) return;
      if (state.coins >= cost) {
        state.coins -= cost;
        state.upgrades[u.id] = lv + 1;
        Sound.win();
        saveState(); updateTopHUD(); renderShop();
        showToast(`${u.name} улучшен!`);
      } else {
        showToast(`Нужно ${cost} ококи`);
      }
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
          <div class="shop-desc">Доход: +${s.baseIncome}/с • Рост: ${s.growSec}с</div>
        </div>
      </div>
      <button class="buy-btn">${s.cost} ококи</button>
    `;
    el.querySelector('.buy-btn').onclick = () => {
      if (state.coins >= s.cost) {
        state.coins -= s.cost;
        state.seeds[s.id] = (state.seeds[s.id] || 0) + 1;
        Sound.coin();
        saveState(); updateTopHUD(); renderGarden();
        showToast(`Куплено семя: ${s.name}`);
      } else {
        showToast(`Нужно ${s.cost} ококи`);
      }
    };
    seedList.appendChild(el);
  });
}

/* ---------- Doodle Jump Game Engine ---------- */
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
  { min: 0,    name: '🌿 Сад',      top: '#0f172a', bot: '#1e3a2f', grid: 'rgba(74,222,128,0.07)' },
  { min: 1500, name: '☁️ Облака',   top: '#0c4a6e', bot: '#38bdf8', grid: 'rgba(255,255,255,0.08)' },
  { min: 3500, name: '🌌 Космос',   top: '#090d16', bot: '#1e1b4b', grid: 'rgba(168,85,247,0.08)' },
  { min: 6000, name: '⚡ Неон',     top: '#1e0536', bot: '#4c1d95', grid: 'rgba(244,114,182,0.1)' }
];

let game = null;
const keys = { left: false, right: false };
let tiltVx = 0;

function startGame() {
  Sound.init();
  resizeCanvas();
  const skin = getEquippedSkin();
  const b = skin.bonus;

  game = {
    running: true,
    paused: false,
    score: 0,
    runCoins: 0,
    runSeeds: 0,
    cameraY: 0,
    maxY: 0,
    player: {
      x: W / 2 - 22,
      y: H - 140,
      w: 44,
      h: 44,
      vx: 0,
      vy: -13,
      facing: 1,
      shield: !!b.startShield,
      jetpack: 0,
      magnet: state.upgrades.magnet > 0 ? 9999 : 0
    },
    platforms: [],
    items: [],
    enemies: [],
    bullets: [],
    bossBullets: [],
    boss: null,
    nextBossScore: 800,
    bossTier: 0,
    particles: [],
    highestPlatY: H - 50
  };

  document.getElementById('boss-hud').classList.add('hidden');

  // Initial safe platform
  game.platforms.push({ x: W / 2 - 50, y: H - 70, w: 100, h: 16, type: 'normal', vx: 0, broken: false });
  while (game.highestPlatY > -H) spawnPlatformRow();

  document.getElementById('overlay-start').classList.add('hidden');
  document.getElementById('overlay-gameover').classList.add('hidden');
  document.getElementById('game-hud').classList.remove('hidden');
  document.getElementById('touch-controls').classList.remove('hidden');
}

function spawnPlatformRow() {
  const diff = Math.min(1, game.score / 5000);
  const gap = 58 + Math.random() * (34 + diff * 32);
  const y = game.highestPlatY - gap;
  game.highestPlatY = y;

  const w = Math.max(58, 84 - diff * 18);
  const x = 12 + Math.random() * (W - w - 24);
  const r = Math.random();
  let type = 'normal', vx = 0;
  if (r < 0.14 + diff * 0.2) { type = 'moving'; vx = (Math.random() < 0.5 ? -1 : 1) * (1.2 + diff * 1.6); }
  else if (r < 0.26 + diff * 0.14) { type = 'break'; }

  const springChance = 0.08 + (state.upgrades.springs || 0) * 0.025;
  const hasSpring = type !== 'break' && Math.random() < springChance;

  game.platforms.push({ x, y, w, h: 15, type, vx, broken: false, hasSpring });

  // Coins & Powerups
  if (Math.random() < 0.45) {
    game.items.push({ x: x + w / 2, y: y - 24, type: 'coin', collected: false });
  } else if (Math.random() < 0.045) {
    game.items.push({ x: x + w / 2, y: y - 26, type: 'seed', collected: false });
  } else if (Math.random() < 0.03) {
    game.items.push({ x: x + w / 2, y: y - 26, type: 'jetpack', collected: false });
  } else if (Math.random() < 0.025) {
    game.items.push({ x: x + w / 2, y: y - 26, type: 'shield', collected: false });
  }

  // Enemies
  if (game.score > 400 && Math.random() < 0.06 + diff * 0.06) {
    game.enemies.push({ x: 30 + Math.random() * (W - 60), y: y - 40, w: 36, h: 32, vx: (Math.random() < 0.5 ? -1 : 1) * 1.1, alive: true });
  }
}

function shootBullet() {
  if (!game || !game.running || game.paused) return;
  Sound.shoot();
  game.bullets.push({ x: game.player.x + game.player.w / 2, y: game.player.y, vy: -14 });
}

function damageBoss(dmg, coinMult) {
  if (!game || !game.boss) return;
  const bs = game.boss;
  bs.hp -= dmg;
  Sound.coin();
  addParticles(bs.x + bs.w / 2, bs.y + bs.h / 2, '#f97316', 8);
  const pct = Math.max(0, (bs.hp / bs.maxHp) * 100);
  document.getElementById('boss-hp-fill').style.width = `${pct}%`;

  if (bs.hp <= 0) {
    const reward = Math.round(bs.reward * coinMult);
    game.runCoins += reward;
    const dropSeed = game.bossTier >= 2 ? 'epic' : 'rare';
    state.seeds[dropSeed] = (state.seeds[dropSeed] || 0) + 1;
    game.runSeeds++;
    addParticles(bs.x + bs.w / 2, bs.y + bs.h / 2, '#facc15', 24);
    Sound.win();
    showToast(`🏆 Босс повержен! +${reward} ококи и семя!`);
    game.boss = null;
    game.bossTier++;
    game.nextBossScore = game.score + 900;
    document.getElementById('boss-hud').classList.add('hidden');
  }
}

function addParticles(x, y, color, count = 8) {
  for (let i = 0; i < count; i++) {
    game.particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      life: 1,
      color
    });
  }
}

function endGame() {
  if (!game || !game.running) return;
  game.running = false;
  Sound.hit();

  state.coins += game.runCoins;
  if (game.score > state.bestScore) state.bestScore = game.score;
  saveState();
  updateTopHUD();

  document.getElementById('go-score').textContent = fmt(game.score);
  document.getElementById('go-best').textContent = fmt(state.bestScore);
  document.getElementById('go-coins').textContent = `+${fmt(game.runCoins)}`;
  document.getElementById('go-seeds').textContent = `+${game.runSeeds}`;
  document.getElementById('overlay-gameover').classList.remove('hidden');
  document.getElementById('touch-controls').classList.add('hidden');
  document.getElementById('boss-hud').classList.add('hidden');
}

function updateGame() {
  if (!game || !game.running || game.paused) return;
  const p = game.player;
  const skin = getEquippedSkin();
  const b = skin.bonus;

  const speed = 6.2 * (1 + (b.speedMult || 0));
  const grav = 0.42 * (1 + (b.gravMult || 0));
  const jumpV = -12.6 * (1 + (b.jumpMult || 0));

  // Horizontal control
  if (keys.left) { p.vx = -speed; p.facing = -1; }
  else if (keys.right) { p.vx = speed; p.facing = 1; }
  else if (state.tilt && Math.abs(tiltVx) > 0.2) {
    p.vx = Math.max(-speed, Math.min(speed, tiltVx));
    p.facing = p.vx >= 0 ? 1 : -1;
  } else {
    p.vx *= 0.82;
  }

  p.x += p.vx;
  if (p.x + p.w < 0) p.x = W;
  if (p.x > W) p.x = -p.w;

  // Jetpack or Gravity
  if (p.jetpack > 0) {
    p.jetpack--;
    p.vy = -15.5;
    if (p.jetpack % 3 === 0) addParticles(p.x + p.w / 2, p.y + p.h, '#facc15', 2);
  } else {
    p.vy += grav;
  }
  p.y += p.vy;

  if (b.neonTrail && Math.random() < 0.4) {
    addParticles(p.x + p.w / 2, p.y + p.h / 2, skin.color, 1);
  }

  // Camera follow
  if (p.y < game.cameraY + H * 0.4) {
    game.cameraY = p.y - H * 0.4;
    const hScore = Math.floor(-game.cameraY / 4);
    if (hScore > game.score) game.score = hScore;
  }

  while (game.highestPlatY > game.cameraY - H) spawnPlatformRow();

  // Platforms
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
      } else if (pl.hasSpring) {
        p.vy = jumpV * 1.65;
        Sound.spring();
        addParticles(pl.x + pl.w / 2, pl.y, '#38bdf8', 10);
      } else {
        p.vy = jumpV;
        Sound.jump();
        addParticles(p.x + p.w / 2, p.y + p.h, '#4ade80', 4);
      }
    }
  }

  // Items
  const magRange = 45 + (state.upgrades.magnet || 0) * 32;
  const coinMult = 1 + (b.coinMult || 0) + (state.upgrades.coinMult || 0) * 0.25;
  for (const it of game.items) {
    if (it.collected) continue;
    const dx = (p.x + p.w / 2) - it.x;
    const dy = (p.y + p.h / 2) - it.y;
    const dist = Math.hypot(dx, dy);

    if (state.upgrades.magnet > 0 && (it.type === 'coin' || it.type === 'seed') && dist < magRange) {
      it.x += dx * 0.14;
      it.y += dy * 0.14;
    }

    if (dist < 30) {
      it.collected = true;
      if (it.type === 'coin') {
        game.runCoins += Math.max(1, Math.round(5 * coinMult));
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
      }
    }
  }

  // Bullets
  const dmg = 1 + (b.bossDmg || 0);
  for (const bl of game.bullets) {
    bl.y += bl.vy;
    for (const en of game.enemies) {
      if (!en.alive) continue;
      if (bl.x > en.x && bl.x < en.x + en.w && bl.y > en.y && bl.y < en.y + en.h) {
        en.alive = false;
        bl.y = -999999;
        game.runCoins += Math.round(15 * coinMult);
        Sound.coin();
        addParticles(en.x + en.w / 2, en.y + en.h / 2, '#f43f5e', 12);
      }
    }
    // Hit Boss
    if (game.boss && bl.x > game.boss.x && bl.x < game.boss.x + game.boss.w &&
        bl.y > game.boss.y && bl.y < game.boss.y + game.boss.h) {
      bl.y = -999999;
      damageBoss(dmg, coinMult);
    }
  }

  // Boss Spawn & Logic
  if (!game.boss && game.score >= game.nextBossScore) {
    const tpl = BOSS_TEMPLATES[game.bossTier % BOSS_TEMPLATES.length];
    const scale = 1 + Math.floor(game.bossTier / BOSS_TEMPLATES.length) * 0.6;
    game.boss = {
      name: tpl.name,
      emoji: tpl.emoji,
      hp: Math.round(tpl.hp * scale),
      maxHp: Math.round(tpl.hp * scale),
      reward: Math.round(tpl.reward * scale),
      x: W / 2 - 42,
      y: game.cameraY + 115,
      w: 84,
      h: 72,
      vx: tpl.speed,
      fireCd: tpl.fireRate,
      fireRate: tpl.fireRate
    };
    document.getElementById('boss-name').textContent = `${tpl.emoji} БОСС: ${tpl.name}`;
    document.getElementById('boss-hp-fill').style.width = '100%';
    document.getElementById('boss-hud').classList.remove('hidden');
    showToast(`⚠️ Появился босс: ${tpl.name}! Стреляй ⚡`);
  }

  if (game.boss) {
    const bs = game.boss;
    bs.y = game.cameraY + 115;
    bs.x += bs.vx;
    if (bs.x < 14 || bs.x + bs.w > W - 14) bs.vx *= -1;

    bs.fireCd--;
    if (bs.fireCd <= 0) {
      bs.fireCd = bs.fireRate;
      game.bossBullets.push({ x: bs.x + bs.w / 2, y: bs.y + bs.h, vy: 4.5 });
    }

    // Stomp boss
    if (p.x + p.w - 6 > bs.x && p.x + 6 < bs.x + bs.w && p.y + p.h > bs.y && p.y < bs.y + bs.h) {
      if (p.vy > 0 && p.y + p.h - p.vy <= bs.y + 22) {
        p.vy = jumpV * 1.3;
        damageBoss(dmg * 2, coinMult);
      } else if (p.jetpack > 0) {
        damageBoss(dmg, coinMult);
      } else if (p.shield) {
        p.shield = false;
        p.vy = jumpV;
        Sound.break();
      } else {
        endGame();
        return;
      }
    }
  }

  // Boss Projectiles
  for (const bb of game.bossBullets) {
    bb.y += bb.vy;
    if (bb.x > p.x + 6 && bb.x < p.x + p.w - 6 && bb.y > p.y + 6 && bb.y < p.y + p.h - 6) {
      bb.y = 999999;
      if (p.jetpack > 0) continue;
      if (p.shield) {
        p.shield = false;
        Sound.break();
      } else {
        endGame();
        return;
      }
    }
  }
  game.bossBullets = game.bossBullets.filter(bb => bb.y < game.cameraY + H + 40);

  // Enemies
  for (const en of game.enemies) {
    if (!en.alive) continue;
    en.x += en.vx;
    if (en.x < 10 || en.x + en.w > W - 10) en.vx *= -1;
    if (p.x + p.w - 6 > en.x && p.x + 6 < en.x + en.w && p.y + p.h > en.y && p.y < en.y + en.h) {
      if (p.vy > 0 && p.y + p.h - p.vy <= en.y + 14) {
        en.alive = false;
        p.vy = jumpV * 1.2;
        game.runCoins += Math.round(15 * coinMult);
        Sound.spring();
        addParticles(en.x + en.w / 2, en.y + en.h / 2, '#f43f5e', 12);
      } else if (p.jetpack > 0) {
        en.alive = false;
        addParticles(en.x + en.w / 2, en.y + en.h / 2, '#f43f5e', 10);
      } else if (p.shield) {
        p.shield = false;
        en.alive = false;
        p.vy = jumpV;
        Sound.break();
      } else {
        endGame();
        return;
      }
    }
  }

  // Particles
  for (const pt of game.particles) {
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.life -= 0.04;
  }
  game.particles = game.particles.filter(pt => pt.life > 0);

  // Cleanup below camera
  const cutY = game.cameraY + H + 80;
  game.platforms = game.platforms.filter(pl => pl.y < cutY);
  game.items = game.items.filter(it => !it.collected && it.y < cutY);
  game.enemies = game.enemies.filter(en => en.alive && en.y < cutY);
  game.bullets = game.bullets.filter(bl => bl.y > game.cameraY - 40);

  // Fall check
  if (p.y > game.cameraY + H + 40) endGame();

  // HUD
  document.getElementById('hud-score').textContent = fmt(game.score);
  document.getElementById('hud-coins').textContent = fmt(game.runCoins);
  const biome = [...BIOMES].reverse().find(bm => game.score >= bm.min) || BIOMES[0];
  document.getElementById('hud-biome').textContent = biome.name;
  document.getElementById('hud-powerups').textContent =
    (p.shield ? '🛡️ ' : '') + (p.jetpack > 0 ? '🚀' : '');
}

function drawGame() {
  const score = game ? game.score : 0;
  const biome = [...BIOMES].reverse().find(bm => score >= bm.min) || BIOMES[0];

  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, biome.top);
  grad.addColorStop(1, biome.bot);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Notebook grid lines
  ctx.strokeStyle = biome.grid;
  ctx.lineWidth = 1;
  const camY = game ? game.cameraY : 0;
  const step = 32;
  const offY = -(camY % step);
  for (let x = 0; x < W; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = offY; y < H; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  if (!game) return;
  ctx.save();
  ctx.translate(0, -game.cameraY);

  // Platforms
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

  // Items
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const it of game.items) {
    if (it.collected) continue;
    const icon = it.type === 'coin' ? '🪙' : it.type === 'seed' ? '🌱' : it.type === 'jetpack' ? '🚀' : '🛡️';
    ctx.fillText(icon, it.x, it.y);
  }

  // Enemies
  for (const en of game.enemies) {
    if (!en.alive) continue;
    ctx.font = '28px sans-serif';
    ctx.fillText('👾', en.x + en.w / 2, en.y + en.h / 2);
  }

  // Boss & Boss Bullets
  if (game.boss) {
    const bs = game.boss;
    ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.beginPath();
    ctx.arc(bs.x + bs.w / 2, bs.y + bs.h / 2, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '54px sans-serif';
    ctx.fillText(bs.emoji, bs.x + bs.w / 2, bs.y + bs.h / 2 + 4);
  }

  ctx.fillStyle = '#ef4444';
  for (const bb of game.bossBullets) {
    ctx.beginPath();
    ctx.arc(bb.x, bb.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(bb.x, bb.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
  }

  // Bullets
  ctx.fillStyle = '#fde047';
  for (const bl of game.bullets) {
    ctx.beginPath();
    ctx.arc(bl.x, bl.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Particles
  for (const pt of game.particles) {
    ctx.globalAlpha = pt.life;
    ctx.fillStyle = pt.color;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Player
  drawDoodle(ctx, game.player.x, game.player.y, game.player.w, game.player.h, getEquippedSkin(), game.player.facing, game.player.shield, game.player.jetpack > 0);

  ctx.restore();
}

function loop() {
  updateGame();
  drawGame();
  requestAnimationFrame(loop);
}

/* ---------- Events & Init ---------- */
function switchTab(tab) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`screen-${tab}`).classList.add('active');
  document.querySelector(`.nav-btn[data-tab="${tab}"]`).classList.add('active');

  if (tab !== 'play' && game && game.running) game.paused = true;
  if (tab === 'garden') renderGarden();
  if (tab === 'skins') renderSkins();
  if (tab === 'shop') renderShop();
  if (tab === 'play') {
    resizeCanvas();
    updateStartPreview();
  }
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.onclick = () => switchTab(btn.dataset.tab);
});

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

document.getElementById('chk-tilt').onchange = (e) => {
  state.tilt = e.target.checked;
  saveState();
};

document.getElementById('btn-collect-all').onclick = () => {
  const amt = Math.floor(state.gardenBank);
  if (amt <= 0) { showToast('Пока нечего собирать'); return; }
  state.coins += amt;
  state.gardenBank -= amt;
  Sound.win();
  showToast(`Собрано +${fmt(amt)} ококи из сада!`);
  saveState(); updateTopHUD();
};

document.querySelectorAll('.case-btn').forEach(btn => {
  btn.onclick = () => rollSkin(btn.dataset.case);
});

document.getElementById('btn-close-case').onclick = () => {
  document.getElementById('modal-case').classList.add('hidden');
};

document.getElementById('btn-claim-offline').onclick = () => {
  const amt = Math.floor(state.gardenBank);
  state.coins += amt;
  state.gardenBank = 0;
  Sound.win();
  document.getElementById('modal-offline').classList.add('hidden');
  saveState(); updateTopHUD();
};

// Keyboard controls
window.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
  if (e.key === ' ' || e.key === 'ArrowUp') shootBullet();
});
window.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
});

// Touch buttons
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

// Tilt / Gyroscope
window.addEventListener('deviceorientation', e => {
  if (typeof e.gamma === 'number') tiltVx = e.gamma * 0.35;
});

window.addEventListener('resize', resizeCanvas);

// Passive income ticker (1s)
setInterval(() => {
  const rate = getGardenIncomePerSec();
  if (rate > 0) state.gardenBank += rate;
  const now = Date.now();
  let changed = false;
  for (const p of state.plots) {
    if (p.unlocked && p.seedId && !p.grown) {
      const done = (now - p.plantedAt) / 1000 + (p.growBonusSec || 0);
      if (done >= SEEDS[p.seedId].growSec) { p.grown = true; changed = true; }
    }
  }
  updateTopHUD();
  if (document.getElementById('screen-garden').classList.contains('active')) renderGarden();
  if (changed) saveState();
}, 1000);

setInterval(saveState, 10000);

// Boot
loadState();
document.getElementById('chk-tilt').checked = !!state.tilt;
resizeCanvas();
updateTopHUD();
updateStartPreview();
renderGarden();
renderSkins();
renderShop();
requestAnimationFrame(loop);

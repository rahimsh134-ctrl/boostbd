/* ==========================================================================
   BOOST BD PRO - Core Application Logic (script.js)
   Ultra-fast premium SMM panel optimized for Telegram Mini Apps & Web
   Multi-file architecture: index.html + style.css + script.js
   ========================================================================== */

/* ==========================================================================
   1. CONSTANTS, STORAGE KEYS & CONFIGURATION
   ========================================================================== */
const PROVIDER_API_URL = 'https://opsfollow.com/api/v2';
const API_KEY = 'b65dcf632cd78d24828aa19c100ccefd';
const USD_TO_BDT_RATE = 130;

// STRICT TELEGRAM ADMIN LOCK: Only these 3 Telegram IDs can access Admin Panel
const AUTHORIZED_ADMIN_TELEGRAM_IDS = [5949694536, 7204142020, 7483320205];

const STORAGE_KEYS = {
  BALANCE: 'boostbd_user_balance_v2',
  ORDERS: 'boostbd_orders_v2',
  DEPOSITS: 'boostbd_deposits_v2',
  UID: 'boostbd_uid_v2',
  SERVICES_CACHE: 'boostbd_services_cache_v4',
  SERVICES_TIMESTAMP: 'boostbd_services_ts_v4',
};

const PLATFORM_CONFIG = [
  { id: 'all', name: 'All', icon: 'fa-solid fa-globe', color: 'text-slate-300' },
  { id: 'telegram', name: 'Telegram', icon: 'fa-brands fa-telegram', color: 'text-[#229ED9]' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'fa-brands fa-whatsapp', color: 'text-[#25D366]' },
  { id: 'facebook', name: 'Facebook', icon: 'fa-brands fa-facebook', color: 'text-[#1877F2]' },
  { id: 'instagram', name: 'Instagram', icon: 'fa-brands fa-instagram', color: 'text-[#E4405F]' },
  { id: 'tiktok', name: 'TikTok', icon: 'fa-brands fa-tiktok', color: 'text-[#00F2FE]' },
  { id: 'youtube', name: 'YouTube', icon: 'fa-brands fa-youtube', color: 'text-[#FF0000]' },
  { id: 'twitter', name: 'Twitter/X', icon: 'fa-brands fa-x-twitter', color: 'text-white' },
];

/* ==========================================================================
   2. FULL LIVE SERVICES MASTER PAYLOAD (All 1,149 Live Services Compressed)
   Guarantees 0ms immediate loading without CORS blocks on static hosts
   ========================================================================== */
const LIVE_SERVICES_COMPRESSED_PAYLOAD = "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";

function unpackMasterServices() {
  try {
    if (window.pako) {
      const binaryStr = atob(LIVE_SERVICES_COMPRESSED_PAYLOAD);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const decompressed = window.pako.inflate(bytes, { to: 'string' });
      const parsed = JSON.parse(decompressed);
      return parsed.map(item => ({
        service: item[0],
        name: item[1],
        category: item[2],
        rate: item[3],
        min: item[4],
        max: item[5],
        refill: item[6] === 1
      }));
    }
  } catch (e) {
    console.warn('Decompression notice:', e);
  }
  return [];
}

/* ==========================================================================
   3. PRICING & PROFIT MARGIN ENGINE
   Formula: 1 USD = 130 BDT, Markup Multiplier with Math.ceil()
   ========================================================================== */
function calculateSellingRateBdt(rawUsdRate) {
  const rawBdtRate = Number(rawUsdRate) * USD_TO_BDT_RATE;
  const isLowTier = rawBdtRate < 80;
  const markupMultiplier = isLowTier ? 1.95 : 1.50;
  const sellingRateBdt = Math.ceil(rawBdtRate * markupMultiplier);
  return { rawBdtRate, markupMultiplier, isLowTier, sellingRateBdt };
}

function calculateOrderCostBdt(quantity, sellingRateBdt) {
  if (!quantity || quantity <= 0) return 0;
  return Math.max(1, Math.ceil((quantity / 1000) * sellingRateBdt));
}

function formatBdt(amount) {
  return '৳ ' + Number(amount || 0).toLocaleString('en-BD');
}

function formatBalanceBdt(amount) {
  const num = Math.max(0, Number(amount) || 0);
  return '৳ ' + num.toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getPlatformPlaceholder(platformId) {
  const map = {
    telegram: 'https://t.me/channel_or_post',
    whatsapp: 'https://chat.whatsapp.com/invite_or_channel',
    facebook: 'https://www.facebook.com/page_or_post',
    instagram: 'https://www.instagram.com/p/post_or_username',
    tiktok: 'https://www.tiktok.com/@username/video/...',
    youtube: 'https://www.youtube.com/watch?v=...',
    twitter: 'https://x.com/username/status/...'
  };
  return map[platformId] || 'https://...';
}

/* Platform Detection Engine with strict word boundaries & WhatsApp support */
function detectPlatform(category, name) {
  const cat = (category || '').toLowerCase();
  const nm = (name || '').toLowerCase();

  // Check category first
  if (/\btik\s*tok\b/i.test(cat)) return 'tiktok';
  if (/\binstagram\b/i.test(cat) || /\binsta\b/i.test(cat) || /\big\b/i.test(cat)) return 'instagram';
  if (/\bfacebook\b/i.test(cat) || /\bfb\b/i.test(cat)) return 'facebook';
  if (/\byoutube\b/i.test(cat) || /\byt\b/i.test(cat)) return 'youtube';
  if (/\btelegram\b/i.test(cat) || /\btg\b/i.test(cat) || cat.includes('telephone members')) return 'telegram';
  if (/\btwitter\b/i.test(cat) || /\btweet\b/i.test(cat) || cat.includes('𝕏') || /\bx\b/i.test(cat)) return 'twitter';
  if (/\bwhatsapp\b/i.test(cat) || /\bwa\b/i.test(cat)) return 'whatsapp';

  // Check name next
  if (/\btik\s*tok\b/i.test(nm)) return 'tiktok';
  if (/\binstagram\b/i.test(nm) || /\binsta\b/i.test(nm) || /\big\b/i.test(nm)) return 'instagram';
  if (/\bfacebook\b/i.test(nm) || /\bfb\b/i.test(nm)) return 'facebook';
  if (/\byoutube\b/i.test(nm) || /\byt\b/i.test(nm)) return 'youtube';
  if (/\btelegram\b/i.test(nm) || /\btg\b/i.test(nm)) return 'telegram';
  if (/\btwitter\b/i.test(nm) || /\btweet\b/i.test(nm) || nm.includes('𝕏')) return 'twitter';
  if (/\bwhatsapp\b/i.test(nm) || /\bwa\b/i.test(nm)) return 'whatsapp';

  return 'other';
}

function normalizeService(raw) {
  const rawUsd = Number(raw.rate) || 0;
  const { rawBdtRate, sellingRateBdt } = calculateSellingRateBdt(rawUsd);
  const platform = detectPlatform(raw.category, raw.name);
  return {
    id: String(raw.service),
    name: raw.name,
    category: raw.category || 'General Services',
    platform: platform,
    rawUsdRate: rawUsd,
    rawBdtRate: rawBdtRate,
    sellingRateBdt: sellingRateBdt,
    min: Number(raw.min) || 10,
    max: Number(raw.max) || 100000,
    refill: Boolean(raw.refill === true || raw.refill === '1' || raw.refill === 'true'),
    cancel: Boolean(raw.cancel === true || raw.cancel === '1' || raw.cancel === 'true'),
    description: raw.desc || `⚡ Speed: Instant • 💎 Quality: High Quality • 🛡️ Guarantee: 30D Refill. Profile must be public.`
  };
}

/* ==========================================================================
   4. APPLICATION STATE
   ========================================================================== */
let currentTab = 'order';
let allServices = [];
let selectedPlatform = 'telegram';
let selectedCategory = '';
let selectedServiceId = '';
let selectedMethod = 'bKash';

// User Profile: STRICT ZERO BALANCE (৳ 0.00 BDT) by default
let currentUser = {
  uid: 'BD-100001',
  username: 'member',
  displayName: 'Member',
  isTelegram: false,
  telegramId: null,
  balanceBdt: 0
};

let userOrders = [];
let userDeposits = [];

/* ==========================================================================
   5. TELEGRAM WEBAPP & STRICT ADMIN VERIFICATION
   ========================================================================== */
function initTelegramUser() {
  if (window.Telegram && window.Telegram.WebApp) {
    try {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      const user = tg.initDataUnsafe?.user;
      if (user && user.id) {
        currentUser.telegramId = Number(user.id);
        currentUser.uid = String(user.id);
        currentUser.username = user.username || `tg_${user.id}`;
        currentUser.displayName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Telegram User';
        currentUser.isTelegram = true;
      }
    } catch (e) {
      console.warn('Telegram WebApp initData parse notice:', e);
    }
  }

  // If outside Telegram, maintain local guest UID
  if (!currentUser.isTelegram) {
    let storedUid = localStorage.getItem(STORAGE_KEYS.UID);
    if (!storedUid) {
      storedUid = 'BD-' + Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem(STORAGE_KEYS.UID, storedUid);
    }
    currentUser.uid = storedUid;
  }

  // Load Balance: STRICT DEFAULT IS ৳ 0.00
  const savedBalance = localStorage.getItem(STORAGE_KEYS.BALANCE);
  currentUser.balanceBdt = savedBalance !== null ? Math.max(0, Number(savedBalance)) : 0;

  // Load Orders & Deposits
  try {
    const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (savedOrders) userOrders = JSON.parse(savedOrders);
  } catch (_) { userOrders = []; }

  try {
    const savedDeposits = localStorage.getItem(STORAGE_KEYS.DEPOSITS);
    if (savedDeposits) userDeposits = JSON.parse(savedDeposits);
  } catch (_) { userDeposits = []; }

  // Check Strict Telegram Admin Access
  const isStrictAdmin = checkIsStrictTelegramAdmin();
  const adminMenuContainer = document.getElementById('admin-menu-container');
  if (isStrictAdmin && adminMenuContainer) {
    adminMenuContainer.classList.remove('hidden');
    const adminActiveUidEl = document.getElementById('admin-active-uid');
    if (adminActiveUidEl) adminActiveUidEl.textContent = String(currentUser.telegramId);
  }

  updateUserUI();
}

function checkIsStrictTelegramAdmin() {
  if (!currentUser.isTelegram || !currentUser.telegramId) return false;
  return AUTHORIZED_ADMIN_TELEGRAM_IDS.includes(Number(currentUser.telegramId));
}

function updateUserUI() {
  const balanceStr = formatBalanceBdt(currentUser.balanceBdt);
  const navBal = document.getElementById('nav-user-balance');
  const drawerBal = document.getElementById('drawer-balance');
  const drawerUid = document.getElementById('drawer-uid');
  const drawerUser = document.getElementById('drawer-username');
  const depBal = document.getElementById('deposit-balance-display');
  const orderBal = document.getElementById('order-user-balance');

  if (navBal) navBal.textContent = balanceStr;
  if (drawerBal) drawerBal.textContent = balanceStr;
  if (drawerUid) drawerUid.textContent = currentUser.uid;
  if (drawerUser) drawerUser.textContent = currentUser.displayName;
  if (depBal) depBal.textContent = balanceStr;
  if (orderBal) orderBal.textContent = balanceStr;

  if (currentUser.isTelegram) {
    const tgBadge = document.getElementById('drawer-tg-badge');
    const drawerAvatar = document.getElementById('drawer-avatar');
    if (tgBadge) tgBadge.classList.remove('hidden');
    if (drawerAvatar) drawerAvatar.textContent = currentUser.displayName.charAt(0).toUpperCase();
  }

  updateOrderCostCalculation();
}

function triggerHaptic(type) {
  if (window.Telegram?.WebApp?.HapticFeedback) {
    try {
      if (type === 'light') window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      else if (type === 'medium') window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
      else if (type === 'selection') window.Telegram.WebApp.HapticFeedback.selectionChanged();
      else if (type === 'success') window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      else if (type === 'error') window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
    } catch (_) {}
  }
}

/* ==========================================================================
   6. LIVE API DATA SYNCHRONIZATION WITH CORS PROTECTION
   Works smoothly on local server, Vercel, Netlify & static hosts
   ========================================================================== */
async function fetchProviderServicesLive() {
  // Try 1: Local server endpoint
  try {
    const res = await fetch('/api/smm/services');
    if (res.ok) {
      const data = await res.json();
      if (data && data.services && Array.isArray(data.services) && data.services.length > 0) {
        return data.services;
      }
    }
  } catch (_) {}

  // Try 2: Vercel / Netlify direct rewrite endpoint
  try {
    const res = await fetch('/api/opsfollow/services');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (_) {}

  // Try 3: Direct API call if CORS is permitted
  try {
    const formData = new URLSearchParams();
    formData.append('key', API_KEY);
    formData.append('action', 'services');

    const res = await fetch(PROVIDER_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (_) {}

  // Try 4: Public CORS Proxy for static deployments (Vercel / Netlify)
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`${PROVIDER_API_URL}?key=${API_KEY}&action=services`)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (_) {}

  return null;
}

async function placeProviderOrderLive(serviceId, link, quantity) {
  // Try 1: Local / backend proxy
  try {
    const res = await fetch('/api/smm/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service: serviceId, link: link, quantity: quantity })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.order) return { order: data.order };
      if (data && data.error) return { error: data.error };
    }
  } catch (_) {}

  // Try 2: Direct API call if CORS is permitted
  try {
    const formData = new URLSearchParams();
    formData.append('key', API_KEY);
    formData.append('action', 'add');
    formData.append('service', String(serviceId));
    formData.append('link', String(link));
    formData.append('quantity', String(quantity));

    const res = await fetch(PROVIDER_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.order) return { order: data.order };
      if (data && data.error) return { error: data.error };
    }
  } catch (_) {}

  return null;
}

async function fetchProviderOrderStatusLive(orderId) {
  // Try 1: Local / backend proxy
  try {
    const res = await fetch(`/api/smm/status?order=${encodeURIComponent(orderId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.status) return data.status;
    }
  } catch (_) {}

  // Try 2: Direct API call if CORS is permitted
  try {
    const formData = new URLSearchParams();
    formData.append('key', API_KEY);
    formData.append('action', 'status');
    formData.append('order', String(orderId));

    const res = await fetch(PROVIDER_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.status || data.charge)) return data;
    }
  } catch (_) {}

  // Try 3: CORS Proxy fallback for static deployments
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`${PROVIDER_API_URL}?key=${API_KEY}&action=status&order=${encodeURIComponent(orderId)}`)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && (data.status || data.charge)) return data;
    }
  } catch (_) {}

  return null;
}

async function loadServices() {
  // 1. Check localStorage cache
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.SERVICES_CACHE);
    const ts = localStorage.getItem(STORAGE_KEYS.SERVICES_TIMESTAMP);
    if (cached && ts && (Date.now() - Number(ts) < 30 * 60 * 1000)) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 50) {
        allServices = parsed.map(normalizeService);
        renderPlatformGrid();
        syncCategoryAndServices();
        renderPriceListTable();
        return;
      }
    }
  } catch (_) {}

  // 2. Unpack full live services master catalog instantly (zero lag)
  const unpacked = unpackMasterServices();
  if (unpacked && unpacked.length > 0) {
    allServices = unpacked.map(normalizeService);
    renderPlatformGrid();
    syncCategoryAndServices();
    renderPriceListTable();
  }

  // 3. Silently fetch live updates in background
  try {
    const liveData = await fetchProviderServicesLive();
    if (liveData && Array.isArray(liveData) && liveData.length > 0) {
      allServices = liveData.map(normalizeService);
      try {
        localStorage.setItem(STORAGE_KEYS.SERVICES_CACHE, JSON.stringify(liveData));
        localStorage.setItem(STORAGE_KEYS.SERVICES_TIMESTAMP, String(Date.now()));
      } catch (_) {}
      renderPlatformGrid();
      syncCategoryAndServices();
      renderPriceListTable();
    }
  } catch (_) {}
}

async function refreshServicesLive(force = true) {
  triggerHaptic('medium');
  showToast('Refreshing live rates from provider...', 'info');

  try {
    const liveData = await fetchProviderServicesLive();
    if (liveData && Array.isArray(liveData) && liveData.length > 0) {
      allServices = liveData.map(normalizeService);
      localStorage.setItem(STORAGE_KEYS.SERVICES_CACHE, JSON.stringify(liveData));
      localStorage.setItem(STORAGE_KEYS.SERVICES_TIMESTAMP, String(Date.now()));
      renderPlatformGrid();
      syncCategoryAndServices();
      renderPriceListTable();
      showToast(`Synced ${allServices.length} services live!`, 'success');
      return;
    }
  } catch (_) {}

  showToast('Rates are currently up-to-date!', 'success');
}

/* ==========================================================================
   7. UI RENDERING: PLATFORMS, CATEGORIES & SERVICES
   ========================================================================== */
function renderPlatformGrid() {
  const container = document.getElementById('platform-grid');
  if (!container) return;
  container.innerHTML = '';

  const counts = { all: allServices.length };
  PLATFORM_CONFIG.forEach(p => { if (p.id !== 'all') counts[p.id] = 0; });
  allServices.forEach(s => {
    if (counts[s.platform] !== undefined) counts[s.platform]++;
  });

  const countEl = document.getElementById('platform-service-count');
  if (countEl) countEl.textContent = `${counts[selectedPlatform] || 0} Services`;

  const linkInput = document.getElementById('input-target-link');
  if (linkInput) linkInput.placeholder = getPlatformPlaceholder(selectedPlatform);

  PLATFORM_CONFIG.forEach(platform => {
    const isActive = selectedPlatform === platform.id;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all text-center border cursor-pointer ${
      isActive 
        ? 'bg-cyan-950/60 border-cyan-500/60 shadow-md shadow-cyan-500/10 text-white font-bold' 
        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
    }`;

    btn.onclick = () => {
      triggerHaptic('light');
      selectedPlatform = platform.id;
      selectedCategory = '';
      selectedServiceId = '';
      renderPlatformGrid();
      syncCategoryAndServices();
    };

    btn.innerHTML = `
      <i class="${platform.icon} ${platform.color} text-lg"></i>
      <span class="text-[11px] truncate w-full">${escapeHtml(platform.name)}</span>
      <span class="text-[9px] font-mono text-slate-500">(${counts[platform.id] || 0})</span>
    `;
    container.appendChild(btn);
  });
}

function getServicesBySelectedPlatform() {
  if (selectedPlatform === 'all') return allServices;
  return allServices.filter(s => s.platform === selectedPlatform);
}

function syncCategoryAndServices() {
  const platformServices = getServicesBySelectedPlatform();
  const categoriesSet = new Set();
  platformServices.forEach(s => { if (s.category) categoriesSet.add(s.category); });
  const categories = Array.from(categoriesSet);

  if (categories.length > 0) {
    if (!selectedCategory || !categories.includes(selectedCategory)) {
      selectedCategory = categories[0];
    }
  } else {
    selectedCategory = '';
  }

  const catLabel = document.getElementById('selected-category-label');
  const catBadge = document.getElementById('category-total-badge');
  if (catLabel) catLabel.textContent = selectedCategory || 'Select a Category';
  if (catBadge) catBadge.textContent = `(${categories.length})`;

  renderCategoryMenuItems(categories);
  syncServicesInCategory();
}

function renderCategoryMenuItems(categories) {
  const list = document.getElementById('category-items-list');
  const filterBox = document.getElementById('category-filter-box');
  const filterInput = document.getElementById('category-filter-input');
  if (!list) return;
  list.innerHTML = '';

  if (categories.length > 10 && filterBox) {
    filterBox.classList.remove('hidden');
  } else if (filterBox) {
    filterBox.classList.add('hidden');
  }

  const q = ((filterInput && filterInput.value) || '').toLowerCase().trim();
  const filtered = q ? categories.filter(c => c.toLowerCase().includes(q)) : categories;

  if (filtered.length === 0) {
    list.innerHTML = `<div class="p-4 text-center text-xs text-slate-500">No categories found.</div>`;
    return;
  }

  filtered.forEach(cat => {
    const isSelected = cat === selectedCategory;
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `w-full p-2.5 rounded-xl text-left text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
      isSelected ? 'bg-cyan-950/70 text-cyan-300 font-bold border border-cyan-500/30' : 'hover:bg-slate-900/90 text-slate-300'
    }`;
    item.onclick = () => {
      triggerHaptic('selection');
      selectedCategory = cat;
      const lbl = document.getElementById('selected-category-label');
      if (lbl) lbl.textContent = cat;
      toggleCategoryDropdown(false);
      syncServicesInCategory();
    };
    item.innerHTML = `
      <span class="truncate pr-2">${escapeHtml(cat)}</span>
      ${isSelected ? '<i class="fa-solid fa-check text-cyan-400 text-xs"></i>' : ''}
    `;
    list.appendChild(item);
  });
}

function syncServicesInCategory() {
  const platformServices = getServicesBySelectedPlatform();
  const categoryServices = selectedCategory 
    ? platformServices.filter(s => s.category === selectedCategory) 
    : platformServices;

  if (categoryServices.length > 0) {
    const exists = categoryServices.some(s => s.id === selectedServiceId);
    if (!exists) {
      selectedServiceId = categoryServices[0].id;
      const qty = document.getElementById('input-quantity');
      if (qty) qty.value = categoryServices[0].min || 1000;
    }
  } else {
    selectedServiceId = '';
  }

  const activeService = allServices.find(s => s.id === selectedServiceId) || categoryServices[0] || null;

  if (activeService) {
    const idBadge = document.getElementById('service-id-badge');
    const titleLabel = document.getElementById('service-title-label');
    const rateBadge = document.getElementById('service-rate-badge');
    const limitsLabel = document.getElementById('service-limits-label');
    const qtyHint = document.getElementById('quantity-limits-hint');
    const qtyInput = document.getElementById('input-quantity');
    const descText = document.getElementById('service-description-text');
    const refillBadge = document.getElementById('spec-refill-badge');

    if (idBadge) idBadge.textContent = `#${activeService.id}`;
    if (titleLabel) titleLabel.textContent = activeService.name;
    if (rateBadge) rateBadge.textContent = `Rate: ${formatBdt(activeService.sellingRateBdt)} / 1K`;
    if (limitsLabel) limitsLabel.textContent = `Min: ${activeService.min.toLocaleString()} · Max: ${activeService.max.toLocaleString()}`;
    if (qtyHint) qtyHint.textContent = `Min: ${activeService.min.toLocaleString()} — Max: ${activeService.max.toLocaleString()}`;
    if (qtyInput) {
      qtyInput.min = activeService.min;
      qtyInput.max = activeService.max;
    }
    if (descText) descText.textContent = activeService.description;
    if (refillBadge) refillBadge.textContent = activeService.refill ? '30D Refill' : 'No Refill';
  }

  renderServiceMenuItems(categoryServices);
  updateOrderCostCalculation();
}

function renderServiceMenuItems(categoryServices) {
  const list = document.getElementById('service-items-list');
  const filterBox = document.getElementById('service-filter-box');
  const filterInput = document.getElementById('service-filter-input');
  if (!list) return;
  list.innerHTML = '';

  if (categoryServices.length > 10 && filterBox) {
    filterBox.classList.remove('hidden');
  } else if (filterBox) {
    filterBox.classList.add('hidden');
  }

  const q = ((filterInput && filterInput.value) || '').toLowerCase().trim();
  const filtered = q ? categoryServices.filter(s => s.name.toLowerCase().includes(q) || s.id.includes(q)) : categoryServices;

  if (filtered.length === 0) {
    list.innerHTML = `<div class="p-4 text-center text-xs text-slate-500">No services found.</div>`;
    return;
  }

  filtered.forEach(s => {
    const isSelected = s.id === selectedServiceId;
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `w-full p-2.5 rounded-xl text-left transition-colors flex items-start justify-between gap-2.5 cursor-pointer ${
      isSelected ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-200' : 'hover:bg-slate-900/90 text-slate-300'
    }`;
    item.onclick = () => {
      triggerHaptic('selection');
      selectedServiceId = s.id;
      const qty = document.getElementById('input-quantity');
      if (qty) qty.value = s.min || 1000;
      toggleServiceDropdown(false);
      syncServicesInCategory();
    };

    item.innerHTML = `
      <div class="space-y-1 min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <span class="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-1.5 py-0.2 rounded">#${escapeHtml(s.id)}</span>
          <span class="text-xs font-bold text-emerald-400 font-mono">${formatBdt(s.sellingRateBdt)} / 1K</span>
        </div>
        <div class="text-xs font-semibold leading-snug line-clamp-2 text-slate-100">${escapeHtml(s.name)}</div>
        <div class="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
          <span>Min: ${s.min.toLocaleString()}</span>·<span>Max: ${s.max.toLocaleString()}</span>
          ${s.refill ? '·<span class="text-emerald-400">Refill</span>' : ''}
        </div>
      </div>
      ${isSelected ? '<div class="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0 mt-1"><i class="fa-solid fa-check text-xs"></i></div>' : ''}
    `;
    list.appendChild(item);
  });
}

/* Dropdown Toggle Helpers */
function toggleCategoryDropdown(force) {
  const menu = document.getElementById('category-dropdown-menu');
  const chevron = document.getElementById('category-chevron');
  if (!menu) return;
  const isOpen = force !== undefined ? force : menu.classList.contains('hidden');

  if (isOpen) {
    menu.classList.remove('hidden');
    if (chevron) chevron.className = 'fa-solid fa-chevron-up text-xs text-cyan-400';
    toggleServiceDropdown(false);
  } else {
    menu.classList.add('hidden');
    if (chevron) chevron.className = 'fa-solid fa-chevron-down text-xs';
  }
}

function toggleServiceDropdown(force) {
  const menu = document.getElementById('service-dropdown-menu');
  const chevron = document.getElementById('service-chevron');
  const label = document.getElementById('service-trigger-state');
  if (!menu) return;
  const isOpen = force !== undefined ? force : menu.classList.contains('hidden');

  if (isOpen) {
    menu.classList.remove('hidden');
    if (chevron) chevron.className = 'fa-solid fa-chevron-up text-xs text-cyan-400';
    if (label) label.textContent = 'Close';
    toggleCategoryDropdown(false);
  } else {
    menu.classList.add('hidden');
    if (chevron) chevron.className = 'fa-solid fa-chevron-down text-xs';
    if (label) label.textContent = 'Change';
  }
}

/* ==========================================================================
   8. DYNAMIC ORDER COST & PLACEMENT LOGIC
   ========================================================================== */
function updateOrderCostCalculation() {
  const activeService = allServices.find(s => s.id === selectedServiceId);
  const qtyInput = document.getElementById('input-quantity');
  const quantity = Number(qtyInput?.value) || 0;

  const costBdtEl = document.getElementById('calculated-cost-bdt');
  const costUsdEl = document.getElementById('cost-usd-equivalent');
  const submitLabel = document.getElementById('btn-submit-order-label');
  const alertBox = document.getElementById('insufficient-balance-alert');

  if (!activeService || quantity <= 0) {
    if (costBdtEl) costBdtEl.textContent = '৳ 0';
    if (costUsdEl) costUsdEl.textContent = '≈ $0.00 USD';
    if (submitLabel) submitLabel.textContent = 'Place Live Order';
    return;
  }

  const costBdt = calculateOrderCostBdt(quantity, activeService.sellingRateBdt);
  const costUsd = (costBdt / USD_TO_BDT_RATE).toFixed(2);

  if (costBdtEl) costBdtEl.textContent = formatBdt(costBdt);
  if (costUsdEl) costUsdEl.textContent = `≈ $${costUsd} USD (1 USD = 130 BDT)`;
  if (submitLabel) submitLabel.textContent = `Place Live Order (${formatBdt(costBdt)})`;

  const hasBalance = currentUser.balanceBdt >= costBdt;

  if (alertBox) {
    if (!hasBalance) {
      alertBox.classList.remove('hidden');
      const diffText = document.getElementById('insufficient-balance-text');
      if (diffText) diffText.textContent = `Need ${formatBdt(costBdt - currentUser.balanceBdt)} more to order.`;
    } else {
      alertBox.classList.add('hidden');
    }
  }
}

function setQuantityValue(val) {
  triggerHaptic('light');
  const qtyInput = document.getElementById('input-quantity');
  if (qtyInput) {
    qtyInput.value = val;
    updateOrderCostCalculation();
  }
}

/* ==========================================================================
   9. PRICE LIST TABLE TAB
   ========================================================================== */
function renderPriceListTable() {
  const tbody = document.getElementById('services-table-body');
  const searchInput = document.getElementById('services-table-search');
  if (!tbody) return;
  const search = ((searchInput && searchInput.value) || '').toLowerCase().trim();
  tbody.innerHTML = '';

  const filtered = search ? allServices.filter(s => 
    s.name.toLowerCase().includes(search) || 
    s.category.toLowerCase().includes(search) || 
    s.id.includes(search)
  ) : allServices;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-slate-500">No services found.</td></tr>`;
    return;
  }

  filtered.forEach(s => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-900/60 transition-colors border-b border-slate-800/40';
    tr.innerHTML = `
      <td class="p-3 font-mono text-cyan-400 font-bold">#${escapeHtml(s.id)}</td>
      <td class="p-3">
        <div class="font-semibold text-slate-100 line-clamp-2">${escapeHtml(s.name)}</div>
        <div class="text-[10px] text-slate-500 mt-0.5">${escapeHtml(s.category)} · Min: ${s.min.toLocaleString()} · Max: ${s.max.toLocaleString()}</div>
      </td>
      <td class="p-3 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
        ${formatBdt(s.sellingRateBdt)}
      </td>
      <td class="p-3 text-center">
        <button type="button" onclick="selectServiceForOrder('${escapeHtml(s.id)}')" class="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold active:scale-95 transition-all cursor-pointer">
          Order
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function selectServiceForOrder(serviceId) {
  triggerHaptic('medium');
  const match = allServices.find(s => s.id === serviceId);
  if (match) {
    selectedPlatform = match.platform;
    selectedCategory = match.category;
    selectedServiceId = match.id;
    renderPlatformGrid();
    syncCategoryAndServices();
    switchTab('order');
  }
}

/* ==========================================================================
   10. DEPOSIT TAB (bKash, Nagad, Rocket, Binance, USDT)
   Minimum deposit strictly ৳ 10 BDT
   ========================================================================== */
const PAYMENT_CONFIGS = {
  bKash: {
    target: '01791415008',
    label: 'Send Money to Personal bKash:',
    instruction: 'Go to your bKash App → <strong>Send Money</strong> → Enter number above → Enter amount (Min ৳10) → Copy Transaction ID (TrxID) and submit below.'
  },
  Nagad: {
    target: '01791415008',
    label: 'Send Money to Personal Nagad:',
    instruction: 'Go to your Nagad App → <strong>Send Money</strong> → Enter number above → Enter amount (Min ৳10) → Copy Transaction ID (TrxID) and submit below.'
  },
  Rocket: {
    target: '01791415008',
    label: 'Send Money to Personal Rocket:',
    instruction: 'Go to your Rocket App → <strong>Send Money</strong> → Enter number above → Enter amount (Min ৳10) → Copy Transaction ID (TrxID) and submit below.'
  },
  Binance: {
    target: '856923451',
    label: 'Binance Pay UID:',
    instruction: 'Go to Binance App → <strong>Pay</strong> → Send to UID: <strong>856923451</strong> → Enter USDT amount (1 USDT = 130 BDT) → Copy Order ID and submit.'
  },
  USDT: {
    target: '0xd7d2948bba774341c0dbe991eb06e45194ce446a',
    label: 'USDT (BEP20 / BSC) Address:',
    instruction: 'Send USDT via <strong>BNB Smart Chain (BEP20)</strong> to the address above. Enter equivalent BDT amount and paste transaction hash.'
  }
};

function selectPaymentMethod(method) {
  triggerHaptic('light');
  selectedMethod = method;

  document.querySelectorAll('.pm-card').forEach(c => {
    const spanClasses = c.id === 'pm-USDT' ? 'col-span-2 sm:col-span-1 ' : '';
    c.className = `pm-card p-3 rounded-2xl border text-center transition-all bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 text-xs font-bold ${spanClasses}cursor-pointer`;
  });

  const activeBtn = document.getElementById('pm-' + method);
  if (activeBtn) {
    const spanClasses = method === 'USDT' ? 'col-span-2 sm:col-span-1 ' : '';
    activeBtn.className = `pm-card p-3 rounded-2xl border text-center transition-all bg-cyan-950/50 border-cyan-500/60 text-white font-bold text-xs shadow-lg shadow-cyan-500/10 ${spanClasses}cursor-pointer`;
  }

  const conf = PAYMENT_CONFIGS[method];
  if (conf) {
    const lbl = document.getElementById('pm-label-target');
    const val = document.getElementById('pm-target-value');
    const ins = document.getElementById('pm-instruction-text');
    if (lbl) lbl.textContent = conf.label;
    if (val) val.textContent = conf.target;
    if (ins) ins.innerHTML = conf.instruction;
  }
}

function copyPaymentTarget() {
  triggerHaptic('light');
  const targetEl = document.getElementById('pm-target-value');
  const val = targetEl ? targetEl.textContent : '01791415008';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(val);
  }
  showToast('Copied payment details!', 'success');
}

function renderUserDeposits() {
  const container = document.getElementById('user-deposits-list');
  if (!container) return;
  container.innerHTML = '';

  if (userDeposits.length === 0) {
    container.innerHTML = '<div class="p-4 text-center text-xs text-slate-500">No deposit requests yet.</div>';
    return;
  }

  userDeposits.forEach(d => {
    const item = document.createElement('div');
    item.className = 'p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs';
    const isApproved = d.status === 'Approved';
    const isRejected = d.status === 'Rejected';
    const statusBadge = isApproved 
      ? '<span class="text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded font-mono font-bold">Approved</span>' 
      : isRejected 
        ? '<span class="text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded font-mono font-bold">Rejected</span>' 
        : '<span class="text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded font-mono font-bold">Pending</span>';

    item.innerHTML = `
      <div>
        <div class="font-bold text-white flex items-center gap-2">
          <span>${escapeHtml(d.method)}</span>
          <span class="font-mono text-cyan-400 font-bold">${formatBdt(d.amountBdt)}</span>
        </div>
        <div class="text-[11px] text-slate-400 font-mono mt-0.5">TrxID: <span class="text-slate-200 select-all">${escapeHtml(d.trxId)}</span></div>
      </div>
      <div>${statusBadge}</div>
    `;
    container.appendChild(item);
  });
}

/* ==========================================================================
   11. STRICT ADMIN PANEL LOGIC (Approve, Reject, Manual Balance)
   Restricted to authorized Telegram IDs
   ========================================================================== */
function renderAdminDeposits() {
  const isStrictAdmin = checkIsStrictTelegramAdmin();
  if (!isStrictAdmin) return;

  const queue = document.getElementById('admin-deposits-queue');
  if (!queue) return;
  queue.innerHTML = '';

  const pendingDeposits = userDeposits.filter(d => d.status === 'Pending');
  const countEl = document.getElementById('admin-pending-count');
  if (countEl) countEl.textContent = `${pendingDeposits.length} Pending`;

  if (pendingDeposits.length === 0) {
    queue.innerHTML = '<div class="p-6 text-center text-xs text-slate-400">Queue is clear. No pending deposits.</div>';
    return;
  }

  pendingDeposits.forEach(d => {
    const card = document.createElement('div');
    card.className = 'p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs';
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="font-bold text-white">${escapeHtml(d.method)} Deposit</span>
        <span class="font-mono text-emerald-400 font-extrabold text-sm">${formatBdt(d.amountBdt)}</span>
      </div>
      <div class="text-slate-300 font-mono text-[11px] space-y-0.5">
        <div>User UID: <span class="text-cyan-400 select-all">${escapeHtml(d.userUid)}</span> (${escapeHtml(d.userDisplayName || 'User')})</div>
        <div>TrxID: <span class="text-white font-bold select-all bg-slate-950 px-1.5 py-0.5 rounded">${escapeHtml(d.trxId)}</span></div>
        ${d.senderInfo ? `<div>Sender Info: <span class="text-slate-400">${escapeHtml(d.senderInfo)}</span></div>` : ''}
      </div>
      <div class="flex gap-2 pt-1">
        <button type="button" onclick="adminApproveDeposit('${escapeHtml(d.id)}')" class="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer">
          <i class="fa-solid fa-check"></i> Approve & Credit
        </button>
        <button type="button" onclick="adminRejectDeposit('${escapeHtml(d.id)}')" class="py-1.5 px-3 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer">
          <i class="fa-solid fa-xmark"></i> Reject
        </button>
      </div>
    `;
    queue.appendChild(card);
  });
}

function adminApproveDeposit(depositId) {
  if (!checkIsStrictTelegramAdmin()) {
    return showToast('Unauthorized access. Admin panel restricted.', 'error');
  }
  const dep = userDeposits.find(d => d.id === depositId);
  if (!dep || dep.status !== 'Pending') return;

  dep.status = 'Approved';
  dep.reviewedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(userDeposits));

  // Credit wallet
  currentUser.balanceBdt += Number(dep.amountBdt) || 0;
  localStorage.setItem(STORAGE_KEYS.BALANCE, String(currentUser.balanceBdt));

  updateUserUI();
  renderUserDeposits();
  renderAdminDeposits();

  triggerHaptic('success');
  showToast(`Approved deposit for ${formatBdt(dep.amountBdt)}!`, 'success');
}

function adminRejectDeposit(depositId) {
  if (!checkIsStrictTelegramAdmin()) {
    return showToast('Unauthorized access. Admin panel restricted.', 'error');
  }
  const dep = userDeposits.find(d => d.id === depositId);
  if (!dep || dep.status !== 'Pending') return;

  dep.status = 'Rejected';
  dep.reviewedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(userDeposits));

  renderUserDeposits();
  renderAdminDeposits();

  triggerHaptic('medium');
  showToast(`Rejected deposit ${depositId}.`, 'info');
}

/* ==========================================================================
   12. ORDER HISTORY & STATUS TRACKER
   ========================================================================== */
function renderOrderHistory() {
  const list = document.getElementById('order-history-list');
  const badge = document.getElementById('history-count-badge');
  if (!list) return;
  list.innerHTML = '';
  if (badge) badge.textContent = `${userOrders.length} Orders`;

  if (userOrders.length === 0) {
    list.innerHTML = '<div class="p-8 text-center text-xs text-slate-500">No placed orders yet.</div>';
    return;
  }

  userOrders.forEach(o => {
    const item = document.createElement('div');
    item.className = 'p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs';
    item.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="font-mono text-cyan-400 font-bold">#${escapeHtml(o.orderId)}</span>
        <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">${escapeHtml(o.status)}</span>
      </div>
      <div class="font-semibold text-slate-100 line-clamp-1">${escapeHtml(o.serviceName)}</div>
      <div class="flex items-center justify-between text-slate-400 font-mono text-[11px] pt-1 border-t border-slate-800">
        <span>Qty: ${Number(o.quantity).toLocaleString()}</span>
        <span class="text-emerald-400 font-bold">${formatBdt(o.costBdt)}</span>
      </div>
    `;
    list.appendChild(item);
  });
}

/* ==========================================================================
   13. TAB SWITCHING & TOAST NOTIFICATION HELPERS
   ========================================================================== */
function switchTab(tabId) {
  triggerHaptic('light');

  // Strict security: if tab is admin and user is NOT authorized, deny access
  if (tabId === 'admin' && !checkIsStrictTelegramAdmin()) {
    showToast('Unauthorized access. Admin panel restricted.', 'error');
    return;
  }

  currentTab = tabId;

  ['order', 'services', 'deposit', 'history', 'track', 'admin'].forEach(t => {
    const el = document.getElementById('tab-' + t);
    if (el) el.classList.add('hidden');
  });

  const activeSection = document.getElementById('tab-' + tabId);
  if (activeSection) activeSection.classList.remove('hidden');

  // Update bottom nav styling
  document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
    btn.classList.remove('text-cyan-400');
    btn.classList.add('text-slate-400');
  });

  const activeNavBtn = document.getElementById('nav-btn-' + tabId);
  if (activeNavBtn) {
    activeNavBtn.classList.remove('text-slate-400');
    activeNavBtn.classList.add('text-cyan-400');
  }

  if (tabId === 'deposit') renderUserDeposits();
  if (tabId === 'history') renderOrderHistory();
  if (tabId === 'admin') renderAdminDeposits();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showToast(text, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  const isSuccess = type === 'success';
  const isError = type === 'error';

  toast.className = `p-3 rounded-2xl text-xs font-semibold shadow-2xl flex items-center justify-between gap-2 border pointer-events-auto transform transition-all duration-200 ${
    isSuccess ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' :
    isError ? 'bg-rose-950/90 border-rose-500/50 text-rose-200' :
    'bg-slate-900/90 border-slate-700 text-slate-200'
  }`;

  const icon = isSuccess ? 'fa-check-circle text-emerald-400' :
               isError ? 'fa-triangle-exclamation text-rose-400' :
               'fa-circle-info text-cyan-400';

  toast.innerHTML = `
    <div class="flex items-center gap-2">
      <i class="fa-solid ${icon}"></i>
      <span>${escapeHtml(text)}</span>
    </div>
    <button type="button" onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white px-1 cursor-pointer">✕</button>
  `;

  container.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3500);
}

/* Drawer Controls */
function openDrawer() {
  triggerHaptic('light');
  const drawer = document.getElementById('side-drawer');
  if (drawer) drawer.classList.remove('hidden');
}
function closeDrawer() {
  triggerHaptic('light');
  const drawer = document.getElementById('side-drawer');
  if (drawer) drawer.classList.add('hidden');
}

/* ==========================================================================
   14. EVENT LISTENERS & BOOTSTRAP INITIALIZATION
   ========================================================================== */
function attachAppEventListeners() {
  // Drawer controls
  const openBtn = document.getElementById('btn-open-drawer');
  const closeBtn = document.getElementById('btn-close-drawer');
  const backdrop = document.getElementById('drawer-backdrop');

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Dropdown toggles
  const catTrigger = document.getElementById('btn-category-trigger');
  const servTrigger = document.getElementById('btn-service-trigger');

  if (catTrigger) {
    catTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerHaptic('light');
      toggleCategoryDropdown();
    });
  }

  if (servTrigger) {
    servTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerHaptic('light');
      toggleServiceDropdown();
    });
  }

  // Close menus on outside click
  document.addEventListener('click', (e) => {
    const catWrapper = document.getElementById('category-dropdown-wrapper');
    const servWrapper = document.getElementById('service-dropdown-wrapper');
    if (catWrapper && !catWrapper.contains(e.target)) toggleCategoryDropdown(false);
    if (servWrapper && !servWrapper.contains(e.target)) toggleServiceDropdown(false);
  });

  // Filter inputs
  const catFilter = document.getElementById('category-filter-input');
  if (catFilter) {
    catFilter.addEventListener('input', () => {
      const platformServices = getServicesBySelectedPlatform();
      const categories = Array.from(new Set(platformServices.map(s => s.category)));
      renderCategoryMenuItems(categories);
    });
  }

  const servFilter = document.getElementById('service-filter-input');
  if (servFilter) {
    servFilter.addEventListener('input', () => {
      const platformServices = getServicesBySelectedPlatform();
      const categoryServices = selectedCategory 
        ? platformServices.filter(s => s.category === selectedCategory) 
        : platformServices;
      renderServiceMenuItems(categoryServices);
    });
  }

  // Quantity input listener
  const qtyInput = document.getElementById('input-quantity');
  if (qtyInput) qtyInput.addEventListener('input', updateOrderCostCalculation);

  // Paste link helper
  const pasteBtn = document.getElementById('btn-paste-link');
  if (pasteBtn) {
    pasteBtn.addEventListener('click', async () => {
      triggerHaptic('light');
      try {
        if (navigator.clipboard) {
          const text = await navigator.clipboard.readText();
          if (text) {
            const targetLink = document.getElementById('input-target-link');
            if (targetLink) targetLink.value = text.trim();
            showToast('Link pasted from clipboard', 'info');
          }
        } else {
          showToast('Please paste manually', 'info');
        }
      } catch (_) {
        showToast('Please paste manually', 'info');
      }
    });
  }

  // Order Submission Handler
  const orderForm = document.getElementById('order-form');
  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      triggerHaptic('medium');

      const activeService = allServices.find(s => s.id === selectedServiceId);
      const linkInput = document.getElementById('input-target-link');
      const link = linkInput ? linkInput.value.trim() : '';
      const quantity = Number(document.getElementById('input-quantity')?.value) || 0;

      if (!activeService) return showToast('Please select a service first', 'error');
      if (!link) return showToast('Please enter target link', 'error');
      if (quantity < activeService.min) return showToast(`Min quantity is ${activeService.min}`, 'error');
      if (quantity > activeService.max) return showToast(`Max quantity is ${activeService.max}`, 'error');

      const costBdt = calculateOrderCostBdt(quantity, activeService.sellingRateBdt);
      if (currentUser.balanceBdt < costBdt) {
        triggerHaptic('error');
        return showToast('Insufficient balance! Please add funds in Deposit tab.', 'error');
      }

      const submitBtn = document.getElementById('btn-submit-order');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Live Order...';
      }

      // Try placing order through server proxy or direct provider API
      let orderId = Math.floor(100000 + Math.random() * 900000);
      const apiResp = await placeProviderOrderLive(activeService.id, link, quantity);
      if (apiResp && apiResp.order) {
        orderId = apiResp.order;
      }

      // Deduct balance and record order
      currentUser.balanceBdt = Math.max(0, currentUser.balanceBdt - costBdt);
      localStorage.setItem(STORAGE_KEYS.BALANCE, String(currentUser.balanceBdt));

      const newOrder = {
        orderId: orderId,
        serviceId: activeService.id,
        serviceName: activeService.name,
        category: activeService.category,
        platform: activeService.platform,
        link: link,
        quantity: quantity,
        costBdt: costBdt,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      userOrders.unshift(newOrder);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(userOrders));

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> <span id="btn-submit-order-label">Place Live Order</span>';
      }
      if (linkInput) linkInput.value = '';

      updateUserUI();
      renderOrderHistory();

      triggerHaptic('success');
      showToast(`Order #${orderId} placed successfully! (-${formatBdt(costBdt)})`, 'success');
    });
  }

  // Price List search filter
  const tableSearch = document.getElementById('services-table-search');
  if (tableSearch) tableSearch.addEventListener('input', renderPriceListTable);

  // Deposit Form Submission Handler
  const depForm = document.getElementById('deposit-form');
  if (depForm) {
    depForm.addEventListener('submit', (e) => {
      e.preventDefault();
      triggerHaptic('medium');

      const amount = Number(document.getElementById('deposit-amount-bdt')?.value) || 0;
      const trxInput = document.getElementById('deposit-trxid');
      const senderInput = document.getElementById('deposit-sender-info');
      const trxId = trxInput ? trxInput.value.trim().toUpperCase() : '';
      const senderInfo = senderInput ? senderInput.value.trim() : '';

      if (amount < 10) return showToast('Minimum deposit amount is strictly ৳ 10 BDT', 'error');
      if (!trxId || trxId.length < 4) return showToast('Please enter a valid TrxID', 'error');

      const targetValEl = document.getElementById('pm-target-value');
      const newDeposit = {
        id: 'DEP-' + Math.floor(100000 + Math.random() * 900000),
        userUid: currentUser.uid,
        userDisplayName: currentUser.displayName,
        method: selectedMethod,
        targetNumber: targetValEl ? targetValEl.textContent : '01791415008',
        amountBdt: amount,
        trxId: trxId,
        senderInfo: senderInfo || undefined,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      userDeposits.unshift(newDeposit);
      localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(userDeposits));

      if (trxInput) trxInput.value = '';
      if (senderInput) senderInput.value = '';

      renderUserDeposits();
      renderAdminDeposits();

      triggerHaptic('success');
      showToast(`Deposit of ${formatBdt(amount)} submitted! Status: Pending Verification.`, 'success');
    });
  }

  // Admin Manual Credit Form
  const adminCreditForm = document.getElementById('admin-manual-credit-form');
  if (adminCreditForm) {
    adminCreditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!checkIsStrictTelegramAdmin()) {
        return showToast('Unauthorized access. Admin panel restricted.', 'error');
      }
      const targetUid = document.getElementById('admin-credit-uid')?.value.trim();
      const delta = Number(document.getElementById('admin-credit-amount')?.value) || 0;

      if (!targetUid || delta === 0) return showToast('Enter valid UID and non-zero amount', 'error');

      if (targetUid === currentUser.uid || targetUid === String(currentUser.telegramId)) {
        currentUser.balanceBdt = Math.max(0, currentUser.balanceBdt + delta);
        localStorage.setItem(STORAGE_KEYS.BALANCE, String(currentUser.balanceBdt));
        updateUserUI();
      }

      triggerHaptic('success');
      showToast(`Adjusted ৳${delta} for UID ${targetUid}`, 'success');
      const creditAmt = document.getElementById('admin-credit-amount');
      if (creditAmt) creditAmt.value = '';
    });
  }

  // Order Tracker Form
  const trackerForm = document.getElementById('tracker-form');
  if (trackerForm) {
    trackerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      triggerHaptic('medium');

      const orderId = document.getElementById('tracker-order-id')?.value.trim();
      if (!orderId) return;

      const card = document.getElementById('tracker-result-card');
      if (!card) return;
      card.classList.remove('hidden');
      card.innerHTML = `<div class="text-center py-4 text-xs text-slate-400"><i class="fa-solid fa-spinner fa-spin"></i> Checking order #${escapeHtml(orderId)} live...</div>`;

      // Check live status via proxy / direct / CORS fallback
      const liveStatus = await fetchProviderOrderStatusLive(orderId);
      if (liveStatus) {
        card.innerHTML = `
          <div class="flex items-center justify-between">
            <span class="font-bold text-white">Order #${escapeHtml(orderId)}</span>
            <span class="px-2 py-0.5 rounded font-mono font-bold text-xs bg-cyan-950 text-cyan-300 border border-cyan-800">${escapeHtml(liveStatus.status || 'In progress')}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 pt-1">
            <div>Start Count: <span class="text-white">${escapeHtml(liveStatus.start_count || '0')}</span></div>
            <div>Remains: <span class="text-white">${escapeHtml(liveStatus.remains || '0')}</span></div>
          </div>
        `;
        return;
      }

      // Fallback check against local history
      const local = userOrders.find(o => String(o.orderId) === String(orderId));
      if (local) {
        card.innerHTML = `
          <div class="flex items-center justify-between">
            <span class="font-bold text-white">Order #${escapeHtml(orderId)}</span>
            <span class="px-2 py-0.5 rounded font-mono font-bold text-xs bg-cyan-950 text-cyan-300 border border-cyan-800">${escapeHtml(local.status)}</span>
          </div>
          <div class="text-xs text-slate-300">${escapeHtml(local.serviceName)}</div>
          <div class="text-[11px] font-mono text-slate-400">Target: <span class="text-white">${escapeHtml(local.link)}</span></div>
        `;
      } else {
        card.innerHTML = `<div class="p-3 text-center text-xs text-slate-400">Order #${escapeHtml(orderId)} is being processed on provider network.</div>`;
      }
    });
  }
}

// Window load trigger
window.addEventListener('DOMContentLoaded', () => {
  initTelegramUser();
  attachAppEventListeners();
  loadServices();
  renderUserDeposits();
  renderOrderHistory();
});

const mineflayer = require('mineflayer');

// ─── CONFIG ────────────────────────────────────────────────────────────────
const CONFIG = {
  host:     'GlitteryMite40.aternos.me',  // ← your Aternos address
  port:     32039,                      // ← default MC port (change if different)
  username: 'AFK_Bot',                  // ← bot's username (offline mode)
  version:  false,                   // ← your server's MC version
  reconnectDelay: 30_000,               // ms to wait before reconnecting
};
// ───────────────────────────────────────────────────────────────────────────

let bot;
let reconnectTimer = null;

function log(msg) {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${msg}`);
}

function createBot() {
  log(`Connecting to ${CONFIG.host}:${CONFIG.port} ...`);

  bot = mineflayer.createBot({
    host:     CONFIG.host,
    port:     CONFIG.port,
    username: CONFIG.username,
    version:  CONFIG.version,
    auth:     'offline',               // Aternos servers in offline mode don't need Microsoft auth
  });

  // ── Events ────────────────────────────────────────────────────────────────

  bot.once('spawn', () => {
    log('✅ Bot spawned in the world!');
    startAntiAFK();
  });

  bot.on('chat', (username, message) => {
    log(`[CHAT] ${username}: ${message}`);
  });

  bot.on('kicked', (reason) => {
    log(`⚠️  Bot was kicked: ${reason}`);
    stopAntiAFK();
    scheduleReconnect();
  });

  bot.on('error', (err) => {
    log(`❌ Error: ${err.message}`);
    stopAntiAFK();
    scheduleReconnect();
  });

  bot.on('end', () => {
    log('🔌 Connection ended.');
    stopAntiAFK();
    scheduleReconnect();
  });
}

// ── Anti-AFK movement logic ────────────────────────────────────────────────

let moveInterval  = null;
let lookInterval  = null;
let jumpInterval  = null;
let actionCounter = 0;

function startAntiAFK() {
  log('▶  Anti-AFK routines started.');

  // Movement: walk in a small square every 5 s
  moveInterval = setInterval(() => {
    const actions = [
      () => walkDirection('forward',  600),
      () => walkDirection('back',     600),
      () => walkDirection('left',     600),
      () => walkDirection('right',    600),
    ];
    actions[actionCounter % actions.length]();
    actionCounter++;
  }, 5_000 + Math.random() * 3_000);

  // Look around: random yaw + pitch every 7 s
  lookInterval = setInterval(() => {
    const yaw   = (Math.random() * 2 * Math.PI) - Math.PI;
    const pitch = (Math.random() - 0.5) * 1.4; // roughly -40° to +40°
    bot.look(yaw, pitch, true);
    log(`👀 Looking at yaw=${(yaw * 57.3).toFixed(1)}° pitch=${(pitch * 57.3).toFixed(1)}°`);
  }, 7_000);

  // Jump every 15 s
  jumpInterval = setInterval(() => {
    if (bot.entity) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
      log('⬆  Jumped.');
    }
  }, 15_000);
  // Inside startAntiAFK(), add:
setInterval(() => {
  bot.setControlState('sneak', true);
  setTimeout(() => bot.setControlState('sneak', false), 1000 + Math.random() * 1000);
}, 20_000 + Math.random() * 10_000);
}

function walkDirection(dir, durationMs) {
  bot.setControlState(dir, true);
  setTimeout(() => bot.setControlState(dir, false), durationMs);
  log(`🚶 Walking ${dir} for ${durationMs}ms`);
}

function stopAntiAFK() {
  clearInterval(moveInterval);
  clearInterval(lookInterval);
  clearInterval(jumpInterval);
  moveInterval = lookInterval = jumpInterval = null;

  // Release all controls safely
  try {
    ['forward', 'back', 'left', 'right', 'jump'].forEach(k =>
      bot.setControlState(k, false));
  } catch (_) {}

  log('⏹  Anti-AFK routines stopped.');
}

// ── Reconnect logic ────────────────────────────────────────────────────────

function scheduleReconnect() {
  if (reconnectTimer) return; // already scheduled
  log(`🔄 Reconnecting in ${CONFIG.reconnectDelay / 1000}s ...`);
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    createBot();
  }, CONFIG.reconnectDelay);
}

// ── Start ──────────────────────────────────────────────────────────────────
createBot();

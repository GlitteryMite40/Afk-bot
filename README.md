# 🤖 Minecraft AFK Bot — Aternos Server Keeper

Keeps your Aternos server online by joining it and making constant small movements.

---

## ⚙️ Setup

### 1. Install Node.js
Download from https://nodejs.org (LTS version recommended)

### 2. Install dependencies
```bash
npm install
```

### 3. Edit `bot.js` — update these lines at the top:
```js
host:     'YOUR_SERVER.aternos.me',  // ← your Aternos address (e.g. myserver.aternos.me)
port:     25565,                      // ← leave as-is unless your server uses a custom port
username: 'AFK_Bot',                  // ← any name you want the bot to show as
version:  '1.20.1',                   // ← must match your Aternos server version exactly
```

### 4. Run the bot
```bash
node bot.js
```

---

## 🎮 What the bot does every few seconds

| Action       | Interval | Description                          |
|--------------|----------|--------------------------------------|
| Walk         | 5s       | Cycles through forward/back/left/right |
| Look around  | 7s       | Rotates to random yaw + pitch        |
| Jump         | 15s      | Presses jump briefly                 |
| Reconnect    | 10s      | Automatically re-joins after kicks/disconnects |

---

## ⚠️ Important notes

- **Server mode**: Your Aternos server must be in **offline/cracked mode** (most Aternos servers are).  
  If it requires Microsoft/Mojang auth, change `auth: 'offline'` to `auth: 'microsoft'` in `bot.js`.
- **Version**: The `version` field in config **must exactly match** your server's Minecraft version  
  (e.g. `'1.20.4'`, `'1.19.2'`, `'1.8.9'`).
- **Aternos activity**: Aternos may still shut down the server after a while with no real players —  
  the bot counts as a player, so it should stay online.

---

## 🛠 Troubleshooting

| Problem | Fix |
|---------|-----|
| `Error: connect ECONNREFUSED` | Server isn't started yet on Aternos — start it first |
| `Bot was kicked: You are not white-listed` | Add `AFK_Bot` to your server whitelist |
| `Error: disconnect.loginFailed` | Switch to `auth: 'microsoft'` if it's a premium server |
| Bot keeps teleporting back | Disable anti-cheat plugins or increase move duration |

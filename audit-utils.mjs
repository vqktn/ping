const AUTH_ACTIONS = new Set(["login", "logout", "signup"]);
const ECONOMY_ACTIONS = new Set([
  "shop_buy", "quest_claim", "coin_grant", "item_grant", "badge_award",
  "coin_admin_remove", "crypto_admin_grant", "crypto_admin_remove", "crypto_mined", "crypto_upgrade", "crypto_boost",
  "crypto_convert", "crypto_sell", "crypto_exchange", "crypto_list", "crypto_cancel",
  "crypto_market_buy", "crypto_market_sale", "blackmarket_buy"
]);

function matchesCategory(action, category) {
  if (category === "all") return true;
  if (category === "auth") return AUTH_ACTIONS.has(action);
  if (category === "moderation") return action.startsWith("mod_");
  if (category === "servers") return action.startsWith("server_");
  if (category === "announcements") return action === "announce";
  if (category === "voice") return action.startsWith("voice_");
  if (category === "economy") return ECONOMY_ACTIONS.has(action);
  if (category === "games") return action.startsWith("game_");
  return !AUTH_ACTIONS.has(action) && !ECONOMY_ACTIONS.has(action) && action !== "announce"
    && !["mod_", "server_", "voice_", "game_", "crypto_", "blackmarket_"].some((prefix) => action.startsWith(prefix));
}

export function filterAuditEvents(rows, { category = "all", query = "", from = "", through = "" } = {}) {
  const needle = String(query || "").trim().toLocaleLowerCase();
  return (Array.isArray(rows) ? rows : []).filter((row) => {
    const action = String(row.action || "");
    if (!matchesCategory(action, category)) return false;
    const day = String(row.created_at || "").slice(0, 10);
    if (from && day < from) return false;
    if (through && day > through) return false;
    if (!needle) return true;
    return [row.username, row.action, row.detail, row.ip]
      .some((value) => String(value || "").toLocaleLowerCase().includes(needle));
  });
}

function csvCell(value) {
  let text = String(value ?? "");
  if (/^[\s]*[=+\-@]/.test(text)) text = "'" + text;
  return '"' + text.replace(/"/g, '""') + '"';
}

export function auditEventsToCsv(rows) {
  const header = ["Timestamp", "Username", "Action", "Detail", "IP", "User ID"];
  const values = (Array.isArray(rows) ? rows : []).map((row) => [
    row.created_at, row.username, row.action, row.detail, row.ip, row.user_id
  ]);
  return "\uFEFF" + [header, ...values].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export const toHours = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h + m / 60;
};

export const toTimeStr = (hours) => {
  let h = Math.floor(hours);
  let m = Math.round((hours - h) * 60);

  // handle overflow minutes
  if (m === 60) {
    h += 1;
    m = 0;
  }

  // optional safety: wrap (if you ever go past 24h)
  if (h >= 24) h = h % 24;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const normalizeTime = (time) => {
  if (!time || typeof time !== "string") return "";

  const [h, m] = time.split(":").map(Number);

  if (isNaN(h) || isNaN(m)) return "";

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const toMinutes = (t) => {
  if (!t || typeof t !== "string") return null;

  const parts = t.split(":");
  if (parts.length !== 2) return null;

  const [h, m] = parts.map(Number);

  if (isNaN(h) || isNaN(m)) return null;

  return h * 60 + m;
};
export const timeToMinutesSafe = (time) => {
  const normalized = normalizeTime(time);
  if (!normalized) return null;

  return toMinutes(normalized);
};
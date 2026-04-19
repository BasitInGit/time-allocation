import { toTimeStr } from "./timeUtils";

export function fillTasks({
  slot,
  taskPool,
  distribution,
  rules,
  intensity,
  categoryBudgets = [],
}) {
  const schedule = [];

  let cursor = slot.start;
  let remaining = slot.duration;

  let lastCategory = null;

  const minStep = 0.25; // 15 min safety floor

  while (remaining > minStep) {
    let category = pickCategory(distribution, categoryBudgets);

    // prevent repeat
    if (category === lastCategory) {
      category = pickAlternativeCategory(distribution, categoryBudgets, lastCategory);
    }

    // force recovery after work/academic
    if (lastCategory === "Work" || lastCategory === "Academic") {
      if (category === "Work" || category === "Academic") {
        category = pickWellbeingCategory(categoryBudgets);
      }
    }

    const budget = categoryBudgets.find(b => b.name === category);
    if (budget && budget.hours <= 0) continue;

    const task = pickTask(taskPool, category, intensity);
    if (!task) break;

    // ✅ FIXED duration logic
    const duration = Math.min(
      task.duration,
      rules.maxBlock,
      remaining,
      budget?.hours ?? remaining
    );

    if (duration < minStep) break;

    schedule.push({
      title: task.name,
      category,
      start: toTimeStr(cursor),
      end: toTimeStr(cursor + duration),
      duration,
      type: "task",
    });

    // =========================
    // ✅ FIXED GAP LOGIC (IMPORTANT)
    // =========================
    let GAP = 0;

    if (lastCategory === "Work" || lastCategory === "Academic") {
      // adaptive gap based on previous task
      GAP = Math.min(duration * rules.gapFactor, 0.5);
    } else {
      GAP = duration * rules.gapFactor * 0.3;
    }

    cursor += duration + GAP;
    remaining -= duration + GAP;

    lastCategory = category;
  }

  return schedule;
}

function pickCategory(distribution = [], categoryBudgets = []) {
  const usable = distribution.filter(d => {
    const budget = categoryBudgets.find(b => b.name === d.name);
    return !budget || budget.hours > 0;
  });

  if (!usable.length) return distribution[0]?.name;

  const total = usable.reduce((a, d) => a + (d.value || 1), 0);

  let r = Math.random() * total;

  for (const d of usable) {
    r -= d.value || 1;
    if (r <= 0) return d.name;
  }

  return usable[0].name;
}

function pickAlternativeCategory(distribution, budgets, last) {
  const options = distribution
    .map(d => d.name)
    .filter(name => name !== last);

  return options[Math.floor(Math.random() * options.length)];
}

function pickWellbeingCategory(categoryBudgets) {
  const options = ["Health", "Leisure"].filter(name => {
    const b = categoryBudgets.find(x => x.name === name);
    return !b || b.hours > 0;
  });

  return options.length
    ? options[Math.floor(Math.random() * options.length)]
    : "Health";
}

function pickTask(pool, category, intensity) {
  const tasks = pool?.[category]?.[intensity];

  if (!tasks || tasks.length === 0) return null;

  return tasks[Math.floor(Math.random() * tasks.length)];
}
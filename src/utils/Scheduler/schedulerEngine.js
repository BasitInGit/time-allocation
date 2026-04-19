import { toHours, toTimeStr } from "./timeUtils";
import { buildTimelineBlocks, extractFreeSlots } from "./timelineBuilder";
import { fillTasks } from "./taskFiller";
import { INTENSITY_RULES } from "./intensityRules";
import { buildTaskPool } from "./buildTaskPool";
import { normalizeDate } from "../dateUtils";

const MIN_BLOCK = {
  Light: 0.3,
  Balanced: 0.5,
  Intense: 0.75,
};

export function generateSchedule({
  date,
  startTime,
  endTime,
  tasks = [],
  distribution = [],
  preferences = [],
  categoryAnalysis = [],
  existingTasks = [],
}) {
  const cleanDate = normalizeDate(date);

  // =====================
  // 1. BASE TIMELINE
  // =====================
  const baseTimeline = buildTimelineBlocks({
  date,
  startTime,
  endTime,
  existingTasks,
}).filter(block =>
  block.start >= toHours(startTime) &&
  block.start < toHours(endTime)
);

  const freeSlots = extractFreeSlots(baseTimeline);


  const rules = INTENSITY_RULES[intensity];

const totalFree = freeSlots.reduce((a, s) => a + s.duration, 0);

const usableWorkTime = totalFree * rules.utilisation;

let categoryBudgets = buildCategoryBudgets(
    distribution,
    rules,
    usableWorkTime
  );



  // =====================
  // 4. TASK POOL
  // =====================
  const taskPool = buildTaskPool({
    intensity,
    distribution,
  });

  // =====================
  // 5. FILL REMAINING SPACE
  // =====================
  let filled = [];

  for (const slot of freeSlots) {
  filled.push(
    ...fillTasks({
      slot,
  taskPool,
  categoryBudgets,
  distribution,
  intensity,
  rules,
    })
  );
}

  // =====================
  // 7. FINAL OUTPUT
  // =====================

  const normalizeOutput = (e) => {
  let start = e.start;

  // convert HH:MM → number if needed
  if (typeof start === "string") {
    start = toHours(start);
  }

  if (typeof start !== "number" || isNaN(start)) {
    console.warn("BAD EVENT:", e);
    return null;
  }

  return {
    id: e.id || `gen-${Math.random()}`,
    title: e.title,
    category: e.category,
    date: cleanDate,
    time: toTimeStr(start),
    duration: Number(e.duration) || 1,
    type: e.type || "task",
  };
};

  return filled
  .map(normalizeOutput)
.filter(Boolean)
  .sort((a, b) => toHours(a.time) - toHours(b.time));
}

function buildCategoryBudgets(distribution, intensityRules, usableHours) {
  const intensityWeights = intensityRules.weights || {};

  const totalUserWeight = distribution.reduce(
    (a, d) => a + (d.value || 1),
    0
  );

  const raw = distribution.map(d => {
    const userRatio = (d.value || 1) / totalUserWeight;
    const intensityWeight = intensityWeights[d.name] ?? 1;

    return {
      name: d.name,
      rawScore: userRatio * intensityWeight,
    };
  });

  const totalScore = raw.reduce((a, d) => a + d.rawScore, 0);

  return raw.map(d => ({
    name: d.name,
    hours: (d.rawScore / totalScore) * usableHours,
  }));
}








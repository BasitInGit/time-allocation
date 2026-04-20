import { toHours, toTimeStr } from "./timeUtils";
import { buildTimelineBlocks } from "./timelineBuilder";
import { getGap } from "./gapHelper";
import { getAllowedCategories } from "./scoreHelper";
import { pickCategory, pickIntensity } from "./pickHelper";
import { pickTask, TASK_LIBRARY } from "./taskPicker";
import { normalizeDate } from "../dateUtils";


export function generateSchedule({
  date,
  startTime,
  endTime,
  distribution = [],
  preferences = [],
  categoryAnalysis = [],
  existingTasks = [],
}) {

  const cleanDate = normalizeDate(date);

  const start = toHours(startTime);
  const end = toHours(endTime);

  const baseTimeline = buildTimelineBlocks({
    date,
    startTime,
    endTime,
    existingTasks,
  })
  .map(block => ({
    ...block,
    start: Math.max(block.start, start),
    end: Math.min(block.end, end),
  }))
  .filter(block => block.end > block.start);

  let lastCategory = null;
  let lastTaskName = null;
  let prevLoad = 0;
  let gap = 0;

  const scheduled = [];

for (const block of baseTimeline) {

  const duration = block.end - block.start;

  const timeOfDay =
    block.start < 12 ? "morning" :
    block.start < 17 ? "afternoon" :
    "evening";

  // =====================
  // FIXED BLOCK
  // =====================
  if (block.type === "fixed") {

    prevLoad += duration;

    if (prevLoad >= 2) {
      gap = getGap(prevLoad, timeOfDay);
      prevLoad = 0;
    }

    continue;
  }

  // =====================
  // FREE BLOCK
  // =====================
  let remaining = duration - gap;
  let cursor = block.start + gap;

  gap = 0;

  while (remaining > 0) {

    const allowed = getAllowedCategories(timeOfDay, preferences);
    const categories = allowed.length
      ? allowed
      : preferences.map(p => p.name);

    const category = pickCategory({
      categories,
      lastCategory,
      timeOfDay,
      preferences,
      distribution,
    });

    if (!category) break;

    const intensity = pickIntensity({
      category,
      prevLoad,
      preferences,
      categoryAnalysis,
    });


    const task = pickTask({
      category,
      intensity,
      slotDuration: Math.min(2, remaining),
      taskLibrary: TASK_LIBRARY,
      lastTaskName,
    });

    if (!task) break;

    scheduled.push({
      ...task,
      category,
      start: cursor,
      end: cursor + task.duration,
    });

    lastCategory = category;
    lastTaskName = task.name;

    cursor += task.duration;
    remaining -= task.duration;
    prevLoad += task.duration;

    if (prevLoad >= 2) {
      gap = getGap(prevLoad, timeOfDay);
      prevLoad = 0;
      cursor += gap;
      remaining -= gap;
    }
  }
}
return scheduled

}








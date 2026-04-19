import { toHours, toTimeStr } from "./timeUtils";
import { normalizeDate } from "../dateUtils";;

/**
 * Build free time blocks by removing existing tasks
 */
export function buildTimelineBlocks({
  date,
  startTime,
  endTime,
  existingTasks = [],
}) {
  const start = toHours(startTime);
const end = toHours(endTime);

const sorted = [...existingTasks]
  .filter(t => {
    const tTime = toHours(t.time);
    return tTime >= start && tTime < end;
  })
  .sort((a, b) => toHours(a.time) - toHours(b.time));

  const blocks = [];
  let cursor = start;

  for (const task of sorted) {
    const taskStart = toHours(task.time);
    const taskEnd = taskStart + (task.duration || 1);

    // gap BEFORE task
    if (taskStart > cursor) {
      blocks.push({
        start: cursor,
        end: taskStart,
        type: "free",
      });
    }

    // push fixed task
    blocks.push({
  start: taskStart,
  end: taskEnd,
  type: "fixed",
  task: {
    ...task,
    time: task.time,
    id: task.id,
    date: normalizeDate(task.date),
  }
});

    cursor = Math.max(cursor, taskEnd);
  }

  // trailing free time
  if (cursor < end) {
    blocks.push({
      start: cursor,
      end,
      type: "free",
    });
  }

  return blocks;
}

export function extractFreeSlots(blocks) {
  return blocks
    .filter(b => b.type === "free")
    .map(b => ({
      start: b.start,
      end: b.end,
      duration: b.end - b.start,
    }));
}
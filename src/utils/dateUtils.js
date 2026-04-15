export const getWeekRange = (date = new Date()) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay()); // Sunday

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return { start, end };
};

export function getTasksForWeek(tasks, date = new Date()) {
  const { start, end } = getWeekRange(date);

  return tasks.filter(task => {
    const d = new Date(task.date);
    return d >= start && d <= end;
  });
}

export function getWeekRangeLabel(date = new Date()) {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay() + 1); // Monday start

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const format = (d) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return `${format(start)} – ${format(end)}`;
}
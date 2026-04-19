export const TASK_LIBRARY = {
  Academic: {
    Light: [
      { name: "Review notes", duration: 0.5, weight: 1 },
      { name: "Flashcards", duration: 0.5, weight: 1 },
      { name: "Summary reading", duration: 0.5, weight: 1 },
    ],
    Balanced: [
      { name: "Practice problems", duration: 1, weight: 1 },
      { name: "Revision session", duration: 1.5, weight: 1.2 },
      { name: "Past paper section", duration: 1.5, weight: 1.3 },
    ],
    Intense: [
      { name: "Deep work session", duration: 2, weight: 1.5 },
      { name: "Timed exam simulation", duration: 2, weight: 1.6 },
      { name: "Full topic mastery block", duration: 2, weight: 1.7 },
    ],
  },

  Work: {
    Light: [
      { name: "Light admin", duration: 0.5, weight: 1 },
      { name: "Inbox sorting", duration: 0.5, weight: 1 },
      { name: "Task triage", duration: 0.5, weight: 1 },
    ],
    Balanced: [
      { name: "Emails", duration: 0.5, weight: 1 },
      { name: "Project work", duration: 1.5, weight: 1.2 },
      { name: "Meetings follow-up", duration: 1, weight: 1.1 },
    ],
    Intense: [
      { name: "Deep project focus", duration: 2, weight: 1.5 },
      { name: "Sprint execution", duration: 2, weight: 1.6 },
      { name: "High-priority delivery", duration: 2, weight: 1.7 },
    ],
  },

  Health: {
    Light: [
      { name: "Stretching", duration: 0.5, weight: 1 },
      { name: "Short walk", duration: 0.5, weight: 1 },
      { name: "Mobility routine", duration: 0.5, weight: 1 },
    ],
    Balanced: [
      { name: "Workout", duration: 1, weight: 1 },
      { name: "Cardio session", duration: 1, weight: 1.1 },
      { name: "Strength training", duration: 1, weight: 1.2 },
    ],
    Intense: [
      { name: "Intense training", duration: 1.5, weight: 1.2 },
      { name: "HIIT session", duration: 1.5, weight: 1.3 },
      { name: "Full body workout", duration: 1.5, weight: 1.4 },
    ],
  },

  Leisure: {
    Light: [
      { name: "Relax", duration: 0.5, weight: 1 },
      { name: "Music break", duration: 0.5, weight: 1 },
      { name: "Scroll / unwind", duration: 0.5, weight: 1 },
    ],
    Balanced: [
      { name: "Relax", duration: 1, weight: 1 },
      { name: "Watch episode", duration: 1, weight: 1.1 },
      { name: "Hobby time", duration: 1, weight: 1.2 },
    ],
    Intense: [
      { name: "Long break", duration: 1.5, weight: 1 },
      { name: "Social time", duration: 1.5, weight: 1.1 },
      { name: "Extended leisure", duration: 1.5, weight: 1.2 },
    ],
  },
};
export function buildTaskPool({ distribution = [] }) { const pool = {}; const distributionMap = {}; distribution.forEach(d => { distributionMap[d.name] = d.value ?? 1; }); Object.keys(TASK_LIBRARY).forEach(category => { pool[category] = {}; Object.keys(TASK_LIBRARY[category]).forEach(intensity => { const categoryTasks = TASK_LIBRARY[category][intensity] || []; const categoryWeight = distributionMap[category] ?? 1; pool[category][intensity] = categoryTasks.map(task => ({ name: task.name, duration: task.duration, type: "template", weight: (task.weight || 1) * categoryWeight, })); }); }); return pool; }
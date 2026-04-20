export const TASK_LIBRARY = {
  Academic: {
  Light: {
    0.5: [
      { name: "Review notes", duration: 0.5 },
      { name: "Flashcards", duration: 0.5 }
    ],
    1: [
      { name: "Light practice questions", duration: 1 },
      { name: "Lecture recap", duration: 1 }
    ],
    1.5: [
      { name: "Topic summary session", duration: 1.5 },
      { name: "Guided revision", duration: 1.5 }
    ],
    2: [
      { name: "Extended reading", duration: 2 },
      { name: "Concept consolidation", duration: 2 }
    ]
  },

  Balanced: {
    0.5: [
      { name: "Quick recall drill", duration: 0.5 },
      { name: "Problem warm-up", duration: 0.5 }
    ],
    1: [
      { name: "Practice questions set", duration: 1 },
      { name: "Structured revision", duration: 1 }
    ],
    1.5: [
      { name: "Past paper section", duration: 1.5 },
      { name: "Topic deep dive", duration: 1.5 }
    ],
    2: [
      { name: "Mock exam section", duration: 2 },
      { name: "Full topic review", duration: 2 }
    ]
  },

  Intense: {
    0.5: [
      { name: "Rapid problem solving", duration: 0.5 },
      { name: "Speed recall drill", duration: 0.5 }
    ],
    1: [
      { name: "Focused problem block", duration: 1 },
      { name: "Timed questions set", duration: 1 }
    ],
    1.5: [
      { name: "High difficulty revision", duration: 1.5 },
      { name: "Exam technique drill", duration: 1.5 }
    ],
    2: [
      { name: "Full exam simulation", duration: 2 },
      { name: "Deep mastery session", duration: 2 }
    ]
  }
},

  Work: {
  Light: {
    0.5: [
      { name: "Inbox check", duration: 0.5 },
      { name: "Small admin task", duration: 0.5 }
    ],
    1: [
      { name: "Email cleanup", duration: 1 },
      { name: "Task review", duration: 1 }
    ],
    1.5: [
      { name: "Document review", duration: 1.5 },
      { name: "Light planning", duration: 1.5 }
    ],
    2: [
      { name: "System cleanup", duration: 2 },
      { name: "Organising workspace", duration: 2 }
    ]
  },

  Balanced: {
    0.5: [
      { name: "Quick responses", duration: 0.5 },
      { name: "Ticket triage", duration: 0.5 }
    ],
    1: [
      { name: "Email batch processing", duration: 1 },
      { name: "Task execution block", duration: 1 }
    ],
    1.5: [
      { name: "Project work block", duration: 1.5 },
      { name: "Report drafting", duration: 1.5 }
    ],
    2: [
      { name: "Feature development", duration: 2 },
      { name: "Workflow planning", duration: 2 }
    ]
  },

  Intense: {
    0.5: [
      { name: "Bug fix sprint", duration: 0.5 },
      { name: "Hotfix check", duration: 0.5 }
    ],
    1: [
      { name: "Focused build", duration: 1 },
      { name: "Critical task block", duration: 1 }
    ],
    1.5: [
      { name: "Deep development", duration: 1.5 },
      { name: "System design work", duration: 1.5 }
    ],
    2: [
      { name: "Major feature build", duration: 2 },
      { name: "Sprint execution", duration: 2 }
    ]
  }
},

 Health: {
  Light: {
    0.5: [
      { name: "Stretch", duration: 0.5 },
      { name: "Walk", duration: 0.5 }
    ],
    1: [
      { name: "Light yoga", duration: 1 },
      { name: "Mobility session", duration: 1 }
    ],
    1.5: [
      { name: "Recovery workout", duration: 1.5 },
      { name: "Long walk", duration: 1.5 }
    ],
    2: [
      { name: "Extended recovery", duration: 2 },
      { name: "Low intensity cardio", duration: 2 }
    ]
  },

  Balanced: {
    0.5: [
      { name: "Warm-up", duration: 0.5 },
      { name: "Core activation", duration: 0.5 }
    ],
    1: [
      { name: "Workout session", duration: 1 },
      { name: "Cardio session", duration: 1 }
    ],
    1.5: [
      { name: "Gym session", duration: 1.5 },
      { name: "Strength training", duration: 1.5 }
    ],
    2: [
      { name: "Full workout block", duration: 2 },
      { name: "Conditioning session", duration: 2 }
    ]
  },

  Intense: {
    0.5: [
      { name: "HIIT burst", duration: 0.5 },
      { name: "Sprint set", duration: 0.5 }
    ],
    1: [
      { name: "HIIT session", duration: 1 },
      { name: "Hard cardio", duration: 1 }
    ],
    1.5: [
      { name: "High intensity workout", duration: 1.5 },
      { name: "Athletic training", duration: 1.5 }
    ],
    2: [
      { name: "Peak conditioning", duration: 2 },
      { name: "Endurance training", duration: 2 }
    ]
  }
},

  Leisure: {
  Light: {
    0.5: [
      { name: "Music break", duration: 0.5 },
      { name: "Rest", duration: 0.5 }
    ],
    1: [
      { name: "Short unwind", duration: 1 },
      { name: "Tea break", duration: 1 }
    ],
    1.5: [
      { name: "Relax session", duration: 1.5 },
      { name: "Light hobby", duration: 1.5 }
    ],
    2: [
      { name: "Passive recovery", duration: 2 },
      { name: "Long rest", duration: 2 }
    ]
  },

  Balanced: {
    0.5: [
      { name: "Short scroll", duration: 0.5 },
      { name: "Quick break", duration: 0.5 }
    ],
    1: [
      { name: "Watch episode", duration: 1 },
      { name: "Gaming session", duration: 1 }
    ],
    1.5: [
      { name: "Hobby time", duration: 1.5 },
      { name: "Social catch-up", duration: 1.5 }
    ],
    2: [
      { name: "Long episode binge", duration: 2 },
      { name: "Creative time", duration: 2 }
    ]
  },

  Intense: {
    0.5: [
      { name: "Quick reset", duration: 0.5 },
      { name: "Mental break", duration: 0.5 }
    ],
    1: [
      { name: "Focused leisure", duration: 1 },
      { name: "Deep hobby work", duration: 1 }
    ],
    1.5: [
      { name: "Extended hobby session", duration: 1.5 },
      { name: "Creative work", duration: 1.5 }
    ],
    2: [
      { name: "Full leisure block", duration: 2 },
      { name: "Immersive activity", duration: 2 }
    ]
  }
}
};

export function pickTask({
  category,
  intensity,
  slotDuration,
  taskLibrary,
  lastTaskName,
}) {
  const pool = taskLibrary?.[category]?.[intensity] || [];

  if (!pool.length) return null;

  // 1. exact match first
  let candidates = pool.filter(t => t.duration === slotDuration);

  // 2. fallback: closest duration
  if (!candidates.length) {
    const sorted = [...pool].sort(
      (a, b) =>
        Math.abs(a.duration - slotDuration) -
        Math.abs(b.duration - slotDuration)
    );

    candidates = sorted.slice(0, 2); // top 2 closest
  }

  // 3. avoid repetition (soft penalty)
  const filtered = candidates.filter(t => t.name !== lastTaskName);

  const finalPool = filtered.length ? filtered : candidates;

  // 4. pick weighted random (or just first for simplicity)
  const choice =
    finalPool[Math.floor(Math.random() * finalPool.length)];

  return choice;
}
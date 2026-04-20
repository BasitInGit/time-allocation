function pickCategory({
  categories,
  lastCategory,
  timeOfDay,
  preferences,
  distribution,
}) {
  let best = null;
  let bestScore = -Infinity;

  for (const category of categories) {
    const score = scoreCategory({
      category,
      lastCategory,
      timeOfDay,
      preferences,
      distribution,
    });

    if (score > bestScore) {
      bestScore = score;
      best = category;
    }
  }

  return best;
}


function pickIntensity({
  category,
  prevLoad,
  preferences,
  categoryAnalysis,
}) {
  const pref = preferences.find(p => p.name === category);
  const userIntensity = pref?.intensity || "medium";

  const analysis = categoryAnalysis?.[category];

  // 🔹 Step 1: start from user choice
  let final = userIntensity;

  // 🔹 Step 2: adjust UP if deadlines demand it
  if (analysis?.recommendedIntensity === "Intense") {
    final = "high";
  } else if (
    analysis?.recommendedIntensity === "Balanced" &&
    final === "low"
  ) {
    final = "medium";
  }

  // 🔹 Step 3: adjust DOWN if fatigue is high
  if (prevLoad >= 3) {
    final = "low";
  } else if (prevLoad >= 2 && final === "high") {
    final = "medium";
  }

  return final;
}
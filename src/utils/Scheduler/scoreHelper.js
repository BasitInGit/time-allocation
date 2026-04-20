export function getTimeOfDay(hour) {
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export function getAllowedCategories(timeOfDay, preferences) {
  return preferences
    .filter(p => {
      return (
        p.preferredTime === "any" ||
        p.preferredTime === timeOfDay
      );
    })
    .map(p => p.name);
}

export function scoreCategory({
  category,
  preferences,
  lastCategory,
  timeOfDay,
  distribution,
}) {
  let score = 0;

  const pref = preferences.find(p => p.name === category);

  if (pref) {
    if (pref.preferredTime === timeOfDay) {
      score += 3;
    } else if (pref.preferredTime !== "any") {
      score -= 2;
    }
  }

  if (category === lastCategory) {
    score -= 3;
  }

  const dist = distribution.find(d => d.name === category);
  if (dist) {
    score += ((dist.delta || 0) / 100) * 3;
  }

  return score;
}
export const INTENSITY_RULES = {
  Light: {
    utilisation: 0.6,
    gapFactor: 0.4,
    maxBlock: 1,
    deadlineCap: 0.3,
    weights: {
      Academic: 0.7,
      Work: 0.7,
      Health: 1.3,
      Leisure: 1.6,
    },
  },

  Balanced: {
    utilisation: 0.6,
    gapFactor: 0.2,
    maxBlock: 2,
    deadlineCap: 0.5,
    weights: {
      Academic: 1,
      Work: 1,
      Health: 1,
      Leisure: 1,
    },
  },

  Intense: {
    utilisation: 0.8,
    gapFactor: 0.2,
    maxBlock: 3,
    deadlineCap: 0.7,
    weights: {
      Academic: 1.5,
      Work: 1.5,
      Health: 0.8,
      Leisure: 0.5,
    },
  },
};
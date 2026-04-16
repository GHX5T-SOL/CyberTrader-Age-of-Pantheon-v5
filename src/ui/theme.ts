export const colors = {
  voidBlack: "#05060D",
  deepNavy: "#080A14",
  deepGreenBlack: "#080A14",
  panel: "#0C1020",
  panelSoft: "#11162A",
  panelGlass: "#12172B",
  line: "#222944",
  frameLine: "#222944",
  lineSoft: "#171D33",
  cyan: "#00E7FF",
  electricCyan: "#00E7FF",
  cyanSoft: "#0A88A8",
  magenta: "#FF2FB2",
  magentaSoft: "#9C2BFF",
  violet: "#B56CFF",
  archivistViolet: "#B56CFF",
  profit: "#1FFFD1",
  acidGreen: "#1FFFD1",
  loss: "#FF3F8F",
  hotRed: "#FF3F8F",
  warning: "#FFB85C",
  signalAmber: "#FFB85C",
  text: "#F4F6FF",
  offWhite: "#F4F6FF",
  muted: "#8B91A8",
  metaGray: "#8B91A8",
  faint: "#4B5168",
  phosphor: "#F4F6FF",
  phosphorDim: "#8B91A8",
  phosphorGhost: "#4B5168",
  locked: "#30354A",
  lockedGray: "#30354A"
};

export const fonts = {
  mono: "Courier",
  display: "Courier"
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
};

export const radii = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 22,
  pill: 999
};

export const glow = {
  cyanText: {
    textShadowColor: colors.cyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10
  },
  magentaText: {
    textShadowColor: colors.magenta,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10
  },
  cyanBox: {
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 4
  },
  magentaBox: {
    shadowColor: colors.magenta,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.32,
    shadowRadius: 18,
    elevation: 5
  }
};

export const shadow = {
  cyanGlow: glow.cyanText,
  greenGlow: glow.cyanText,
  redGlow: glow.magentaText
};

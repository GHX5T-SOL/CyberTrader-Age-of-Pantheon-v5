export const colors = {
  voidBlack: "#000000",
  deepNavy: "#04060D",
  deepGreenBlack: "#04060D",
  panel: "rgba(6,10,24,0.74)",
  panelSoft: "rgba(9,13,30,0.70)",
  panelGlass: "rgba(255,255,255,0.045)",
  line: "rgba(255,255,255,0.08)",
  frameLine: "rgba(255,255,255,0.08)",
  lineSoft: "rgba(255,255,255,0.055)",
  cyan: "#22D3EE",
  electricCyan: "#22D3EE",
  cyanSoft: "rgba(34,211,238,0.14)",
  magenta: "#EC4899",
  magentaSoft: "rgba(236,72,153,0.16)",
  violet: "#A855F7",
  archivistViolet: "#A855F7",
  profit: "#22D3EE",
  acidGreen: "#22D3EE",
  loss: "#EC4899",
  hotRed: "#EC4899",
  warning: "#FFB85C",
  signalAmber: "#FFB85C",
  text: "#F3F7FF",
  offWhite: "#F3F7FF",
  muted: "#93A5C6",
  metaGray: "#93A5C6",
  faint: "#6A7A98",
  phosphor: "#F3F7FF",
  phosphorDim: "#93A5C6",
  phosphorGhost: "#6A7A98",
  locked: "#3B4058",
  lockedGray: "#3B4058"
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

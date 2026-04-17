import React, { PropsWithChildren } from "react";
import {
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewStyle
} from "react-native";
import { pirateOsTheme as t } from "../../theme/pirateOsTheme";

const webAmbientBlur = Platform.OS === "web"
  ? ({ filter: "blur(30px) saturate(1.45)" } as Record<string, string>)
  : {};

const webPhoneGlow = Platform.OS === "web"
  ? ({
      boxShadow:
        "-10px 0 30px rgba(34,211,238,0.34), 10px 0 34px rgba(236,72,153,0.32), 0 34px 90px rgba(168,85,247,0.24)"
    } as Record<string, string>)
  : {};

type PiratePhoneFrameProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  onMenu?: () => void;
  rightLabel?: string;
  cityBand?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}>;

export function PiratePhoneFrame({
  title = "AG3NT_OS/PIRAT3",
  subtitle = "EIDOLON ID: 7X9...A3F",
  onBack,
  onMenu,
  rightLabel = "III",
  cityBand = true,
  contentStyle,
  children
}: PiratePhoneFrameProps) {
  const { width, height } = useWindowDimensions();
  const phoneWidth = Math.min(Math.max(width - 28, 296), 322);
  const phoneHeight = Math.round(phoneWidth * 2.17);
  const minStageHeight = Math.max(height, phoneHeight + 68);

  return (
    <SafeAreaView style={[styles.safe, { minHeight: height }]}>
      <ImageBackground source={{ uri: t.cityImage }} resizeMode="cover" style={styles.ambientImage} imageStyle={styles.ambientImageStyle}>
        <View style={styles.ambientFloorCyan} />
        <View style={styles.ambientFloorPink} />
        <View style={styles.ambientWash} />
      </ImageBackground>

      <ScrollView
        style={styles.stageScroll}
        contentContainerStyle={[styles.stageContent, { minHeight: minStageHeight }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.phoneFrame, webPhoneGlow, { width: phoneWidth, height: phoneHeight }]}>
          <View style={styles.leftSideButtonTop} />
          <View style={styles.leftSideButtonMid} />
          <View style={styles.screenGlass}>
            {cityBand ? (
              <ImageBackground source={{ uri: t.cityImage }} resizeMode="cover" style={styles.cityLayer} imageStyle={styles.cityImage}>
                <View style={styles.cityTint} />
                <View style={styles.cityFade} />
              </ImageBackground>
            ) : null}

            <StatusBarRow />
            <View style={styles.header}>
              {onBack ? (
                <Pressable onPress={onBack} style={styles.backButton}>
                  <Text style={styles.backText}>BACK</Text>
                </Pressable>
              ) : null}
              <View style={styles.identity}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
              </View>
              {onMenu ? (
                <Pressable onPress={onMenu} style={styles.menuButton}>
                  <Text style={styles.menuText}>{rightLabel}</Text>
                </Pressable>
              ) : null}
            </View>

            <ScrollView
              style={styles.innerScroll}
              contentContainerStyle={[styles.innerContent, contentStyle]}
              showsVerticalScrollIndicator={false}
            >
              {children}
              <Text style={styles.footer}>// PIRATE OS v0.1.3</Text>
              <View style={styles.homeIndicator} />
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusBarRow() {
  return (
    <View style={styles.statusRow}>
      <Text style={styles.statusText}>9:41</Text>
      <View style={styles.systemIcons}>
        <View style={[styles.signalBar, styles.signalBarShort]} />
        <View style={[styles.signalBar, styles.signalBarMid]} />
        <View style={styles.signalBar} />
        <Text style={styles.wifiIcon}>~</Text>
        <View style={styles.batteryIcon}>
          <View style={styles.batteryFill} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: t.bg
  },
  ambientImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: t.bg
  },
  ambientImageStyle: {
    ...webAmbientBlur,
    opacity: 0.3,
    transform: [{ scale: 1.25 }]
  },
  ambientFloorCyan: {
    position: "absolute",
    left: "12%",
    bottom: -18,
    width: 180,
    height: 42,
    borderRadius: 90,
    backgroundColor: "rgba(34,211,238,0.22)",
    transform: [{ rotate: "-4deg" }]
  },
  ambientFloorPink: {
    position: "absolute",
    right: "16%",
    bottom: -22,
    width: 210,
    height: 48,
    borderRadius: 105,
    backgroundColor: "rgba(236,72,153,0.26)",
    transform: [{ rotate: "5deg" }]
  },
  ambientWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.64)"
  },
  stageScroll: {
    flex: 1
  },
  stageContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 34
  },
  phoneFrame: {
    borderRadius: 42,
    padding: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    backgroundColor: "rgba(0,0,0,0.86)",
    shadowColor: t.violet,
    shadowOpacity: 0.36,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 18 }
  },
  leftSideButtonTop: {
    position: "absolute",
    left: -5,
    top: 124,
    width: 4,
    height: 44,
    borderRadius: 3,
    backgroundColor: "rgba(34,211,238,0.28)"
  },
  leftSideButtonMid: {
    position: "absolute",
    left: -5,
    top: 182,
    width: 4,
    height: 56,
    borderRadius: 3,
    backgroundColor: "rgba(34,211,238,0.20)"
  },
  screenGlass: {
    flex: 1,
    borderRadius: 39,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.40)",
    backgroundColor: "rgba(1,2,8,0.94)"
  },
  cityLayer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 80,
    height: 276
  },
  cityImage: {
    opacity: 0.62
  },
  cityTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(14,4,28,0.18)"
  },
  cityFade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.34)"
  },
  statusRow: {
    height: 22,
    marginTop: 16,
    marginHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  statusText: {
    color: t.text,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.2
  },
  systemIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  signalBar: {
    width: 3,
    height: 8,
    borderRadius: 1,
    backgroundColor: t.text
  },
  signalBarShort: {
    height: 4,
    opacity: 0.72
  },
  signalBarMid: {
    height: 6,
    opacity: 0.86
  },
  wifiIcon: {
    marginLeft: 2,
    color: t.text,
    fontSize: 12,
    fontWeight: "900"
  },
  batteryIcon: {
    width: 17,
    height: 8,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: t.text,
    padding: 1
  },
  batteryFill: {
    flex: 1,
    backgroundColor: t.text,
    borderRadius: 1
  },
  header: {
    minHeight: 43,
    marginTop: 8,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10
  },
  backButton: {
    height: 34,
    minWidth: 44,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.28)",
    backgroundColor: "rgba(5,10,24,0.56)",
    alignItems: "center",
    justifyContent: "center"
  },
  backText: {
    color: t.cyan,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8
  },
  identity: {
    flex: 1,
    minWidth: 0
  },
  title: {
    color: t.text,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  subtitle: {
    marginTop: 6,
    color: t.textDim,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  menuButton: {
    width: 34,
    height: 34,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.28)",
    backgroundColor: "rgba(5,10,24,0.56)",
    alignItems: "center",
    justifyContent: "center"
  },
  menuText: {
    color: t.cyan,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.8
  },
  innerScroll: {
    flex: 1
  },
  innerContent: {
    minHeight: 550,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    gap: 10
  },
  footer: {
    marginTop: 10,
    color: t.textMuted,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
    textTransform: "uppercase"
  },
  homeIndicator: {
    alignSelf: "center",
    marginTop: 8,
    width: 116,
    height: 4,
    borderRadius: 2,
    backgroundColor: t.text
  }
});

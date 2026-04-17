import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useGameStore } from "@/game/store";
import { BootScreen } from "@/screens/BootScreen";
import { IntroScreen } from "@/screens/IntroScreen";
import { LoginScreen } from "@/screens/LoginScreen";
import { ModulePage } from "@/screens/ModulePage";
import PirateOsHomeScreen from "@/screens/PirateOsHomeScreen";
import { SilkroadTerminal } from "@/screens/SilkroadTerminal";
import { SystemMenu } from "@/screens/SystemMenu";
import { Toast } from "@/screens/Toast";
import { TutorialOverlay } from "@/screens/TutorialOverlay";
import { DeckText, Scanlines } from "@/ui/primitives";
import { colors, spacing } from "@/ui/theme";

export default function GameApp() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <GameRoot />
    </SafeAreaProvider>
  );
}

function GameRoot() {
  const { state, hydrated, hydrate, marketTick, toast, clearToast, navigate, buyEnergy } = useGameStore();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") {
      return;
    }

    document.documentElement.style.backgroundColor = colors.voidBlack;
    document.body.style.backgroundColor = colors.voidBlack;
    document.body.style.margin = "0";
    document.body.style.minHeight = "100vh";
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!state.user) {
      return undefined;
    }

    const timer = setInterval(() => marketTick(), 45_000);
    return () => clearInterval(timer);
  }, [marketTick, state.user]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = setTimeout(clearToast, 3200);
    return () => clearTimeout(timer);
  }, [clearToast, toast]);

  if (!hydrated) {
    return (
      <SafeAreaView style={styles.root}>
        <Scanlines />
        <DeckText tone="cyan" style={styles.loading}>MOUNTING AG3NT_OS//PIRAT3 ...</DeckText>
      </SafeAreaView>
    );
  }

  if (state.game.currentScreen === "intro") {
    return <IntroScreen />;
  }

  if (state.game.currentScreen === "login") {
    return <LoginScreen />;
  }

  if (state.game.currentScreen === "boot") {
    return <BootScreen />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <Scanlines />
      <View style={styles.screen}>
        {state.game.currentScreen === "deck" ? (
          <PirateOsHomeScreen
            onOpenMenu={() => setMenuOpen(true)}
            onBuyEnergy={() => buyEnergy(6)}
            onEnterSilkroad={() => navigate("s1lkroad")}
          />
        ) : null}
        {state.game.currentScreen === "s1lkroad" ? <SilkroadTerminal openMenu={() => setMenuOpen(true)} /> : null}
        {state.game.currentScreen !== "deck" && state.game.currentScreen !== "s1lkroad" ? (
          <ModulePage screen={state.game.currentScreen} openMenu={() => setMenuOpen(true)} />
        ) : null}
      </View>
      <TutorialOverlay />
      {toast ? <Toast message={toast} /> : null}
      {menuOpen ? <SystemMenu close={() => setMenuOpen(false)} /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.voidBlack
  },
  screen: {
    flex: 1
  },
  loading: {
    margin: spacing.xl,
    fontSize: 16,
    letterSpacing: 1.4
  }
});

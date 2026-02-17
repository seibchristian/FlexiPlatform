import { ScrollView, Text, View, TouchableOpacity, Switch } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { router } from "expo-router";

export default function SettingsScreen() {
  const colors = useColors();
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsSections = [
    {
      title: "Verwaltung",
      items: [
        { label: "Drucker", route: "/settings/printers", icon: "🖨️" },
        { label: "Server", route: "/settings/server", icon: "🖥️" },
        { label: "Datenbank", route: "/settings/database", icon: "🗄️" },
      ],
    },
    {
      title: "Allgemein",
      items: [
        { label: "Sprache", value: "Deutsch", icon: "🌐" },
        { label: "Theme", value: "Auto", icon: "🎨" },
      ],
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/(tabs)/" as any);
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          <View className="gap-1">
            <Text className="text-2xl font-bold text-foreground">Einstellungen</Text>
            <Text className="text-sm text-muted">Verwalte Plattformeinstellungen</Text>
          </View>

          {/* Management Section */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground mb-2">Verwaltung</Text>
            {settingsSections[0].items.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between"
                onPress={() => {}}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">{item.icon}</Text>
                  <Text className="text-foreground font-medium">{item.label}</Text>
                </View>
                <Text className="text-muted">›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* General Settings */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground mb-2">Allgemein</Text>
            
            <View className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">🌐</Text>
                <Text className="text-foreground font-medium">Sprache</Text>
              </View>
              <Text className="text-muted">Deutsch</Text>
            </View>

            <View className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">🔔</Text>
                <Text className="text-foreground font-medium">Benachrichtigungen</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            <View className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">🎨</Text>
                <Text className="text-foreground font-medium">Dunkler Modus</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>

          {/* About Section */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground mb-2">Über</Text>
            
            <View className="bg-surface rounded-lg p-4 border border-border">
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-muted">Version</Text>
                  <Text className="text-foreground font-semibold">1.0.0</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-muted">Build</Text>
                  <Text className="text-foreground font-semibold">2026.02.17</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-primary font-semibold text-center">
                Datenschutz & Bedingungen
              </Text>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            className="bg-error px-4 py-3 rounded-lg mt-4"
            onPress={handleLogout}
          >
            <Text className="text-background font-semibold text-center">
              Abmelden
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

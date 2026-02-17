import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/hooks/use-auth";
import { router } from "expo-router";
import { useColors } from "@/hooks/use-colors";

export default function HomeScreen() {
  const { user, isAuthenticated, loading } = useAuth();
  const colors = useColors();

  if (loading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <ScreenContainer className="flex items-center justify-center gap-4">
        <Text className="text-2xl font-bold text-foreground">FlexiPlatform</Text>
        <Text className="text-base text-muted text-center">
          Bitte melden Sie sich an, um fortzufahren
        </Text>
        <TouchableOpacity
          className="bg-primary px-8 py-3 rounded-full mt-4"
          onPress={() => router.push("/(tabs)/" as any)}
        >
          <Text className="text-background font-semibold">Anmelden</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  const dashboardItems = [
    {
      id: "plugins",
      title: "Plugins",
      description: "Verwalte Plugins",
      icon: "🔌",
      route: "/plugins",
    },
    {
      id: "users",
      title: "Benutzer",
      description: "Benutzerverwaltung",
      icon: "👥",
      route: "/users",
    },
    {
      id: "printers",
      title: "Drucker",
      description: "Druckereinstellungen",
      icon: "🖨️",
      route: "/settings/printers",
    },
    {
      id: "server",
      title: "Server",
      description: "Servereinstellungen",
      icon: "🖥️",
      route: "/settings/server",
    },
    {
      id: "database",
      title: "Datenbank",
      description: "Datenbankeinstellungen",
      icon: "🗄️",
      route: "/settings/database",
    },
    {
      id: "settings",
      title: "Einstellungen",
      description: "Allgemeine Einstellungen",
      icon: "⚙️",
      route: "/settings",
    },
  ];

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Willkommen, {user?.name || "Benutzer"}!
            </Text>
            <Text className="text-base text-muted">
              Verwalten Sie Ihre Plattform und Plugins
            </Text>
          </View>

          {/* Dashboard Grid */}
          <View className="gap-3">
            {dashboardItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {}}
                className="bg-surface rounded-xl p-4 border border-border active:opacity-70"
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-3xl">{item.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-foreground">
                      {item.title}
                    </Text>
                    <Text className="text-sm text-muted">{item.description}</Text>
                  </View>
                  <Text className="text-xl text-muted">›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

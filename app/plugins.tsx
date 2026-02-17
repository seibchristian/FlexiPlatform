import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";

export default function PluginsScreen() {
  const colors = useColors();
  const [plugins, setPlugins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder: In Zukunft werden hier echte Plugins geladen
    setPlugins([
      { id: 1, name: "Analytics Plugin", version: "1.0.0", enabled: true, description: "Analytik und Reporting" },
      { id: 2, name: "Export Plugin", version: "2.1.0", enabled: true, description: "Datenexport in verschiedene Formate" },
      { id: 3, name: "Backup Plugin", version: "1.5.0", enabled: false, description: "Automatische Backups" },
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View className="gap-1">
              <Text className="text-2xl font-bold text-foreground">Plugins</Text>
              <Text className="text-sm text-muted">Verwalte installierte Plugins</Text>
            </View>
            <TouchableOpacity className="bg-primary px-4 py-2 rounded-lg">
              <Text className="text-background font-semibold text-sm">+ Hinzufügen</Text>
            </TouchableOpacity>
          </View>

          {/* Plugin List */}
          <View className="gap-2">
            {plugins.map((plugin) => (
              <View
                key={plugin.id}
                className="bg-surface rounded-xl p-4 border border-border"
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-foreground">
                      {plugin.name}
                    </Text>
                    <Text className="text-xs text-muted mt-1">v{plugin.version}</Text>
                  </View>
                  <View
                    className={`px-3 py-1 rounded-full ${
                      plugin.enabled ? "bg-success" : "bg-error"
                    }`}
                  >
                    <Text className="text-xs font-semibold text-white">
                      {plugin.enabled ? "Aktiv" : "Inaktiv"}
                    </Text>
                  </View>
                </View>
                <Text className="text-sm text-muted mb-3">{plugin.description}</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity className="flex-1 bg-primary px-3 py-2 rounded-lg">
                    <Text className="text-background font-semibold text-center text-sm">
                      {plugin.enabled ? "Deaktivieren" : "Aktivieren"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-border px-3 py-2 rounded-lg">
                    <Text className="text-foreground font-semibold text-center text-sm">
                      Einstellungen
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

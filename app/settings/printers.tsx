import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";

export default function PrintersSettingsScreen() {
  const colors = useColors();
  const [printers, setPrinters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPrinters([
      { id: 1, name: "Büro Drucker", ipAddress: "192.168.1.100", port: 9100, status: "online", model: "HP LaserJet Pro" },
      { id: 2, name: "Konferenzraum", ipAddress: "192.168.1.101", port: 9100, status: "offline", model: "Canon imageRUNNER" },
    ]);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-success";
      case "offline":
        return "bg-error";
      default:
        return "bg-warning";
    }
  };

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
          <View className="flex-row items-center justify-between">
            <View className="gap-1">
              <Text className="text-2xl font-bold text-foreground">Drucker</Text>
              <Text className="text-sm text-muted">Konfiguriere Drucker</Text>
            </View>
            <TouchableOpacity className="bg-primary px-4 py-2 rounded-lg">
              <Text className="text-background font-semibold text-sm">+ Hinzufügen</Text>
            </TouchableOpacity>
          </View>

          <View className="gap-2">
            {printers.map((printer) => (
              <View
                key={printer.id}
                className="bg-surface rounded-xl p-4 border border-border"
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-foreground">
                      {printer.name}
                    </Text>
                    <Text className="text-xs text-muted mt-1">{printer.model}</Text>
                    <Text className="text-xs text-muted mt-1">
                      {printer.ipAddress}:{printer.port}
                    </Text>
                  </View>
                  <View
                    className={`px-3 py-1 rounded-full ${getStatusColor(printer.status)}`}
                  >
                    <Text className="text-xs font-semibold text-white capitalize">
                      {printer.status}
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity className="flex-1 bg-primary px-3 py-2 rounded-lg">
                    <Text className="text-background font-semibold text-center text-sm">
                      Test
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-border px-3 py-2 rounded-lg">
                    <Text className="text-foreground font-semibold text-center text-sm">
                      Bearbeiten
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-error px-3 py-2 rounded-lg">
                    <Text className="text-background font-semibold text-center text-sm">
                      Löschen
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

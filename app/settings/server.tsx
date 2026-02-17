import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";

export default function ServerSettingsScreen() {
  const colors = useColors();
  const [serverAddress, setServerAddress] = useState("localhost");
  const [port, setPort] = useState("3000");
  const [status, setStatus] = useState("online");
  const [loading, setLoading] = useState(false);

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          <View className="gap-1">
            <Text className="text-2xl font-bold text-foreground">Server-Einstellungen</Text>
            <Text className="text-sm text-muted">Konfiguriere Serverparameter</Text>
          </View>

          {/* Status Card */}
          <View className="bg-surface rounded-xl p-4 border border-border">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-muted">Server-Status</Text>
                <Text className="text-lg font-semibold text-foreground mt-1">
                  {status === "online" ? "Online" : "Offline"}
                </Text>
              </View>
              <View
                className={`px-4 py-2 rounded-full ${
                  status === "online" ? "bg-success" : "bg-error"
                }`}
              >
                <Text className="text-white font-semibold text-sm">
                  {status === "online" ? "●" : "●"}
                </Text>
              </View>
            </View>
          </View>

          {/* Server Address */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Server-Adresse</Text>
            <TextInput
              value={serverAddress}
              onChangeText={setServerAddress}
              placeholder="localhost oder IP-Adresse"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor={colors.muted}
            />
          </View>

          {/* Port */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Port</Text>
            <TextInput
              value={port}
              onChangeText={setPort}
              placeholder="3000"
              keyboardType="number-pad"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor={colors.muted}
            />
          </View>

          {/* Action Buttons */}
          <View className="gap-2 mt-4">
            <TouchableOpacity
              className="bg-primary px-4 py-3 rounded-lg"
              onPress={() => setLoading(true)}
            >
              <Text className="text-background font-semibold text-center">
                Verbindung testen
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-border px-4 py-3 rounded-lg">
              <Text className="text-foreground font-semibold text-center">
                Speichern
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-warning px-4 py-3 rounded-lg">
              <Text className="text-white font-semibold text-center">
                Server neu starten
              </Text>
            </TouchableOpacity>
          </View>

          {/* Logs Section */}
          <View className="gap-2 mt-6">
            <Text className="text-sm font-semibold text-foreground">Aktuelle Logs</Text>
            <View className="bg-surface rounded-lg p-3 border border-border">
              <Text className="text-xs text-muted font-mono">
                [2026-02-17 12:00:00] Server gestartet{"\n"}
                [2026-02-17 12:00:05] Datenbank verbunden{"\n"}
                [2026-02-17 12:00:10] API bereit
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

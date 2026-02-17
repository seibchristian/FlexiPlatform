import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";

export default function DatabaseSettingsScreen() {
  const colors = useColors();
  const [dbType, setDbType] = useState("mysql");
  const [host, setHost] = useState("localhost");
  const [port, setPort] = useState("3306");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [database, setDatabase] = useState("");
  const [status, setStatus] = useState("disconnected");

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          <View className="gap-1">
            <Text className="text-2xl font-bold text-foreground">Datenbankeinstellungen</Text>
            <Text className="text-sm text-muted">Konfiguriere Datenbankverbindung</Text>
          </View>

          {/* Status Card */}
          <View className="bg-surface rounded-xl p-4 border border-border">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-muted">Verbindungsstatus</Text>
                <Text className="text-lg font-semibold text-foreground mt-1">
                  {status === "connected" ? "Verbunden" : "Getrennt"}
                </Text>
              </View>
              <View
                className={`px-4 py-2 rounded-full ${
                  status === "connected" ? "bg-success" : "bg-error"
                }`}
              >
                <Text className="text-white font-semibold text-sm">●</Text>
              </View>
            </View>
          </View>

          {/* Database Type */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Datenbanktyp</Text>
            <View className="flex-row gap-2">
              {["mysql", "postgresql", "sqlite"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setDbType(type)}
                  className={`flex-1 px-3 py-2 rounded-lg border ${
                    dbType === type
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`font-semibold text-center text-sm ${
                      dbType === type ? "text-background" : "text-foreground"
                    }`}
                  >
                    {type.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Host */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Host</Text>
            <TextInput
              value={host}
              onChangeText={setHost}
              placeholder="localhost"
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
              placeholder="3306"
              keyboardType="number-pad"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor={colors.muted}
            />
          </View>

          {/* Username */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Benutzername</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="root"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor={colors.muted}
            />
          </View>

          {/* Password */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Passwort</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Passwort"
              secureTextEntry
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor={colors.muted}
            />
          </View>

          {/* Database */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Datenbankname</Text>
            <TextInput
              value={database}
              onChangeText={setDatabase}
              placeholder="flexiplatform"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor={colors.muted}
            />
          </View>

          {/* Action Buttons */}
          <View className="gap-2 mt-4">
            <TouchableOpacity className="bg-primary px-4 py-3 rounded-lg">
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
                Backup erstellen
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

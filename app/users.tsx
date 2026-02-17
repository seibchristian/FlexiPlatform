import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";

export default function UsersScreen() {
  const colors = useColors();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder: In Zukunft werden hier echte Benutzer geladen
    setUsers([
      { id: 1, name: "Admin User", email: "admin@example.com", role: "admin" },
      { id: 2, name: "Editor User", email: "editor@example.com", role: "editor" },
      { id: 3, name: "Viewer User", email: "viewer@example.com", role: "viewer" },
    ]);
    setLoading(false);
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-error";
      case "editor":
        return "bg-warning";
      default:
        return "bg-border";
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
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View className="gap-1">
              <Text className="text-2xl font-bold text-foreground">Benutzer</Text>
              <Text className="text-sm text-muted">Verwalte Plattformbenutzer</Text>
            </View>
            <TouchableOpacity className="bg-primary px-4 py-2 rounded-lg">
              <Text className="text-background font-semibold text-sm">+ Neu</Text>
            </TouchableOpacity>
          </View>

          {/* User List */}
          <View className="gap-2">
            {users.map((user) => (
              <View
                key={user.id}
                className="bg-surface rounded-xl p-4 border border-border"
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-foreground">
                      {user.name}
                    </Text>
                    <Text className="text-xs text-muted mt-1">{user.email}</Text>
                  </View>
                  <View
                    className={`px-3 py-1 rounded-full ${getRoleColor(user.role)}`}
                  >
                    <Text className="text-xs font-semibold text-white capitalize">
                      {user.role}
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity className="flex-1 bg-primary px-3 py-2 rounded-lg">
                    <Text className="text-background font-semibold text-center text-sm">
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

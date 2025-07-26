import { useAuth } from "@/context/AuthContext";
import { H4, Text, YStack } from "tamagui";

export default function SettingsScreen() {
  const { user } = useAuth();
  return (
    <YStack gap="$2" alignItems="flex-start" width="100%" padding="$3">
      <H4>User Info</H4>
      <YStack gap="$2" padding="$4" width="100%" backgroundColor="#f0f0f0">
        <Text>Name: {user?.name}</Text>
        <Text>Email: {user?.email}</Text>
      </YStack>
    </YStack>
  );
}

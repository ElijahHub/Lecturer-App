import { AuthProvider } from "@/context/AuthContext";
import { ResetProvider } from "@/context/ResetContext";
import { defaultConfig } from "@tamagui/config/v4";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { createTamagui, TamaguiProvider } from "tamagui";

const config = createTamagui(defaultConfig);
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ResetProvider>
          <TamaguiProvider config={config}>
            <Stack
              initialRouteName="(tabs)"
              screenOptions={{ headerShown: false }}
            />
          </TamaguiProvider>
        </ResetProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

import { Header, Navbar } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { Separator, Spinner, YStack } from "tamagui";

export default function TabLayout() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token)
      setTimeout(() => {
        router.replace("/login");
      }, 1000);
  }, [token]);

  if (!token) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background" position="relative">
      <Header />
      <Separator />
      <YStack flex={1} paddingTop="$1">
        <Slot />
      </YStack>
      <Navbar />
    </YStack>
  );
}

import { BookOpen, Home, QrCode, Settings } from "@tamagui/lucide-icons";
import { usePathname, useRouter } from "expo-router";
import { Button, XStack } from "tamagui";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const active = (path: string) => (pathname === path ? "#333" : "white");

  return (
    <XStack
      backgroundColor="rgba(20, 20, 20, 0.2)"
      padding="$3"
      borderRadius="$6"
      justifyContent="space-around"
      alignItems="center"
      bottom={50}
      left="50%"
      transform="translate(-50%, 0)"
      width="94%"
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <Button
        backgroundColor={active("/") === "#333" ? "white" : "blue"}
        onPress={() => router.push("/")}
        icon={<Home color={active("/")} size={24} />}
      ></Button>
      <Button
        backgroundColor={active("/qrcode") === "#333" ? "white" : "blue"}
        onPress={() => router.push("/qrcode")}
        icon={<QrCode color={active("/qrcode")} size={24} />}
      ></Button>
      <Button
        backgroundColor={active("/attendance") === "#333" ? "white" : "blue"}
        onPress={() => router.push("/attendance")}
        icon={<BookOpen color={active("/attendance")} size={24} />}
      ></Button>
      <Button
        backgroundColor={active("/settings") === "#333" ? "white" : "blue"}
        onPress={() => router.push("/setting")}
        icon={<Settings color={active("/settings")} size={24} />}
      ></Button>
    </XStack>
  );
}

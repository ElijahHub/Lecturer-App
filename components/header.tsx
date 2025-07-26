import { useAuth } from "@/context/AuthContext";
import { LogOut } from "@tamagui/lucide-icons";
import { ImageSourcePropType } from "react-native";
import { Button, Image, Text, XStack } from "tamagui";

const logo: ImageSourcePropType = require("@/assets/images/afit_logo.png");

export default function Header() {
  const { logout } = useAuth();

  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      padding="$2"
      paddingTop="$3"
      paddingBottom="$1"
    >
      <XStack alignItems="center">
        <Image
          source={logo}
          width={40}
          height={40}
          alignSelf="flex-start"
          marginBottom="$4"
          marginTop="$5"
          alt="Logo"
          contain="contain"
          borderRadius={100}
        />
        <Text fontSize="$5" fontWeight="700" color="#0f172a" textAlign="center">
          Attendance App
        </Text>
      </XStack>
      <Button
        icon={<LogOut color="#333" />}
        backgroundColor="transparent"
        onPress={async () => await logout()}
        width={100}
        color="white"
        fontSize="$3"
      >
        Logout
      </Button>
    </XStack>
  );
}

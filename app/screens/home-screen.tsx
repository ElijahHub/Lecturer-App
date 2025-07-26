import { useAuth } from "@/context/AuthContext";
import { BookOpen, QrCode } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Card, Text, YStack } from "tamagui";

export default function HomeScreen() {
  const router = useRouter();

  const { user } = useAuth();

  return (
    <YStack
      gap="$4"
      alignItems="center"
      width="100%"
      padding="$5"
      paddingTop="$2"
    >
      <Text fontSize="$6" color="#334155" textAlign="center">
        Welcome {user?.name}!
      </Text>
      <Text fontSize="$4" color="#333" textAlign="center">
        What would you like to do today?
      </Text>
      <YStack width="100%" gap="$4" padding="$5" justifyContent="center">
        <Card
          backgroundColor="#dbeafe"
          width="100%"
          height={120}
          justifyContent="center"
          alignItems="center"
          borderRadius="$4"
          pressStyle={{ scale: 0.95 }}
          onPress={() => router.push("/qrcode")}
        >
          <QrCode color="#0F172A" size={40} />
          <Text marginTop="$2" fontSize="$5" color="#0F172A">
            Generate QRCode
          </Text>
        </Card>
        <Card
          backgroundColor="#dbeafe"
          width="100%"
          height={120}
          justifyContent="center"
          alignItems="center"
          borderRadius="$4"
          pressStyle={{ scale: 0.95 }}
          onPress={() => router.push("/attendance")}
        >
          <BookOpen color="#0F172A" size={40} />
          <Text marginTop="$2" fontSize="$5" color="#0F172A">
            Get Attendance
          </Text>
        </Card>
      </YStack>
    </YStack>
  );
}

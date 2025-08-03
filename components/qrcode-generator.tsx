import { Save, Share } from "@tamagui/lucide-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { useRef } from "react";
import { Alert, ImageSourcePropType } from "react-native";
import type QRCodeType from "react-native-qrcode-svg";
import QRCode from "react-native-qrcode-svg";
import { Button, Text, View, XStack, YStack } from "tamagui";

// Fix: Added correct typing import
type QRCodeTypes = QRCodeType & {
  toDataURL: (callback: (data: string) => void) => void;
};

// Fix: Image must be a local asset
const logo: ImageSourcePropType = require("@/assets/images/logo_nobg.png");

const getFileName = () => {
  const now = new Date();
  return `qr_${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()}_${now.getHours()}${now.getMinutes()}${now.getSeconds()}.png`;
};

export default function QRGenerator({ value }: { value: string }) {
  const qrRef = useRef<QRCodeTypes | null>(null);

  // ✅ Prevent crash if value is missing
  if (!value || value.trim() === "") {
    return (
      <YStack gap="$4" alignItems="center" padding="$4">
        <Text>Please enter a value to generate a QR code.</Text>
      </YStack>
    );
  }

  const handleSaveOrShare = async (action: "save" | "share") => {
    const filename = getFileName();
    const fileUri = FileSystem.documentDirectory + filename;

    qrRef.current?.toDataURL(async (dataURL: string) => {
      try {
        await FileSystem.writeAsStringAsync(fileUri, dataURL, {
          encoding: FileSystem.EncodingType.Base64,
        });

        if (action === "save") {
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status !== "granted") {
            return Alert.alert("Permission denied!", "Cannot save QR code.");
          }

          const asset = await MediaLibrary.createAssetAsync(fileUri);
          await MediaLibrary.createAlbumAsync("QR Codes", asset, false);
          Alert.alert("Success", "QR code saved to gallery.");
        } else {
          await Sharing.shareAsync(fileUri);
        }
      } catch (err) {
        console.error("Error saving or sharing QR code:", err);
        Alert.alert("Error", "Failed to process QR code.");
      }
    });
  };

  return (
    <YStack gap="$4" alignItems="center" padding="$4">
      <Text>Your QR Code</Text>

      <View style={{ backgroundColor: "white", padding: 8, borderRadius: 8 }}>
        <QRCode
          value={value}
          size={220}
          logo={logo}
          logoSize={50}
          logoBackgroundColor="transparent"
          getRef={(ref) => (qrRef.current = ref)}
        />
      </View>

      <XStack alignItems="center" justifyContent="center" gap="$4">
        <Button
          variant="outlined"
          backgroundColor="blue"
          color="white"
          theme="light"
          onPress={() => handleSaveOrShare("save")}
          icon={<Save size={20} color="white" />}
        >
          Save to Gallery
        </Button>
        <Button
          onPress={() => handleSaveOrShare("share")}
          icon={<Share size={20} />}
        >
          Share
        </Button>
      </XStack>
    </YStack>
  );
}

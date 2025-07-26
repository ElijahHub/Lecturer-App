import { QRGenerator } from "@/components";
import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useCourses } from "@/hooks";
import axios from "axios";
import * as Location from "expo-location";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert } from "react-native";
import { Button, Form, H4, Label, Select, Spinner, View } from "tamagui";

export default function QRCodePage() {
  const [qrCodeData, setQrCodeData] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<{ courseId: string }>({
    defaultValues: {
      courseId: "",
    },
    mode: "onChange",
  });

  const { data } = useCourses();
  const { user, token } = useAuth();

  const courseList = data
    ?.filter((course) => course.lecturersId.includes(user?.id as string))
    .map((course) => ({
      id: course.id,
      code: course.courseCode,
    }));

  const onSubmit = async (data: { courseId: string }) => {
    if (qrCodeData) return;
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location required",
          "Location permission is required to scan QR codes."
        );
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      const res = await axios.post(
        `${API_URL}/session/create`,
        {
          courseId: data.courseId,
          geolocationData: {
            latitude,
            longitude,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setQrCodeData(res.data.data.qrCode);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "An error occurred while creating the QR code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View alignItems="center" paddingTop="$5" flex={1}>
      <H4 fontSize={30} paddingBottom="$5" color="#fff">
        Generate QRcode
      </H4>

      <Form gap="$3">
        <Label htmlFor="courseId">Choose Course</Label>
        <Controller
          control={control}
          name="courseId"
          render={({ field: { onChange, value } }) => (
            <Select value={value} onValueChange={onChange}>
              <Select.Trigger width={240} />
              <Select.Content>
                {courseList?.map((course, i) => (
                  <Select.Item key={course.id} value={course.code} index={i}>
                    {course.code}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          )}
        />

        <Button
          variant="outlined"
          backgroundColor={isLoading ? "#9e9eff" : "blue"}
          color="white"
          theme="light"
          disabled={!isValid || isLoading}
          onPress={handleSubmit(onSubmit)}
          icon={isLoading ? <Spinner color="white" /> : undefined}
        >
          {isLoading ? "" : "Generate Code"}
        </Button>
      </Form>

      <QRGenerator value={qrCodeData} />
    </View>
  );
}

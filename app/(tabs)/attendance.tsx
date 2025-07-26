import { useAuth } from "@/context/AuthContext";
import { useCourses, useSessionAttendance } from "@/hooks";
import { AttendanceData, sessionFormSchema, SessionFormValues } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Form,
  H4,
  Label,
  ListItemFrame,
  Select,
  Spinner,
  Text,
  View,
} from "tamagui";

export default function AttendancePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceList, setAttendanceList] = useState<
    AttendanceData[] | undefined
  >(undefined);
  const [error, setError] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      courseId: "",
      date: new Date("2025-04-30").toISOString().split("T")[0],
    },
  });

  const { data } = useCourses();

  const { token, user } = useAuth();

  const courseList = data
    ?.filter((course) => course.lecturersId.includes(user?.id as string))
    .map((course) => ({
      id: course.id,
      code: course.courseCode,
    }));

  const onSubmit = async (dat: SessionFormValues) => {
    setIsLoading(true);
    setAttendanceList(undefined);
    try {
      const { data } = await useSessionAttendance(
        dat.courseId,
        dat.date,
        token as string
      );
      setAttendanceList(data);
    } catch (error: any) {
      if (error.response) {
        setError(
          `Error: ${
            error.response.data.message || "Failed to fetch attendance"
          }`
        );
      } else if (error.request) {
        setError("Network error. Please try again later.");
      } else {
        setError("Something went wrong.");
      }
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

        <Label htmlFor="data">Select Date</Label>
        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, value } }) => (
            <>
              <Button onPress={() => setShowDatePicker(true)}>{value}</Button>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(value)}
                  mode="date"
                  display="default"
                  onChange={(_, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      const newDate = new Date(selectedDate);
                      newDate.setFullYear(2025);
                      const formatted = newDate.toISOString().split("T")[0];
                      onChange(formatted);
                    }
                  }}
                />
              )}
            </>
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
          {isLoading ? "" : "Get Attendance"}
        </Button>
      </Form>

      {attendanceList ? (
        <View>
          {attendanceList.map((list) => (
            <ListItemFrame>
              <ListItemFrame>{list.matNumber}</ListItemFrame>
            </ListItemFrame>
          ))}
        </View>
      ) : (
        <Text>{error}</Text>
      )}
    </View>
  );
}

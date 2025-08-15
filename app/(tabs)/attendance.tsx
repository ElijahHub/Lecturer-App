import { useAuth } from "@/context/AuthContext";
import { useCourses, useSessionAttendance } from "@/hooks";
import { sessionFormSchema, SessionFormValues } from "@/types";
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
  const { token, user } = useAuth();
  const { data: coursesData } = useCourses();

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date("2025-04-30").toISOString().split("T")[0]
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      courseId: "",
      date: selectedDate,
    },
  });

  const courseList = coursesData
    ?.filter((course) => course.lecturersId.includes(user?.id as string))
    .map((course) => ({
      id: course.id,
      code: course.courseCode,
    }));

  // React Query hook for fetching attendance
  const {
    data: attendanceList,
    isLoading,
    refetch,
    isError,
    error,
  } = useSessionAttendance(selectedCourse, selectedDate, token as string);

  const onSubmit = (data: SessionFormValues) => {
    setSelectedCourse(data.courseId);
    setSelectedDate(data.date);
    refetch(); // trigger the query
  };

  return (
    <View alignItems="center" paddingTop="$5" flex={1}>
      <H4 fontSize={30} paddingBottom="$5" color="#000">
        Get Attendance
      </H4>

      <Form gap="$3">
        <Label htmlFor="courseId">Choose Course</Label>
        <Controller
          control={control}
          name="courseId"
          render={({ field: { onChange, value } }) => (
            <Select value={value} onValueChange={onChange}>
              <Select.Trigger width={240}>
                <Select.Value placeholder="Select a course" />
              </Select.Trigger>
              <Select.Content>
                {courseList?.map((course, i) => (
                  <Select.Item key={course.id} value={course.id} index={i}>
                    <Select.ItemText>{course.code}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          )}
        />

        <Label htmlFor="date">Select Date</Label>
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
                      const formatted = selectedDate
                        .toISOString()
                        .split("T")[0];
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

      {attendanceList && attendanceList.length > 0 ? (
        <View marginTop="$5">
          {attendanceList.map((item) => (
            <ListItemFrame key={item.matNumber} padding="$2">
              <Text>
                {item.name} - {item.matNumber}
              </Text>
            </ListItemFrame>
          ))}
        </View>
      ) : (
        !isLoading && <Text>No attendance found.</Text>
      )}
    </View>
  );
}

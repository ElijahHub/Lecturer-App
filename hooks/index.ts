import { API_URL } from "@/config";
import { AttendanceData, Course } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async (): Promise<Course[]> => {
      const response = await axios.get(`${API_URL}/courses`);
      return response.data.data;
    },
    refetchOnWindowFocus: false,
  });
}

export function useCourse(courseCode: string) {
  return useQuery({
    queryKey: ["course", courseCode],
    queryFn: async (): Promise<Course> => {
      const response = await axios.get(`${API_URL}/courses/${courseCode}`);
      return response.data.data;
    },
    enabled: !!courseCode,
    refetchOnWindowFocus: false,
  });
}

export function useSessionAttendance(
  courseId: string,
  date: string,
  token: string
) {
  return useQuery({
    queryKey: ["sessionAttendance", courseId, date],
    queryFn: async (): Promise<AttendanceData[]> => {
      try {
        const response = await axios.get<{ data: AttendanceData[] }>(
          `${API_URL}/attendance/session`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              courseId,
              date,
            },
          }
        );

        return response.data.data;
      } catch (err) {
        console.error("Failed to fetch session attendance:", err);
        throw err;
      }
    },
    enabled: !!courseId && !!date,
    refetchOnWindowFocus: false,
  });
}

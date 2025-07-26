import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  email: string | null;
  login: (params: {
    email: string;
    password: string;
  }) => Promise<
    { status: "success" } | { status: "change-password"; userId: string }
  >;
  logout(): Promise<void>;
  changePassword: ({
    password,
    confirmPassword,
  }: {
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
}

export const LoginSchema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string(),
});

export type LoginValues = z.infer<typeof LoginSchema>;

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase letter and one number"
      ),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ResetPasswordValues = z.infer<typeof ResetPasswordSchema>;

export const ResetCodeSchema = z.object({
  code: z
    .string()
    .min(6, "Code sent is a six digit number")
    .max(6, "Code Sent is a six digit number"),
});

export type ResetCodeValue = z.infer<typeof ResetCodeSchema>;

export interface ResetContextType {
  email: string | null;
  setEmail: (email: string) => void;

  isVerified: boolean;
  setIsVerified: (verified: boolean) => void;

  sendResetCode: (email: string) => Promise<void>;
  verifyResetCode: (email: string, code: string) => Promise<void>;
  resetPassword: (
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
}

export interface Responses {
  success: boolean;
  message: string;
}

export interface AttendanceData {
  date: any;
  matNumber: string;
  name: string;
}

export interface Course {
  id: string;
  courseName: string;
  courseCode: string;
  description?: string;
  lecturersId: string[];
}

export interface SessionData {
  courseId: string;
  geolocationData: {
    latitude: number;
    longitude: number;
  };
}

export const sessionFormSchema = z.object({
  courseId: z.string().nonempty("Course is required"),
  date: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: "Date must be in YYYY-MM-DD format",
  }),
});

export type SessionFormValues = z.infer<typeof sessionFormSchema>;

export interface DecodedToken {
  _id: string;
  name: string;
  email: string;
}

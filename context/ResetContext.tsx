import { API_URL } from "@/config";
import { ResetContextType } from "@/types";
import axios from "axios";
import { createContext, useContext, useState } from "react";

const ResetContext = createContext<ResetContextType | undefined>(undefined);

export const ResetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [email, setEmail] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const sendResetCode = async (email: string) => {
    await axios.post(`${API_URL}/forgot-password`, { email });
  };

  const verifyResetCode = async (email: string, code: string) => {
    await axios.post(`${API_URL}/verify-reset-code`, { email, code });
    setIsVerified(true);
  };

  const resetPassword = async (
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    await axios.post(`${API_URL}/reset-password`, {
      email,
      newPassword: password,
      confirmNewPassword: confirmPassword,
    });
  };

  return (
    <ResetContext.Provider
      value={{
        email,
        setEmail,
        isVerified,
        setIsVerified,
        sendResetCode,
        verifyResetCode,
        resetPassword,
      }}
    >
      {children}
    </ResetContext.Provider>
  );
};

export function useReset() {
  const context = useContext(ResetContext);
  if (!context) {
    throw new Error("useReset must be used within a ResetProvider");
  }
  return context;
}

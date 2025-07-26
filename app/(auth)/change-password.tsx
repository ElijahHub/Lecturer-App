import { FormWrapper } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { ResetPasswordSchema, ResetPasswordValues } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Form, Input, Spinner, Text, YStack } from "tamagui";

export default function ChangePassword() {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  const { changePassword } = useAuth();

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordValues) => {
    setIsLoading(true);
    setError("");
    try {
      await changePassword(data);
      router.push("/");
    } catch (error) {
      setError("error : Something went wrong");
      console.error("Change password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper logo={false} title="Change Password">
      <Form gap="$3">
        <Text fontSize={14} textAlign="center" paddingVertical="$2">
          Change Default Password to Continue
        </Text>
        {error !== "" && (
          <Text color="$red10" textAlign="center">
            {error}
          </Text>
        )}
        <Controller
          control={control}
          name="password"
          rules={{ required: "Password is required" }}
          render={({ field: { onChange, value } }) => (
            <YStack>
              <YStack position="relative" width="100%">
                <Input
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  backgroundColor="rgba(200,200,200,0.5)"
                  placeholderTextColor={"light"}
                  value={value.trim()}
                  onChangeText={onChange}
                  paddingRight="$6"
                />
                <Button
                  position="absolute"
                  right="$2"
                  top="50%"
                  zIndex={1}
                  size="$2"
                  chromeless
                  elevate={false}
                  circular
                  onPress={() => setShowPassword((prev) => !prev)}
                  icon={showPassword ? EyeOff : Eye}
                  style={{ transform: [{ translateY: -12 }] }}
                />
              </YStack>
              {errors.password && (
                <Text fontSize={12} paddingLeft="$2" textAlign="left">
                  {errors.password.message}
                </Text>
              )}
            </YStack>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "Confirm Password is required",
            validate: (value) => value === password || "Passwords do not match",
          }}
          render={({ field: { onChange, value } }) => (
            <YStack>
              <YStack position="relative" width="100%">
                <Input
                  placeholder="Confirm Password"
                  secureTextEntry={!showPassword}
                  backgroundColor="rgba(200,200,200,0.5)"
                  placeholderTextColor={"light"}
                  value={value.trim()}
                  onChangeText={onChange}
                  paddingRight="$6"
                />
                <Button
                  position="absolute"
                  right="$2"
                  top="50%"
                  zIndex={1}
                  size="$2"
                  chromeless
                  elevate={false}
                  circular
                  onPress={() => setShowPassword((prev) => !prev)}
                  icon={showPassword ? <EyeOff /> : <Eye />}
                  style={{ transform: [{ translateY: -12 }] }}
                />
              </YStack>
              {errors.confirmPassword && (
                <Text fontSize={12} paddingLeft="$2" textAlign="left">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </YStack>
          )}
        />
        <Button
          variant="outlined"
          backgroundColor={isLoading ? "#9e9eff" : "blue"}
          color="white"
          theme="light"
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid || isLoading}
          icon={isLoading ? <Spinner color="white" /> : undefined}
        >
          {isLoading ? "" : "Login"}
        </Button>
      </Form>
    </FormWrapper>
  );
}

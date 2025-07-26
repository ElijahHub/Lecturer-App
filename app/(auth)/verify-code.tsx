import { FormWrapper } from "@/components";
import { useReset } from "@/context/ResetContext";
import { ResetCodeSchema, ResetCodeValue } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Form, Input, Spinner, Text, XStack, YStack } from "tamagui";

export default function VerifyCode() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetCodeValue>({
    resolver: zodResolver(ResetCodeSchema),
    mode: "onSubmit",
    defaultValues: {
      code: "",
    },
  });

  const router = useRouter();

  const { verifyResetCode, email } = useReset();

  const onSubmit = async (data: ResetCodeValue) => {
    setIsLoading(true);
    setError("");
    try {
      await verifyResetCode(email!, data.code);
      router.push("/reset-password");
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper logo={false} title="Reset Password">
      <Form gap="$3">
        <Text fontSize={14} textAlign="center" paddingVertical="$2">
          Enter your email address below to reset password
        </Text>
        {error !== "" && (
          <Text color="$red10" textAlign="center">
            {error}
          </Text>
        )}
        <Controller
          control={control}
          name="code"
          rules={{ required: "Email Address is required" }}
          render={({ field: { onChange, value } }) => (
            <YStack>
              <Input
                placeholder="Email Address"
                backgroundColor="rgba(200,200,200,0.5)"
                placeholderTextColor={"light"}
                value={value.trim()}
                onChangeText={onChange}
              />
              {errors.code && (
                <Text fontSize={12} paddingLeft="$2" textAlign="left">
                  {errors.code.message}
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
          {isLoading ? "" : "Reset Password"}
        </Button>
      </Form>
      <XStack justifyContent="center" marginTop="$4">
        <Text color="#444">Login Instead </Text>
        <Link href="/login" push>
          <Text color="#6e4eff" fontWeight="bold">
            Login
          </Text>
        </Link>
      </XStack>
    </FormWrapper>
  );
}

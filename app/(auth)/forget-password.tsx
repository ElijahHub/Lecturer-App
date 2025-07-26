import { FormWrapper } from "@/components";
import { useReset } from "@/context/ResetContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Form, Input, Spinner, Text, XStack, YStack } from "tamagui";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Invalid Email Address"),
});

export default function ForgetPassword() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<{ email: string }>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();

  const { sendResetCode } = useReset();

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    setError("");
    try {
      await sendResetCode(data.email);
      router.push("/verify-code");
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
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
          name="email"
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
              {errors.email && (
                <Text fontSize={12} paddingLeft="$2" textAlign="left">
                  {errors.email.message}
                </Text>
              )}
            </YStack>
          )}
        />
        <Button
          variant="outlined"
          backgroundColor={loading ? "#9e9eff" : "blue"}
          color="white"
          theme="light"
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid || loading}
          icon={loading ? <Spinner color="white" size="large" /> : undefined}
        >
          {loading ? "" : "Reset Password"}
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

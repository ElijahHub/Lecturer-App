import { FormWrapper } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { LoginSchema, LoginValues } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "@tamagui/lucide-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Form, Input, Spinner, Text, XStack, YStack } from "tamagui";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const { login } = useAuth();

  const onSubmit = async (data: LoginValues) => {
    setError("");
    setIsLoading(true);
    try {
      const result = await login(data);

      if (result.status === "change-password")
        router.push({
          pathname: "/change-password",
          params: { email: data.email },
        });
      else router.push("/");
    } catch (error) {
      setError("Invalid email or password");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper title="WELCOME BACK!" logo={true}>
      <Form gap="$3">
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
                <Text color="red">{errors.password.message}</Text>
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
      <XStack justifyContent="flex-end" marginTop="$4">
        <Link href="/forget-password" push>
          <Text color="#6e4eff" fontWeight="bold">
            Forget Password
          </Text>
        </Link>
      </XStack>
    </FormWrapper>
  );
}

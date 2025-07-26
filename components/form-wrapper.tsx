import { ImageSourcePropType } from "react-native";
import { H4, Image, YStack } from "tamagui";
import ScreenWrapper from "./screen-wrapper";

const logoImg: ImageSourcePropType = require("@/assets/images/afit_logo.png");

export default function FormWrapper({
  logo,
  children,
  title,
}: {
  logo: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <ScreenWrapper>
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="white"
        padding="$4"
      >
        <YStack
          width={300}
          background="white"
          borderRadius="$4"
          padding="$4"
          paddingTop="$2"
          shadowColor="#ccc"
          shadowRadius={10}
          borderColor="gray"
        >
          {logo && (
            <Image
              source={logoImg}
              width={90}
              height={90}
              alignSelf="center"
              marginBottom="$2"
              alt="Logo"
              contain="contain"
            />
          )}

          <H4 textAlign="center" color="#111" marginBottom="$2">
            {title}
          </H4>
          {children}
        </YStack>
      </YStack>
    </ScreenWrapper>
  );
}

import { COLORS } from "@/constants/Colors";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from "react-native-safe-area-context";

const StackLayout = () => {
	const insets = useSafeAreaInsets();
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {
					paddingTop: insets.top,
					backgroundColor: COLORS.background,
				},
			}}
		></Stack>
	);
};

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<StatusBar style="light" />
			<StackLayout></StackLayout>
		</SafeAreaProvider>
	);
}

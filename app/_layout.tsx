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
				headerStyle: {
					backgroundColor: COLORS.background,
				},
				animation: "none",
			}}
		>
			<Stack.Screen
				name="(auth)"
				options={{
					animation: "none",
				}}
			/>
			<Stack.Screen
				name="(tabs)"
				options={{
					animation: "fade",
					animationDuration: 1000,
				}}
			/>
		</Stack>
	);
};

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<StatusBar style="auto" />
			<StackLayout></StackLayout>
		</SafeAreaProvider>
	);
}

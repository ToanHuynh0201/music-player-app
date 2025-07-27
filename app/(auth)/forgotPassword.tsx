import CustomTextInput from "@/components/CustomTextInput";
import { COLORS, GRADIENTS } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
	Animated,
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const { height, width } = Dimensions.get("window");

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);

	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(30)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: true,
			}),
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 800,
				useNativeDriver: true,
			}),
		]).start();
	}, []);

	const handleSubmit = async () => {
		setIsProcessing(true);
	};

	return (
		<LinearGradient
			colors={GRADIENTS.playerBackground}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			{/* Your forgot password content goes here */}
			<Animated.View
				style={[
					styles.content,
					{
						opacity: fadeAnim,
						transform: [{ translateY: slideAnim }],
					},
				]}
			>
				{/* Header */}
				<View style={styles.header}>
					<View style={styles.logoContainer}>
						<View style={styles.logo}>
							<Text style={styles.logoText}>♪</Text>
						</View>
					</View>
					<Text style={styles.title}>Forgot Password</Text>
					<Text style={styles.subtitle}>
						Enter your email to reset your password
					</Text>
				</View>

				{/* Form */}
				<View style={styles.form}>
					{/* Email Input */}
					{!isProcessing ? (
						<CustomTextInput
							label="Email"
							value={email}
							onChangeText={setEmail}
							placeholder="Enter your email"
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
						/>
					) : (
						<CustomTextInput
							label="OTP"
							value={otp}
							onChangeText={setOtp}
							placeholder="Enter OTP sent to your email"
							keyboardType="numeric"
							autoCapitalize="none"
							autoCorrect={false}
						/>
					)}

					<TouchableOpacity
						style={[
							styles.submitButton,
							isLoading && styles.submitButtonDisabled,
						]}
						onPress={handleSubmit}
						disabled={isLoading}
					>
						<LinearGradient
							colors={GRADIENTS.primaryButton}
							style={styles.submitButtonGradient}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
						>
							<Text style={styles.submitButtonText}>
								{isLoading ? "Processing..." : "Continue"}
							</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>
			</Animated.View>
		</LinearGradient>
	);
};

export default ForgotPassword;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 24,
		paddingVertical: 24,
	},
	content: {
		width: "100%",
		maxWidth: 400,
		alignSelf: "center",
	},
	header: {
		alignItems: "center",
		marginBottom: 40,
	},
	logoContainer: {
		marginBottom: 24,
	},
	logo: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: COLORS.surface,
		borderWidth: 2,
		borderColor: COLORS.primary,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: COLORS.primary,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	logoText: {
		fontSize: 32,
		color: COLORS.primary,
		fontWeight: "bold",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: COLORS.textPrimary,
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: COLORS.textSecondary,
		textAlign: "center",
	},
	form: {
		marginBottom: 32,
	},
	submitButton: {
		borderRadius: 12,
		overflow: "hidden",
		marginBottom: 24,
		shadowColor: COLORS.primary,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	submitButtonDisabled: {
		opacity: 0.7,
	},
	submitButtonGradient: {
		paddingVertical: 16,
		alignItems: "center",
	},
	submitButtonText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "bold",
	},
});

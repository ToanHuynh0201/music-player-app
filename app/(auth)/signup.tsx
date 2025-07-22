import CustomTextInput from "@/components/CustomTextInput";
import { COLORS, GRADIENTS, getColorWithOpacity } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
	Alert,
	Animated,
	Dimensions,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const SignUpScreen = () => {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [agreeToTerms, setAgreeToTerms] = useState(false);

	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(30)).current;

	React.useEffect(() => {
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

	const validateForm = () => {
		if (!fullName.trim()) {
			Alert.alert("Error", "Please enter your full name");
			return false;
		}

		if (!email || !email.includes("@")) {
			Alert.alert("Error", "Please enter a valid email address");
			return false;
		}

		if (password.length < 6) {
			Alert.alert("Error", "Password must be at least 6 characters long");
			return false;
		}

		if (password !== confirmPassword) {
			Alert.alert("Error", "Passwords do not match");
			return false;
		}

		if (!agreeToTerms) {
			Alert.alert(
				"Error",
				"Please agree to Terms of Service and Privacy Policy"
			);
			return false;
		}

		return true;
	};

	const handleSignUp = async () => {
		if (!validateForm()) return;

		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			Alert.alert(
				"Success!",
				"Account created successfully. Please check your email to verify your account.",
				[
					{
						text: "OK",
						onPress: () => router.replace("/login"),
					},
				]
			);
		}, 2000);
	};

	const handleSocialSignUp = (provider: string) => {
		Alert.alert(
			"Social Sign Up",
			`Sign up with ${provider} will be implemented soon.`
		);
	};

	const handleBackToLogin = () => {
		router.replace("/(auth)/login");
	};

	const getPasswordStrength = (password: string) => {
		if (password.length === 0)
			return { strength: 0, text: "", color: COLORS.textSecondary };
		if (password.length < 4)
			return { strength: 1, text: "Weak", color: COLORS.error };
		if (password.length < 8)
			return { strength: 2, text: "Medium", color: COLORS.warning };
		if (
			password.length >= 8 &&
			/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
		) {
			return { strength: 3, text: "Strong", color: COLORS.success };
		}
		return { strength: 2, text: "Medium", color: COLORS.warning };
	};

	const passwordStrength = getPasswordStrength(password);

	return (
		<LinearGradient
			colors={GRADIENTS.playerBackground}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			<KeyboardAvoidingView
				style={styles.keyboardContainer}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContainer}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<Animated.View
						style={[
							styles.content,
							{
								opacity: fadeAnim,
								transform: [{ translateY: slideAnim }],
							},
						]}
					>
						{/* Back Button */}
						<TouchableOpacity
							style={styles.backButton}
							onPress={handleBackToLogin}
						>
							<Text style={styles.backButtonText}>‹ Back</Text>
						</TouchableOpacity>

						{/* Header */}
						<View style={styles.header}>
							<View style={styles.logoContainer}>
								<View style={styles.logo}>
									<Text style={styles.logoText}>♪</Text>
								</View>
							</View>
							<Text style={styles.title}>Create Account</Text>
							<Text style={styles.subtitle}>
								Join MusicFlow and discover your sound
							</Text>
						</View>

						{/* Form */}
						<View style={styles.form}>
							{/* Full Name Input */}
							<CustomTextInput
								label="Full Name"
								value={fullName}
								onChangeText={setFullName}
								placeholder="Enter your full name"
								autoCapitalize="words"
								autoCorrect={false}
							/>

							{/* Email Input */}
							<CustomTextInput
								label="Email"
								value={email}
								onChangeText={setEmail}
								placeholder="Enter your email"
								keyboardType="email-address"
								autoCapitalize="none"
								autoCorrect={false}
							/>

							{/* Password Input */}
							<CustomTextInput
								label="Password"
								value={password}
								onChangeText={setPassword}
								placeholder="Create a password"
								hasPasswordToggle={true}
								showPassword={showPassword}
								onTogglePassword={() =>
									setShowPassword(!showPassword)
								}
								autoCapitalize="none"
							/>

							{/* Confirm Password Input */}
							<CustomTextInput
								label="Confirm Password"
								value={confirmPassword}
								onChangeText={setConfirmPassword}
								placeholder="Confirm your password"
								hasPasswordToggle={true}
								showPassword={showConfirmPassword}
								onTogglePassword={() =>
									setShowConfirmPassword(!showConfirmPassword)
								}
								autoCapitalize="none"
								isValid={
									confirmPassword.length > 0 &&
									password === confirmPassword
								}
								errorMessage={
									confirmPassword.length > 0 &&
									password !== confirmPassword
										? "Passwords do not match"
										: undefined
								}
							/>

							{/* Terms Agreement */}
							<TouchableOpacity
								style={styles.termsContainer}
								onPress={() => setAgreeToTerms(!agreeToTerms)}
							>
								<View
									style={[
										styles.checkbox,
										agreeToTerms && styles.checkboxChecked,
									]}
								>
									{agreeToTerms && (
										<Text style={styles.checkmark}>✓</Text>
									)}
								</View>
								<View style={styles.termsText}>
									<Text style={styles.termsTextNormal}>
										I agree to the{" "}
									</Text>
									<TouchableOpacity>
										<Text style={styles.termsTextLink}>
											Terms of Service
										</Text>
									</TouchableOpacity>
									<Text style={styles.termsTextNormal}>
										{" "}
										and{" "}
									</Text>
									<TouchableOpacity>
										<Text style={styles.termsTextLink}>
											Privacy Policy
										</Text>
									</TouchableOpacity>
								</View>
							</TouchableOpacity>

							{/* Sign Up Button */}
							<TouchableOpacity
								style={[
									styles.signUpButton,
									isLoading && styles.signUpButtonDisabled,
								]}
								onPress={handleSignUp}
								disabled={isLoading}
							>
								<LinearGradient
									colors={GRADIENTS.primaryButton}
									style={styles.signUpButtonGradient}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 0 }}
								>
									<Text style={styles.signUpButtonText}>
										{isLoading
											? "Creating Account..."
											: "Create Account"}
									</Text>
								</LinearGradient>
							</TouchableOpacity>

							{/* Divider */}
							<View style={styles.divider}>
								<View style={styles.dividerLine} />
								<Text style={styles.dividerText}>
									or sign up with
								</Text>
								<View style={styles.dividerLine} />
							</View>

							{/* Social Sign Up Buttons */}
							<View style={styles.socialContainer}>
								<TouchableOpacity
									style={styles.socialButton}
									onPress={() => handleSocialSignUp("Google")}
								>
									<Text style={styles.socialButtonText}>
										Google
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.socialButton}
									onPress={() => handleSocialSignUp("Apple")}
								>
									<Text style={styles.socialButtonText}>
										Apple
									</Text>
								</TouchableOpacity>
							</View>

							{/* Password Requirements */}
							<View style={styles.passwordRequirements}>
								<Text style={styles.requirementsTitle}>
									Password Requirements:
								</Text>
								<Text style={styles.requirementItem}>
									• At least 6 characters
								</Text>
								<Text style={styles.requirementItem}>
									• Mix of letters and numbers for better
									security
								</Text>
							</View>
						</View>

						{/* Login Link */}
						<View style={styles.footer}>
							<Text style={styles.footerText}>
								Already have an account?{" "}
							</Text>
							<TouchableOpacity onPress={handleBackToLogin}>
								<Text style={styles.loginText}>Sign In</Text>
							</TouchableOpacity>
						</View>
					</Animated.View>
				</ScrollView>
			</KeyboardAvoidingView>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	keyboardContainer: {
		flex: 1,
	},
	scrollContainer: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingVertical: 40,
	},
	content: {
		width: "100%",
		maxWidth: 400,
		alignSelf: "center",
	},
	backButton: {
		alignSelf: "flex-start",
		padding: 8,
		marginBottom: 20,
	},
	backButtonText: {
		fontSize: 18,
		color: COLORS.primary,
		fontWeight: "500",
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
	inputContainer: {
		marginBottom: 20,
	},
	inputLabel: {
		fontSize: 14,
		color: COLORS.textPrimary,
		marginBottom: 8,
		fontWeight: "500",
	},
	inputWrapper: {
		position: "relative",
	},
	input: {
		backgroundColor: COLORS.surface,
		borderWidth: 1,
		borderColor: COLORS.border,
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 16,
		color: COLORS.textPrimary,
		fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
	},
	eyeButton: {
		position: "absolute",
		right: 16,
		top: 14,
		padding: 4,
	},
	eyeText: {
		fontSize: 18,
	},
	passwordStrength: {
		marginTop: 8,
		flexDirection: "row",
		alignItems: "center",
	},
	strengthBar: {
		flex: 1,
		height: 4,
		backgroundColor: COLORS.border,
		borderRadius: 2,
		marginRight: 12,
		overflow: "hidden",
	},
	strengthFill: {
		height: "100%",
		borderRadius: 2,
	},
	strengthText: {
		fontSize: 12,
		fontWeight: "500",
	},
	passwordMatch: {
		marginTop: 6,
	},
	matchText: {
		fontSize: 12,
		fontWeight: "500",
	},
	termsContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 24,
		paddingHorizontal: 4,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderWidth: 2,
		borderColor: COLORS.border,
		borderRadius: 4,
		marginRight: 12,
		marginTop: 2,
		justifyContent: "center",
		alignItems: "center",
	},
	checkboxChecked: {
		backgroundColor: COLORS.primary,
		borderColor: COLORS.primary,
	},
	checkmark: {
		color: COLORS.textPrimary,
		fontSize: 12,
		fontWeight: "bold",
	},
	termsText: {
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
	},
	termsTextNormal: {
		fontSize: 14,
		color: COLORS.textSecondary,
		lineHeight: 20,
	},
	termsTextLink: {
		fontSize: 14,
		color: COLORS.primary,
		fontWeight: "500",
		lineHeight: 20,
	},
	signUpButton: {
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
	signUpButtonDisabled: {
		opacity: 0.7,
	},
	signUpButtonGradient: {
		paddingVertical: 16,
		alignItems: "center",
	},
	signUpButtonText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "bold",
	},
	divider: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 24,
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: COLORS.border,
	},
	dividerText: {
		color: COLORS.textSecondary,
		fontSize: 14,
		marginHorizontal: 16,
	},
	socialContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 24,
	},
	socialButton: {
		flex: 1,
		backgroundColor: COLORS.surface,
		borderWidth: 1,
		borderColor: COLORS.border,
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
		marginHorizontal: 6,
	},
	socialButtonText: {
		color: COLORS.textPrimary,
		fontSize: 14,
		fontWeight: "500",
	},
	passwordRequirements: {
		backgroundColor: getColorWithOpacity(COLORS.primary, 0.05),
		borderRadius: 8,
		padding: 12,
		marginBottom: 16,
	},
	requirementsTitle: {
		fontSize: 12,
		fontWeight: "600",
		color: COLORS.textPrimary,
		marginBottom: 6,
	},
	requirementItem: {
		fontSize: 11,
		color: COLORS.textSecondary,
		marginBottom: 2,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	footerText: {
		color: COLORS.textSecondary,
		fontSize: 14,
	},
	loginText: {
		color: COLORS.primary,
		fontSize: 14,
		fontWeight: "bold",
	},
});

export default SignUpScreen;

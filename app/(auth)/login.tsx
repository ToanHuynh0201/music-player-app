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
import Modal from "react-native-modal";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isGoogleModalVisible, setIsGoogleModalVisible] = useState(false);

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

	const handleLogin = async () => {
		// if (!email || !password) {
		// 	Alert.alert("Error", "Please fill in all fields");
		// 	return;
		// }

		// if (!email.includes("@")) {
		// 	Alert.alert("Error", "Please enter a valid email address");
		// 	return;
		// }

		// setIsLoading(true);

		// // Simulate API call
		// setTimeout(() => {
		// 	setIsLoading(false);
		// 	// Simple validation (in real app, this would be actual authentication)
		// 	if (
		// 		email.toLowerCase().includes("test") ||
		// 		email.toLowerCase().includes("demo")
		// 	) {
		// 		// Navigate to main app (you can replace this with your main tabs)
		// 		router.replace("/(tabs)/home");
		// 	} else {
		// 		Alert.alert(
		// 			"Login Failed",
		// 			'Please use a test email or try "demo@example.com"'
		// 		);
		// 	}
		// }, 1500);
		router.replace("/(tabs)/home");
	};

	const handleForgotPassword = () => {
		Alert.alert(
			"Forgot Password",
			"Password reset link will be sent to your email."
		);
	};

	const handleSocialLogin = (provider: string) => {
		if (provider === "Google") {
			setIsGoogleModalVisible(true);
		} else {
			Alert.alert(
				"Social Login",
				`Login with ${provider} will be implemented soon.`
			);
		}
	};

	const handleGoogleLogin = () => {
		setIsGoogleModalVisible(false);
		// Thực hiện logic đăng nhập Google ở đây
		Alert.alert("Google Login", "Đang thực hiện đăng nhập với Google...");
	};

	const handleSignUp = () => {
		router.push("/signup");
	};

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
						{/* Header */}
						<View style={styles.header}>
							<View style={styles.logoContainer}>
								<View style={styles.logo}>
									<Text style={styles.logoText}>♪</Text>
								</View>
							</View>
							<Text style={styles.title}>Welcome Back</Text>
							<Text style={styles.subtitle}>
								Sign in to continue listening
							</Text>
						</View>

						{/* Form */}
						<View style={styles.form}>
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
								placeholder="Enter your password"
								hasPasswordToggle={true}
								showPassword={showPassword}
								onTogglePassword={() =>
									setShowPassword(!showPassword)
								}
								autoCapitalize="none"
								containerStyle={{ marginBottom: 10 }} // Custom style nếu cần
							/>

							{/* Forgot Password */}
							<TouchableOpacity onPress={handleForgotPassword}>
								<Text style={styles.forgotPassword}>
									Forgot Password?
								</Text>
							</TouchableOpacity>

							{/* Login Button */}
							<TouchableOpacity
								style={[
									styles.loginButton,
									isLoading && styles.loginButtonDisabled,
								]}
								onPress={handleLogin}
								disabled={isLoading}
							>
								<LinearGradient
									colors={GRADIENTS.primaryButton}
									style={styles.loginButtonGradient}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 0 }}
								>
									<Text style={styles.loginButtonText}>
										{isLoading
											? "Signing In..."
											: "Sign In"}
									</Text>
								</LinearGradient>
							</TouchableOpacity>

							{/* Divider */}
							<View style={styles.divider}>
								<View style={styles.dividerLine} />
								<Text style={styles.dividerText}>
									or continue with
								</Text>
								<View style={styles.dividerLine} />
							</View>

							{/* Social Login Buttons */}
							<View style={styles.socialContainer}>
								<TouchableOpacity
									style={styles.socialButton}
									onPress={() => handleSocialLogin("Google")}
								>
									<Text style={styles.socialButtonText}>
										Google
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.socialButton}
									onPress={() => handleSocialLogin("Apple")}
								>
									<Text style={styles.socialButtonText}>
										Apple
									</Text>
								</TouchableOpacity>
							</View>

							{/* Demo Hint */}
							<View style={styles.demoHint}>
								<Text style={styles.demoHintText}>
									Demo: Use any email with "test" or "demo" to
									login
								</Text>
							</View>
						</View>

						{/* Sign Up Link */}
						<View style={styles.footer}>
							<Text style={styles.footerText}>
								Don't have an account?{" "}
							</Text>
							<TouchableOpacity onPress={handleSignUp}>
								<Text style={styles.signUpText}>Sign Up</Text>
							</TouchableOpacity>
						</View>
					</Animated.View>
				</ScrollView>
			</KeyboardAvoidingView>

			{/* Google Login Modal */}
			<Modal
				isVisible={isGoogleModalVisible}
				onBackdropPress={() => setIsGoogleModalVisible(false)}
				onBackButtonPress={() => setIsGoogleModalVisible(false)}
				animationIn="slideInUp"
				animationOut="slideOutDown"
				backdropOpacity={0.7}
				style={styles.modal}
				coverScreen
				swipeThreshold={100}
				propagateSwipe
				onSwipeComplete={() => setIsGoogleModalVisible(false)}
				hasBackdrop
			>
				<View style={styles.modalContent}>
					<View style={styles.modalHeader}>
						<Text style={styles.modalTitle}>Google Login</Text>
						<TouchableOpacity
							onPress={() => setIsGoogleModalVisible(false)}
							style={styles.closeButton}
						>
							<Text style={styles.closeButtonText}>✕</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.modalBody}>
						<View style={styles.googleIcon}>
							<Text style={styles.googleIconText}>G</Text>
						</View>
						<Text style={styles.modalDescription}>
							Đăng nhập bằng tài khoản Google của bạn
						</Text>
					</View>

					<View style={styles.modalFooter}>
						<TouchableOpacity
							style={styles.modalButton}
							onPress={handleGoogleLogin}
						>
							<LinearGradient
								colors={GRADIENTS.primaryButton}
								style={styles.modalButtonGradient}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
							>
								<Text style={styles.modalButtonText}>
									Tiếp tục với Google
								</Text>
							</LinearGradient>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.cancelButton}
							onPress={() => setIsGoogleModalVisible(false)}
						>
							<Text style={styles.cancelButtonText}>Hủy</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
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
		justifyContent: "center",
		paddingHorizontal: 24,
		paddingVertical: 40,
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
	forgotPassword: {
		color: COLORS.primary,
		fontSize: 14,
		textAlign: "right",
		marginBottom: 24,
		fontWeight: "500",
	},
	loginButton: {
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
	loginButtonDisabled: {
		opacity: 0.7,
	},
	loginButtonGradient: {
		paddingVertical: 16,
		alignItems: "center",
	},
	loginButtonText: {
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
	demoHint: {
		backgroundColor: getColorWithOpacity(COLORS.primary, 0.1),
		borderRadius: 8,
		padding: 12,
		marginBottom: 16,
	},
	demoHintText: {
		color: COLORS.textSecondary,
		fontSize: 12,
		textAlign: "center",
		fontStyle: "italic",
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
	signUpText: {
		color: COLORS.primary,
		fontSize: 14,
		fontWeight: "bold",
	},
	// Modal styles
	modal: {
		margin: 0,
		flex: 1,
		height: height,
		justifyContent: "flex-end",
	},
	modalContent: {
		backgroundColor: COLORS.surface,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingHorizontal: 24,
		paddingTop: 20,
		paddingBottom: 40,
		maxHeight: height * 0.6,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 24,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: COLORS.textPrimary,
	},
	closeButton: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: COLORS.border,
		justifyContent: "center",
		alignItems: "center",
	},
	closeButtonText: {
		fontSize: 16,
		color: COLORS.textSecondary,
	},
	modalBody: {
		alignItems: "center",
		marginBottom: 32,
	},
	googleIcon: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: COLORS.primary,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
	},
	googleIconText: {
		fontSize: 24,
		fontWeight: "bold",
		color: COLORS.textPrimary,
	},
	modalDescription: {
		fontSize: 16,
		color: COLORS.textSecondary,
		textAlign: "center",
		lineHeight: 22,
	},
	modalFooter: {
		gap: 12,
	},
	modalButton: {
		borderRadius: 12,
		overflow: "hidden",
	},
	modalButtonGradient: {
		paddingVertical: 16,
		alignItems: "center",
	},
	modalButtonText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "bold",
	},
	cancelButton: {
		paddingVertical: 16,
		alignItems: "center",
		backgroundColor: "transparent",
		borderWidth: 1,
		borderColor: COLORS.border,
		borderRadius: 12,
	},
	cancelButtonText: {
		color: COLORS.textSecondary,
		fontSize: 16,
		fontWeight: "500",
	},
});
export default LoginScreen;

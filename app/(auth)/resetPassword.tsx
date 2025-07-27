import CloseButton from "@/components/CloseButton";
import CustomTextInput from "@/components/CustomTextInput";
import Typo from "@/components/Typo";
import ValidationItem from "@/components/ValidationItem";
import { COLOR_VARIANTS, COLORS, GRADIENTS } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

const ResetPassword = () => {
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(30)).current;

	// Password validation functions
	const hasMinLength = (password: string) => password.length >= 10;
	const hasLetter = (password: string) => /[a-zA-Z]/.test(password);
	const hasNumberOrSpecial = (password: string) =>
		/[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
	const passwordsMatch = () =>
		newPassword !== "" &&
		confirmPassword !== "" &&
		newPassword === confirmPassword;

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

	const isFormValid = () => {
		return (
			hasMinLength(newPassword) &&
			hasLetter(newPassword) &&
			hasNumberOrSpecial(newPassword) &&
			passwordsMatch()
		);
	};

	const handleChangePassword = () => {
		if (isFormValid()) {
			router.replace("/login");
		}
	};

	return (
		<LinearGradient
			colors={GRADIENTS.playerBackground}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
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
				<CloseButton
					iconSize={40}
					style={{
						alignSelf: "flex-end",
						top: -32,
					}}
				/>
				{/* Header */}
				<View style={styles.header}>
					<Typo size={32} fontWeight="600" style={styles.title}>
						Reset your password
					</Typo>
					<Typo size={16} fontWeight="400" style={styles.subtitle}>
						Please enter your new password below.
					</Typo>
				</View>

				{/* Form */}
				<View style={styles.form}>
					{/* New Password Input */}
					<CustomTextInput
						label="New password"
						value={newPassword}
						onChangeText={setNewPassword}
						placeholder="Enter your new password"
						keyboardType="default"
						hasPasswordToggle={true}
						autoCapitalize="none"
						showPassword={showPassword}
						onTogglePassword={() => setShowPassword(!showPassword)}
					/>

					{/* Password Validation */}
					<View style={styles.validationContainer}>
						<Typo
							size={14}
							fontWeight="500"
							style={styles.validationTitle}
						>
							Your password must contain at least
						</Typo>

						<ValidationItem
							isValid={hasMinLength(newPassword)}
							text="10 characters"
						/>

						<ValidationItem
							isValid={hasLetter(newPassword)}
							text="1 letter"
						/>
						<ValidationItem
							isValid={hasNumberOrSpecial(newPassword)}
							text="1 number or special character (example: # ? ! &)"
						/>
					</View>

					{/* Confirm Password Input */}
					<CustomTextInput
						label="Confirm new password"
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						placeholder="Confirm your password"
						keyboardType="default"
						hasPasswordToggle={true}
						autoCapitalize="none"
						showPassword={showConfirmPassword}
						onTogglePassword={() =>
							setShowConfirmPassword(!showConfirmPassword)
						}
					/>

					{/* Password Match Validation */}
					{confirmPassword !== "" && (
						<ValidationItem
							isValid={passwordsMatch()}
							text="Passwords match"
						/>
					)}
				</View>

				{/* Support Link */}
				<TouchableOpacity style={styles.supportLink}>
					<Typo size={14} fontWeight="400" style={styles.supportText}>
						Need support?
					</Typo>
				</TouchableOpacity>

				{/* Change Password Button */}
				<TouchableOpacity
					style={[
						styles.changeButton,
						{
							backgroundColor: isFormValid()
								? COLOR_VARIANTS.text.primary
								: COLOR_VARIANTS.text.disabled,
						},
						isLoading && styles.changeButtonDisabled,
					]}
					onPress={handleChangePassword}
					disabled={!isFormValid()}
				>
					<LinearGradient
						colors={
							isFormValid()
								? GRADIENTS.primaryButton
								: GRADIENTS.nowPlayingCard
						}
						style={[
							styles.changeButtonGradient,
							isFormValid()
								? { shadowColor: COLORS.primary }
								: { shadowColor: COLORS.surface },
						]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
					>
						<Typo size={24} fontWeight="600">
							Change password
						</Typo>
					</LinearGradient>
				</TouchableOpacity>
			</Animated.View>
		</LinearGradient>
	);
};

export default ResetPassword;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 24,
	},
	content: {
		width: "100%",
		maxWidth: 400,
	},
	header: {
		marginBottom: 32,
		alignItems: "flex-start",
	},
	title: {
		color: "#FFFFFF",
		marginBottom: 8,
	},
	subtitle: {
		color: "#D1D5DB",
	},
	form: {
		marginBottom: 24,
		gap: 16,
	},
	validationContainer: {
		gap: 8,
	},
	validationTitle: {
		color: "#D1D5DB",
		marginBottom: 4,
	},
	validationItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	validationText: {
		flex: 1,
	},
	supportLink: {
		alignSelf: "flex-start",
		marginBottom: 32,
	},
	supportText: {
		color: "#D1D5DB",
		textDecorationLine: "underline",
	},
	changeButton: {
		borderRadius: 12,
		overflow: "hidden",
		marginBottom: 24,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	changeButtonGradient: {
		paddingVertical: 16,
		alignItems: "center",
	},
	changeButtonDisabled: {
		opacity: 0.7,
	},
});

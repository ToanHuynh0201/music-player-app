import { COLORS } from "@/constants/Colors";
import React from "react";
import {
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TextInputProps,
	TouchableOpacity,
	View,
} from "react-native";

interface CustomTextInputProps extends TextInputProps {
	label: string;
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	showPassword?: boolean;
	onTogglePassword?: () => void;
	hasPasswordToggle?: boolean;
	errorMessage?: string;
	isValid?: boolean;
	containerStyle?: any;
	inputStyle?: any;
	labelStyle?: any;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
	label,
	value,
	onChangeText,
	placeholder,
	showPassword = false,
	onTogglePassword,
	hasPasswordToggle = false,
	errorMessage,
	isValid,
	containerStyle,
	inputStyle,
	labelStyle,
	...textInputProps
}) => {
	return (
		<View style={[styles.inputContainer, containerStyle]}>
			<Text style={[styles.inputLabel, labelStyle]}>{label}</Text>
			<View style={styles.inputWrapper}>
				<TextInput
					style={[
						styles.input,
						hasPasswordToggle && { paddingRight: 50 },
						errorMessage && styles.inputError,
						isValid && styles.inputSuccess,
						inputStyle,
					]}
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					placeholderTextColor={COLORS.textSecondary}
					secureTextEntry={hasPasswordToggle ? !showPassword : false}
					{...textInputProps}
				/>

				{hasPasswordToggle && (
					<TouchableOpacity
						style={styles.eyeButton}
						onPress={onTogglePassword}
					>
						<Text style={styles.eyeText}>
							{showPassword ? "👁️" : "👁️‍🗨️"}
						</Text>
					</TouchableOpacity>
				)}
			</View>

			{errorMessage && (
				<Text style={styles.errorText}>{errorMessage}</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
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
	inputError: {
		borderColor: COLORS.error,
	},
	inputSuccess: {
		borderColor: COLORS.success,
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
	errorText: {
		fontSize: 12,
		color: COLORS.error,
		marginTop: 6,
		marginLeft: 4,
	},
});

export default CustomTextInput;

// components/ValidationItem.js
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import Typo from "./Typo";

type ValidationItemProps = {
	isValid: boolean;
	text: string;
};

const ValidationItem = ({ isValid, text }: ValidationItemProps) => (
	<View style={styles.validationItem}>
		<Ionicons
			name={isValid ? "checkmark-circle" : "radio-button-off"}
			size={20}
			color={isValid ? "#4ADE80" : "#6B7280"}
		/>
		<Typo
			size={14}
			fontWeight="400"
			style={{ color: isValid ? "#4ADE80" : "#9CA3AF" }}
		>
			{text}
		</Typo>
	</View>
);
const styles = StyleSheet.create({
	validationItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
});
export default ValidationItem;

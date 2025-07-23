import Typo from "@/components/Typo";
import { COLORS } from "@/constants/Colors";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface FilterButtonProps {
	label: string;
	isSelected: boolean;
	onPress: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
	label,
	isSelected,
	onPress,
}) => {
	return (
		<TouchableOpacity
			style={[
				styles.filterButton,
				isSelected && styles.filterButtonActive,
			]}
			onPress={onPress}
		>
			<Typo
				size={14}
				fontWeight="500"
				color={isSelected ? COLORS.textPrimary : COLORS.textSecondary}
			>
				{label}
			</Typo>
		</TouchableOpacity>
	);
};

export default FilterButton;

const styles = StyleSheet.create({
	filterButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: COLORS.surface,
		marginRight: 8,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	filterButtonActive: {
		backgroundColor: COLORS.primary,
		borderColor: COLORS.primary,
	},
});

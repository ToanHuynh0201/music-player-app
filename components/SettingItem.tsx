import { COLORS, getColorWithOpacity } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SettingItemProps {
	icon: string;
	title: string;
	subtitle?: string;
	onPress?: () => void;
	showArrow?: boolean;
	rightComponent?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({
	icon,
	title,
	subtitle,
	onPress,
	showArrow = true,
	rightComponent,
}) => (
	<TouchableOpacity
		style={styles.settingItem}
		onPress={onPress}
		disabled={!onPress && !rightComponent}
	>
		<View style={styles.settingLeft}>
			<View style={styles.settingIcon}>
				<Text style={styles.settingIconText}>{icon}</Text>
			</View>
			<View style={styles.settingInfo}>
				<Text style={styles.settingTitle}>{title}</Text>
				{subtitle && (
					<Text style={styles.settingSubtitle}>{subtitle}</Text>
				)}
			</View>
		</View>
		<View style={styles.settingRight}>
			{rightComponent}
			{showArrow && !rightComponent && (
				<Text style={styles.arrow}>›</Text>
			)}
		</View>
	</TouchableOpacity>
);

export default SettingItem;

const styles = StyleSheet.create({
	settingItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
	},
	settingLeft: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	settingIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: getColorWithOpacity(COLORS.primary, 0.1),
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	settingIconText: {
		fontSize: 18,
	},
	settingInfo: {
		flex: 1,
	},
	settingTitle: {
		fontSize: 16,
		fontWeight: "500",
		color: COLORS.textPrimary,
		marginBottom: 2,
	},
	settingSubtitle: {
		fontSize: 12,
		color: COLORS.textSecondary,
	},
	settingRight: {
		flexDirection: "row",
		alignItems: "center",
	},
	arrow: {
		fontSize: 20,
		color: COLORS.textSecondary,
		marginLeft: 8,
	},
});

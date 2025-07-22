import SettingItem from "@/components/SettingItem";
import { COLORS, GRADIENTS } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
	Alert,
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const { width } = Dimensions.get("window");

const Profile = () => {
	const [darkMode, setDarkMode] = useState(true);
	const [notifications, setNotifications] = useState(true);
	const [autoPlay, setAutoPlay] = useState(false);
	const [highQuality, setHighQuality] = useState(false);

	// Mock user data
	const userInfo = {
		name: "Music Lover",
		email: "demo@musicflow.com",
		premium: false,
		avatar: "",
	};

	const handleLogout = () => {
		Alert.alert("Logout", "Are you sure you want to logout?", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "Logout",
				style: "destructive",
				onPress: () => {
					// Navigate back to login screen
					router.replace("/login");
				},
			},
		]);
	};

	const handleUpgradeToPremium = () => {
		Alert.alert(
			"Upgrade to Premium",
			"Get unlimited skips, ad-free listening, and high-quality audio!",
			[
				{ text: "Maybe Later", style: "cancel" },
				{
					text: "Upgrade Now",
					onPress: () => Alert.alert("Feature Coming Soon!"),
				},
			]
		);
	};

	return (
		<LinearGradient
			colors={GRADIENTS.playerBackground}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.headerTitle}>Profile</Text>
				</View>

				{/* User Info Card */}
				<View style={styles.userCard}>
					<LinearGradient
						colors={GRADIENTS.nowPlayingCard}
						style={styles.userCardGradient}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
					>
						{/* Avatar */}
						<View style={styles.avatarContainer}>
							{userInfo.avatar ? (
								<Image
									source={{ uri: userInfo.avatar }}
									style={styles.avatar}
								/>
							) : (
								<View style={styles.avatarPlaceholder}>
									<Text style={styles.avatarText}>
										{userInfo.name.charAt(0).toUpperCase()}
									</Text>
								</View>
							)}
							{userInfo.premium && (
								<View style={styles.premiumBadge}>
									<Text style={styles.premiumBadgeText}>
										♪
									</Text>
								</View>
							)}
						</View>

						{/* User Info */}
						<View style={styles.userInfo}>
							<View style={styles.userNameContainer}>
								<Text style={styles.userName}>
									{userInfo.name}
								</Text>
								{userInfo.premium && (
									<View style={styles.premiumTag}>
										<Text style={styles.premiumTagText}>
											PREMIUM
										</Text>
									</View>
								)}
							</View>
							<Text style={styles.userEmail}>
								{userInfo.email}
							</Text>
						</View>

						{/* Stats */}
						<View style={styles.statsContainer}>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>142</Text>
								<Text style={styles.statLabel}>Playlists</Text>
							</View>
							<View style={styles.statDivider} />
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>2.4K</Text>
								<Text style={styles.statLabel}>Songs</Text>
							</View>
							<View style={styles.statDivider} />
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>86h</Text>
								<Text style={styles.statLabel}>Listened</Text>
							</View>
						</View>
					</LinearGradient>
				</View>

				{/* Premium Upgrade (if not premium) */}
				{!userInfo.premium && (
					<TouchableOpacity
						style={styles.premiumPromo}
						onPress={handleUpgradeToPremium}
					>
						<LinearGradient
							colors={GRADIENTS.accentButton}
							style={styles.premiumPromoGradient}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
						>
							<View style={styles.premiumPromoContent}>
								<View style={styles.premiumPromoText}>
									<Text style={styles.premiumPromoTitle}>
										Upgrade to Premium
									</Text>
									<Text style={styles.premiumPromoSubtitle}>
										Unlimited skips • No ads • High quality
									</Text>
								</View>
								<Text style={styles.premiumPromoArrow}>→</Text>
							</View>
						</LinearGradient>
					</TouchableOpacity>
				)}

				{/* Settings Sections */}

				{/* Music & Audio */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Music & Audio</Text>
					<View style={styles.sectionContent}>
						<SettingItem
							icon="🎵"
							title="Audio Quality"
							subtitle={
								highQuality
									? "High (320 kbps)"
									: "Standard (128 kbps)"
							}
							rightComponent={
								<Switch
									value={highQuality}
									onValueChange={setHighQuality}
									trackColor={{
										false: COLORS.secondary,
										true: COLORS.primary,
									}}
									thumbColor={
										highQuality
											? COLORS.textPrimary
											: COLORS.textSecondary
									}
									disabled={!userInfo.premium}
								/>
							}
							showArrow={false}
						/>
						<SettingItem
							icon="⚡"
							title="Auto-play"
							subtitle="Continue playing similar songs"
							rightComponent={
								<Switch
									value={autoPlay}
									onValueChange={setAutoPlay}
									trackColor={{
										false: COLORS.secondary,
										true: COLORS.primary,
									}}
									thumbColor={
										autoPlay
											? COLORS.textPrimary
											: COLORS.textSecondary
									}
								/>
							}
							showArrow={false}
						/>
						<SettingItem
							icon="⬇️"
							title="Download Quality"
							subtitle="Standard"
							onPress={() =>
								Alert.alert(
									"Download Quality",
									"Feature coming soon!"
								)
							}
						/>
					</View>
				</View>

				{/* App Settings */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>App Settings</Text>
					<View style={styles.sectionContent}>
						<SettingItem
							icon="🌙"
							title="Dark Mode"
							subtitle="Always on for better experience"
							rightComponent={
								<Switch
									value={darkMode}
									onValueChange={setDarkMode}
									trackColor={{
										false: COLORS.secondary,
										true: COLORS.primary,
									}}
									thumbColor={
										darkMode
											? COLORS.textPrimary
											: COLORS.textSecondary
									}
								/>
							}
							showArrow={false}
						/>
						<SettingItem
							icon="🔔"
							title="Notifications"
							subtitle="New releases and recommendations"
							rightComponent={
								<Switch
									value={notifications}
									onValueChange={setNotifications}
									trackColor={{
										false: COLORS.secondary,
										true: COLORS.primary,
									}}
									thumbColor={
										notifications
											? COLORS.textPrimary
											: COLORS.textSecondary
									}
								/>
							}
							showArrow={false}
						/>
						<SettingItem
							icon="📱"
							title="Storage & Data"
							subtitle="Manage downloads and cache"
							onPress={() =>
								Alert.alert("Storage", "Feature coming soon!")
							}
						/>
					</View>
				</View>

				{/* Account */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Account</Text>
					<View style={styles.sectionContent}>
						<SettingItem
							icon="👤"
							title="Edit Profile"
							subtitle="Change name, email, and photo"
							onPress={() =>
								Alert.alert(
									"Edit Profile",
									"Feature coming soon!"
								)
							}
						/>
						<SettingItem
							icon="🔒"
							title="Privacy & Security"
							subtitle="Password, security settings"
							onPress={() =>
								Alert.alert("Privacy", "Feature coming soon!")
							}
						/>
						<SettingItem
							icon="💳"
							title="Subscription"
							subtitle={
								userInfo.premium ? "Premium Plan" : "Free Plan"
							}
							onPress={() =>
								Alert.alert(
									"Subscription",
									"Manage your subscription"
								)
							}
						/>
					</View>
				</View>

				{/* Support */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Support</Text>
					<View style={styles.sectionContent}>
						<SettingItem
							icon="❓"
							title="Help & FAQ"
							subtitle="Get help with common questions"
							onPress={() =>
								Alert.alert("Help", "Feature coming soon!")
							}
						/>
						<SettingItem
							icon="📧"
							title="Contact Us"
							subtitle="Send feedback or report issues"
							onPress={() =>
								Alert.alert("Contact", "Feature coming soon!")
							}
						/>
						<SettingItem
							icon="⭐"
							title="Rate the App"
							subtitle="Help us improve"
							onPress={() =>
								Alert.alert(
									"Rate App",
									"Thank you for your feedback!"
								)
							}
						/>
					</View>
				</View>

				{/* About */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>About</Text>
					<View style={styles.sectionContent}>
						<SettingItem
							icon="ℹ️"
							title="App Version"
							subtitle="1.0.0"
							showArrow={false}
						/>
						<SettingItem
							icon="📋"
							title="Terms of Service"
							onPress={() =>
								Alert.alert("Terms", "Feature coming soon!")
							}
						/>
						<SettingItem
							icon="🔐"
							title="Privacy Policy"
							onPress={() =>
								Alert.alert(
									"Privacy Policy",
									"Feature coming soon!"
								)
							}
						/>
					</View>
				</View>

				{/* Logout Button */}
				<View style={styles.logoutContainer}>
					<TouchableOpacity
						style={styles.logoutButton}
						onPress={handleLogout}
					>
						<Text style={styles.logoutButtonText}>Logout</Text>
					</TouchableOpacity>
				</View>

				{/* Bottom Spacing */}
				<View style={styles.bottomSpacing} />
			</ScrollView>
		</LinearGradient>
	);
};

export default Profile;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	header: {
		paddingHorizontal: 24,
		paddingTop: 60,
		paddingBottom: 24,
	},
	headerTitle: {
		fontSize: 32,
		fontWeight: "bold",
		color: COLORS.textPrimary,
	},

	// User Card
	userCard: {
		marginHorizontal: 24,
		marginBottom: 24,
		borderRadius: 20,
		overflow: "hidden",
		shadowColor: COLORS.shadow,
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.3,
		shadowRadius: 16,
		elevation: 12,
	},
	userCardGradient: {
		padding: 24,
	},
	avatarContainer: {
		alignSelf: "center",
		marginBottom: 16,
		position: "relative",
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
	},
	avatarPlaceholder: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: COLORS.primary,
		justifyContent: "center",
		alignItems: "center",
	},
	avatarText: {
		fontSize: 32,
		fontWeight: "bold",
		color: COLORS.textPrimary,
	},
	premiumBadge: {
		position: "absolute",
		bottom: -4,
		right: -4,
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: COLORS.accent,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: COLORS.surface,
	},
	premiumBadgeText: {
		fontSize: 12,
		color: COLORS.textPrimary,
	},
	userInfo: {
		alignItems: "center",
		marginBottom: 24,
	},
	userNameContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 4,
	},
	userName: {
		fontSize: 22,
		fontWeight: "bold",
		color: COLORS.textPrimary,
		marginRight: 8,
	},
	premiumTag: {
		backgroundColor: COLORS.accent,
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 10,
	},
	premiumTagText: {
		fontSize: 10,
		fontWeight: "bold",
		color: COLORS.textPrimary,
	},
	userEmail: {
		fontSize: 14,
		color: COLORS.textSecondary,
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	statItem: {
		alignItems: "center",
	},
	statNumber: {
		fontSize: 18,
		fontWeight: "bold",
		color: COLORS.textPrimary,
		marginBottom: 2,
	},
	statLabel: {
		fontSize: 12,
		color: COLORS.textSecondary,
	},
	statDivider: {
		width: 1,
		height: 30,
		backgroundColor: COLORS.border,
	},

	// Premium Promo
	premiumPromo: {
		marginHorizontal: 24,
		marginBottom: 24,
		borderRadius: 16,
		overflow: "hidden",
	},
	premiumPromoGradient: {
		padding: 20,
	},
	premiumPromoContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	premiumPromoText: {
		flex: 1,
	},
	premiumPromoTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: COLORS.textPrimary,
		marginBottom: 4,
	},
	premiumPromoSubtitle: {
		fontSize: 14,
		color: COLORS.textPrimary,
		opacity: 0.8,
	},
	premiumPromoArrow: {
		fontSize: 24,
		color: COLORS.textPrimary,
		marginLeft: 16,
	},

	// Sections
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: COLORS.textPrimary,
		marginBottom: 12,
		marginLeft: 24,
	},
	sectionContent: {
		marginHorizontal: 24,
		backgroundColor: COLORS.surface,
		borderRadius: 16,
		overflow: "hidden",
	},

	// Logout
	logoutContainer: {
		marginHorizontal: 24,
		marginBottom: 24,
	},
	logoutButton: {
		backgroundColor: COLORS.surface,
		borderWidth: 2,
		borderColor: COLORS.error,
		borderRadius: 16,
		paddingVertical: 16,
		alignItems: "center",
	},
	logoutButtonText: {
		fontSize: 16,
		fontWeight: "bold",
		color: COLORS.error,
	},
	bottomSpacing: {
		height: 100,
	},
});

import { COLOR_VARIANTS, COLORS, GRADIENTS } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
const { width, height } = Dimensions.get("window");

const SAMPLE_DATA = {
	recentlyPlayed: [
		{
			id: "1",
			title: "Blinding Lights",
			artist: "The Weeknd",
			image: "https://i.scdn.co/image/ab67616d0000b273473c5b1cac05d6e78e2ad6f7",
			duration: "3:20",
		},
		{
			id: "2",
			title: "Watermelon Sugar",
			artist: "Harry Styles",
			image: "https://i.scdn.co/image/ab67616d0000b273adce4d44ca3b60ae98776470",
			duration: "2:54",
		},
		{
			id: "3",
			title: "Levitating",
			artist: "Dua Lipa",
			image: "https://i.scdn.co/image/ab67616d0000b273c83fd3d3b9ad50f5b6b49040",
			duration: "3:23",
		},
	],
	popularArtists: [
		{
			id: "1",
			name: "Taylor Swift",
			image: "https://i.scdn.co/image/ab6761610000e5eb859e4c14fa59296c8649e0e4",
			followers: "89M",
		},
		{
			id: "2",
			name: "The Weeknd",
			image: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb",
			followers: "65M",
		},
		{
			id: "3",
			name: "Ariana Grande",
			image: "https://i.scdn.co/image/ab6761610000e5eb40b5c07ab77b6b1a9075fdc0",
			followers: "72M",
		},
		{
			id: "4",
			name: "Ed Sheeran",
			image: "https://i.scdn.co/image/ab6761610000e5eb12a2ef08d00dd7451a6ee9e6",
			followers: "45M",
		},
	],
	featuredPlaylists: [
		{
			id: "1",
			title: "Today's Top Hits",
			description: "The most played songs right now",
			image: "https://i.scdn.co/image/ab67706f00000003c13b4a1d98c91b9c3160c9e4",
			songs: 50,
		},
		{
			id: "2",
			title: "RapCaviar",
			description: "New music from Drake, Travis Scott and more",
			image: "https://i.scdn.co/image/ab67706f00000003ee2eb4e7c8f2ee1e83bcb2b1",
			songs: 65,
		},
	],
	genres: [
		{ id: "1", name: "Pop", color: "#FF6B6B" },
		{ id: "2", name: "Hip-Hop", color: "#4ECDC4" },
		{ id: "3", name: "Rock", color: "#45B7D1" },
		{ id: "4", name: "Jazz", color: "#96CEB4" },
		{ id: "5", name: "Classical", color: "#FFEAA7" },
		{ id: "6", name: "Electronic", color: "#DDA0DD" },
	],
};

const Home = () => {
	const [greeting, setGreeting] = useState("");

	useEffect(() => {
		const hour = new Date().getHours();
		if (hour < 12) {
			setGreeting("Chào buổi sáng");
		} else if (hour < 18) {
			setGreeting("Chào buổi chiều");
		} else {
			setGreeting("Chào buổi tối");
		}
	}, []);
	return (
		<View style={styles.container}>
			<StatusBar
				barStyle="light-content"
				backgroundColor={COLORS.background}
			/>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Header */}
				<LinearGradient
					colors={GRADIENTS.playerBackground}
					style={styles.header}
				>
					<View style={styles.headerContent}>
						<View>
							<Text style={styles.greeting}>{greeting}</Text>
							<Text style={styles.userName}>Music Lover</Text>
						</View>
						<TouchableOpacity style={styles.profileButton}>
							<Ionicons
								name="person-circle"
								size={32}
								color={COLORS.textPrimary}
							/>
						</TouchableOpacity>
					</View>
				</LinearGradient>

				{/* Quick Access Genres */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Thể loại</Text>
					<FlatList
						data={SAMPLE_DATA.genres}
						renderItem={renderGenre}
						keyExtractor={(item) => item.id}
						numColumns={2}
						scrollEnabled={false}
						contentContainerStyle={styles.genreGrid}
					/>
				</View>

				{/* Recently Played */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Nghe gần đây</Text>
						<TouchableOpacity>
							<Text style={styles.seeAllText}>Xem tất cả</Text>
						</TouchableOpacity>
					</View>
					<FlatList
						data={SAMPLE_DATA.recentlyPlayed}
						renderItem={renderRecentlyPlayed}
						keyExtractor={(item) => item.id}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.horizontalList}
					/>
				</View>

				{/* Popular Artists */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>
							Nghệ sĩ phổ biến
						</Text>
						<TouchableOpacity>
							<Text style={styles.seeAllText}>Xem tất cả</Text>
						</TouchableOpacity>
					</View>
					<FlatList
						data={SAMPLE_DATA.popularArtists}
						renderItem={renderArtist}
						keyExtractor={(item) => item.id}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.horizontalList}
					/>
				</View>

				{/* Featured Playlists */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>
							Playlist nổi bật
						</Text>
						<TouchableOpacity>
							<Text style={styles.seeAllText}>Xem tất cả</Text>
						</TouchableOpacity>
					</View>
					<FlatList
						data={SAMPLE_DATA.featuredPlaylists}
						renderItem={renderPlaylist}
						keyExtractor={(item) => item.id}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.horizontalList}
					/>
				</View>

				{/* Bottom Spacing */}
				<View style={styles.bottomSpacing} />
			</ScrollView>
		</View>
	);
};

const renderRecentlyPlayed = ({ item }: any) => (
	<TouchableOpacity style={styles.recentItem} activeOpacity={0.7}>
		<Image source={{ uri: item.image }} style={styles.recentImage} />
		<View style={styles.recentInfo}>
			<Text style={styles.recentTitle} numberOfLines={1}>
				{item.title}
			</Text>
			<Text style={styles.recentArtist} numberOfLines={1}>
				{item.artist}
			</Text>
		</View>
		<TouchableOpacity style={styles.playButton}>
			<Ionicons name="play" size={16} color={COLORS.background} />
		</TouchableOpacity>
	</TouchableOpacity>
);

const renderArtist = ({ item }: any) => (
	<TouchableOpacity style={styles.artistItem} activeOpacity={0.7}>
		<Image source={{ uri: item.image }} style={styles.artistImage} />
		<Text style={styles.artistName} numberOfLines={1}>
			{item.name}
		</Text>
		<Text style={styles.artistFollowers}>{item.followers} followers</Text>
	</TouchableOpacity>
);

const renderPlaylist = ({ item }: any) => (
	<TouchableOpacity style={styles.playlistItem} activeOpacity={0.7}>
		<Image source={{ uri: item.image }} style={styles.playlistImage} />
		<View style={styles.playlistInfo}>
			<Text style={styles.playlistTitle} numberOfLines={1}>
				{item.title}
			</Text>
			<Text style={styles.playlistDescription} numberOfLines={2}>
				{item.description}
			</Text>
			<Text style={styles.playlistSongs}>{item.songs} bài hát</Text>
		</View>
	</TouchableOpacity>
);

const renderGenre = ({ item }: any) => (
	<TouchableOpacity
		style={[styles.genreItem, { backgroundColor: item.color }]}
		activeOpacity={0.8}
	>
		<Text style={styles.genreText}>{item.name}</Text>
	</TouchableOpacity>
);
export default Home;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	scrollContent: {
		paddingBottom: 100, // Space for tab bar
	},
	header: {
		backgroundColor: COLORS.primary, // Dùng màu đặc thay gradient
		paddingTop: 50,
		paddingHorizontal: 20,
		paddingBottom: 30,
	},
	headerContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	greeting: {
		fontSize: 16,
		color: COLOR_VARIANTS.text.secondary,
		fontWeight: "400",
	},
	userName: {
		fontSize: 24,
		color: COLOR_VARIANTS.text.primary,
		fontWeight: "bold",
		marginTop: 4,
	},
	profileButton: {
		padding: 4,
	},
	section: {
		marginTop: 32,
		paddingHorizontal: 20,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 22,
		fontWeight: "bold",
		color: COLORS.textPrimary,
	},
	seeAllText: {
		fontSize: 14,
		color: COLORS.primary,
		fontWeight: "600",
	},
	horizontalList: {
		paddingRight: 20,
	},
	// Genre Styles
	genreGrid: {
		gap: 12,
	},
	genreItem: {
		flex: 1,
		height: 80,
		marginHorizontal: 6,
		marginVertical: 6,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	genreText: {
		fontSize: 16,
		fontWeight: "bold",
		color: COLORS.textPrimary,
	},
	// Recently Played Styles
	recentItem: {
		backgroundColor: COLOR_VARIANTS.surface.light,
		borderRadius: 12,
		padding: 12,
		marginRight: 16,
		width: width * 0.8,
		flexDirection: "row",
		alignItems: "center",
	},
	recentImage: {
		width: 50,
		height: 50,
		borderRadius: 8,
	},
	recentInfo: {
		flex: 1,
		marginLeft: 12,
	},
	recentTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: COLORS.textPrimary,
		marginBottom: 4,
	},
	recentArtist: {
		fontSize: 14,
		color: COLORS.textSecondary,
	},
	playButton: {
		backgroundColor: COLORS.primary,
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	// Artist Styles
	artistItem: {
		alignItems: "center",
		marginRight: 20,
		width: 100,
	},
	artistImage: {
		width: 80,
		height: 80,
		borderRadius: 40,
		marginBottom: 8,
	},
	artistName: {
		fontSize: 14,
		fontWeight: "600",
		color: COLORS.textPrimary,
		textAlign: "center",
		marginBottom: 4,
	},
	artistFollowers: {
		fontSize: 12,
		color: COLORS.textSecondary,
		textAlign: "center",
	},
	// Playlist Styles
	playlistItem: {
		backgroundColor: COLOR_VARIANTS.surface.light,
		borderRadius: 12,
		padding: 12,
		marginRight: 16,
		width: width * 0.7,
		flexDirection: "row",
	},
	playlistImage: {
		width: 80,
		height: 80,
		borderRadius: 8,
	},
	playlistInfo: {
		flex: 1,
		marginLeft: 12,
		justifyContent: "space-between",
	},
	playlistTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: COLORS.textPrimary,
		marginBottom: 4,
	},
	playlistDescription: {
		fontSize: 13,
		color: COLORS.textSecondary,
		lineHeight: 18,
		marginBottom: 8,
	},
	playlistSongs: {
		fontSize: 12,
		color: COLORS.textSecondary,
		fontWeight: "500",
	},
	bottomSpacing: {
		height: 40,
	},
});

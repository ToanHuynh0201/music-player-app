import FeaturedPlaylists from "@/components/FeaturedPlaylists";
import Genre from "@/components/Genre";
import HomeHeader from "@/components/HomeHeader";
import PopularArtists from "@/components/PopularArtists";
import RecentlyPlayed from "@/components/RecentlyPlayed";
import { COLOR_VARIANTS, COLORS } from "@/constants/Colors";
import {
	featuredPlaylists,
	genres,
	popularArtists,
	recentlyPlayed,
} from "@/data";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	Dimensions,
	FlatList,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
const { width, height } = Dimensions.get("window");

const Home = () => {
	const [greeting, setGreeting] = useState("");
	const router = useRouter();
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

	const onProfilePress = () => {
		router.navigate("/(tabs)/profile");
	};
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
				<HomeHeader onProfilePress={onProfilePress} />

				{/* Quick Access Genres */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Thể loại</Text>
					<FlatList
						data={genres}
						renderItem={(item) => (
							<Genre genre={genres[item.index]} />
						)}
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
						data={recentlyPlayed}
						renderItem={(item) => (
							<RecentlyPlayed data={recentlyPlayed[item.index]} />
						)}
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
						data={popularArtists}
						renderItem={(item) => (
							<PopularArtists data={popularArtists[item.index]} />
						)}
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
						data={featuredPlaylists}
						renderItem={(item) => (
							<FeaturedPlaylists
								data={featuredPlaylists[item.index]}
							/>
						)}
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

import Typo from "@/components/Typo";
import { COLORS } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import {
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";

// Sample data
const SAMPLE_PLAYLISTS = [
	{
		id: "1",
		title: "Liked Songs",
		type: "liked",
		songCount: 247,
		image: null,
		isLiked: true,
	},
	{
		id: "2",
		title: "My Playlist #1",
		type: "playlist",
		songCount: 23,
		image: "https://picsum.photos/200/200?random=1",
		creator: "You",
	},
	{
		id: "3",
		title: "Chill Vibes",
		type: "playlist",
		songCount: 45,
		image: "https://picsum.photos/200/200?random=2",
		creator: "You",
	},
	{
		id: "4",
		title: "Workout Mix",
		type: "playlist",
		songCount: 32,
		image: "https://picsum.photos/200/200?random=3",
		creator: "You",
	},
	{
		id: "5",
		title: "Lo-Fi Study",
		type: "playlist",
		songCount: 67,
		image: "https://picsum.photos/200/200?random=4",
		creator: "You",
	},
	{
		id: "6",
		title: "Road Trip Hits",
		type: "playlist",
		songCount: 89,
		image: "https://picsum.photos/200/200?random=5",
		creator: "You",
	},
	{
		id: "7",
		title: "Late Night Jazz",
		type: "playlist",
		songCount: 34,
		image: "https://picsum.photos/200/200?random=6",
		creator: "You",
	},
	{
		id: "8",
		title: "Party Time",
		type: "playlist",
		songCount: 56,
		image: "https://picsum.photos/200/200?random=7",
		creator: "You",
	},
];

const SAMPLE_ALBUMS = [
	{
		id: "1",
		title: "After Hours",
		artist: "The Weeknd",
		type: "album",
		image: "https://picsum.photos/200/200?random=8",
		year: 2020,
	},
	{
		id: "2",
		title: "Future Nostalgia",
		artist: "Dua Lipa",
		type: "album",
		image: "https://picsum.photos/200/200?random=9",
		year: 2020,
	},
	{
		id: "3",
		title: "Blinding Lights",
		artist: "The Weeknd",
		type: "album",
		image: "https://picsum.photos/200/200?random=10",
		year: 2019,
	},
	{
		id: "4",
		title: "Positions",
		artist: "Ariana Grande",
		type: "album",
		image: "https://picsum.photos/200/200?random=11",
		year: 2020,
	},
	{
		id: "5",
		title: "Folklore",
		artist: "Taylor Swift",
		type: "album",
		image: "https://picsum.photos/200/200?random=12",
		year: 2020,
	},
	{
		id: "6",
		title: "Fine Line",
		artist: "Harry Styles",
		type: "album",
		image: "https://picsum.photos/200/200?random=13",
		year: 2019,
	},
	{
		id: "7",
		title: "Circles",
		artist: "Post Malone",
		type: "album",
		image: "https://picsum.photos/200/200?random=14",
		year: 2019,
	},
	{
		id: "8",
		title: "Divide",
		artist: "Ed Sheeran",
		type: "album",
		image: "https://picsum.photos/200/200?random=15",
		year: 2017,
	},
	{
		id: "9",
		title: "Sour",
		artist: "Olivia Rodrigo",
		type: "album",
		image: "https://picsum.photos/200/200?random=16",
		year: 2021,
	},
	{
		id: "10",
		title: "Planet Her",
		artist: "Doja Cat",
		type: "album",
		image: "https://picsum.photos/200/200?random=17",
		year: 2021,
	},
];

const SAMPLE_ARTISTS = [
	{
		id: "1",
		name: "The Weeknd",
		type: "artist",
		image: "https://picsum.photos/200/200?random=18",
	},
	{
		id: "2",
		name: "Dua Lipa",
		type: "artist",
		image: "https://picsum.photos/200/200?random=19",
	},
	{
		id: "3",
		name: "Ariana Grande",
		type: "artist",
		image: "https://picsum.photos/200/200?random=20",
	},
	{
		id: "4",
		name: "Taylor Swift",
		type: "artist",
		image: "https://picsum.photos/200/200?random=21",
	},
	{
		id: "5",
		name: "Harry Styles",
		type: "artist",
		image: "https://picsum.photos/200/200?random=22",
	},
	{
		id: "6",
		name: "Post Malone",
		type: "artist",
		image: "https://picsum.photos/200/200?random=23",
	},
	{
		id: "7",
		name: "Ed Sheeran",
		type: "artist",
		image: "https://picsum.photos/200/200?random=24",
	},
	{
		id: "8",
		name: "Olivia Rodrigo",
		type: "artist",
		image: "https://picsum.photos/200/200?random=25",
	},
	{
		id: "9",
		name: "Doja Cat",
		type: "artist",
		image: "https://picsum.photos/200/200?random=26",
	},
	{
		id: "10",
		name: "Billie Eilish",
		type: "artist",
		image: "https://picsum.photos/200/200?random=27",
	},
	{
		id: "11",
		name: "Drake",
		type: "artist",
		image: "https://picsum.photos/200/200?random=28",
	},
	{
		id: "12",
		name: "Bruno Mars",
		type: "artist",
		image: "https://picsum.photos/200/200?random=29",
	},
];

// Simple Animated Library Item Component
const AnimatedLibraryItem = ({
	item,
	opacity,
}: {
	item: any;
	opacity: number;
}) => {
	return (
		<View style={{ opacity }}>
			<TouchableOpacity style={styles.libraryItem}>
				<View style={styles.itemImageContainer}>
					{item.isLiked ? (
						<View style={styles.likedSongsIcon}>
							<Typo size={24}>❤️</Typo>
						</View>
					) : (
						<View style={styles.imageWrapper}>
							<Image
								source={{
									uri:
										item.image ||
										"https://picsum.photos/200/200?random=0",
								}}
								style={[
									styles.itemImage,
									item.type === "artist" &&
										styles.artistImage,
									item.type === "album" && styles.albumImage,
									item.type === "playlist" &&
										styles.playlistImage,
								]}
							/>
						</View>
					)}
				</View>

				<View style={styles.itemInfo}>
					<View style={styles.titleRow}>
						<Typo
							size={16}
							fontWeight="500"
							color={COLORS.textPrimary}
							style={styles.itemTitle}
							textProps={{ numberOfLines: 1 }}
						>
							{item.title || item.name}
						</Typo>
						{item.type === "album" && (
							<View style={styles.albumIndicator} />
						)}
					</View>

					<Typo
						size={14}
						color={COLORS.textSecondary}
						textProps={{ numberOfLines: 1 }}
					>
						{item.type === "playlist" &&
							`Playlist • ${item.songCount} songs`}
						{item.type === "album" && `Album • ${item.artist}`}
						{item.type === "artist" && "Artist"}
						{item.isLiked && `${item.songCount} liked songs`}
					</Typo>
				</View>
			</TouchableOpacity>
		</View>
	);
};

const Library = () => {
	const [selectedFilter, setSelectedFilter] = useState("all");
	const [viewMode, setViewMode] = useState<"list" | "grid">("list");
	const [displayData, setDisplayData] = useState<any[]>([]);
	const [isAnimating, setIsAnimating] = useState(false);
	const [opacity, setOpacity] = useState(1);

	const filters = [
		{ id: "all", label: "All" },
		{ id: "playlists", label: "Playlists" },
		{ id: "artists", label: "Artists" },
		{ id: "albums", label: "Albums" },
	];

	const getFilteredData = () => {
		switch (selectedFilter) {
			case "playlists":
				return SAMPLE_PLAYLISTS;
			case "artists":
				return SAMPLE_ARTISTS;
			case "albums":
				return SAMPLE_ALBUMS;
			default:
				return [
					...SAMPLE_PLAYLISTS,
					...SAMPLE_ALBUMS,
					...SAMPLE_ARTISTS,
				];
		}
	};

	// Initialize display data
	useEffect(() => {
		setDisplayData(getFilteredData());
	}, []);

	// Handle filter change with simple animation
	const handleFilterChange = (filterId: string) => {
		if (isAnimating || filterId === selectedFilter) return;

		setIsAnimating(true);
		setOpacity(0);

		setTimeout(() => {
			// Update filter and data
			setSelectedFilter(filterId);
			const newData =
				filterId === "playlists"
					? SAMPLE_PLAYLISTS
					: filterId === "artists"
					? SAMPLE_ARTISTS
					: filterId === "albums"
					? SAMPLE_ALBUMS
					: [
							...SAMPLE_PLAYLISTS,
							...SAMPLE_ALBUMS,
							...SAMPLE_ARTISTS,
					  ];

			setDisplayData(newData);
			setOpacity(1);

			setTimeout(() => {
				setIsAnimating(false);
			}, 200);
		}, 150);
	};

	const renderLibraryItem = ({ item }: { item: any }) => (
		<AnimatedLibraryItem item={item} opacity={opacity} />
	);

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerTop}>
					<Typo
						size={24}
						fontWeight="bold"
						color={COLORS.textPrimary}
					>
						Your Library
					</Typo>
					<View style={styles.headerButtons}>
						<TouchableOpacity style={styles.headerButton}>
							<Typo size={18} color={COLORS.textPrimary}>
								🔍
							</Typo>
						</TouchableOpacity>
						<TouchableOpacity style={styles.headerButton}>
							<Typo size={18} color={COLORS.textPrimary}>
								+
							</Typo>
						</TouchableOpacity>
					</View>
				</View>

				{/* Filter buttons */}
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.filtersContainer}
					contentContainerStyle={styles.filtersContent}
				>
					{filters.map((filter) => (
						<TouchableOpacity
							key={filter.id}
							style={[
								styles.filterButton,
								selectedFilter === filter.id &&
									styles.filterButtonActive,
							]}
							onPress={() => handleFilterChange(filter.id)}
						>
							<Typo
								size={14}
								fontWeight="500"
								color={
									selectedFilter === filter.id
										? COLORS.textPrimary
										: COLORS.textSecondary
								}
							>
								{filter.label}
							</Typo>
						</TouchableOpacity>
					))}
				</ScrollView>

				{/* Sort and view options */}
				<View style={styles.sortContainer}>
					<TouchableOpacity style={styles.sortButton}>
						<Typo size={14} color={COLORS.textSecondary}>
							↓ Recently added
						</Typo>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.viewModeButton}
						onPress={() =>
							setViewMode(viewMode === "list" ? "grid" : "list")
						}
					>
						<Typo size={16} color={COLORS.textSecondary}>
							{viewMode === "list" ? "☰" : "⊞"}
						</Typo>
					</TouchableOpacity>
				</View>
			</View>

			{/* Library items */}
			<View style={[styles.libraryList, { opacity }]}>
				<FlatList
					data={displayData}
					contentContainerStyle={{ paddingBottom: 110 }}
					renderItem={renderLibraryItem}
					keyExtractor={(item) => `${item.type}-${item.id}`}
					showsVerticalScrollIndicator={false}
					key={selectedFilter}
				/>
			</View>
		</View>
	);
};

export default Library;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	header: {
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 8,
	},
	headerTop: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	headerButtons: {
		flexDirection: "row",
		gap: 16,
	},
	headerButton: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: COLORS.surface,
		justifyContent: "center",
		alignItems: "center",
	},
	filtersContainer: {
		marginBottom: 16,
	},
	filtersContent: {
		paddingRight: 16,
	},
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
	sortContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	sortButton: {
		flexDirection: "row",
		alignItems: "center",
	},
	viewModeButton: {
		padding: 8,
	},
	libraryList: {
		flex: 1,
		paddingHorizontal: 16,
	},
	libraryItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		paddingHorizontal: 8,
		borderRadius: 8,
	},
	itemImageContainer: {
		marginRight: 12,
	},
	imageWrapper: {
		position: "relative",
	},
	itemImage: {
		width: 56,
		height: 56,
		backgroundColor: COLORS.surface,
	},
	albumImage: {
		borderRadius: 6,
	},
	playlistImage: {
		borderRadius: 4,
	},
	artistImage: {
		borderRadius: 28,
	},
	likedSongsIcon: {
		width: 56,
		height: 56,
		borderRadius: 4,
		backgroundColor: COLORS.primary,
		justifyContent: "center",
		alignItems: "center",
	},
	itemInfo: {
		flex: 1,
		justifyContent: "center",
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 2,
	},
	itemTitle: {
		flex: 1,
	},
	albumIndicator: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: COLORS.primary,
		marginLeft: 8,
	},
});

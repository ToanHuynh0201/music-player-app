import FilterButton from "@/components/FilterButton";
import LibraryItem from "@/components/LibraryItem";
import Typo from "@/components/Typo";
import { COLORS } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import {
	FlatList,
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
		type: "liked" as const,
		songCount: 247,
		image: null,
		isLiked: true,
	},
	{
		id: "2",
		title: "My Playlist #1",
		type: "playlist" as const,
		songCount: 23,
		image: "https://picsum.photos/200/200?random=1",
	},
	{
		id: "3",
		title: "Chill Vibes",
		type: "playlist" as const,
		songCount: 45,
		image: "https://picsum.photos/200/200?random=2",
	},
	{
		id: "4",
		title: "Workout Mix",
		type: "playlist" as const,
		songCount: 32,
		image: "https://picsum.photos/200/200?random=3",
	},
	{
		id: "5",
		title: "Lo-Fi Study",
		type: "playlist" as const,
		songCount: 67,
		image: "https://picsum.photos/200/200?random=4",
	},
	{
		id: "6",
		title: "Road Trip Hits",
		type: "playlist" as const,
		songCount: 89,
		image: "https://picsum.photos/200/200?random=5",
	},
	{
		id: "7",
		title: "Late Night Jazz",
		type: "playlist" as const,
		songCount: 34,
		image: "https://picsum.photos/200/200?random=6",
	},
	{
		id: "8",
		title: "Party Time",
		type: "playlist" as const,
		songCount: 56,
		image: "https://picsum.photos/200/200?random=7",
	},
];

const SAMPLE_ALBUMS = [
	{
		id: "1",
		title: "After Hours",
		artist: "The Weeknd",
		type: "album" as const,
		image: "https://picsum.photos/200/200?random=8",
		year: 2020,
	},
	{
		id: "2",
		title: "Future Nostalgia",
		artist: "Dua Lipa",
		type: "album" as const,
		image: "https://picsum.photos/200/200?random=9",
		year: 2020,
	},
	{
		id: "3",
		title: "Blinding Lights",
		artist: "The Weeknd",
		type: "album" as const,
		image: "https://picsum.photos/200/200?random=10",
		year: 2019,
	},
	{
		id: "4",
		title: "Positions",
		artist: "Ariana Grande",
		type: "album" as const,
		image: "https://picsum.photos/200/200?random=11",
		year: 2020,
	},
	{
		id: "5",
		title: "Folklore",
		artist: "Taylor Swift",
		type: "album" as const,
		image: "https://picsum.photos/200/200?random=12",
		year: 2020,
	},
	{
		id: "6",
		title: "Fine Line",
		artist: "Harry Styles",
		type: "album" as const,
		image: "https://picsum.photos/200/200?random=13",
		year: 2019,
	},
	{
		id: "7",
		title: "Circles",
		artist: "Post Malone",
		type: "album" as const,
		image: "https://picsum.photos/200/200?random=14",
		year: 2019,
	},
	{
		id: "8",
		title: "Divide",
		artist: "Ed Sheeran",
		type: "album" as const,
		image: "https://picsum.photos/200/200?random=15",
		year: 2017,
	},
	{
		id: "9",
		title: "Sour",
		artist: "Olivia Rodrigo",
		type: "album" as const,
		image: "https://picsum.photos/200/200?random=16",
		year: 2021,
	},
	{
		id: "10",
		title: "Planet Her",
		artist: "Doja Cat",
		type: "album" as const,
		image: "https://picsum.photos/200/200?random=17",
		year: 2021,
	},
];

const SAMPLE_ARTISTS = [
	{
		id: "1",
		name: "The Weeknd",
		type: "artist" as const,
		image: "https://picsum.photos/200/200?random=18",
	},
	{
		id: "2",
		name: "Dua Lipa",
		type: "artist" as const,
		image: "https://picsum.photos/200/200?random=19",
	},
	{
		id: "3",
		name: "Ariana Grande",
		type: "artist" as const,
		image: "https://picsum.photos/200/200?random=20",
	},
	{
		id: "4",
		name: "Taylor Swift",
		type: "artist" as const,
		image: "https://picsum.photos/200/200?random=21",
	},
	{
		id: "5",
		name: "Harry Styles",
		type: "artist" as const,
		image: "https://picsum.photos/200/200?random=22",
	},
	{
		id: "6",
		name: "Post Malone",
		type: "artist" as const,
		image: "https://picsum.photos/200/200?random=23",
	},
	{
		id: "7",
		name: "Ed Sheeran",
		type: "artist" as const,
		image: "https://picsum.photos/200/200?random=24",
	},
	{
		id: "8",
		name: "Olivia Rodrigo",
		type: "artist" as const,
		image: "https://picsum.photos/200/200?random=25",
	},
	{
		id: "9",
		name: "Doja Cat",
		type: "artist" as const,
		image: "https://picsum.photos/200/200?random=26",
	},
	{
		id: "10",
		name: "Billie Eilish",
		type: "artist" as const,
		image: "https://picsum.photos/200/200?random=27",
	},
	{
		id: "11",
		name: "Drake",
		type: "artist" as const,
		image: "https://picsum.photos/200/200?random=28",
	},
	{
		id: "12",
		name: "Bruno Mars",
		type: "artist" as const,
		image: "https://picsum.photos/200/200?random=29",
	},
];

// Main Library Component
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
		<LibraryItem item={item} opacity={opacity} />
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
						<FilterButton
							key={filter.id}
							label={filter.label}
							isSelected={selectedFilter === filter.id}
							onPress={() => handleFilterChange(filter.id)}
						/>
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
					renderItem={renderLibraryItem}
					contentContainerStyle={{ paddingBottom: 110 }}
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
});

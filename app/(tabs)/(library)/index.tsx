import FilterButton from "@/components/FilterButton";
import LibraryItem from "@/components/LibraryItem";
import Typo from "@/components/Typo";
import { COLORS } from "@/constants/Colors";
import { SAMPLE_ALBUMS, SAMPLE_ARTISTS, SAMPLE_PLAYLISTS } from "@/data";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	FlatList,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";

// Sample data

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
						<TouchableOpacity
							style={styles.headerButton}
							onPress={() => router.navigate("/(tabs)/(search)")}
						>
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

import Typo from "@/components/Typo";
import { COLORS } from "@/constants/Colors";
import React, { useState } from "react";
import {
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const TABS = [
	{ id: "songs", label: "Bài hát" },
	{ id: "artists", label: "Nghệ sĩ" },
	{ id: "albums", label: "Album" },
];

// Sample data
const SAMPLE_SONGS = [
	{ id: "1", name: "Em của ngày hôm qua", artist: "Sơn Tùng M-TP" },
	{ id: "2", name: "Nơi này có anh", artist: "Sơn Tùng M-TP" },
	{ id: "3", name: "Có chắc yêu là đây", artist: "Sơn Tùng M-TP" },
];
const SAMPLE_ARTISTS = [
	{ id: "a1", name: "Sơn Tùng M-TP" },
	{ id: "a2", name: "Đen Vâu" },
	{ id: "a3", name: "Mỹ Tâm" },
];
const SAMPLE_ALBUMS = [
	{ id: "al1", name: "Sky Tour", artist: "Sơn Tùng M-TP" },
	{ id: "al2", name: "Show of Đen", artist: "Đen Vâu" },
];

const Search = () => {
	const [query, setQuery] = useState("");
	const [activeTab, setActiveTab] = useState("songs");

	const filterData = () => {
		const q = query.toLowerCase();
		if (activeTab === "songs") {
			return SAMPLE_SONGS.filter(
				(item) =>
					item.name.toLowerCase().includes(q) ||
					item.artist.toLowerCase().includes(q)
			);
		}
		if (activeTab === "artists") {
			return SAMPLE_ARTISTS.filter((item) =>
				item.name.toLowerCase().includes(q)
			);
		}
		if (activeTab === "albums") {
			return SAMPLE_ALBUMS.filter(
				(item) =>
					item.name.toLowerCase().includes(q) ||
					item.artist.toLowerCase().includes(q)
			);
		}
		return [];
	};

	const renderItem = ({ item }: { item: any }) => {
		if (activeTab === "songs") {
			return (
				<View style={styles.resultItem}>
					<Text style={styles.songName}>{item.name}</Text>
					<Text style={styles.songArtist}>{item.artist}</Text>
				</View>
			);
		}
		if (activeTab === "artists") {
			return (
				<View style={styles.resultItem}>
					<Text style={styles.artistName}>{item.name}</Text>
				</View>
			);
		}
		if (activeTab === "albums") {
			return (
				<View style={styles.resultItem}>
					<Text style={styles.albumName}>{item.name}</Text>
					<Text style={styles.albumArtist}>{item.artist}</Text>
				</View>
			);
		}
		return null;
	};

	return (
		<View style={styles.container}>
			<Typo size={24} fontWeight="bold" style={styles.header}>
				Tìm kiếm
			</Typo>
			<View style={styles.searchBox}>
				<TextInput
					style={styles.input}
					placeholder="Nhập tên bài hát, nghệ sĩ hoặc album..."
					placeholderTextColor={COLORS.textSecondary}
					value={query}
					onChangeText={setQuery}
				/>
			</View>
			<View style={styles.tabs}>
				{TABS.map((tab) => (
					<TouchableOpacity
						key={tab.id}
						style={[
							styles.tab,
							activeTab === tab.id && styles.tabActive,
						]}
						onPress={() => setActiveTab(tab.id)}
					>
						<Text
							style={[
								styles.tabLabel,
								activeTab === tab.id && styles.tabLabelActive,
							]}
						>
							{tab.label}
						</Text>
					</TouchableOpacity>
				))}
			</View>
			<FlatList
				data={filterData()}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				style={styles.resultList}
				ListEmptyComponent={
					<Text style={styles.emptyText}>Không có kết quả</Text>
				}
			/>
		</View>
	);
};

export default Search;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
		paddingHorizontal: 16,
		paddingTop: 24,
	},
	header: {
		marginBottom: 16,
	},
	searchBox: {
		backgroundColor: COLORS.surface,
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 8,
		marginBottom: 16,
	},
	input: {
		fontSize: 16,
		color: COLORS.textPrimary,
	},
	tabs: {
		flexDirection: "row",
		marginBottom: 16,
	},
	tab: {
		flex: 1,
		paddingVertical: 10,
		alignItems: "center",
		borderBottomWidth: 2,
		borderBottomColor: "transparent",
	},
	tabActive: {
		borderBottomColor: COLORS.primary,
	},
	tabLabel: {
		fontSize: 16,
		color: COLORS.textSecondary,
		fontWeight: "500",
	},
	tabLabelActive: {
		color: COLORS.primary,
		fontWeight: "bold",
	},
	resultList: {
		flex: 1,
	},
	resultItem: {
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
	},
	songName: {
		fontSize: 16,
		color: COLORS.textPrimary,
		fontWeight: "bold",
	},
	songArtist: {
		fontSize: 14,
		color: COLORS.textSecondary,
	},
	artistName: {
		fontSize: 16,
		color: COLORS.textPrimary,
	},
	albumName: {
		fontSize: 16,
		color: COLORS.textPrimary,
		fontWeight: "bold",
	},
	albumArtist: {
		fontSize: 14,
		color: COLORS.textSecondary,
	},
	emptyText: {
		textAlign: "center",
		color: COLORS.textSecondary,
		marginTop: 40,
	},
});

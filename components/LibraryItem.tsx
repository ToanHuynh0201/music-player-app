import Typo from "@/components/Typo";
import { COLORS } from "@/constants/Colors";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface LibraryItemProps {
	item: {
		id: string;
		title?: string;
		name?: string;
		type: "playlist" | "album" | "artist" | "liked";
		songCount?: number;
		artist?: string;
		year?: number;
		image?: string;
		isLiked?: boolean;
	};
	opacity: number;
}

const LibraryItem: React.FC<LibraryItemProps> = ({ item, opacity }) => {
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

export default LibraryItem;

const styles = StyleSheet.create({
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

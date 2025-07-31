import AsyncStorage from "@react-native-async-storage/async-storage";
import { spotifyAuth } from "./SpotifyAuth";

// Base Spotify API URL
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

// User interface
export interface SpotifyUser {
	id: string;
	display_name: string;
	email: string;
	images: Array<{
		url: string;
		height: number;
		width: number;
	}>;
	followers: {
		total: number;
	};
	country: string;
	product: string;
}

// Playlist interface
export interface SpotifyPlaylist {
	id: string;
	name: string;
	description: string;
	images: Array<{
		url: string;
		height: number;
		width: number;
	}>;
	tracks: {
		total: number;
	};
	owner: {
		id: string;
		display_name: string;
	};
	public: boolean;
	collaborative: boolean;
}

// Track interface
export interface SpotifyTrack {
	id: string;
	name: string;
	artists: Array<{
		id: string;
		name: string;
	}>;
	album: {
		id: string;
		name: string;
		images: Array<{
			url: string;
			height: number;
			width: number;
		}>;
	};
	duration_ms: number;
	explicit: boolean;
	preview_url: string | null;
	popularity: number;
}

// Search results interface
export interface SpotifySearchResults {
	tracks?: {
		items: SpotifyTrack[];
		total: number;
	};
	artists?: {
		items: Array<{
			id: string;
			name: string;
			images: Array<{ url: string; height: number; width: number }>;
			followers: { total: number };
			genres: string[];
			popularity: number;
		}>;
		total: number;
	};
	albums?: {
		items: Array<{
			id: string;
			name: string;
			artists: Array<{ id: string; name: string }>;
			images: Array<{ url: string; height: number; width: number }>;
			total_tracks: number;
			release_date: string;
		}>;
		total: number;
	};
	playlists?: {
		items: SpotifyPlaylist[];
		total: number;
	};
}

class SpotifyService {
	// Make authenticated Spotify API request
	private async makeRequest(
		endpoint: string,
		options: RequestInit = {}
	): Promise<Response> {
		const accessToken = await spotifyAuth.getValidAccessToken();

		if (!accessToken) {
			throw new Error(
				"No valid access token available. Please login again."
			);
		}

		const url = `${SPOTIFY_API_BASE}${endpoint}`;

		const response = await fetch(url, {
			...options,
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
				...options.headers,
			},
		});

		// Handle token expiration
		if (response.status === 401) {
			console.log("🔄 Token expired, attempting refresh...");

			try {
				const newAccessToken = await spotifyAuth.getValidAccessToken();
				if (newAccessToken) {
					// Retry the request with new token
					return await fetch(url, {
						...options,
						headers: {
							Authorization: `Bearer ${newAccessToken}`,
							"Content-Type": "application/json",
							...options.headers,
						},
					});
				}
			} catch (refreshError) {
				console.error("Failed to refresh token:", refreshError);
			}

			throw new Error("Authentication failed. Please login again.");
		}

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.error?.message ||
					`Spotify API error: ${response.status} ${response.statusText}`
			);
		}

		return response;
	}

	// Get current user profile
	async getCurrentUser(): Promise<SpotifyUser> {
		try {
			// Try to get cached user first
			const cachedUser = await AsyncStorage.getItem("spotify_user");
			if (cachedUser) {
				return JSON.parse(cachedUser);
			}

			// Fetch from API if not cached
			const response = await this.makeRequest("/me");
			const user = await response.json();

			// Cache the user data
			await AsyncStorage.setItem("spotify_user", JSON.stringify(user));

			return user;
		} catch (error) {
			console.error("Error fetching current user:", error);
			throw error;
		}
	}

	// Get user's playlists
	async getUserPlaylists(
		limit: number = 20,
		offset: number = 0
	): Promise<{
		items: SpotifyPlaylist[];
		total: number;
		next: string | null;
	}> {
		try {
			const response = await this.makeRequest(
				`/me/playlists?limit=${limit}&offset=${offset}`
			);
			return await response.json();
		} catch (error) {
			console.error("Error fetching user playlists:", error);
			throw error;
		}
	}

	// Get playlist tracks
	async getPlaylistTracks(
		playlistId: string,
		limit: number = 50,
		offset: number = 0
	): Promise<{
		items: Array<{ track: SpotifyTrack }>;
		total: number;
		next: string | null;
	}> {
		try {
			const response = await this.makeRequest(
				`/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`
			);
			return await response.json();
		} catch (error) {
			console.error("Error fetching playlist tracks:", error);
			throw error;
		}
	}

	// Search for content
	async search(
		query: string,
		types: string[] = ["track", "artist", "album", "playlist"],
		limit: number = 20
	): Promise<SpotifySearchResults> {
		try {
			const typeString = types.join(",");
			const encodedQuery = encodeURIComponent(query);

			const response = await this.makeRequest(
				`/search?q=${encodedQuery}&type=${typeString}&limit=${limit}`
			);
			return await response.json();
		} catch (error) {
			console.error("Error searching:", error);
			throw error;
		}
	}

	// Get user's top tracks
	async getTopTracks(
		timeRange: "short_term" | "medium_term" | "long_term" = "medium_term",
		limit: number = 20
	): Promise<{ items: SpotifyTrack[] }> {
		try {
			const response = await this.makeRequest(
				`/me/top/tracks?time_range=${timeRange}&limit=${limit}`
			);
			return await response.json();
		} catch (error) {
			console.error("Error fetching top tracks:", error);
			throw error;
		}
	}

	// Get user's top artists
	async getTopArtists(
		timeRange: "short_term" | "medium_term" | "long_term" = "medium_term",
		limit: number = 20
	): Promise<{
		items: Array<{
			id: string;
			name: string;
			images: Array<{ url: string; height: number; width: number }>;
			followers: { total: number };
			genres: string[];
			popularity: number;
		}>;
	}> {
		try {
			const response = await this.makeRequest(
				`/me/top/artists?time_range=${timeRange}&limit=${limit}`
			);
			return await response.json();
		} catch (error) {
			console.error("Error fetching top artists:", error);
			throw error;
		}
	}

	// Get recently played tracks
	async getRecentlyPlayed(limit: number = 20): Promise<{
		items: Array<{
			track: SpotifyTrack;
			played_at: string;
		}>;
	}> {
		try {
			const response = await this.makeRequest(
				`/me/player/recently-played?limit=${limit}`
			);
			return await response.json();
		} catch (error) {
			console.error("Error fetching recently played:", error);
			throw error;
		}
	}

	// Get user's saved albums
	async getSavedAlbums(
		limit: number = 20,
		offset: number = 0
	): Promise<{
		items: Array<{
			album: {
				id: string;
				name: string;
				artists: Array<{ id: string; name: string }>;
				images: Array<{ url: string; height: number; width: number }>;
				total_tracks: number;
				release_date: string;
			};
			added_at: string;
		}>;
		total: number;
	}> {
		try {
			const response = await this.makeRequest(
				`/me/albums?limit=${limit}&offset=${offset}`
			);
			return await response.json();
		} catch (error) {
			console.error("Error fetching saved albums:", error);
			throw error;
		}
	}

	// Get user's saved tracks
	async getSavedTracks(
		limit: number = 20,
		offset: number = 0
	): Promise<{
		items: Array<{
			track: SpotifyTrack;
			added_at: string;
		}>;
		total: number;
	}> {
		try {
			const response = await this.makeRequest(
				`/me/tracks?limit=${limit}&offset=${offset}`
			);
			return await response.json();
		} catch (error) {
			console.error("Error fetching saved tracks:", error);
			throw error;
		}
	}

	// Add track to user's library
	async saveTrack(trackId: string): Promise<void> {
		try {
			await this.makeRequest(`/me/tracks`, {
				method: "PUT",
				body: JSON.stringify({ ids: [trackId] }),
			});
		} catch (error) {
			console.error("Error saving track:", error);
			throw error;
		}
	}

	// Remove track from user's library
	async removeTrack(trackId: string): Promise<void> {
		try {
			await this.makeRequest(`/me/tracks`, {
				method: "DELETE",
				body: JSON.stringify({ ids: [trackId] }),
			});
		} catch (error) {
			console.error("Error removing track:", error);
			throw error;
		}
	}

	// Check if tracks are saved
	async areTracksSaved(trackIds: string[]): Promise<boolean[]> {
		try {
			const response = await this.makeRequest(
				`/me/tracks/contains?ids=${trackIds.join(",")}`
			);
			return await response.json();
		} catch (error) {
			console.error("Error checking saved tracks:", error);
			throw error;
		}
	}

	// Get current playback state
	async getCurrentPlayback(): Promise<{
		device: {
			id: string;
			is_active: boolean;
			name: string;
			type: string;
			volume_percent: number;
		};
		shuffle_state: boolean;
		repeat_state: "off" | "track" | "context";
		timestamp: number;
		progress_ms: number;
		is_playing: boolean;
		item: SpotifyTrack;
	} | null> {
		try {
			const response = await this.makeRequest("/me/player");

			// No content means no active device
			if (response.status === 204) {
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Error fetching current playback:", error);
			return null;
		}
	}

	// Get available devices
	async getDevices(): Promise<{
		devices: Array<{
			id: string;
			is_active: boolean;
			name: string;
			type: string;
			volume_percent: number;
		}>;
	}> {
		try {
			const response = await this.makeRequest("/me/player/devices");
			return await response.json();
		} catch (error) {
			console.error("Error fetching devices:", error);
			throw error;
		}
	}

	// Control playback
	async play(
		deviceId?: string,
		contextUri?: string,
		trackUris?: string[]
	): Promise<void> {
		try {
			const body: any = {};

			if (contextUri) {
				body.context_uri = contextUri;
			} else if (trackUris) {
				body.uris = trackUris;
			}

			const endpoint = deviceId
				? `/me/player/play?device_id=${deviceId}`
				: "/me/player/play";

			await this.makeRequest(endpoint, {
				method: "PUT",
				body:
					Object.keys(body).length > 0
						? JSON.stringify(body)
						: undefined,
			});
		} catch (error) {
			console.error("Error starting playback:", error);
			throw error;
		}
	}

	async pause(): Promise<void> {
		try {
			await this.makeRequest("/me/player/pause", {
				method: "PUT",
			});
		} catch (error) {
			console.error("Error pausing playback:", error);
			throw error;
		}
	}

	async skipToNext(): Promise<void> {
		try {
			await this.makeRequest("/me/player/next", {
				method: "POST",
			});
		} catch (error) {
			console.error("Error skipping to next:", error);
			throw error;
		}
	}

	async skipToPrevious(): Promise<void> {
		try {
			await this.makeRequest("/me/player/previous", {
				method: "POST",
			});
		} catch (error) {
			console.error("Error skipping to previous:", error);
			throw error;
		}
	}
}

export const spotifyService = new SpotifyService();

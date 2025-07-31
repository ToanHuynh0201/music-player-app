import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

// Complete the auth session for web browsers
WebBrowser.maybeCompleteAuthSession();

// Warm up the browser for better performance
if (Platform.OS === "web") {
	WebBrowser.warmUpAsync();
}

// Spotify OAuth configuration
const SPOTIFY_CLIENT_ID = "066b93b708ef4bfb99ee25877296b19b";

// Scopes for Spotify API access
const SCOPES = [
	"user-read-email",
	"user-read-private",
	"user-library-read",
	"user-library-modify",
	"playlist-read-private",
	"playlist-read-collaborative",
	"playlist-modify-private",
	"playlist-modify-public",
	"user-read-recently-played",
	"user-top-read",
	"user-read-playback-state",
	"user-modify-playback-state",
	"user-read-currently-playing",
	"streaming",
];

// OAuth endpoints
const discovery = {
	authorizationEndpoint: "https://accounts.spotify.com/authorize",
	tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export interface SpotifyTokens {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
	tokenType: string;
	scope: string;
	expiresAt?: number;
}

class SpotifyAuthService {
	private redirectUri: string;

	constructor() {
		// Create redirect URI with proper fallbacks
		this.redirectUri = makeRedirectUri({
			scheme: "musicplayerapp",
			path: "auth",
		});

		console.log("🔗 Redirect URI:", this.redirectUri);
		console.log("🏗️ Development mode:", __DEV__);
		console.log("📱 Platform:", Platform.OS);
	}

	// Get auth configuration for components
	getAuthConfig() {
		return {
			clientId: SPOTIFY_CLIENT_ID,
			scopes: SCOPES,
			usePKCE: true,
			redirectUri: this.redirectUri,
			responseType: AuthSession.ResponseType.Code,
			discovery,
		};
	}

	// Exchange authorization code for access token
	async exchangeCodeForTokens(
		code: string,
		codeVerifier: string
	): Promise<SpotifyTokens> {
		try {
			const tokenRequestParams = {
				grant_type: "authorization_code",
				code,
				redirect_uri: this.redirectUri,
				client_id: SPOTIFY_CLIENT_ID,
				code_verifier: codeVerifier,
			};

			console.log("📡 Making token request...");

			const response = await fetch(discovery.tokenEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams(tokenRequestParams).toString(),
			});

			const data = await response.json();

			if (response.ok) {
				const tokens: SpotifyTokens = {
					accessToken: data.access_token,
					refreshToken: data.refresh_token,
					expiresIn: data.expires_in,
					tokenType: data.token_type,
					scope: data.scope,
					expiresAt: Date.now() + data.expires_in * 1000,
				};

				// Store tokens automatically
				await this.storeTokens(tokens);
				console.log("✅ Tokens stored successfully");

				return tokens;
			} else {
				console.error("Token exchange error:", data);
				throw new Error(
					data.error_description || "Token exchange failed"
				);
			}
		} catch (error) {
			console.error("Token exchange error:", error);
			throw error;
		}
	}

	// Refresh access token
	async refreshToken(refreshToken?: string): Promise<SpotifyTokens> {
		try {
			// If no refresh token provided, try to get from storage
			const currentRefreshToken =
				refreshToken || (await this.getStoredTokens())?.refreshToken;

			if (!currentRefreshToken) {
				throw new Error("No refresh token available");
			}

			const tokenRequestParams = {
				grant_type: "refresh_token",
				refresh_token: currentRefreshToken,
				client_id: SPOTIFY_CLIENT_ID,
			};

			const response = await fetch(discovery.tokenEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams(tokenRequestParams).toString(),
			});

			const data = await response.json();

			if (response.ok) {
				const tokens: SpotifyTokens = {
					accessToken: data.access_token,
					refreshToken: data.refresh_token || currentRefreshToken,
					expiresIn: data.expires_in,
					tokenType: data.token_type,
					scope: data.scope,
					expiresAt: Date.now() + data.expires_in * 1000,
				};

				await this.storeTokens(tokens);
				console.log("✅ Tokens refreshed successfully");

				return tokens;
			} else {
				console.error("Token refresh error:", data);
				throw new Error(
					data.error_description || "Token refresh failed"
				);
			}
		} catch (error) {
			console.error("Token refresh error:", error);
			// If refresh fails, clear stored tokens
			await this.clearTokens();
			throw error;
		}
	}

	// Store tokens securely
	private async storeTokens(tokens: SpotifyTokens): Promise<void> {
		try {
			await AsyncStorage.setItem(
				"spotify_tokens",
				JSON.stringify(tokens)
			);
		} catch (error) {
			console.error("Error storing tokens:", error);
			throw error;
		}
	}

	// Get stored tokens and auto-refresh if needed
	async getStoredTokens(): Promise<SpotifyTokens | null> {
		try {
			const tokensJson = await AsyncStorage.getItem("spotify_tokens");
			if (!tokensJson) return null;

			const tokenData = JSON.parse(tokensJson);

			// Check if token is expired (with 5 minute buffer)
			const bufferTime = 5 * 60 * 1000; // 5 minutes
			if (
				tokenData.expiresAt &&
				Date.now() >= tokenData.expiresAt - bufferTime
			) {
				console.log("🔄 Token expired, refreshing...");
				try {
					return await this.refreshToken(tokenData.refreshToken);
				} catch (error) {
					console.error("Failed to refresh token:", error);
					return null;
				}
			}

			return tokenData;
		} catch (error) {
			console.error("Error getting stored tokens:", error);
			return null;
		}
	}

	// Get valid access token (auto-refresh if needed)
	async getValidAccessToken(): Promise<string | null> {
		const tokens = await this.getStoredTokens();
		return tokens?.accessToken || null;
	}
	// Clear stored tokens
	async clearTokens(): Promise<void> {
		try {
			await AsyncStorage.removeItem("spotify_tokens");
			await AsyncStorage.removeItem("spotify_user");
			console.log("🗑️ Tokens cleared");
		} catch (error) {
			console.error("Error clearing tokens:", error);
		}
	}

	// Check if user is authenticated
	async isAuthenticated(): Promise<boolean> {
		const tokens = await this.getStoredTokens();
		return tokens !== null && !!tokens.accessToken;
	}

	// Logout - clear stored tokens
	async logout(): Promise<void> {
		await this.clearTokens();
		console.log("👋 User logged out");
	}

	// Get redirect URI (for external use)
	getRedirectUri(): string {
		return this.redirectUri;
	}
}

export const spotifyAuth = new SpotifyAuthService();

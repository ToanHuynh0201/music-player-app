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
const SPOTIFY_CLIENT_SECRET = "your_client_secret_here"; // Get this from Spotify dashboard

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
}

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

class SpotifyAuthService {
	private request: AuthSession.AuthRequest | null = null;
	private redirectUri: string;

	constructor() {
		// Create redirect URI with proper fallbacks
		this.redirectUri = makeRedirectUri({
			scheme: "musicplayerapp",
			path: "auth",
			// Fallback for development
			preferLocalhost: true,
		});

		console.log("🔗 Redirect URI:", this.redirectUri);

		// Additional logging for debugging
		console.log("🏗️ Development mode:", __DEV__);
		console.log("📱 Platform:", Platform.OS);
	}

	// Initialize the auth request
	private createAuthRequest() {
		if (!this.request) {
			this.request = new AuthSession.AuthRequest({
				clientId: SPOTIFY_CLIENT_ID,
				scopes: SCOPES,
				usePKCE: true,
				redirectUri: this.redirectUri,
				responseType: AuthSession.ResponseType.Code,
			});
		}
		return this.request;
	}

	// Initiate Spotify login
	async login(): Promise<SpotifyTokens | null> {
		try {
			const request = this.createAuthRequest();

			console.log(
				"🚀 Starting Spotify auth with redirect URI:",
				this.redirectUri
			);

			// Start the authentication flow
			const result = await request.promptAsync(discovery);

			console.log("🔐 Auth result:", result.type);

			if (result.type === "success" && result.params.code) {
				console.log(
					"✅ Authorization successful, exchanging code for tokens..."
				);

				// Exchange authorization code for access token
				const tokens = await this.exchangeCodeForTokens(
					result.params.code,
					request.codeVerifier!
				);

				if (tokens) {
					console.log("🎉 Tokens received successfully");
					// Store tokens securely
					await this.storeTokens(tokens);
					return tokens;
				}
			} else if (result.type === "error") {
				console.error("❌ Auth error:", result.error);
				if (result.error?.message?.includes("INVALID_CLIENT")) {
					throw new Error(
						"Invalid redirect URI. Please check Spotify app configuration."
					);
				}
				throw new Error(
					result.error?.message || "Authentication failed"
				);
			} else if (result.type === "cancel") {
				console.log("👤 User cancelled authentication");
				return null;
			}

			return null;
		} catch (error) {
			console.error("💥 Spotify login error:", error);
			throw error;
		}
	}

	// Exchange authorization code for access token
	private async exchangeCodeForTokens(
		code: string,
		codeVerifier: string
	): Promise<SpotifyTokens | null> {
		try {
			const tokenRequestParams = {
				grant_type: "authorization_code",
				code,
				redirect_uri: this.redirectUri,
				client_id: SPOTIFY_CLIENT_ID,
				code_verifier: codeVerifier,
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
				return {
					accessToken: data.access_token,
					refreshToken: data.refresh_token,
					expiresIn: data.expires_in,
					tokenType: data.token_type,
					scope: data.scope,
				};
			} else {
				console.error("Token exchange error:", data);
				return null;
			}
		} catch (error) {
			console.error("Token exchange error:", error);
			return null;
		}
	}

	// Refresh access token
	async refreshToken(refreshToken: string): Promise<SpotifyTokens | null> {
		try {
			const tokenRequestParams = {
				grant_type: "refresh_token",
				refresh_token: refreshToken,
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
				const tokens = {
					accessToken: data.access_token,
					refreshToken: data.refresh_token || refreshToken, // Keep old refresh token if new one not provided
					expiresIn: data.expires_in,
					tokenType: data.token_type,
					scope: data.scope,
				};

				await this.storeTokens(tokens);
				return tokens;
			} else {
				console.error("Token refresh error:", data);
				return null;
			}
		} catch (error) {
			console.error("Token refresh error:", error);
			return null;
		}
	}

	// Store tokens securely
	private async storeTokens(tokens: SpotifyTokens): Promise<void> {
		try {
			const tokenData = {
				...tokens,
				expiresAt: Date.now() + tokens.expiresIn * 1000,
			};

			await AsyncStorage.setItem(
				"spotify_tokens",
				JSON.stringify(tokenData)
			);
		} catch (error) {
			console.error("Error storing tokens:", error);
		}
	}

	// Get stored tokens
	async getStoredTokens(): Promise<SpotifyTokens | null> {
		try {
			const tokensJson = await AsyncStorage.getItem("spotify_tokens");
			if (!tokensJson) return null;

			const tokenData = JSON.parse(tokensJson);

			// Check if token is expired
			if (Date.now() >= tokenData.expiresAt) {
				// Try to refresh the token
				return await this.refreshToken(tokenData.refreshToken);
			}

			return {
				accessToken: tokenData.accessToken,
				refreshToken: tokenData.refreshToken,
				expiresIn: tokenData.expiresIn,
				tokenType: tokenData.tokenType,
				scope: tokenData.scope,
			};
		} catch (error) {
			console.error("Error getting stored tokens:", error);
			return null;
		}
	}

	// Get current user profile
	async getCurrentUser(accessToken: string): Promise<SpotifyUser | null> {
		try {
			const response = await fetch("https://api.spotify.com/v1/me", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (response.ok) {
				return await response.json();
			} else {
				console.error("Error fetching user profile:", response.status);
				return null;
			}
		} catch (error) {
			console.error("Error fetching user profile:", error);
			return null;
		}
	}

	// Logout - clear stored tokens
	async logout(): Promise<void> {
		try {
			await AsyncStorage.removeItem("spotify_tokens");
			await AsyncStorage.removeItem("spotify_user");
		} catch (error) {
			console.error("Error during logout:", error);
		}
	}

	// Check if user is authenticated
	async isAuthenticated(): Promise<boolean> {
		const tokens = await this.getStoredTokens();
		return tokens !== null;
	}

	// Make authenticated Spotify API request
	async makeSpotifyRequest(
		endpoint: string,
		options: RequestInit = {}
	): Promise<any> {
		const tokens = await this.getStoredTokens();

		if (!tokens) {
			throw new Error("No authentication tokens available");
		}

		const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
			...options,
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
				"Content-Type": "application/json",
				...options.headers,
			},
		});

		if (response.status === 401) {
			// Token might be expired, try to refresh
			const newTokens = await this.refreshToken(tokens.refreshToken);
			if (newTokens) {
				// Retry the request with new token
				return await fetch(`https://api.spotify.com/v1${endpoint}`, {
					...options,
					headers: {
						Authorization: `Bearer ${newTokens.accessToken}`,
						"Content-Type": "application/json",
						...options.headers,
					},
				});
			} else {
				throw new Error("Authentication failed");
			}
		}

		return response;
	}
}

export const spotifyAuth = new SpotifyAuthService();

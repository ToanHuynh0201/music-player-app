import { COLORS, GRADIENTS, getColorWithOpacity } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useRef, useState } from "react";
import {
	Alert,
	Animated,
	Dimensions,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

// Complete auth session
WebBrowser.maybeCompleteAuthSession();

const { height } = Dimensions.get("window");

// Spotify configuration
const SPOTIFY_CLIENT_ID = "066b93b708ef4bfb99ee25877296b19b";
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

const discovery = {
	authorizationEndpoint: "https://accounts.spotify.com/authorize",
	tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const LoginScreen = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(30)).current;

	// Create redirect URI
	const redirectUri = AuthSession.makeRedirectUri({
		scheme: "musicplayerapp",
		path: "auth",
	});

	// Use AuthSession hook
	const [request, response, promptAsync] = AuthSession.useAuthRequest(
		{
			clientId: SPOTIFY_CLIENT_ID,
			scopes: SCOPES,
			usePKCE: true,
			redirectUri: redirectUri,
			responseType: AuthSession.ResponseType.Code,
		},
		discovery
	);

	console.log("🔗 Redirect URI:", redirectUri);

	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: true,
			}),
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 800,
				useNativeDriver: true,
			}),
		]).start();

		// Check if user is already authenticated
		checkExistingAuth();
	}, []);

	// Handle auth response
	useEffect(() => {
		if (response?.type === "success") {
			console.log("✅ Auth success, code:", response.params.code);
			handleAuthSuccess(response.params.code, request?.codeVerifier);
		} else if (response?.type === "error") {
			console.error("❌ Auth error:", response.error);
			setError(
				`Authentication failed: ${
					response.error?.message || "Unknown error"
				}`
			);
			setIsLoading(false);
		} else if (response?.type === "cancel") {
			console.log("👤 User cancelled authentication");
			setIsLoading(false);
		}
	}, [response]);

	const checkExistingAuth = async () => {
		try {
			const tokensJson = await AsyncStorage.getItem("spotify_tokens");
			if (tokensJson) {
				const tokenData = JSON.parse(tokensJson);
				// Check if token is still valid (not expired)
				if (Date.now() < tokenData.expiresAt) {
					console.log(
						"🔄 User already authenticated, redirecting..."
					);
					router.replace("/(tabs)/(home)");
				}
			}
		} catch (error) {
			console.error("Error checking existing auth:", error);
		}
	};

	const handleAuthSuccess = async (code: string, codeVerifier?: string) => {
		if (!codeVerifier) {
			setError("Code verifier missing");
			setIsLoading(false);
			return;
		}

		try {
			console.log("🔄 Exchanging code for tokens...");

			// Exchange code for tokens
			const tokens = await exchangeCodeForTokens(code, codeVerifier);

			if (tokens) {
				console.log("✅ Tokens received, getting user profile...");

				// Get user profile
				const user = await getCurrentUser(tokens.accessToken);

				if (user) {
					console.log("✅ User profile received:", user.display_name);

					// Store user profile
					await AsyncStorage.setItem(
						"spotify_user",
						JSON.stringify(user)
					);

					// Navigate to main app
					router.replace("/(tabs)/(home)");
				} else {
					setError("Failed to get user profile");
				}
			} else {
				setError("Failed to exchange code for tokens");
			}
		} catch (error) {
			console.error("💥 Auth success handler error:", error);
			setError(
				error instanceof Error ? error.message : "Authentication failed"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const exchangeCodeForTokens = async (
		code: string,
		codeVerifier: string
	) => {
		try {
			const tokenRequestParams = {
				grant_type: "authorization_code",
				code,
				redirect_uri: redirectUri,
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
				const tokens = {
					accessToken: data.access_token,
					refreshToken: data.refresh_token,
					expiresIn: data.expires_in,
					tokenType: data.token_type,
					scope: data.scope,
					expiresAt: Date.now() + data.expires_in * 1000,
				};

				// Store tokens
				await AsyncStorage.setItem(
					"spotify_tokens",
					JSON.stringify(tokens)
				);

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
	};

	const getCurrentUser = async (accessToken: string) => {
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
				throw new Error("Failed to fetch user profile");
			}
		} catch (error) {
			console.error("Error fetching user profile:", error);
			throw error;
		}
	};

	const handleSpotifyLogin = async () => {
		if (!request) {
			console.error("❌ Auth request not ready");
			setError("Authentication not ready. Please try again.");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			console.log("🚀 Starting Spotify auth...");
			console.log("📱 Platform:", Platform.OS);
			console.log("🔗 Using redirect URI:", redirectUri);

			// Start the authentication flow
			const result = await promptAsync({
				showInRecents: true,
			});

			console.log("📋 Prompt result:", result);
		} catch (error) {
			console.error("💥 Spotify login error:", error);
			setError("Login failed. Please try again.");
			setIsLoading(false);

			Alert.alert(
				"Login Failed",
				"There was an error logging in with Spotify. Please try again.",
				[{ text: "OK" }]
			);
		}
	};

	const handleSignUp = () => {
		router.push("/signup");
	};

	return (
		<LinearGradient
			colors={GRADIENTS.playerBackground}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			<KeyboardAvoidingView
				style={styles.keyboardContainer}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContainer}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<Animated.View
						style={[
							styles.content,
							{
								opacity: fadeAnim,
								transform: [{ translateY: slideAnim }],
							},
						]}
					>
						{/* Header */}
						<View style={styles.header}>
							<View style={styles.logoContainer}>
								<View style={styles.logo}>
									<Text style={styles.logoText}>♪</Text>
								</View>
							</View>
							<Text style={styles.title}>Welcome to Music</Text>
							<Text style={styles.subtitle}>
								Connect with Spotify to start listening
							</Text>
						</View>

						{/* Error Message */}
						{error && (
							<View style={styles.errorContainer}>
								<Text style={styles.errorText}>{error}</Text>
							</View>
						)}

						{/* Debug Info (only in development) */}
						{__DEV__ && (
							<View style={styles.debugContainer}>
								<Text style={styles.debugText}>
									Platform: {Platform.OS}
								</Text>
								<Text style={styles.debugText}>
									Redirect: {redirectUri}
								</Text>
								<Text style={styles.debugText}>
									Request Ready: {request ? "✅" : "❌"}
								</Text>
							</View>
						)}

						{/* Spotify Login Section */}
						<View style={styles.loginSection}>
							{/* Spotify Logo */}
							<View style={styles.spotifyLogoContainer}>
								<View style={styles.spotifyLogo}>
									<Text style={styles.spotifyLogoText}>
										♫
									</Text>
								</View>
								<Text style={styles.spotifyText}>Spotify</Text>
							</View>

							{/* Description */}
							<Text style={styles.description}>
								Sign in with your Spotify account to access your
								music library, playlists, and personalized
								recommendations.
							</Text>

							{/* Features List */}
							<View style={styles.featuresList}>
								<View style={styles.featureItem}>
									<View style={styles.featureBullet} />
									<Text style={styles.featureText}>
										Access your playlists
									</Text>
								</View>
								<View style={styles.featureItem}>
									<View style={styles.featureBullet} />
									<Text style={styles.featureText}>
										Sync your music library
									</Text>
								</View>
								<View style={styles.featureItem}>
									<View style={styles.featureBullet} />
									<Text style={styles.featureText}>
										Get personalized recommendations
									</Text>
								</View>
								<View style={styles.featureItem}>
									<View style={styles.featureBullet} />
									<Text style={styles.featureText}>
										Stream high-quality music
									</Text>
								</View>
							</View>

							{/* Spotify Login Button */}
							<TouchableOpacity
								style={[
									styles.spotifyButton,
									(isLoading || !request) &&
										styles.spotifyButtonDisabled,
								]}
								onPress={handleSpotifyLogin}
								disabled={isLoading || !request}
							>
								<LinearGradient
									colors={["#1DB954", "#1AAE4F"]}
									style={styles.spotifyButtonGradient}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 0 }}
								>
									<View style={styles.spotifyButtonContent}>
										<Text style={styles.spotifyButtonIcon}>
											♫
										</Text>
										<Text style={styles.spotifyButtonText}>
											{isLoading
												? "Connecting..."
												: !request
												? "Preparing..."
												: "Continue with Spotify"}
										</Text>
									</View>
								</LinearGradient>
							</TouchableOpacity>

							{/* Privacy Notice */}
							<View style={styles.privacyNotice}>
								<Text style={styles.privacyText}>
									By continuing, you agree to Spotify's Terms
									of Service and Privacy Policy. We'll only
									access your public profile and playlists.
								</Text>
							</View>
						</View>
					</Animated.View>
				</ScrollView>
			</KeyboardAvoidingView>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	keyboardContainer: {
		flex: 1,
	},
	scrollContainer: {
		flexGrow: 1,
		justifyContent: "center",
		paddingHorizontal: 24,
		paddingVertical: 40,
	},
	content: {
		width: "100%",
		maxWidth: 400,
		alignSelf: "center",
	},
	header: {
		alignItems: "center",
		marginBottom: 48,
	},
	logoContainer: {
		marginBottom: 24,
	},
	logo: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: COLORS.surface,
		borderWidth: 2,
		borderColor: COLORS.primary,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: COLORS.primary,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	logoText: {
		fontSize: 32,
		color: COLORS.primary,
		fontWeight: "bold",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: COLORS.textPrimary,
		marginBottom: 8,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 16,
		color: COLORS.textSecondary,
		textAlign: "center",
		lineHeight: 22,
	},
	errorContainer: {
		backgroundColor: "rgba(255, 59, 48, 0.1)",
		borderColor: "rgba(255, 59, 48, 0.3)",
		borderWidth: 1,
		borderRadius: 12,
		padding: 16,
		marginBottom: 24,
	},
	errorText: {
		color: "#FF3B30",
		fontSize: 14,
		textAlign: "center",
	},
	debugContainer: {
		backgroundColor: "rgba(0, 122, 255, 0.1)",
		borderColor: "rgba(0, 122, 255, 0.3)",
		borderWidth: 1,
		borderRadius: 12,
		padding: 16,
		marginBottom: 24,
	},
	debugText: {
		color: "#007AFF",
		fontSize: 12,
		textAlign: "center",
		marginBottom: 4,
	},
	loginSection: {
		alignItems: "center",
		marginBottom: 32,
	},
	spotifyLogoContainer: {
		alignItems: "center",
		marginBottom: 24,
	},
	spotifyLogo: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: "#1DB954",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#1DB954",
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.4,
		shadowRadius: 12,
		elevation: 12,
		marginBottom: 16,
	},
	spotifyLogoText: {
		fontSize: 40,
		color: COLORS.textPrimary,
		fontWeight: "bold",
	},
	spotifyText: {
		fontSize: 24,
		fontWeight: "bold",
		color: COLORS.textPrimary,
	},
	description: {
		fontSize: 15,
		color: COLORS.textSecondary,
		textAlign: "center",
		lineHeight: 22,
		marginBottom: 32,
		paddingHorizontal: 8,
	},
	featuresList: {
		alignSelf: "stretch",
		marginBottom: 32,
	},
	featureItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
		paddingHorizontal: 16,
	},
	featureBullet: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: COLORS.primary,
		marginRight: 12,
	},
	featureText: {
		fontSize: 14,
		color: COLORS.textSecondary,
		flex: 1,
	},
	spotifyButton: {
		width: "100%",
		borderRadius: 25,
		overflow: "hidden",
		marginBottom: 24,
		shadowColor: "#1DB954",
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.4,
		shadowRadius: 12,
		elevation: 12,
	},
	spotifyButtonDisabled: {
		opacity: 0.7,
	},
	spotifyButtonGradient: {
		paddingVertical: 18,
		paddingHorizontal: 24,
	},
	spotifyButtonContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	spotifyButtonIcon: {
		fontSize: 20,
		color: COLORS.textPrimary,
		marginRight: 12,
		fontWeight: "bold",
	},
	spotifyButtonText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		fontWeight: "bold",
	},
	privacyNotice: {
		backgroundColor: getColorWithOpacity(COLORS.surface, 0.8),
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	privacyText: {
		color: COLORS.textSecondary,
		fontSize: 12,
		textAlign: "center",
		lineHeight: 18,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 16,
	},
	footerText: {
		color: COLORS.textSecondary,
		fontSize: 14,
	},
	signUpText: {
		color: COLORS.primary,
		fontSize: 14,
		fontWeight: "bold",
	},
});

export default LoginScreen;

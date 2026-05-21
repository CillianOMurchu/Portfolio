import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TwitchPlayer {
  addEventListener(event: string, callback: () => void): void;
  destroy(): void;
}

interface TwitchPlayerConstructor {
  new (containerId: string, options: Record<string, unknown>): TwitchPlayer;
  ONLINE: string;
  OFFLINE: string;
}

declare global {
  interface Window {
    Twitch: { Player: TwitchPlayerConstructor };
  }
}

// --- Configuration ---
const TWITCH_CHANNEL_NAME = "ichilliano";
const ALLOWED_PARENTS = ["localhost", "cillianomurchu.vercel.app", "www.cillianmurchu.com", "cillianmurchu.com"];
const PLAYER_EMBED_ID = 'twitch-player-embed'; // ID for the container div

// Ensure the Twitch embed script is loaded globally
function loadTwitchEmbedScript() {
    if (document.getElementById('twitch-embed-script')) {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.setAttribute('src', 'https://embed.twitch.tv/embed/v1.js');
        script.setAttribute('id', 'twitch-embed-script');
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

type StreamStatus = "checking" | "live" | "offline";

const Streaming = () => {
    const [status, setStatus] = useState<StreamStatus>("checking");
    const playerRef = useRef<TwitchPlayer | null>(null);

    useEffect(() => {
        loadTwitchEmbedScript().then(() => {
            if (window.Twitch) {
                initializePlayer();
            }
        });

        function initializePlayer() {
            if (playerRef.current) {
                return;
            }

            const playerInstance = new window.Twitch.Player(PLAYER_EMBED_ID, {
                width: '100%',
                height: '100%',
                channel: TWITCH_CHANNEL_NAME,
                parent: ALLOWED_PARENTS,
                autoplay: true,
                muted: true
            });

            playerRef.current = playerInstance;

            playerInstance.addEventListener(window.Twitch.Player.ONLINE, () => {
                setStatus("live");
            });

            playerInstance.addEventListener(window.Twitch.Player.OFFLINE, () => {
                setStatus("offline");
            });
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null; // Clear the ref
                // Clean up the DOM element content to be safe
                const embedDiv = document.getElementById(PLAYER_EMBED_ID);
                if (embedDiv) embedDiv.innerHTML = '';
            }
        };
    }, []); // Empty dependency array ensures run on mount, cleanup on unmount

    // 🔴 The Twitch Player API will manage the iframe inside this div
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 pt-20 pb-16 relative overflow-hidden">
            
            {/* 🔴 LIVE INDICATOR - Animated Position */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={status}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, top: "50%", left: "50%", x: "-50%", y: "-50%" }}
                    animate={{
                        opacity: 1,
                        top: status === "live" ? "70px" : "50%",
                        right: status === "live" ? "16px" : "auto",
                        left: status === "live" ? "auto" : "50%",
                        x: status === "live" ? 0 : "-50%",
                        y: status === "live" ? 0 : "-50%",
                    }}
                    exit={{ opacity: 0 }}
                    style={{ position: "fixed" }}
                    transition={{ type: "spring", stiffness: 100, damping: 15, duration: 0.6 }}
                >
                    <div className={`w-3 h-3 rounded-full animate-pulse ${
                        status === "live"     ? "bg-emerald-400 shadow-lg shadow-emerald-400/60" :
                        status === "checking" ? "bg-yellow-400 shadow-lg shadow-yellow-400/40" :
                                               "bg-red-400 shadow-lg shadow-red-400/40"
                    }`} />
                    <span className={`text-sm font-semibold ${
                        status === "live"     ? "text-emerald-400" :
                        status === "checking" ? "text-yellow-400" :
                                               "text-red-400"
                    }`}>
                        {status === "live" ? "LIVE" : status === "checking" ? "CHECKING..." : "OFFLINE"}
                    </span>
                </motion.div>
            </AnimatePresence>

            {/* 📺 VIDEO PLAYER CONTAINER - Fades in when live */}
            <motion.div
                className="w-full max-w-7xl aspect-video"
                initial={{ opacity: 0 }}
                animate={{ opacity: status === "live" ? 1 : 0 }}
                transition={{
                    delay: status === "live" ? 1.2 : 0,
                    duration: 0.6
                }}
            >
                <div 
                    id="twitch-player-embed" 
                    className="w-full h-full"
                    style={{
                        borderRadius: "8px",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                    }}
                />
            </motion.div>
        </div>
    );
};

export default Streaming;
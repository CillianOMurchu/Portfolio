import { useEffect, useState, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

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

// Traffic-light colours are deliberate: they signal status, not brand.
const STATUS_DISPLAY: Record<StreamStatus, { label: string; text: string; dot: string }> = {
    live:     { label: "LIVE",        text: "text-success", dot: "bg-success shadow-success/60" },
    checking: { label: "CHECKING...", text: "text-warning",  dot: "bg-warning shadow-warning/40" },
    offline:  { label: "OFFLINE",     text: "text-error",     dot: "bg-error shadow-error/40" },
};

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
        <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 relative overflow-hidden">
            
            {/* 🔴 LIVE INDICATOR - Animated Position */}
            <AnimatePresence mode="wait">
                <m.div
                    key={status}
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
                    <Badge variant="outline" className={`h-7 gap-2 px-3 text-sm font-semibold ${STATUS_DISPLAY[status].text}`}>
                        <span className={`size-2.5 rounded-full animate-pulse shadow-lg ${STATUS_DISPLAY[status].dot}`} />
                        {STATUS_DISPLAY[status].label}
                    </Badge>
                </m.div>
            </AnimatePresence>

            {/* 📺 VIDEO PLAYER CONTAINER - Fades in when live */}
            <m.div
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
                    className="w-full h-full rounded-lg border border-primary/30"
                />
            </m.div>
        </div>
    );
};

export default Streaming;
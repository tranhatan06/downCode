import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Video, AVPlaybackStatus } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { X, Play, Pause } from "lucide-react-native";
import { useState, useRef } from "react";

const { width } = Dimensions.get("window");

interface VideoPreviewProps {
  uri: string;
  onRemove: () => void;
  onConfirm: () => void;
}

export default function VideoPreview({
  uri,
  onRemove,
  onConfirm,
}: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<Video>(null);

  const togglePlayback = async () => {
    try {
      if (videoRef.current) {
        if (isPlaying) {
          await videoRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await videoRef.current.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri }}
          style={styles.video}
          useNativeControls={false}
          resizeMode="cover"
          isLooping
          shouldPlay={false}
          onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
            if (status.isLoaded) {
              setIsPlaying(status.isPlaying);
            }
          }}
        />

        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemove}
          activeOpacity={0.8}
        >
          <X size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {!isPlaying && (
          <View style={styles.overlay} pointerEvents="box-none">
            <TouchableOpacity
              style={styles.playButton}
              onPress={togglePlayback}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#3B82F6", "#60A5FA"]}
                style={styles.playButtonGradient}
              >
                <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {isPlaying && (
          <View style={styles.overlayTransparent} pointerEvents="box-none">
            <TouchableOpacity
              style={styles.playButtonSmall}
              onPress={togglePlayback}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["rgba(59, 130, 246, 0.9)", "rgba(96, 165, 250, 0.9)"]}
                style={styles.playButtonGradient}
              >
                <Pause size={20} color="#FFFFFF" fill="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.removeButtonLarge}
          onPress={onRemove}
          activeOpacity={0.8}
        >
          <Text style={styles.removeButtonText}>Remove Video</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={onConfirm}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#3B82F6", "#60A5FA"]}
            style={styles.confirmButtonGradient}
          >
            <Text style={styles.confirmButtonText}>Confirm & Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  videoContainer: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1E293B",
    marginBottom: 16,
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  overlayTransparent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
  },
  playButtonSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
  },
  playButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  removeButtonLarge: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "#1E293B",
    borderWidth: 1.5,
    borderColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#94A3B8",
  },
  confirmButton: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  confirmButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});


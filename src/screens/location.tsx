import {
    LocationAccuracy,
    requestForegroundPermissionsAsync,
    watchPositionAsync,
    type LocationObject,
    type LocationSubscription,
} from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useWebSocket } from "../components/WebSocketProvider";

export function LocationScreen() {
    const ws = useWebSocket();
    const location = useLocationState();

    useEffect(() => {
        return () => {
            ws.current?.close();
        };
    }, []);

    useEffect(() => {
        if (
            ws.current?.readyState === WebSocket.OPEN &&
            location.status === "granted"
        ) {
            const { latitude, longitude } = location.coordinates;
            ws.current.send(JSON.stringify({ latitude, longitude }));
        }
    }, [location]);

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <LocationView location={location} />
        </View>
    );
}

type LocationState =
    | {
          status: "pending";
          coordinates: null;
      }
    | {
          status: "denied";
          coordinates: null;
      }
    | {
          status: "granted";
          coordinates: LocationObject["coords"];
      };

function useLocationState() {
    const [location, setLocation] = useState<LocationState>({
        status: "pending",
        coordinates: null,
    });

    useEffect(() => {
        let subscription: LocationSubscription | null = null;

        requestForegroundPermissionsAsync().then(async (permission) => {
            if (permission.status !== "granted") {
                setLocation({
                    status: "denied",
                    coordinates: null,
                });
                return;
            }

            subscription = await watchPositionAsync(
                {
                    accuracy: LocationAccuracy.BestForNavigation,
                    timeInterval: 1000,
                },
                (location) => {
                    setLocation({
                        status: "granted",
                        coordinates: location.coords,
                    });
                },
            );
        });

        return () => {
            subscription?.remove();
        };
    }, []);

    return location;
}

function LocationView({ location }: { location: LocationState }) {
    switch (location.status) {
        case "pending":
            return <ActivityIndicator size="large" />;
        case "denied":
            return <Text>Permission denied</Text>;
        case "granted":
            return (
                <View>
                    <Text>Latitude: {location.coordinates.latitude}</Text>
                    <Text>Longitude: {location.coordinates.longitude}</Text>
                </View>
            );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: "white",
        flex: 1,
        justifyContent: "center",
    },
});

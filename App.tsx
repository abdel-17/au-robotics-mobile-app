import {
    LocationAccuracy,
    LocationSubscription,
    requestForegroundPermissionsAsync,
    watchPositionAsync,
    type LocationObject,
} from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

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

export default function App() {
    const location = useLocationState();
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <StatusBar style="auto" />
            <Location location={location} />
        </View>
    );
}

function Location({ location }: { location: LocationState }) {
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

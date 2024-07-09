import {
    LocationAccuracy,
    requestForegroundPermissionsAsync,
    watchPositionAsync,
    type LocationSubscription,
} from "expo-location";
import { useEffect, useState } from "react";

export type LocationCoordinates = {
    latitude: number;
    longitude: number;
};

export type LocationState =
    | {
          permissionStatus: "pending";
          coordinates: null;
      }
    | {
          permissionStatus: "denied";
          coordinates: null;
      }
    | {
          permissionStatus: "granted";
          coordinates: LocationCoordinates;
      };

export function useLocationState() {
    const [location, setLocation] = useState<LocationState>({
        permissionStatus: "pending",
        coordinates: null,
    });

    useEffect(() => {
        let subscription: LocationSubscription | null = null;

        requestForegroundPermissionsAsync().then(async (permission) => {
            if (permission.status !== "granted") {
                setLocation({
                    permissionStatus: "denied",
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
                    const { latitude, longitude } = location.coords;
                    setLocation({
                        permissionStatus: "granted",
                        coordinates: { latitude, longitude },
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

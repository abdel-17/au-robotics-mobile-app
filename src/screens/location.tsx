import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    useLocationState,
    type LocationCoordinates,
    type LocationState,
} from "../utils/location";
import * as ws from "../utils/ws";

type LocationLog = {
    id: number;
    coordinates: LocationCoordinates;
    success: boolean;
};

export function LocationScreen() {
    const location = useLocationState();
    const [logs, setLogs] = useState<LocationLog[]>([]);

    useEffect(() => {
        if (location.permissionStatus !== "granted") {
            return;
        }

        let success: boolean;
        try {
            ws.send(location.coordinates);
            success = true;
        } catch (error) {
            console.error("Failed to send:", error);
            success = false;
        } finally {
            setLogs((old) => {
                const logs = [
                    {
                        id: Math.random(),
                        coordinates: location.coordinates,
                        success,
                    },
                    ...old,
                ];
                if (logs.length > 20) {
                    logs.pop();
                }
                return logs;
            });
        }
    }, [location]);

    useEffect(() => {
        return () => {
            ws.close();
        };
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <LocationView location={location} logs={logs} />
        </View>
    );
}

function LocationView({
    location,
    logs,
}: {
    location: LocationState;
    logs: LocationLog[];
}) {
    switch (location.permissionStatus) {
        case "pending":
            return <ActivityIndicator size="large" />;
        case "denied":
            return <Text>Permission denied</Text>;
        case "granted":
            return (
                <>
                    <Text style={styles.locationText}>
                        {formatCoordinates(location.coordinates)}
                    </Text>
                    <View style={styles.logsContainer}>
                        <FlatList
                            data={logs}
                            renderItem={({ item }) => (
                                <LocationLogView log={item} />
                            )}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </View>
                </>
            );
    }
}

function LocationLogView({ log }: { log: LocationLog }) {
    return (
        <View style={styles.logContainer}>
            <Ionicons
                name={log.success ? "checkmark-circle" : "close-circle"}
                size={24}
                style={
                    log.success ? styles.logSuccessIcon : styles.logErrorIcon
                }
            />
            <Text>{formatCoordinates(log.coordinates)}</Text>
        </View>
    );
}

function formatCoordinates(coordinates: LocationCoordinates) {
    return `(${coordinates.latitude}, ${coordinates.longitude})`;
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: "white",
        flex: 1,
        justifyContent: "center",
        padding: 16,
    },
    locationText: {
        fontSize: 20,
        marginBottom: 24,
    },
    logsContainer: {
        borderColor: "gray",
        borderRadius: 8,
        borderWidth: 1,
        height: "50%",
        width: "100%",
    },
    logContainer: {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        gap: 12,
        justifyContent: "space-between",
        padding: 16,
    },
    logSuccessIcon: {
        color: "green",
    },
    logErrorIcon: {
        color: "red",
    },
});

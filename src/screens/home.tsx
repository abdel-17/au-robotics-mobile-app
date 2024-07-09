import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-root-toast";
import * as ws from "../utils/ws";
import type { ScreenProps } from "../../App";

export function HomeScreen({ navigation }: ScreenProps<"Home">) {
    const [ip, setIp] = useState("");
    const [port, setPort] = useState("");
    const [connecting, setConnecting] = useState(false);

    async function connect() {
        try {
            setConnecting(true);
            await ws.connect(`ws://${ip}:${port}`);
            navigation.navigate("Location");
        } catch (error) {
            console.error("Failed to connect:", error);
            Toast.show("Failed to connect to server");
        } finally {
            setConnecting(false);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View>
                <Text style={styles.label}>IP Address</Text>
                <TextInput
                    value={ip}
                    onChangeText={setIp}
                    style={styles.input}
                />
            </View>
            <View style={styles.portContainer}>
                <Text style={styles.label}>Port</Text>
                <TextInput
                    value={port}
                    onChangeText={setPort}
                    keyboardType="numeric"
                    style={styles.input}
                />
            </View>
            <Button
                title={connecting ? "Connecting" : "Connect"}
                disabled={connecting}
                onPress={connect}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        justifyContent: "center",
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 4,
    },
    input: {
        borderColor: "gray",
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
        padding: 12,
    },
    portContainer: {
        paddingBottom: 24,
        paddingTop: 16,
    },
});

import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    Button,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    View,
} from "react-native";
import * as ws from "../utils/ws";
import type { ScreenProps } from "../../App";

const ipPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
const portPattern = /^\d{1,5}$/;

export function ConnectScreen({ navigation }: ScreenProps<"Connect">) {
    const [ip, setIp] = useState("");
    const [port, setPort] = useState("");
    const [connecting, setConnecting] = useState(false);

    async function connect() {
        if (!ipPattern.test(ip)) {
            ToastAndroid.show("Invalid IP address", ToastAndroid.LONG);
            return;
        }

        if (!portPattern.test(port)) {
            ToastAndroid.show("Invalid port", ToastAndroid.LONG);
            return;
        }

        try {
            setConnecting(true);
            await ws.connect(`ws://${ip}:${port}`);
            navigation.navigate("Location");
        } catch (error) {
            console.error("Failed to connect:", error);
            ToastAndroid.show("Failed to connect", ToastAndroid.LONG);
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
            <View style={styles.buttonContainer}>
                <Button
                    title={connecting ? "Connecting" : "Connect"}
                    disabled={connecting}
                    onPress={connect}
                />
            </View>
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
        fontWeight: "500",
        marginBottom: 4,
    },
    input: {
        borderColor: "gray",
        borderRadius: 8,
        borderWidth: 1,
        padding: 12,
    },
    portContainer: {
        paddingTop: 16,
    },
    buttonContainer: {
        paddingTop: 32,
    },
});

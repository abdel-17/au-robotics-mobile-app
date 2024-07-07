import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import Toast from "react-native-root-toast";
import type { RootStackParamList } from "../../App";
import { useWebSocket } from "../components/WebSocketProvider";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
    const ws = useWebSocket();
    const [ip, setIp] = useState("");
    const [port, setPort] = useState("");
    const [connecting, setConnecting] = useState(false);

    async function connect() {
        try {
            setConnecting(true);
            ws.current = await websocket(`ws://${ip}:${port}`);
            navigation.navigate("Location");
        } catch (error) {
            console.error("Failed to connect:", error);
            Toast.show("Failed to connect to server");
        } finally {
            setConnecting(false);
        }
    }

    return (
        <View className="flex-1 justify-center bg-white p-4">
            <StatusBar style="auto" />
            <View>
                <Text className="font-medium text-base mb-1">IP Address</Text>
                <TextInput
                    value={ip}
                    onChangeText={setIp}
                    className="p-3 text-base border border-gray-300 rounded"
                />
            </View>
            <View className="pt-4">
                <Text className="font-medium text-base mb-1">Port</Text>
                <TextInput
                    value={port}
                    onChangeText={setPort}
                    keyboardType="numeric"
                    className="p-3 text-base border border-gray-300 rounded"
                />
            </View>
            <View className="pt-6">
                <Button
                    title={connecting ? "Connecting" : "Connect"}
                    disabled={connecting}
                    onPress={connect}
                />
            </View>
        </View>
    );
}

async function websocket(url: string) {
    return new Promise<WebSocket>((resolve, reject) => {
        const ws = new WebSocket(url);

        function onOpen() {
            resolve(ws);
            ws.removeEventListener("error", onError);
        }

        function onError(event: Event) {
            reject(event);
            ws.removeEventListener("open", onOpen);
        }

        ws.addEventListener("open", onOpen, { once: true });
        ws.addEventListener("error", onError, { once: true });
    });
}

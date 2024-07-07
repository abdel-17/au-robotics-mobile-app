import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootSiblingParent } from "react-native-root-siblings";
import { WebSocketProvider } from "./src/components/WebSocketProvider";
import { HomeScreen } from "./src/screens/home";
import { LocationScreen } from "./src/screens/location";

export type RootStackParamList = {
    Home: undefined;
    Location: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <WebSocketProvider>
            <RootSiblingParent>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Home">
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen
                            name="Location"
                            component={LocationScreen}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </RootSiblingParent>
        </WebSocketProvider>
    );
}

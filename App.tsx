import { NavigationContainer } from "@react-navigation/native";
import {
    createNativeStackNavigator,
    type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { ConnectScreen } from "./src/screens/connect";
import { LocationScreen } from "./src/screens/location";

type StackParamList = {
    Connect: undefined;
    Location: undefined;
};

export type ScreenProps<TScreen extends keyof StackParamList> =
    NativeStackScreenProps<StackParamList, TScreen>;

const Stack = createNativeStackNavigator<StackParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Connect">
                <Stack.Screen name="Connect" component={ConnectScreen} />
                <Stack.Screen name="Location" component={LocationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

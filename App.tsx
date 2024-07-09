import { NavigationContainer } from "@react-navigation/native";
import {
    createNativeStackNavigator,
    type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootSiblingParent } from "react-native-root-siblings";
import { HomeScreen } from "./src/screens/home";
import { LocationScreen } from "./src/screens/location";

type StackParamList = {
    Home: undefined;
    Location: undefined;
};

export type ScreenProps<TScreen extends keyof StackParamList> =
    NativeStackScreenProps<StackParamList, TScreen>;

const Stack = createNativeStackNavigator<StackParamList>();

export default function App() {
    return (
        <RootSiblingParent>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Location" component={LocationScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </RootSiblingParent>
    );
}

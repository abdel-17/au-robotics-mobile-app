import {
    createContext,
    useContext,
    useRef,
    type MutableRefObject,
    type ReactNode,
} from "react";

const WebSocketContext =
    createContext<MutableRefObject<WebSocket | null> | null>(null);

export function useWebSocket() {
    const ws = useContext(WebSocketContext);
    if (ws === null) {
        throw new Error(
            "useWebSocket() must be used within a <WebSocketProvider>",
        );
    }
    return ws;
}

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const ws = useRef<WebSocket | null>(null);
    return <WebSocketContext.Provider value={ws} children={children} />;
}

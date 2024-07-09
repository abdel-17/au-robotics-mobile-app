let connection: WebSocket | null = null;

export function connect(url: string) {
    return new Promise<void>((resolve, reject) => {
        function onOpen(this: WebSocket) {
            this.removeEventListener("error", onError);
            resolve();
        }

        function onError(this: WebSocket, event: Event) {
            this.removeEventListener("open", onOpen);
            reject(event);
        }

        try {
            connection = new WebSocket(url);
            connection.addEventListener("open", onOpen, { once: true });
            connection.addEventListener("error", onError, { once: true });
        } catch (error) {
            reject(error);
        }
    });
}

export function send(data: string) {
    if (connection === null || connection.readyState !== WebSocket.OPEN) {
        throw new Error("Connection is not open");
    }

    connection.send(data);
}

export function close() {
    if (connection === null) {
        return;
    }

    connection.close();
    connection = null;
}

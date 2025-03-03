import { useEffect, useState } from "react";

class WebSocketService {
    constructor(serverUrl) {
        this.serverUrl = serverUrl;
        this.ws = null;
        this.isConnected = false;
        this.reconnectInterval = 5000;
        this.messageHandlers = [];
    }

    connect() {
        this.ws = new WebSocket(this.serverUrl);

        this.ws.onopen = () => {
            console.log("✅ WebSocket Connected:", this.serverUrl);
            this.isConnected = true;
        };

        this.ws.onmessage = (message) => {
            try {
                const data = JSON.parse(message.data);

                // Call all registered handlers
                this.messageHandlers.forEach(handler => handler(data));
            } catch (error) {
                console.error("❌ WebSocket Message Error:", error);
            }
        };

        this.ws.onerror = (error) => {
            console.error("❌ WebSocket Error:", error);
        };

        this.ws.onclose = () => {
            console.warn("⚠️ WebSocket Disconnected. Attempting to reconnect...");
            this.isConnected = false;
            setTimeout(() => this.connect(), this.reconnectInterval);
        };
    }

    updateBusLocation(busId, location) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const data = JSON.stringify({
                type: "locationUpdate",
                scheduledBusId: busId,
                latitude: location.latitude,
                longitude: location.longitude
            });
            this.ws.send(data);
        } else {
            console.error("⚠️ WebSocket is not open. Cannot send location update.");
        }
    }

    requestScheduledBuses(busStopId, status = ["On Route"]) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const data = JSON.stringify({
                type: "busStopRequest",
                busStopId,
                status
            });
            this.ws.send(data);
        } else {
            console.error("⚠️ WebSocket is not open. Cannot request bus stop data.");
        }
    }

    addMessageHandler(handler) {
        this.messageHandlers.push(handler);
    }

    closeConnection() {
        if (this.ws) {
            this.ws.close();
            console.log("🔴 WebSocket Connection Closed");
        }
    }
}

const wsService = new WebSocketService(import.meta.env.VITE_WS_URL);
wsService.connect();

export default wsService;

// ✅ Example usage inside a React component
export function useWebSocketBusUpdates() {
    const [buses, setBuses] = useState([]);

    useEffect(() => {
        const handleWebSocketMessage = (data) => {
            if (data.type === "busUpdate") {
                setBuses(data.buses);
            }
            if (data.type === "busStopResponse") {
                setBuses(data.buses);
            }
        };

        wsService.addMessageHandler(handleWebSocketMessage);

        return () => {
            wsService.closeConnection();
        };
    }, []);

    return buses;
}

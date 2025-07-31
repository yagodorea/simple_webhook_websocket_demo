import { WebSocketServer, WebSocket } from 'ws';
import { RemoteConfig, WebSocketMessage } from '../types/interfaces';

export class WebSocketHandler {
  private wss: WebSocketServer;
  private remoteConfig: RemoteConfig;

  constructor(server: any, initialConfig: RemoteConfig) {
    this.wss = new WebSocketServer({ server });
    this.remoteConfig = initialConfig;
    this.setupWebSocketServer();
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected');
      
      // Send initial config to new client
      this.sendToClient(ws, {
        type: 'remote-config',
        data: this.remoteConfig
      });
      
      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }

  private sendToClient(client: WebSocket, message: WebSocketMessage): void {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  public broadcastConfig(): void {
    const message: WebSocketMessage = {
      type: 'remote-config',
      data: this.remoteConfig
    };

    this.wss.clients.forEach((client) => {
      this.sendToClient(client, message);
    });
  }

  public updateConfig(newConfig: Partial<RemoteConfig>): void {
    this.remoteConfig = {
      ...this.remoteConfig,
      ...newConfig,
      lastUpdated: new Date().toISOString(),
    };
    this.broadcastConfig();
  }

  public getConfig(): RemoteConfig {
    return this.remoteConfig;
  }
}
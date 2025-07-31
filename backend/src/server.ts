import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { RemoteConfig } from './types/interfaces';
import { WebSocketHandler } from './websocket/handler';
import { ConfigController } from './controllers/configController';
import axios from 'axios';

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

(async () => {
    // Get initial config
    const res = await axios.post('http://localhost:3001/flags', {
        api_key: process.env.POSTHOG_API_KEY,
        distinct_id: '123'
    });
    const ffName = process.env.FEATURE_FLAG_NAME || '';
    const ffPayload = JSON.parse(res.data.featureFlagPayloads[ffName]);
    // Initialize WebSocket handler
    const wsHandler = new WebSocketHandler(server, {key: ffName, ...ffPayload, lastUpdated: new Date().toISOString()});
    
    // Initialize controller
    const configController = new ConfigController(wsHandler);
    
    // Routes
    app.post('/webhook/config', configController.webhookConfig);
    app.post('/api/config', configController.updateConfig);
    app.get('/api/config', configController.getConfig);
    
    const PORT = process.env.PORT || 3002;
    
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`WebSocket server running on ws://localhost:${PORT}`);
    });
})();
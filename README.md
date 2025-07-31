# Simeple Webhook + WebSocket demo
Simple app with backend and frontend to demonstrate usage of webhooks and websockets

## Usage
1. Run npm i on the root and the `backend` and `frontend` directories
2. At Posthog, create an api key and a remote config feature flag
3. Run Posthog's Rust FF service on localhost:3001
4. Run this service with `POSTHOG_API_KEY=phc... FEATURE_FLAG_NAME=some_ff npm run dev`
5. POST requests to `localhost:3002` must contain the predefined `x-api-key` header on `configController.ts`
6. Changes on feature flags should be mirrored in real time in the frontend (`localhost:5173/remote-config`)

import { Request, Response } from 'express';
import { WebSocketHandler } from '../websocket/handler';
import { ApiResponse } from '../types/interfaces';

export class ConfigController {
  private wsHandler: WebSocketHandler;

  constructor(wsHandler: WebSocketHandler) {
    this.wsHandler = wsHandler;
  }

  public webhookConfig = (req: Request, res: Response): void => {
    try {
      const newConfig = req.body;
      
      // Validate that the payload contains required RemoteConfig fields
      if (!newConfig.id || !newConfig.name || !newConfig.version) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid RemoteConfig payload. Missing required fields: id, name, or version'
        };
        res.status(400).json(response);
        return;
      }
      
      // Update the config via WebSocket handler
      this.wsHandler.updateConfig(newConfig);
      
      console.log('Config updated via webhook and broadcasted to clients');
      
      const response: ApiResponse = {
        success: true,
        config: this.wsHandler.getConfig()
      };
      res.json(response);
    } catch (error) {
      console.error('Error processing webhook:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  };

  public updateConfig = (req: Request, res: Response): void => {
    try {
      if (req.headers['x-api-key'] !== 'phc_yagodorea123') {
        console.log('Forbidden, headers=', JSON.stringify(req.headers));
        res.status(403).send();
        return;
      }

      // Update the config via WebSocket handler
      this.wsHandler.updateConfig(req.body.remote_config_payload);
      
      const response: ApiResponse = {
        success: true,
        config: this.wsHandler.getConfig()
      };
      res.json(response);
    } catch (error) {
      console.error('Error updating config:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  };

  public getConfig = (req: Request, res: Response): void => {
    try {
      const response: ApiResponse = {
        success: true,
        config: this.wsHandler.getConfig()
      };
      res.json(response);
    } catch (error) {
      console.error('Error getting config:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Internal server error'
      };
      res.status(500).json(response);
    }
  };
}
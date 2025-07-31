import React, { useState, useEffect } from 'react'

const RemoteConfig = () => {
  const [config, setConfig] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('Disconnected')

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3002')
    
    ws.onopen = () => {
      console.log('Connected to WebSocket server')
      setConnectionStatus('Connected')
    }
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        setConfig({...message.data, lastUpdated: new Date().toISOString()})
        console.log('Received config update:', message.data)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }
    
    ws.onclose = () => {
      console.log('Disconnected from WebSocket server')
      setConnectionStatus('Disconnected')
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setConnectionStatus('Error')
    }
    
    return () => {
      ws.close()
    }
  }, [])

  if (!config) {
    return (
      <div className="page">
        <h1>Remote Config</h1>
        <div className="connection-status">
          <p>Status: <span className={`status ${connectionStatus.toLowerCase()}`}>{connectionStatus}</span></p>
        </div>
        <p>Loading configuration...</p>
      </div>
    )
  }

  return (
    <div className="page">
      <h1>Remote Config</h1>
      <div className="connection-status">
        <p>Status: <span className={`status ${connectionStatus.toLowerCase()}`}>{connectionStatus}</span></p>
        <p>Last Updated: {config.lastUpdated}</p>
      </div>
      
      <div className="config-section">
        <h2>Configuration Details</h2>
        <div className="config-item">
          <strong>Feature flag:</strong> {config.key}
        </div>
        <div className="config-item">
          <strong>Last Updated:</strong> {new Date(config.lastUpdated).toLocaleString()}
        </div>
      </div>

      <div className="config-section">
        <h2>Settings</h2>
        <div className="settings-grid">
          {Object.entries(config).filter(([k]) => !['key', 'lastUpdated'].includes(k)).map(([key, value]) => (
            <div key={key} className="setting-item">
              <span className="setting-name">{key}:</span>
              <span className="setting-value">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="config-section">
        <h2>Raw JSON</h2>
        <pre className="json-display">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default RemoteConfig
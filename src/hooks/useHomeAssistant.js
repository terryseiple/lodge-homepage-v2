import { useState, useEffect, useCallback } from 'react';

const HA_CONFIG = {
  url: 'ws://10.0.102.10:8123/api/websocket',
  reconnectDelay: 5000,
  maxRetries: 3
};

export const useHomeAssistant = (entityIds = []) => {
  const [connected, setConnected] = useState(false);
  const [entities, setEntities] = useState({});
  const [error, setError] = useState(null);
  const [ws, setWs] = useState(null);

  const connect = useCallback(() => {
    try {
      const websocket = new WebSocket(HA_CONFIG.url);
      
      websocket.onopen = () => {
        console.log('✅ Home Assistant connected');
        setConnected(true);
        setError(null);
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'auth_required') {
            // Send auth token if available
            const token = localStorage.getItem('ha_token');
            if (token) {
              websocket.send(JSON.stringify({ type: 'auth', access_token: token }));
            }
          }

          if (data.type === 'result' && data.success) {
            // Handle state updates
            if (data.result && Array.isArray(data.result)) {
              const stateMap = {};
              data.result.forEach(entity => {
                stateMap[entity.entity_id] = entity;
              });
              setEntities(prev => ({ ...prev, ...stateMap }));
            }
          }

          if (data.type === 'event') {
            // Handle real-time updates
            const entityId = data.event?.data?.entity_id;
            if (entityId) {
              setEntities(prev => ({
                ...prev,
                [entityId]: data.event.data.new_state
              }));
            }
          }
        } catch (err) {
          console.warn('HA message parse error:', err);
        }
      };

      websocket.onerror = (err) => {
        console.warn('HA connection error:', err);
        setError('Home Assistant connection failed');
        setConnected(false);
      };

      websocket.onclose = () => {
        console.log('HA connection closed');
        setConnected(false);
        
        // Auto-reconnect
        setTimeout(() => {
          console.log('Attempting HA reconnection...');
          connect();
        }, HA_CONFIG.reconnectDelay);
      };

      setWs(websocket);
    } catch (err) {
      console.error('HA connection setup failed:', err);
      setError(err.message);
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connect]);

  const getEntity = useCallback((entityId) => {
    return entities[entityId] || null;
  }, [entities]);

  const callService = useCallback(async (domain, service, data) => {
    if (!connected || !ws) {
      throw new Error('Home Assistant not connected');
    }

    return new Promise((resolve, reject) => {
      const id = Date.now();
      const message = {
        id,
        type: 'call_service',
        domain,
        service,
        service_data: data
      };

      const handler = (event) => {
        const response = JSON.parse(event.data);
        if (response.id === id) {
          ws.removeEventListener('message', handler);
          if (response.success) {
            resolve(response.result);
          } else {
            reject(new Error(response.error?.message || 'Service call failed'));
          }
        }
      };

      ws.addEventListener('message', handler);
      ws.send(JSON.stringify(message));
    });
  }, [connected, ws]);

  return {
    connected,
    entities,
    error,
    getEntity,
    callService,
    reconnect: connect
  };
};

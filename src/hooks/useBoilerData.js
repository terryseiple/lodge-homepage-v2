import { useState, useEffect } from 'react';
import { useHomeAssistant } from './useHomeAssistant';

const BOILER_ENTITIES = {
  temperature: 'sensor.boiler_temperature',
  pressure: 'sensor.boiler_pressure',
  status: 'binary_sensor.boiler_status',
  setpoint: 'climate.boiler_thermostat'
};

export const useBoilerData = () => {
  const { connected, getEntity } = useHomeAssistant(Object.values(BOILER_ENTITIES));
  const [boilerData, setBoilerData] = useState({
    temperature: null,
    pressure: null,
    status: 'unknown',
    setpoint: null,
    available: false
  });

  useEffect(() => {
    if (!connected) {
      setBoilerData(prev => ({ ...prev, available: false }));
      return;
    }

    const updateBoilerData = () => {
      const tempEntity = getEntity(BOILER_ENTITIES.temperature);
      const pressureEntity = getEntity(BOILER_ENTITIES.pressure);
      const statusEntity = getEntity(BOILER_ENTITIES.status);
      const setpointEntity = getEntity(BOILER_ENTITIES.setpoint);

      setBoilerData({
        temperature: tempEntity?.state ? parseFloat(tempEntity.state) : null,
        pressure: pressureEntity?.state ? parseFloat(pressureEntity.state) : null,
        status: statusEntity?.state === 'on' ? 'running' : 'idle',
        setpoint: setpointEntity?.attributes?.temperature || null,
        available: !!(tempEntity || pressureEntity || statusEntity)
      });
    };

    updateBoilerData();
    
    // Update every 10 seconds when connected
    const interval = setInterval(updateBoilerData, 10000);

    return () => clearInterval(interval);
  }, [connected, getEntity]);

  return {
    ...boilerData,
    connected
  };
};

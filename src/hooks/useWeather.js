import { useState, useEffect } from 'react';

const HA_API_URL = 'http://10.0.102.10:8123/api/states/sensor.the_lodge_sensors_temperature';
const HA_TOKEN = null; // Set if you have a long-lived access token

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState({
    temperature: null,
    conditions: null,
    available: false
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const headers = {};
        if (HA_TOKEN) {
          headers['Authorization'] = `Bearer ${HA_TOKEN}`;
        }

        const response = await fetch(HA_API_URL, { headers });
        const data = await response.json();
        
        if (data && data.state) {
          setWeatherData({
            temperature: parseFloat(data.state),
            conditions: data.attributes?.friendly_name || 'Outside',
            available: true
          });
        } else {
          setWeatherData(prev => ({ ...prev, available: false }));
        }
      } catch (error) {
        console.warn('Weather API fetch error:', error);
        setWeatherData(prev => ({ ...prev, available: false }));
      }
    };

    // Initial fetch
    fetchWeather();
    
    // Update every 5 minutes (weather doesn't change that fast)
    const interval = setInterval(fetchWeather, 300000);

    return () => clearInterval(interval);
  }, []);

  return weatherData;
};

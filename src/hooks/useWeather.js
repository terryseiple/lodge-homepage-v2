import { useState, useEffect } from 'react';

const WEATHER_CONFIG = {
  apiUrl: 'https://swd.weatherflow.com/swd/rest',
  stationId: process.env.VITE_WEATHERFLOW_STATION_ID || null,
  token: process.env.VITE_WEATHERFLOW_TOKEN || null,
  refreshInterval: 5 * 60 * 1000, // 5 minutes
  fallbackData: {
    temperature: null,
    humidity: null,
    pressure: null,
    windSpeed: null,
    conditions: 'unavailable'
  }
};

export const useWeather = () => {
  const [weather, setWeather] = useState(WEATHER_CONFIG.fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchWeather = async () => {
    if (!WEATHER_CONFIG.stationId || !WEATHER_CONFIG.token) {
      setError('WeatherFlow credentials not configured');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${WEATHER_CONFIG.apiUrl}/observations/station/${WEATHER_CONFIG.stationId}?token=${WEATHER_CONFIG.token}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.obs && data.obs.length > 0) {
        const latest = data.obs[0];
        setWeather({
          temperature: latest.air_temperature,
          humidity: latest.relative_humidity,
          pressure: latest.station_pressure,
          windSpeed: latest.wind_avg,
          windGust: latest.wind_gust,
          conditions: getConditions(latest),
          timestamp: latest.timestamp
        });
        setLastUpdate(new Date());
        setError(null);
      }
      
      setLoading(false);
    } catch (err) {
      console.warn('Weather fetch failed:', err);
      setError(err.message);
      setLoading(false);
      
      // Keep last known data if available
      if (weather.temperature !== null) {
        console.log('Using cached weather data');
      }
    }
  };

  const getConditions = (obs) => {
    if (obs.precip_type > 0) return 'rainy';
    if (obs.wind_avg > 15) return 'windy';
    if (obs.solar_radiation > 800) return 'sunny';
    if (obs.solar_radiation < 100) return 'cloudy';
    return 'clear';
  };

  useEffect(() => {
    fetchWeather();
    
    const interval = setInterval(() => {
      fetchWeather();
    }, WEATHER_CONFIG.refreshInterval);

    return () => clearInterval(interval);
  }, []);

  const refresh = () => {
    setLoading(true);
    fetchWeather();
  };

  return {
    weather,
    loading,
    error,
    lastUpdate,
    refresh,
    available: weather.temperature !== null
  };
};

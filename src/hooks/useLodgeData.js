import { useState, useEffect } from 'react';

const BOILER_API = 'http://10.0.101.98:5000/';
const WEATHER_API = 'http://10.0.101.98:5000/weather';

export const useLodgeData = () => {
  const [data, setData] = useState({
    boiler: { temperature: null, status: 'unknown', available: false },
    weather: { temperature: null, conditions: null, available: false }
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch boiler
      try {
        const boilerRes = await fetch(BOILER_API);
        const boilerData = await boilerRes.json();
        if (boilerData?.live) {
          setData(prev => ({
            ...prev,
            boiler: {
              temperature: parseFloat(boilerData.live.temp),
              status: boilerData.live.status,
              available: true,
              connected: true
            }
          }));
        }
      } catch (err) {
        console.warn('Boiler fetch error:', err);
      }

      // Fetch weather from NEW endpoint
      try {
        const weatherRes = await fetch(WEATHER_API);
        if (weatherRes.ok) {
          const weatherData = await weatherRes.json();
          setData(prev => ({
            ...prev,
            weather: {
              temperature: parseFloat(weatherData.temperature),
              conditions: weatherData.conditions || 'Outside',
              available: true
            }
          }));
        }
      } catch (err) {
        console.warn('Weather fetch error:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return data;
};

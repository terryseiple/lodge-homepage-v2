import { useState, useEffect } from 'react';

const BOILER_API_URL = 'http://10.0.101.98:5000/';

export const useBoilerData = () => {
  const [boilerData, setBoilerData] = useState({
    temperature: null,
    status: 'unknown',
    available: false,
    bottomAir: null,
    topAir: null,
    o2: null
  });

  useEffect(() => {
    const fetchBoilerData = async () => {
      try {
        const response = await fetch(BOILER_API_URL);
        const data = await response.json();
        
        if (data && data.live) {
          setBoilerData({
            temperature: parseFloat(data.live.temp),
            status: data.live.status || 'unknown',
            bottomAir: parseFloat(data.live.Bottom_Air),
            topAir: parseFloat(data.live.Top_Air),
            o2: parseFloat(data.live.O2),
            available: true,
            connected: true
          });
        } else {
          setBoilerData(prev => ({ ...prev, available: false, connected: false }));
        }
      } catch (error) {
        console.warn('Boiler API fetch error:', error);
        setBoilerData(prev => ({ ...prev, available: false, connected: false }));
      }
    };

    // Initial fetch
    fetchBoilerData();
    
    // Update every 10 seconds
    const interval = setInterval(fetchBoilerData, 10000);

    return () => clearInterval(interval);
  }, []);

  return boilerData;
};

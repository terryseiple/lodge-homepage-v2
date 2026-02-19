import { useState, useEffect } from 'react';
import { bisonTheme } from './theme-bison';
import { useBoilerData } from './hooks/useBoilerData';
import { useWeather } from './hooks/useWeather';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const boiler = useBoilerData();
  const weather = useWeather();

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });

  const dateString = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const apps = [
    { name: 'Unraid', url: 'http://10.0.101.3', icon: '🖥️' },
    { name: 'Portainer', url: 'http://10.0.101.50:9000', icon: '🐳' },
    { name: 'Home Assistant', url: 'http://10.0.102.10:8123', icon: '🏠' },
    { name: 'Command Center', url: 'http://10.0.101.55', icon: '🎛️' },
    { name: 'Dashboards', url: 'http://10.0.101.63:3000', icon: '📊' },
    { name: 'Music', url: 'http://10.0.101.56', icon: '🎵' },
    { name: 'AdGuard', url: 'http://10.0.101.51:3000', icon: '🛡️' },
    { name: 'NPM', url: 'http://10.0.101.70:81', icon: '🔀' },
    { name: 'GitHub', url: 'https://github.com', icon: '💻', external: true },
  ];

  return (
    <div style={{ 
      backgroundColor: bisonTheme.colors.background,
      color: bisonTheme.colors.text,
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      {/* Bison Header */}
      <div style={{
        background: `linear-gradient(135deg, ${bisonTheme.colors.green} 0%, ${bisonTheme.colors.yellow} 100%)`,
        borderRadius: bisonTheme.borderRadius.xl,
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: bisonTheme.shadows.bison,
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          letterSpacing: '0.2em',
          margin: 0,
          color: bisonTheme.colors.background,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          HORNS UP 🦬
        </h1>
        <div style={{
          fontSize: '1.2rem',
          marginTop: '0.5rem',
          color: bisonTheme.colors.background,
          opacity: 0.9
        }}>
          The Lodge Command Center
        </div>
      </div>

      {/* Clock & Date */}
      <div style={{
        backgroundColor: bisonTheme.colors.card,
        borderRadius: bisonTheme.borderRadius.lg,
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center',
        border: `2px solid ${bisonTheme.colors.yellow}`,
      }}>
        <div style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          color: bisonTheme.colors.yellow,
          marginBottom: '0.5rem',
          fontFamily: 'monospace'
        }}>
          {timeString}
        </div>
        <div style={{
          fontSize: '1.2rem',
          color: bisonTheme.colors.textDim
        }}>
          {dateString}
        </div>
      </div>

      {/* Temperature Display - THE WORKING PART! */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {/* Boiler Temperature */}
        <div style={{
          backgroundColor: bisonTheme.colors.card,
          borderRadius: bisonTheme.borderRadius.lg,
          padding: '1.5rem',
          border: `2px solid ${boiler.available ? bisonTheme.colors.success : bisonTheme.colors.error}`,
        }}>
          <div style={{ 
            fontSize: '0.9rem', 
            color: bisonTheme.colors.textDim,
            marginBottom: '0.5rem'
          }}>
            🔥 Boiler Temperature
          </div>
          {boiler.available ? (
            <>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: bisonTheme.colors.yellow
              }}>
                {boiler.temperature ? `${boiler.temperature}°F` : '--'}
              </div>
              {boiler.status && (
                <div style={{
                  fontSize: '0.8rem',
                  color: boiler.status === 'running' ? bisonTheme.colors.success : bisonTheme.colors.textDim,
                  marginTop: '0.5rem'
                }}>
                  Status: {boiler.status}
                </div>
              )}
            </>
          ) : (
            <div style={{
              fontSize: '1.2rem',
              color: bisonTheme.colors.textMuted
            }}>
              Connecting to HA...
            </div>
          )}
        </div>

        {/* Outside Temperature */}
        <div style={{
          backgroundColor: bisonTheme.colors.card,
          borderRadius: bisonTheme.borderRadius.lg,
          padding: '1.5rem',
          border: `2px solid ${weather.available ? bisonTheme.colors.info : bisonTheme.colors.error}`,
        }}>
          <div style={{ 
            fontSize: '0.9rem', 
            color: bisonTheme.colors.textDim,
            marginBottom: '0.5rem'
          }}>
            🌡️ Outside Temperature
          </div>
          {weather.available ? (
            <>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: bisonTheme.colors.green
              }}>
                {weather.temperature ? `${weather.temperature}°F` : '--'}
              </div>
              {weather.conditions && (
                <div style={{
                  fontSize: '0.8rem',
                  color: bisonTheme.colors.textDim,
                  marginTop: '0.5rem'
                }}>
                  {weather.conditions}
                </div>
              )}
            </>
          ) : (
            <div style={{
              fontSize: '1.2rem',
              color: bisonTheme.colors.textMuted
            }}>
              Loading weather...
            </div>
          )}
        </div>

        {/* Connection Status */}
        <div style={{
          backgroundColor: bisonTheme.colors.card,
          borderRadius: bisonTheme.borderRadius.lg,
          padding: '1.5rem',
          border: `2px solid ${bisonTheme.colors.yellow}`,
        }}>
          <div style={{ 
            fontSize: '0.9rem', 
            color: bisonTheme.colors.textDim,
            marginBottom: '0.5rem'
          }}>
            🔌 System Status
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: boiler.connected ? bisonTheme.colors.success : bisonTheme.colors.error,
                display: 'inline-block'
              }}></span>
              Home Assistant {boiler.connected ? 'Connected' : 'Disconnected'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: boiler.available ? bisonTheme.colors.success : bisonTheme.colors.warning,
                display: 'inline-block'
              }}></span>
              Boiler Data {boiler.available ? 'Available' : 'Unavailable'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: weather.available ? bisonTheme.colors.success : bisonTheme.colors.warning,
                display: 'inline-block'
              }}></span>
              Weather Data {weather.available ? 'Available' : 'Unavailable'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Apps */}
      <div style={{
        backgroundColor: bisonTheme.colors.card,
        borderRadius: bisonTheme.borderRadius.lg,
        padding: '1.5rem',
        marginBottom: '2rem',
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          color: bisonTheme.colors.yellow,
          marginBottom: '1rem',
          borderBottom: `2px solid ${bisonTheme.colors.green}`,
          paddingBottom: '0.5rem'
        }}>
          Quick Launch
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '0.75rem'
        }}>
          {apps.map(app => (
            <a
              key={app.name}
              href={app.url}
              target={app.external ? '_blank' : '_self'}
              rel={app.external ? 'noopener noreferrer' : ''}
              style={{
                backgroundColor: bisonTheme.colors.background,
                border: `2px solid ${bisonTheme.colors.border}`,
                borderRadius: bisonTheme.borderRadius.md,
                padding: '1rem',
                textDecoration: 'none',
                color: bisonTheme.colors.text,
                textAlign: 'center',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = bisonTheme.colors.yellow;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = bisonTheme.shadows.bison;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = bisonTheme.colors.border;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {app.icon}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                {app.name}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        color: bisonTheme.colors.textMuted,
        fontSize: '0.9rem',
        paddingTop: '2rem',
        borderTop: `1px solid ${bisonTheme.colors.border}`
      }}>
        GO BISON! 🦬 | The Lodge Infrastructure | React + Vite + Live Data
      </div>
    </div>
  );
}

export default App;

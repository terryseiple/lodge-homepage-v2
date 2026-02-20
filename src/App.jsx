import { useState, useEffect } from 'react'
import QuickLaunch from './components/QuickLaunch'

function App() {
  const [timeString, setTimeString] = useState('')
  const [dateString, setDateString] = useState('')
  const [weather, setWeather] = useState({ temperature: null, available: false })
  const [boiler, setBoiler] = useState({ temperature: null, available: false })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeString(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      }))
      setDateString(now.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/ha-api/states/sensor.the_lodge_sensors_temperature')
        if (response.ok) {
          const data = await response.json()
          const temp = Math.round(parseFloat(data.state))
          setWeather({ temperature: temp, available: true })
          console.log('Weather:', temp)
        }
      } catch (e) {
        console.log('Weather error:', e)
        setWeather({ temperature: null, available: false })
      }
    }

    const fetchBoiler = async () => {
      try {
        const response = await fetch('http://10.0.101.98:5000')
        if (response.ok) {
          const data = await response.json()
          const temp = Math.round(parseFloat(data.live.temp))
          setBoiler({ temperature: temp, available: true })
          console.log('Boiler:', temp)
        }
      } catch (e) {
        console.log('Boiler error:', e)
        setBoiler({ temperature: null, available: false })
      }
    }

    fetchWeather()
    fetchBoiler()
    const interval = setInterval(() => {
      fetchWeather()
      fetchBoiler()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen text-white p-8" style={{
      background: 'linear-gradient(135deg, #FFC72C 0%, #1a5c3a 50%, #0a4d2e 100%)'
    }}>
      <div className="max-w-7xl mx-auto">
        
      <div className="relative text-center mb-12 py-12">
        {/* CORN ON LEFT SIDE - LOCKED IN STONE */}
        <div className="absolute top-4 left-4 text-7xl opacity-60 animate-bounce-slow" style={{filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.6))'}}>🌽</div>
        <div className="absolute top-24 left-12 text-6xl opacity-50 animate-bounce-slow" style={{animationDelay: '0.3s', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.6))'}}>🌽</div>
        <div className="absolute bottom-8 left-8 text-6xl opacity-50 animate-bounce-slow" style={{animationDelay: '0.6s', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.6))'}}>🌽</div>
        
        {/* WHEAT ON RIGHT SIDE - LOCKED IN STONE */}
        <div className="absolute top-4 right-4 text-7xl opacity-60 animate-bounce-slow" style={{animationDelay: '0.5s', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.6))'}}>🌾</div>
        <div className="absolute top-24 right-12 text-6xl opacity-50 animate-bounce-slow" style={{animationDelay: '0.2s', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.6))'}}>🌾</div>
        <div className="absolute bottom-8 right-8 text-6xl opacity-50 animate-bounce-slow" style={{animationDelay: '0.4s', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.6))'}}>🌾</div>
        
        <h1 className="text-8xl font-black tracking-[0.3em] text-bison-dark drop-shadow-2xl funky-font mb-4">
          HORNS UP 🦬
        </h1>
        <div className="text-3xl mt-2 text-bison-dark opacity-90 font-bold">The Lodge Command Center</div>
      </div>

      <div className="bg-bison-card rounded-xl p-8 mb-8 text-center border-2 border-bison-yellow">
        <div className="text-6xl font-bold text-bison-yellow mb-2 font-mono">{timeString}</div>
        <div className="text-xl text-gray-400">{dateString}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={`bg-bison-card rounded-xl p-6 border-2 ${boiler.available ? 'border-green-500' : 'border-red-500'}`}>
          <div className="text-sm text-gray-400 mb-2">🔥 Boiler Temperature</div>
          {boiler.available && boiler.temperature ? (
            <>
              <div className="text-4xl font-bold text-bison-yellow">
                {boiler.temperature}°F
              </div>
              <div className="text-xs text-gray-500 mt-2">HeatMaster SS Pro</div>
            </>
          ) : (
            <div className="text-xl text-red-400">Unavailable</div>
          )}
        </div>

        <div className={`bg-bison-card rounded-xl p-6 border-2 ${weather.available ? 'border-green-500' : 'border-red-500'}`}>
          <div className="text-sm text-gray-400 mb-2">🌡️ Outdoor Temperature</div>
          {weather.available && weather.temperature ? (
            <>
              <div className="text-4xl font-bold text-bison-yellow">
                {weather.temperature}°F
              </div>
              <div className="text-xs text-gray-500 mt-2">WeatherFlow Tempest</div>
            </>
          ) : (
            <div className="text-xl text-red-400">Unavailable</div>
          )}
        </div>

        <div className="bg-bison-card rounded-xl p-6 border-2 border-bison-yellow">
          <div className="text-sm text-gray-400 mb-2">🦬 System Status</div>
          <div className="text-4xl font-bold text-green-500">ALL GOOD</div>
          <div className="text-xs text-gray-500 mt-2">Command Center Online</div>
        </div>
      </div>

      <QuickLaunch />

      {/* STEALTH PAGE SWITCHER */}
      <div className="text-center mt-8 mb-4">
        <span className="text-xs text-gray-300">Go Bison · Est. 2026 · </span>
        <a href="/basket/" className="text-xs text-bison-yellow hover:text-yellow-300 transition-colors font-bold">
          🧺
        </a>
      </div>

      </div>
    </div>
  )
}

export default App

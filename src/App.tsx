import { useState, useEffect } from 'react'

type Distance = {
  name: string;
  miles: number;
  kilometers: number;
  displayName: string;
}

const DISTANCES: Distance[] = [
  { name: 'mile', miles: 1, kilometers: 1.60934, displayName: 'Mile' },
  { name: '2mile', miles: 2, kilometers: 3.21868, displayName: '2 Mile' },
  { name: '3mile', miles: 3, kilometers: 4.82802, displayName: '3 Mile' },
  { name: '5k', miles: 3.10686, kilometers: 5, displayName: '5K' },
  { name: 'halfMarathon', miles: 13.1094, kilometers: 21.0975, displayName: 'Half Marathon' },
  { name: 'marathon', miles: 26.2188, kilometers: 42.195, displayName: 'Marathon' },
]

type PaceInfo = {
  distance: string;
  time: string;
  distanceInMeters?: number;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

function App() {
  const [mode, setMode] = useState<'timeToPace' | 'paceToTime'>(() => {
    const savedMode = localStorage.getItem('calculatorMode')
    return (savedMode === 'timeToPace' || savedMode === 'paceToTime') ? savedMode : 'timeToPace'
  })
  const [selectedDistance, setSelectedDistance] = useState<Distance>(() => {
    const saved = localStorage.getItem('lastDistance')
    return saved ? DISTANCES.find(d => d.name === saved) || DISTANCES[3] : DISTANCES[3]
  })
  const [hours, setHours] = useState<string>('')
  const [minutes, setMinutes] = useState<string>('')
  const [seconds, setSeconds] = useState<string>('')
  const [result, setResult] = useState<{
    mainResult: string;
    paces?: PaceInfo[];
    totalDistance?: {
      kilometers: string;
      miles: string;
    };
  } | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    localStorage.setItem('lastDistance', selectedDistance.name)
  }, [selectedDistance])

  useEffect(() => {
    localStorage.setItem('calculatorMode', mode)
  }, [mode])

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
      calculate()
    }
  }

  useEffect(() => {
    document.addEventListener('keypress', handleKeyPress)
    return () => document.removeEventListener('keypress', handleKeyPress)
  }, [minutes, seconds, mode, selectedDistance])

  const copyResults = async () => {
    if (!result) return

    let textToCopy = `${selectedDistance.displayName} ${mode === 'timeToPace' ? 'Time' : 'Pace'}: ${result.mainResult}\n`
    
    if (result.paces) {
      textToCopy += '\nSplit Paces:\n'
      result.paces.forEach(pace => {
        textToCopy += `${pace.distance}: ${pace.time}\n`
      })
    }

    if (result.totalDistance) {
      textToCopy += `\nTotal Distance: ${result.totalDistance.kilometers}\n(${result.totalDistance.miles})`
    }

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
    } catch (err) {
      console.error('Failed to copy results:', err)
    }
  }

  const calculate = () => {
    const totalSeconds = 
      (parseInt(hours) || 0) * 3600 + 
      (parseInt(minutes) || 0) * 60 + 
      (parseInt(seconds) || 0)

    if (totalSeconds <= 0) {
      setResult({ mainResult: 'Please enter a valid time' })
      return
    }

    if (mode === 'timeToPace') {
      // Calculate various paces
      const metersPerSecond = (selectedDistance.kilometers * 1000) / totalSeconds
      
      const paces: PaceInfo[] = [
        {
          distance: '400m',
          time: formatTime(400 / metersPerSecond),
          distanceInMeters: 400
        },
        {
          distance: '800m (½ mile)',
          time: formatTime(800 / metersPerSecond),
          distanceInMeters: 800
        },
        {
          distance: '1km',
          time: formatTime(1000 / metersPerSecond),
          distanceInMeters: 1000
        },
        {
          distance: '1 mile',
          time: formatTime((1609.34 / metersPerSecond)),
          distanceInMeters: 1609.34
        }
      ]

      paces.sort((a, b) => (a.distanceInMeters || 0) - (b.distanceInMeters || 0))

      const mileSeconds = totalSeconds / selectedDistance.miles
      const mileMinutes = Math.floor(mileSeconds / 60)
      const remainingSeconds = Math.round(mileSeconds % 60)

      setResult({
        mainResult: `${mileMinutes}:${remainingSeconds.toString().padStart(2, '0')} per mile`,
        paces
      })
    } else {
      // Calculate total time from pace
      const paceSeconds = 
        (parseInt(hours) || 0) * 3600 + 
        (parseInt(minutes) || 0) * 60 + 
        (parseInt(seconds) || 0)

      // paceSeconds is per mile, multiply by total miles for total time
      const totalTimeSeconds = Math.round(paceSeconds * selectedDistance.miles)
      
      const totalHours = Math.floor(totalTimeSeconds / 3600)
      const remainingMinutes = Math.floor((totalTimeSeconds % 3600) / 60)
      const remainingSeconds = Math.round(totalTimeSeconds % 60)
      
      const timeStr = totalHours > 0 
        ? `${totalHours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
        : `${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`

      setResult({
        mainResult: timeStr,
        totalDistance: {
          kilometers: `${selectedDistance.kilometers.toFixed(2)} km`,
          miles: `${selectedDistance.miles.toFixed(2)} miles`
        }
      })
    }
  }

  const commonInputStyles: React.CSSProperties = {
    backgroundColor: '#2a2a2a',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '18px',
    outline: 'none',
    transition: 'all 0.2s ease'
  }

  const selectStyle: React.CSSProperties = {
    ...commonInputStyles,
    padding: '12px 16px',
    paddingRight: '40px',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '300px',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23646cff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px'
  }

  const timeInputsContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: mode === 'timeToPace' ? 'space-between' : 'center',
    gap: '24px',
    width: '100%',
    maxWidth: '300px',
    marginBottom: '24px'
  }

  const timeInputGroupStyle: React.CSSProperties = {
    flex: mode === 'timeToPace' ? '1 1 0' : '0 1 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '90px'
  }

  const inputStyle: React.CSSProperties = {
    ...commonInputStyles,
    width: '90px',
    padding: '12px 8px',
    textAlign: 'center',
  }

  const labelStyle = {
    fontSize: '14px',
    color: '#888',
    textAlign: 'center' as const,
    marginTop: '8px',
    display: 'block',
    width: '100%'
  }

  const formLabelStyle = {
    fontSize: '14px',
    color: '#888',
    textAlign: 'center' as const,
    marginBottom: '12px',
    display: 'block',
    width: '100%',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    fontWeight: '600'
  }

  const sectionStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '300px',
    marginBottom: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    width: '100%',
    maxWidth: '300px',
    justifyContent: 'center'
  }

  const buttonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '12px 24px',
    backgroundColor: isActive ? '#646cff' : '#2a2a2a',
    color: isActive ? 'white' : '#888',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  })

  const modeButtonStyle = buttonStyle

  const resultStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '300px',
    marginTop: '32px',
    textAlign: 'center'
  }

  const resultTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#888',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '600'
  }

  const resultValueStyle: React.CSSProperties = {
    fontSize: '36px',
    color: '#646cff',
    fontWeight: '600',
    marginBottom: '24px'
  }

  const splitTimeStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #2a2a2a',
    fontSize: '16px'
  }

  const splitLabelStyle: React.CSSProperties = {
    color: '#888'
  }

  const splitValueStyle: React.CSSProperties = {
    color: 'white',
    fontWeight: '500'
  }

  const calculateButtonStyle: React.CSSProperties = {
    ...commonInputStyles,
    padding: '14px 24px',
    backgroundColor: '#646cff',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: '600',
    border: 'none',
    width: '100%'
  }

  const copyButtonStyle = (isCopied: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    backgroundColor: isCopied ? '#646cff' : '#2a2a2a',
    color: isCopied ? 'white' : '#888',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '24px'
  })

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <style>{`
        input:hover, select:hover {
          background-color: #333;
        }
        input:focus, select:focus {
          background-color: #333;
          box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
        }
        button:hover {
          transform: translateY(-1px);
          background-color: ${mode === 'timeToPace' ? '#535bc9' : '#333'};
        }
        button:active {
          transform: translateY(0);
        }
        button.active:hover {
          background-color: #535bc9;
        }
        button[style*="background-color: rgb(100, 108, 255)"]:hover {
          background-color: #535bc9 !important;
        }
      `}</style>
      <nav style={{
        backgroundColor: '#1a1a1a',
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#646cff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <h1 style={{ 
          margin: 0,
          fontSize: '24px',
          color: 'white',
          fontWeight: '600'
        }}>Race Pace Calculator</h1>
      </nav>
      
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '32px 24px'
      }}>
        <div style={{ 
          maxWidth: '400px', 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={sectionStyle}>
            <p style={formLabelStyle}>Select Calculation Mode</p>
            <div style={buttonContainerStyle}>
              <button
                onClick={() => setMode('timeToPace')}
                className={mode === 'timeToPace' ? 'active' : ''}
                style={buttonStyle(mode === 'timeToPace')}
              >
                Time → Pace
              </button>
              <button
                onClick={() => setMode('paceToTime')}
                style={modeButtonStyle(mode === 'paceToTime')}
              >
                Pace → Time
              </button>
            </div>
          </div>

          <div style={sectionStyle}>
            <p style={formLabelStyle}>Select Race Distance</p>
            <select 
              value={selectedDistance.name}
              onChange={(e) => setSelectedDistance(DISTANCES.find(d => d.name === e.target.value) || DISTANCES[0])}
              style={selectStyle}
            >
              {DISTANCES.map(distance => (
                <option 
                  key={distance.name} 
                  value={distance.name}
                >
                  {distance.displayName}
                </option>
              ))}
            </select>
          </div>

          <div style={sectionStyle}>
            <p style={formLabelStyle}>
              Enter your {mode === 'timeToPace' ? `${selectedDistance.displayName} time` : 'target mile pace'}
            </p>
            <div style={timeInputsContainerStyle}>
              {mode === 'timeToPace' && (
                <div style={timeInputGroupStyle}>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="00"
                    style={inputStyle}
                    min="0"
                    max="99"
                  />
                  <label style={labelStyle}>Hours</label>
                </div>
              )}
              <div style={timeInputGroupStyle}>
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="00"
                  style={inputStyle}
                  min="0"
                  max="59"
                />
                <label style={labelStyle}>Minutes</label>
              </div>
              <div style={timeInputGroupStyle}>
                <input
                  type="number"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  placeholder="00"
                  style={inputStyle}
                  min="0"
                  max="59"
                />
                <label style={labelStyle}>Seconds</label>
              </div>
            </div>
            <button onClick={calculate} style={calculateButtonStyle}>
              Calculate {mode === 'timeToPace' ? 'Pace' : 'Time'}
            </button>
          </div>

          {result && (
            <div style={resultStyle}>
              <h2 style={resultTitleStyle}>
                {mode === 'timeToPace' ? 'Your Paces:' : `Your ${selectedDistance.displayName} Time:`}
              </h2>
              <p style={resultValueStyle}>{result.mainResult}</p>
              
              {result.paces && (
                <div>
                  {result.paces.map((pace, index) => (
                    <div key={index} style={splitTimeStyle}>
                      <span style={splitLabelStyle}>{pace.distance}:</span>
                      <span style={splitValueStyle}>{pace.time}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {result.totalDistance && (
                <div style={{ marginTop: '24px', color: '#888' }}>
                  <div style={splitTimeStyle}>
                    <span style={splitLabelStyle}>Distance:</span>
                    <span style={splitValueStyle}>{result.totalDistance.kilometers}</span>
                  </div>
                  <div style={splitTimeStyle}>
                    <span style={splitLabelStyle}>Miles:</span>
                    <span style={splitValueStyle}>{result.totalDistance.miles}</span>
                  </div>
                </div>
              )}

              <button
                onClick={copyResults}
                style={copyButtonStyle(copied)}
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  {copied ? (
                    <polyline points="20 6 9 17 4 12" />
                  ) : (
                    <>
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </>
                  )}
                </svg>
                {copied ? 'Copied!' : 'Copy Results'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App

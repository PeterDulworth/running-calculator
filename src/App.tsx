import { useState, useEffect } from 'react'
import type { CalculationMode, Distance, CalculationResult } from './types'
import { DISTANCES } from './constants'
import { calculateResults } from './calculations'
import { Navigation, ModeSelector, DistanceSelector, TimeInputs, Results } from './components'

function App() {
  const [mode, setMode] = useState<CalculationMode>(() => {
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
  const [result, setResult] = useState<CalculationResult | null>(null)
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
    const calculationResult = calculateResults(mode, selectedDistance, hours, minutes, seconds)
    setResult(calculationResult)
  }

  const handleModeChange = (newMode: CalculationMode) => {
    setMode(newMode)
    setHours('')
    setMinutes('')
    setSeconds('')
    setResult(null)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
    }}>
      <style>{`
        input:hover, select:hover {
          background-color: #333;
        }
        body, html {
          overflow: hidden;
          width: 100%;
          height: 100%;
          background-color: #1a1a1a;
        }
        input:focus, select:focus {
          background-color: #333;
          box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
        }
        input::-webkit-input-placeholder {
          text-align: center;
        }
        input::-moz-placeholder {
          text-align: center;
        }
        input:-ms-input-placeholder {
          text-align: center;
        }
        input::placeholder {
          text-align: center;
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
      
      <Navigation />
      
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '32px 0',
        // minHeight: 'calc(100vh - 120px)',
        width: '100%',
        height: 'calc(100vh - 48px)',
        marginTop: '48px',
        marginBottom: '48px',
        overflowY: 'scroll'
      }}>
        <div style={{ 
          // maxWidth: '400px', 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <ModeSelector 
            mode={mode} 
            onModeChange={handleModeChange} 
          />

          <DistanceSelector 
            selectedDistance={selectedDistance}
            onDistanceChange={setSelectedDistance}
          />

          <TimeInputs
            mode={mode}
            selectedDistance={selectedDistance}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            onHoursChange={setHours}
            onMinutesChange={setMinutes}
            onSecondsChange={setSeconds}
            onCalculate={calculate}
          />

          <Results
            result={result}
            mode={mode}
            selectedDistance={selectedDistance}
            copied={copied}
            onCopyResults={copyResults}
          />
        </div>
      </main>
    </div>
  )
}

export default App

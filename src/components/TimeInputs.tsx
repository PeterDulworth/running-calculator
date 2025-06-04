import type { CalculationMode, Distance } from '../types';

interface TimeInputsProps {
  mode: CalculationMode;
  selectedDistance: Distance;
  hours: string;
  minutes: string;
  seconds: string;
  onHoursChange: (value: string) => void;
  onMinutesChange: (value: string) => void;
  onSecondsChange: (value: string) => void;
  onCalculate: () => void;
}

export function TimeInputs({ 
  mode, 
  selectedDistance, 
  hours, 
  minutes, 
  seconds, 
  onHoursChange, 
  onMinutesChange, 
  onSecondsChange,
  onCalculate 
}: TimeInputsProps) {
  const sectionStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '300px',
    marginBottom: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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

  const timeInputsContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: mode === 'timeToPace' ? 'space-between' : 'center',
    gap: '16px',
    width: '100%',
    maxWidth: '300px',
    marginBottom: '24px',
    boxSizing: 'border-box'
  }

  const timeInputGroupStyle: React.CSSProperties = {
    flex: mode === 'timeToPace' ? '1 1 0' : '0 1 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '90px'
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

  const inputStyle: React.CSSProperties = {
    ...commonInputStyles,
    boxSizing: 'border-box',
    width: '80px',
    padding: '12px 8px',
    textAlign: 'center'
  }

  const labelStyle = {
    fontSize: '14px',
    color: '#888',
    textAlign: 'center' as const,
    marginTop: '8px',
    display: 'block',
    width: '100%'
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

  return (
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
              onChange={(e) => onHoursChange(e.target.value)}
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
            onChange={(e) => onMinutesChange(e.target.value)}
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
            onChange={(e) => onSecondsChange(e.target.value)}
            placeholder="00"
            style={inputStyle}
            min="0"
            max="59"
          />
          <label style={labelStyle}>Seconds</label>
        </div>
      </div>
      <button onClick={onCalculate} style={calculateButtonStyle}>
        Calculate {mode === 'timeToPace' ? 'Pace' : 'Time'}
      </button>
    </div>
  )
} 
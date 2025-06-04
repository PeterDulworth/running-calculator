import type { CalculationMode } from '../types';

interface ModeSelectorProps {
  mode: CalculationMode;
  onModeChange: (mode: CalculationMode) => void;
}

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
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

  return (
    <div style={sectionStyle}>
      <p style={formLabelStyle}>Select Calculation Mode</p>
      <div style={buttonContainerStyle}>
        <button
          onClick={() => onModeChange('timeToPace')}
          className={mode === 'timeToPace' ? 'active' : ''}
          style={buttonStyle(mode === 'timeToPace')}
        >
          Time → Pace
        </button>
        <button
          onClick={() => onModeChange('paceToTime')}
          style={buttonStyle(mode === 'paceToTime')}
        >
          Pace → Time
        </button>
      </div>
    </div>
  )
} 
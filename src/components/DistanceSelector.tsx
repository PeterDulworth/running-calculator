import type { Distance } from '../types';
import { DISTANCES } from '../constants';

interface DistanceSelectorProps {
  selectedDistance: Distance;
  onDistanceChange: (distance: Distance) => void;
}

export function DistanceSelector({ selectedDistance, onDistanceChange }: DistanceSelectorProps) {
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

  return (
    <div style={sectionStyle}>
      <p style={formLabelStyle}>Select Race Distance</p>
      <select 
        value={selectedDistance.name}
        onChange={(e) => onDistanceChange(DISTANCES.find(d => d.name === e.target.value) || DISTANCES[0])}
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
  )
} 
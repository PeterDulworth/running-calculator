import type { CalculationResult, CalculationMode, Distance } from '../types';

interface ResultsProps {
  result: CalculationResult | null;
  mode: CalculationMode;
  selectedDistance: Distance;
  copied: boolean;
  onCopyResults: () => void;
}

export function Results({ result, mode, selectedDistance, copied, onCopyResults }: ResultsProps) {
  if (!result) return null;

  const resultStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '300px',
    marginBottom: '48px',
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
        onClick={onCopyResults}
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
  )
} 
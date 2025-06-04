export function Navigation() {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: '#1a1a1a',
      padding: '24px 32px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      borderBottom: '1px solid #2a2a2a',
      justifyContent: 'center',
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
      }}>Running Calculator</h1>
    </nav>
  )
} 
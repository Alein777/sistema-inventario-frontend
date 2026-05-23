export default function ActionButton({ icon: Icon, title, onClick, danger = false, color = null, size = 14 }) {
  const buttonColor = color || (danger ? '#dc2626' : '#2563eb');
  const bgColor = danger ? '#dc2626' : '#fff';

  return (
    <button 
      onClick={onClick} 
      title={title}
      style={{
        flex: 1, 
        padding: '6px 10px', 
        borderRadius: 6, 
        border: `1px solid ${danger ? '#dc2626' : '#e2e8f0'}`,
        background: bgColor,
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontWeight: 500,
        fontSize: 12,
        minWidth: '32px',
        minHeight: '32px'
      }}
    >
      <Icon 
        size={size} 
        color={danger ? '#fff' : buttonColor} 
      />
    </button>
  );
}

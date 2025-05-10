import React from 'react';

const StatusTextCard = ({
  label = 'Truenas State',
  status = 'Checking...',
  style = {},
}) => {
  return (
    <div
      style={{
        width: '140px',
        height: '150px',
        margin: '5px',
        padding: '24px',
        backgroundColor: '#1e1e1e',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      tabIndex={0}
    >
      <div
        style={{
          fontSize: '18px',
          color: '#AAAAAA',
          paddingBottom: '2px',
          textAlign: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: '15px',
          color: '#FFFFFF',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          marginTop: '10px',
          textAlign: 'center',
        }}
      >
        {status}
      </div>
    </div>
  );
};

export default StatusTextCard;
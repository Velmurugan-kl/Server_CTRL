import React, { useState, useRef, useEffect } from 'react';

const PasswordModal = ({ onSubmit, onClose }) => {
  const [password, setPassword] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = () => {
    onSubmit(password);
    setPassword('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const buttonStyle = {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#444',
    color: '#fff',
    marginRight: '8px',
    transition: 'background 0.2s',
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#777',
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: '#222',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h3 style={{ color: '#fff' }}>Enter Password</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <input
            type="password"
            ref={inputRef}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              marginTop: '10px',
              padding: '8px',
              borderRadius: '4px',
              border: 'none',
              width: '200px',
              textAlign: 'center',
            }}
          />
          <div style={{ marginTop: '16px' }}>
            <button type="submit" style={buttonStyle}>Submit</button>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;

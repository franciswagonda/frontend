import React from 'react';

const Header = () => {
  return (
    <header style={{ backgroundColor: '#282c34', padding: '1rem', color: 'white' }}>
      <h1>UCU Innovators Hub</h1>
      <nav>
        <a href="/" style={{ margin: '0 1rem', color: 'white' }}>Home</a>
        <a href="/gallery" style={{ margin: '0 1rem', color: 'white' }}>Gallery</a>
        <a href="/login" style={{ margin: '0 1rem', color: 'white' }}>Login</a>
      </nav>
    </header>
  );
};

export default Header;

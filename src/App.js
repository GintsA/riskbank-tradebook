import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './Login';
import './App.css';
import TraderProfile from './components/TraderProfile';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check login state on app load
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return <Login onLogin={() => setUser(auth.currentUser)} />;
  }

  return (
    <div className="App">
      <TraderProfile user={user} />
      <div className="button-container">
        <button className="main-button" disabled>
          Trade entry
        </button>
      </div>
    </div>
  );
}

export default App;

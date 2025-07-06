import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './Login';
import './App.css';

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
      <h1 className="title">Project - RiskBank TradeBook</h1>
      <p>Welcome, {user.email}</p>
    </div>
  );
}

export default App;

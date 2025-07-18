import React, { useEffect, useState, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './TraderProfile.css';

const experienceWeights = {
  Wanderer: 0,
  Beginner: 1,
  Enthusiast: 1.5,
  Professional: 2.5,
  Expert: 4,
};

const experienceOptions = Object.keys(experienceWeights);

const getPerformanceMetricWeight = (metric) => {
  if (metric >= 100) return 0.055;
  if (metric >= 90) return 0.05;
  if (metric >= 80) return 0.045;
  if (metric >= 70) return 0.04;
  if (metric >= 60) return 0.035;
  if (metric >= 50) return 0.03;
  if (metric >= 40) return 0.025;
  if (metric >= 30) return 0.02;
  if (metric >= 20) return 0.015;
  if (metric >= 10) return 0.01;
  return 0.005;
};

function TraderProfile({ user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: '',
    experienceLevel: 'Wanderer',
    wins: '',
    losses: '',
    accountSize: '',
  });

  const loadProfile = useCallback(async () => {
     // Profiles are stored in the `traderProfiles` collection keyed by UID
      const ref = doc(db, 'traderProfiles', user.uid);
      const snap = await getDoc(ref);
    if (snap.exists()) {
      setProfile(snap.data());
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);

  const startCreate = () => {
    setForm({
      username: user.email,
      experienceLevel: 'Wanderer',
      wins: '',
      losses: '',
      accountSize: '',
    });
    setEditing(true);
  };

  const startEdit = () => {
    setForm({
      username: profile.username,
      experienceLevel: profile.experienceLevel,
      wins: profile.wins,
      losses: profile.losses,
      accountSize: profile.accountSize,
    });
    setEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const winsNum = parseFloat(form.wins) || 0;
    const lossesNum = parseFloat(form.losses) || 0;
    const accountSizeNum = parseFloat(form.accountSize) || 0;
    const totalTrades = winsNum + lossesNum;
    const performanceMetric = totalTrades === 0 ? 0 : Math.ceil((winsNum / totalTrades) * 100);
    const expWeight = experienceWeights[form.experienceLevel] || 0;
    const perfWeight = getPerformanceMetricWeight(performanceMetric);
    const riskBag = accountSizeNum * expWeight * perfWeight;
    const safeAccount = accountSizeNum - riskBag;
    const riskAllowance = riskBag * (performanceMetric / 100);

    const data = {
      username: form.username,
      experienceLevel: form.experienceLevel,
      wins: winsNum,
      losses: lossesNum,
      accountSize: accountSizeNum,
      performanceMetric,
      riskBag,
      safeAccount,
      riskAllowance,
    };

    const ref = doc(db, 'traderProfiles', user.uid);
    await setDoc(ref, data);
    setProfile(data);
    setEditing(false);
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (editing) {
    return (
      <div className="profile-form-wrapper">
        <h2 className="profile-form-title">Trader Profile</h2>
        <form className="profile-form">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <select
            name="experienceLevel"
            value={form.experienceLevel}
            onChange={handleChange}
          >
            {experienceOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="wins"
            value={form.wins}
            onChange={handleChange}
            placeholder="Wins"
          />
          <input
            type="number"
            name="losses"
            value={form.losses}
            onChange={handleChange}
            placeholder="Losses"
          />
          <input
            type="number"
            name="accountSize"
            value={form.accountSize}
            onChange={handleChange}
            placeholder="Account Size"
          />
          <button className="save-button" type="button" onClick={handleSave}>
            Save
          </button>
        </form>
      </div>
    );
  }

  if (profile) {
    return (
      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-title">Trader's Profile</h2>
          <button className="edit-button" onClick={startEdit}>
            Manage Profile
          </button>
        </div>

        <div className="profile-section">
          <div className="section-label">Identity</div>
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Experience Level:</strong> {profile.experienceLevel}
          </p>
        </div>

        <div className="profile-section">
          <div className="section-label">Performance</div>
          <p>
            <strong>Wins:</strong> {profile.wins}
          </p>
          <p>
            <strong>Losses:</strong> {profile.losses}
          </p>
          <p>
            <strong>Performance Metric:</strong> {profile.performanceMetric}
          </p>
        </div>

        <div className="profile-section">
          <div className="section-label">Risk Management</div>
          <p>
            <strong>Account Size:</strong> {profile.accountSize.toFixed(2)}
          </p>
          <p>
            <strong>Risk Bag:</strong> {profile.riskBag.toFixed(2)}
          </p>
          <p>
            <strong>Safe Account:</strong> {profile.safeAccount.toFixed(2)}
          </p>
          <p>
            <strong>Risk Allowance for Next Trade:</strong>{' '}
            {profile.riskAllowance.toFixed(2)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <button onClick={startCreate}>Create Trader's Profile</button>
  );
}

export default TraderProfile;

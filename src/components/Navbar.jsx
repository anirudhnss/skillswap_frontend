import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle, t } = useTheme();
  const nav = useNavigate();
  const loc = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    api.get('/trades/incoming').then(r => {
      setPendingCount(r.data.filter(t => t.status === 'PENDING').length);
    }).catch(() => {});
  }, [loc]);

  const linkStyle = (path) => ({
    color: loc.pathname === path ? t.accent : t.text2,
    textDecoration: 'none', fontWeight: 600, fontSize: 14,
    padding: '6px 12px', borderRadius: 8,
    background: loc.pathname === path ? (dark ? '#2d2b55' : '#ede9ff') : 'transparent',
    transition: 'all 0.2s'
  });

  return (
    <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',
      padding:'14px 32px', background:t.card, borderBottom:`1px solid ${t.border}`,
      position:'sticky', top:0, zIndex:100, backdropFilter:'blur(10px)'}}>
      <Link to="/" style={{color:t.accent,textDecoration:'none',fontSize:22,fontWeight:900,letterSpacing:-1}}>
        Skill<span style={{color:t.text}}>Swap</span>
      </Link>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <Link to="/" style={linkStyle('/')}>Home</Link>
        <Link to="/browse" style={linkStyle('/browse')}>Browse</Link>
        <Link to="/trades" style={{...linkStyle('/trades'), position:'relative'}}>
          Trades
          {pendingCount > 0 && (
            <span style={{position:'absolute',top:-6,right:-6,background:'#c62828',color:'#fff',
              borderRadius:'50%',width:18,height:18,fontSize:11,fontWeight:700,
              display:'flex',alignItems:'center',justifyContent:'center'}}>{pendingCount}</span>
          )}
        </Link>
        <Link to="/bookmarks" style={linkStyle('/bookmarks')}>Saved</Link>
        <Link to="/profile" style={linkStyle('/profile')}>Profile</Link>
        <button onClick={toggle} style={{background:t.bg3,border:'none',borderRadius:8,
          padding:'7px 12px',cursor:'pointer',fontSize:16}}>{dark ? '☀️' : '🌙'}</button>
        <button onClick={() => { logout(); nav('/login'); }}
          style={{background:'transparent',color:t.text2,border:`1px solid ${t.border}`,
            padding:'7px 14px',borderRadius:8,cursor:'pointer',fontSize:13,fontWeight:600}}>
          Logout
        </button>
      </div>
    </nav>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTheme();
  const [me, setMe] = useState(null);
  const [matches, setMatches] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    api.get('/users/me').then(r => setMe(r.data));
    api.get('/users/smart-match').then(r => setMatches(r.data.slice(0, 3)));
    api.get('/trades/incoming').then(r => setPendingCount(r.data.filter(t => t.status === 'PENDING').length));
  }, []);

  const statCard = (icon, label, value, color, to) => (
    <Link to={to} style={{textDecoration:'none'}}>
      <div style={{background:t.card,border:`2px solid ${t.border}`,borderRadius:14,padding:20,
        transition:'transform 0.2s', cursor:'pointer'}}
        onMouseOver={e=>e.currentTarget.style.transform='translateY(-3px)'}
        onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
        <div style={{fontSize:32,marginBottom:8}}>{icon}</div>
        <p style={{margin:0,color:t.text2,fontSize:13}}>{label}</p>
        <p style={{margin:'4px 0 0',fontSize:26,fontWeight:900,color}}>{value}</p>
      </div>
    </Link>
  );

  return (
    <div style={{maxWidth:900,margin:'0 auto',padding:'32px 24px',background:t.bg,minHeight:'100vh',color:t.text}}>
      <div style={{marginBottom:32}}>
        <h1 style={{fontSize:30,fontWeight:900,margin:0}}>Welcome back, {user?.name}! 👋</h1>
        <p style={{color:t.text2,marginTop:4}}>Ready to trade your skills today?</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:16,marginBottom:32}}>
        {statCard('📬','Pending Requests', pendingCount, '#c62828', '/trades')}
        {statCard('🎯','Skills Offered', me?.skillsOffered?.length || 0, t.accent, '/profile')}
        {statCard('🙋','Skills Needed', me?.skillsNeeded?.length || 0, '#2e7d32', '/profile')}
        {statCard('👁','Profile Views', me?.profileViews || 0, '#1565c0', '/profile')}
        {me?.averageRating > 0 && statCard('⭐','Your Rating', me.averageRating.toFixed(1), '#e65100', '/profile')}
      </div>

      {matches.length > 0 && (
        <div style={{marginBottom:32}}>
          <h2 style={{fontSize:20,fontWeight:800,marginBottom:4}}>🔥 Perfect Matches for You</h2>
          <p style={{color:t.text2,fontSize:14,marginBottom:16}}>These people offer what you need!</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:14}}>
            {matches.map(u => (
              <div key={u.id} style={{background:t.card,border:`2px solid ${t.accent}33`,borderRadius:14,padding:16}}>
                <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:8}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:t.accent,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:16}}>{u.name[0]}</div>
                  <div>
                    <p style={{margin:0,fontWeight:700,fontSize:14}}>{u.name}</p>
                    {u.city && <p style={{margin:0,color:t.text2,fontSize:12}}>📍 {u.city}</p>}
                  </div>
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:10}}>
                  {u.skillsOffered?.map(s => <span key={s} style={{background:t.green,color:t.greenText,padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:600}}>{s}</span>)}
                </div>
                <Link to="/browse" style={{display:'block',textAlign:'center',padding:'8px',background:t.accent,color:'#fff',borderRadius:8,textDecoration:'none',fontSize:13,fontWeight:700}}>View Profile</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <Link to="/browse" style={{background:t.accent,color:'#fff',padding:24,borderRadius:16,textDecoration:'none',display:'block',
          transition:'opacity 0.2s'}} onMouseOver={e=>e.currentTarget.style.opacity='.9'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
          <div style={{fontSize:32}}>🔍</div>
          <h3 style={{margin:'8px 0 4px'}}>Browse Skills</h3>
          <p style={{margin:0,color:'rgba(255,255,255,0.8)',fontSize:14}}>Find people to trade with</p>
        </Link>
        <Link to="/trades" style={{background:t.card,border:`2px solid ${t.border}`,color:t.text,padding:24,borderRadius:16,textDecoration:'none',display:'block'}}>
          <div style={{fontSize:32}}>🤝</div>
          <h3 style={{margin:'8px 0 4px'}}>My Trades</h3>
          <p style={{margin:0,color:t.text2,fontSize:14}}>{pendingCount > 0 ? `${pendingCount} pending request(s)!` : 'See your trade requests'}</p>
        </Link>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import api from '../api/axios';
import TradeModal from '../components/TradeModal';
import { CardSkeleton } from '../components/Skeleton';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['All', 'Tech', 'Music', 'Languages', 'Fitness', 'Art', 'Cooking', 'Academic', 'Business'];
const LEVEL_COLORS = { Beginner: ['#fff3e0','#e65100'], Intermediate: ['#e8f5e9','#2e7d32'], Expert: ['#ede7f6','#4527a0'] };

export default function Browse() {
  const { t } = useTheme();
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [selected, setSelected] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [meId, setMeId] = useState(null);

  useEffect(() => {
    api.get('/users/me').then(r => { setMeId(r.data.id); setBookmarks(r.data.bookmarkedUserIds || []); });
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      try {
        let endpoint = '/users';
        if (search) endpoint = `/users/search?skill=${search}`;
        else if (category !== 'All') endpoint = `/users/category?category=${category}`;
        else if (sortBy === 'rating') endpoint = '/users/top-rated';
        const { data } = await api.get(endpoint);
        setUsers(data.filter(u => u.id !== meId));
      } finally { setLoading(false); }
    };
    fetch();
  }, [search, category, sortBy, meId]);

  const toggleBookmark = async (userId) => {
    await api.post(`/users/${userId}/bookmark`);
    setBookmarks(prev => prev.includes(userId) ? prev.filter(id=>id!==userId) : [...prev, userId]);
    addToast(bookmarks.includes(userId) ? 'Removed from saved' : 'Saved!', 'info');
  };

  const availBadge = (status) => ({
    background: status === 'AVAILABLE' ? '#e8f5e9' : '#fff3e0',
    color: status === 'AVAILABLE' ? '#2e7d32' : '#e65100',
    padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:700
  });

  return (
    <div style={{maxWidth:1200,margin:'0 auto',padding:'32px 24px',background:t.bg,minHeight:'100vh',color:t.text}}>
      <h2 style={{fontSize:28,fontWeight:800,marginBottom:4}}>Find a Skill</h2>
      <p style={{color:t.text2,marginBottom:24}}>Browse people and propose a trade</p>

      <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}>
        <input placeholder="🔍 Search skill..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{flex:1,minWidth:200,padding:'12px 16px',fontSize:15,border:`2px solid ${t.border}`,borderRadius:10,background:t.bg2,color:t.text}} />
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
          style={{padding:'12px 16px',border:`2px solid ${t.border}`,borderRadius:10,background:t.bg2,color:t.text,fontSize:14}}>
          <option value="default">Sort: Default</option>
          <option value="rating">Sort: Top Rated</option>
        </select>
      </div>

      <div style={{display:'flex',gap:8,marginBottom:24,flexWrap:'wrap'}}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={()=>setCategory(c)}
            style={{padding:'7px 16px',borderRadius:20,border:'none',cursor:'pointer',fontSize:13,fontWeight:600,
              background: category===c ? t.accent : t.bg3, color: category===c ? '#fff' : t.text}}>
            {c}
          </button>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(290px, 1fr))',gap:20}}>
        {loading ? Array(6).fill(0).map((_,i)=><CardSkeleton key={i}/>) :
          users.map((user, idx) => (
            <div key={user.id} style={{background:t.card,border:`2px solid ${t.border}`,borderRadius:16,padding:20,
              animation:`fadeUp 0.4s ease ${idx*0.05}s both`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                <div style={{display:'flex',gap:10,alignItems:'center'}}>
                  {user.avatarUrl
                    ? <img src={user.avatarUrl} style={{width:48,height:48,borderRadius:'50%',objectFit:'cover'}} />
                    : <div style={{width:48,height:48,borderRadius:'50%',background:t.accent,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:700}}>{user.name[0]}</div>
                  }
                  <div>
                    <p style={{margin:0,fontWeight:700,fontSize:15}}>{user.name}</p>
                    {user.city && <p style={{margin:0,color:t.text2,fontSize:12}}>📍 {user.city}</p>}
                  </div>
                </div>
                <button onClick={()=>toggleBookmark(user.id)} style={{background:'none',border:'none',fontSize:20,cursor:'pointer'}}>
                  {bookmarks.includes(user.id) ? '🔖' : '📌'}
                </button>
              </div>

              <div style={{display:'flex',gap:6,marginBottom:8,flexWrap:'wrap'}}>
                {user.availabilityStatus && <span style={availBadge(user.availabilityStatus)}>{user.availabilityStatus === 'AVAILABLE' ? '🟢 Available' : '🟡 Busy'}</span>}
                {user.averageRating > 0 && <span style={{background:t.bg3,color:t.text,padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:700}}>⭐ {user.averageRating.toFixed(1)}</span>}
                {user.profileViews > 0 && <span style={{color:t.text2,fontSize:11}}>👁 {user.profileViews} views</span>}
              </div>

              {user.bio && <p style={{color:t.text2,fontSize:13,marginBottom:12}}>{user.bio}</p>}

              <p style={{fontSize:11,fontWeight:700,color:t.text2,margin:'8px 0 4px',textTransform:'uppercase'}}>Offers</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:8}}>
                {user.skillsOffered?.map((s,i) => {
                  const level = user.skillLevels?.[i] || 'Beginner';
                  const [bg, col] = LEVEL_COLORS[level] || LEVEL_COLORS.Beginner;
                  return <span key={s} style={{background:bg,color:col,padding:'3px 10px',borderRadius:20,fontSize:12,fontWeight:600}}>{s} · {level}</span>;
                })}
              </div>

              <p style={{fontSize:11,fontWeight:700,color:t.text2,margin:'8px 0 4px',textTransform:'uppercase'}}>Needs</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:14}}>
                {user.skillsNeeded?.map(s=><span key={s} style={{background:t.blue,color:t.blueText,padding:'3px 10px',borderRadius:20,fontSize:12,fontWeight:600}}>{s}</span>)}
              </div>

              <div style={{display:'flex',gap:6}}>
                {user.githubUrl && <a href={user.githubUrl} target="_blank" style={{color:t.text2,fontSize:18,textDecoration:'none'}}>🐙</a>}
                {user.linkedinUrl && <a href={user.linkedinUrl} target="_blank" style={{color:t.text2,fontSize:18,textDecoration:'none'}}>💼</a>}
                {user.instagramUrl && <a href={user.instagramUrl} target="_blank" style={{color:t.text2,fontSize:18,textDecoration:'none'}}>📸</a>}
              </div>

              <button onClick={()=>setSelected(user)} style={{marginTop:12,width:'100%',padding:10,background:t.accent,color:'#fff',border:'none',borderRadius:8,fontWeight:700,cursor:'pointer',transition:'opacity 0.2s'}}
                onMouseOver={e=>e.target.style.opacity='.85'} onMouseOut={e=>e.target.style.opacity='1'}>
                Propose a Trade →
              </button>
            </div>
          ))
        }
      </div>
      {selected && <TradeModal user={selected} onClose={()=>setSelected(null)} />}
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import TradeModal from '../components/TradeModal';

export default function Bookmarks() {
  const { t } = useTheme();
  const { addToast } = useToast();
  const [bookmarks, setBookmarks] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = () => api.get('/users/bookmarks').then(r => setBookmarks(r.data));
  useEffect(() => { load(); }, []);

  const removeBookmark = async (id) => {
    await api.post(`/users/${id}/bookmark`);
    load();
    addToast('Removed from saved', 'info');
  };

  return (
    <div style={{maxWidth:900,margin:'0 auto',padding:'32px 24px',background:t.bg,minHeight:'100vh',color:t.text}}>
      <h2 style={{fontSize:28,fontWeight:800,marginBottom:4}}>🔖 Saved Profiles</h2>
      <p style={{color:t.text2,marginBottom:24}}>People you bookmarked</p>
      {bookmarks.length === 0 ? (
        <div style={{textAlign:'center',padding:'80px 0',color:t.text2}}>
          <div style={{fontSize:56,marginBottom:12}}>📌</div>
          <p style={{fontSize:18}}>No saved profiles yet</p>
          <Link to="/browse" style={{color:'#6c63ff',fontWeight:700}}>Browse and save some →</Link>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:16}}>
          {bookmarks.map(user => (
            <div key={user.id} style={{background:t.card,border:`2px solid ${t.border}`,borderRadius:16,padding:20}}>
              <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:10}}>
                <div style={{width:44,height:44,borderRadius:'50%',background:'#6c63ff',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:18}}>{user.name[0]}</div>
                <div>
                  <p style={{margin:0,fontWeight:700}}>{user.name}</p>
                  {user.city && <p style={{margin:0,color:t.text2,fontSize:12}}>📍 {user.city}</p>}
                </div>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:12}}>
                {user.skillsOffered?.map(s=><span key={s} style={{background:t.green,color:t.greenText,padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:600}}>{s}</span>)}
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>setSelected(user)} style={{flex:1,padding:'8px',background:'#6c63ff',color:'#fff',border:'none',borderRadius:8,fontWeight:700,cursor:'pointer',fontSize:13}}>Trade</button>
                <button onClick={()=>removeBookmark(user.id)} style={{padding:'8px 12px',background:t.bg3,border:'none',borderRadius:8,cursor:'pointer',color:t.text,fontSize:13}}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {selected && <TradeModal user={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}

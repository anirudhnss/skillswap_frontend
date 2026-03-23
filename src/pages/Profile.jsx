import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['Tech','Music','Languages','Fitness','Art','Cooking','Academic','Business'];
const LEVELS = ['Beginner','Intermediate','Expert'];

export default function Profile() {
  const { t } = useTheme();
  const { addToast } = useToast();
  const [me, setMe] = useState(null);
  const [editing, setEditing] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({});

  useEffect(() => {
    api.get('/users/me').then(r => {
      setMe(r.data);
      setForm({
        ...r.data,
        skillsOffered: r.data.skillsOffered || [],
        skillsNeeded: r.data.skillsNeeded || [],
        skillLevels: r.data.skillLevels || [],
        skillCategories: r.data.skillCategories || [],
      });
      api.get(`/reviews/user/${r.data.id}`).then(rv => setReviews(rv.data));
    });
  }, []);

  const save = async () => {
    try {
      const r = await api.put('/users/me', form);
      setMe(r.data); setEditing(false);
      addToast('Profile updated!');
    } catch { addToast('Failed to update profile', 'error'); }
  };

  const addOfferedSkill = () => setForm(f => ({...f, skillsOffered:[...f.skillsOffered,''], skillLevels:[...f.skillLevels,'Beginner'], skillCategories:[...f.skillCategories,'Tech']}));
  const removeOfferedSkill = (i) => setForm(f => ({...f, skillsOffered:f.skillsOffered.filter((_,idx)=>idx!==i), skillLevels:f.skillLevels.filter((_,idx)=>idx!==i), skillCategories:f.skillCategories.filter((_,idx)=>idx!==i)}));
  const updateOffered = (i, val) => { const a=[...form.skillsOffered]; a[i]=val; setForm(f=>({...f,skillsOffered:a})); };
  const updateLevel = (i, val) => { const a=[...form.skillLevels]; a[i]=val; setForm(f=>({...f,skillLevels:a})); };
  const updateCategory = (i, val) => { const a=[...form.skillCategories]; a[i]=val; setForm(f=>({...f,skillCategories:a})); };

  const inp = {width:'100%',padding:'10px 14px',border:`2px solid ${t.border}`,borderRadius:8,fontSize:14,boxSizing:'border-box',marginBottom:10,background:t.bg2,color:t.text};
  const btn = (bg,col='#fff') => ({padding:'10px 20px',background:bg,color:col,border:'none',borderRadius:8,fontWeight:700,cursor:'pointer'});

  if (!me) return <div style={{padding:32,color:t.text}}>Loading...</div>;

  return (
    <div style={{maxWidth:700,margin:'0 auto',padding:'32px 24px',background:t.bg,minHeight:'100vh',color:t.text}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <h2 style={{margin:0,fontSize:26,fontWeight:800}}>Your Profile</h2>
        {!editing && <button onClick={()=>setEditing(true)} style={btn(t.accent)}>Edit Profile ✏️</button>}
      </div>

      {!editing ? (
        <>
          <div style={{background:t.card,border:`2px solid ${t.border}`,borderRadius:16,padding:24,marginBottom:20}}>
            <div style={{display:'flex',gap:16,alignItems:'center',marginBottom:16}}>
              <div style={{width:64,height:64,borderRadius:'50%',background:t.accent,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:700}}>{me.name[0]}</div>
              <div>
                <h3 style={{margin:0,fontSize:20}}>{me.name}</h3>
                <p style={{margin:'2px 0',color:t.text2,fontSize:14}}>{me.email}</p>
                {me.city && <p style={{margin:'2px 0',color:t.text2,fontSize:13}}>📍 {me.city}</p>}
              </div>
              <div style={{marginLeft:'auto',textAlign:'right'}}>
                <span style={{background:me.availabilityStatus==='AVAILABLE'?'#e8f5e9':'#fff3e0',color:me.availabilityStatus==='AVAILABLE'?'#2e7d32':'#e65100',padding:'4px 12px',borderRadius:20,fontSize:12,fontWeight:700}}>{me.availabilityStatus==='AVAILABLE'?'🟢 Available':'🟡 Busy'}</span>
                <p style={{margin:'6px 0 0',fontSize:13,color:t.text2}}>👁 {me.profileViews||0} views</p>
              </div>
            </div>
            {me.bio && <p style={{color:t.text2,margin:'0 0 12px'}}>{me.bio}</p>}
            <div style={{display:'flex',gap:12}}>
              {me.githubUrl && <a href={me.githubUrl} target="_blank" style={{color:t.accent,textDecoration:'none',fontSize:13,fontWeight:600}}>🐙 GitHub</a>}
              {me.linkedinUrl && <a href={me.linkedinUrl} target="_blank" style={{color:t.accent,textDecoration:'none',fontSize:13,fontWeight:600}}>💼 LinkedIn</a>}
              {me.instagramUrl && <a href={me.instagramUrl} target="_blank" style={{color:t.accent,textDecoration:'none',fontSize:13,fontWeight:600}}>📸 Instagram</a>}
            </div>
          </div>

          <div style={{background:t.card,border:`2px solid ${t.border}`,borderRadius:16,padding:24,marginBottom:20}}>
            <h3 style={{marginTop:0}}>Skills I Offer</h3>
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {me.skillsOffered?.map((s,i) => (
                <span key={s} style={{background:t.green,color:t.greenText,padding:'5px 14px',borderRadius:20,fontSize:13,fontWeight:600}}>
                  {s} · {me.skillLevels?.[i]||'Beginner'} · {me.skillCategories?.[i]||''}
                </span>
              ))}
            </div>
            <h3 style={{marginTop:16}}>Skills I Need</h3>
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {me.skillsNeeded?.map(s => <span key={s} style={{background:t.blue,color:t.blueText,padding:'5px 14px',borderRadius:20,fontSize:13,fontWeight:600}}>{s}</span>)}
            </div>
          </div>

          {reviews.length > 0 && (
            <div style={{background:t.card,border:`2px solid ${t.border}`,borderRadius:16,padding:24}}>
              <h3 style={{marginTop:0}}>⭐ Reviews ({me.averageRating?.toFixed(1)} avg)</h3>
              {reviews.map(r => (
                <div key={r.id} style={{borderBottom:`1px solid ${t.border}`,paddingBottom:12,marginBottom:12}}>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <p style={{margin:0,fontWeight:700,fontSize:14}}>{r.reviewer?.name}</p>
                    <span>{'⭐'.repeat(r.rating)}</span>
                  </div>
                  <p style={{margin:'4px 0 0',color:t.text2,fontSize:13}}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{background:t.card,border:`2px solid ${t.border}`,borderRadius:16,padding:24}}>
          <h3 style={{marginTop:0}}>Basic Info</h3>
          <input value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" style={inp}/>
          <input value={form.bio||''} onChange={e=>setForm({...form,bio:e.target.value})} placeholder="Bio" style={inp}/>
          <input value={form.city||''} onChange={e=>setForm({...form,city:e.target.value})} placeholder="City" style={inp}/>
          <select value={form.availabilityStatus||'AVAILABLE'} onChange={e=>setForm({...form,availabilityStatus:e.target.value})} style={inp}>
            <option value="AVAILABLE">🟢 Available</option>
            <option value="BUSY">🟡 Busy this week</option>
          </select>

          <h3>Portfolio Links</h3>
          <input value={form.githubUrl||''} onChange={e=>setForm({...form,githubUrl:e.target.value})} placeholder="GitHub URL" style={inp}/>
          <input value={form.linkedinUrl||''} onChange={e=>setForm({...form,linkedinUrl:e.target.value})} placeholder="LinkedIn URL" style={inp}/>
          <input value={form.instagramUrl||''} onChange={e=>setForm({...form,instagramUrl:e.target.value})} placeholder="Instagram URL" style={inp}/>

          <h3>Skills I Offer</h3>
          {form.skillsOffered?.map((s,i) => (
            <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',gap:8,marginBottom:8}}>
              <input value={s} onChange={e=>updateOffered(i,e.target.value)} placeholder="Skill name" style={{...inp,marginBottom:0}}/>
              <select value={form.skillLevels?.[i]||'Beginner'} onChange={e=>updateLevel(i,e.target.value)} style={{...inp,marginBottom:0}}>
                {LEVELS.map(l=><option key={l}>{l}</option>)}
              </select>
              <select value={form.skillCategories?.[i]||'Tech'} onChange={e=>updateCategory(i,e.target.value)} style={{...inp,marginBottom:0}}>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
              <button onClick={()=>removeOfferedSkill(i)} style={{padding:'0 12px',background:'#c62828',color:'#fff',border:'none',borderRadius:8,cursor:'pointer'}}>✕</button>
            </div>
          ))}
          <button onClick={addOfferedSkill} style={{color:t.accent,background:'none',border:`1px dashed ${t.accent}`,borderRadius:8,padding:'7px 14px',cursor:'pointer',marginBottom:16,fontSize:13}}>+ Add skill</button>

          <h3>Skills I Need (comma separated)</h3>
          <input value={form.skillsNeeded?.join(', ')||''} onChange={e=>setForm({...form,skillsNeeded:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} placeholder="Math tutoring, Haircut, ..." style={inp}/>

          <div style={{display:'flex',gap:10,marginTop:8}}>
            <button onClick={save} style={btn(t.accent)}>Save Changes</button>
            <button onClick={()=>setEditing(false)} style={btn(t.bg3,t.text)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

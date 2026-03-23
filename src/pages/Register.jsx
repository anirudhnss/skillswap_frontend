import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

const CATEGORIES = ['Tech','Music','Languages','Fitness','Art','Cooking','Academic','Business'];
const LEVELS = ['Beginner','Intermediate','Expert'];

export default function Register() {
  const { login } = useAuth();
  const { t } = useTheme();
  const { addToast } = useToast();
  const nav = useNavigate();
  const [form, setForm] = useState({ name:'',email:'',password:'',bio:'',city:'',githubUrl:'',linkedinUrl:'',instagramUrl:'' });
  const [offeredSkills, setOfferedSkills] = useState([{name:'',level:'Beginner',category:'Tech'}]);
  const [neededSkills, setNeededSkills] = useState('');
  const [loading, setLoading] = useState(false);

  const addSkill = () => setOfferedSkills([...offeredSkills, {name:'',level:'Beginner',category:'Tech'}]);
  const updateSkill = (i, field, val) => { const s=[...offeredSkills]; s[i][field]=val; setOfferedSkills(s); };
  const removeSkill = (i) => setOfferedSkills(offeredSkills.filter((_,idx)=>idx!==i));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        skillsOffered: offeredSkills.map(s=>s.name).filter(Boolean),
        skillLevels: offeredSkills.map(s=>s.level),
        skillCategories: offeredSkills.map(s=>s.category),
        skillsNeeded: neededSkills.split(',').map(s=>s.trim()).filter(Boolean),
      };
      const { data } = await api.post('/auth/register', payload);
      login({ id: data.userId, name: data.name }, data.token);
      nav('/');
    } catch (e) { addToast(e.response?.data || 'Registration failed', 'error'); }
    finally { setLoading(false); }
  };

  const inp = {display:'block',width:'100%',padding:'10px 14px',marginBottom:10,border:`2px solid ${t.border}`,borderRadius:8,fontSize:14,boxSizing:'border-box',background:t.bg2,color:t.text};

  return (
    <div style={{minHeight:'100vh',background:t.bg,padding:'40px 24px'}}>
      <div style={{maxWidth:560,margin:'0 auto'}}>
        <h1 style={{fontSize:30,fontWeight:900,color:t.text,marginBottom:4}}>Join SkillSwap</h1>
        <p style={{color:t.text2,marginBottom:24}}>Trade your skills. No cash needed.</p>

        <div style={{background:t.card,border:`2px solid ${t.border}`,borderRadius:16,padding:24,marginBottom:16}}>
          <h3 style={{marginTop:0,color:t.text}}>Basic Info</h3>
          {['name','email','password','bio','city'].map(field=>(
            <input key={field} placeholder={field.charAt(0).toUpperCase()+field.slice(1)}
              type={field==='password'?'password':'text'} value={form[field]}
              onChange={e=>setForm({...form,[field]:e.target.value})} style={inp} />
          ))}
        </div>

        <div style={{background:t.card,border:`2px solid ${t.border}`,borderRadius:16,padding:24,marginBottom:16}}>
          <h3 style={{marginTop:0,color:t.text}}>Portfolio Links (optional)</h3>
          <input placeholder="GitHub URL" value={form.githubUrl} onChange={e=>setForm({...form,githubUrl:e.target.value})} style={inp}/>
          <input placeholder="LinkedIn URL" value={form.linkedinUrl} onChange={e=>setForm({...form,linkedinUrl:e.target.value})} style={inp}/>
          <input placeholder="Instagram URL" value={form.instagramUrl} onChange={e=>setForm({...form,instagramUrl:e.target.value})} style={inp}/>
        </div>

        <div style={{background:t.card,border:`2px solid ${t.border}`,borderRadius:16,padding:24,marginBottom:16}}>
          <h3 style={{marginTop:0,color:t.text}}>Skills I Can Offer</h3>
          {offeredSkills.map((s,i)=>(
            <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',gap:8,marginBottom:8}}>
              <input value={s.name} onChange={e=>updateSkill(i,'name',e.target.value)} placeholder="Skill" style={{...inp,marginBottom:0}}/>
              <select value={s.level} onChange={e=>updateSkill(i,'level',e.target.value)} style={{...inp,marginBottom:0}}>
                {LEVELS.map(l=><option key={l}>{l}</option>)}
              </select>
              <select value={s.category} onChange={e=>updateSkill(i,'category',e.target.value)} style={{...inp,marginBottom:0}}>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
              {offeredSkills.length>1 && <button onClick={()=>removeSkill(i)} style={{padding:'0 12px',background:'#c62828',color:'#fff',border:'none',borderRadius:8,cursor:'pointer'}}>✕</button>}
            </div>
          ))}
          <button onClick={addSkill} style={{color:'#6c63ff',background:'none',border:'1px dashed #6c63ff',borderRadius:8,padding:'7px 14px',cursor:'pointer',fontSize:13}}>+ Add another skill</button>
        </div>

        <div style={{background:t.card,border:`2px solid ${t.border}`,borderRadius:16,padding:24,marginBottom:24}}>
          <h3 style={{marginTop:0,color:t.text}}>Skills I Need</h3>
          <input placeholder="Math tutoring, Haircut, React help... (comma separated)" value={neededSkills} onChange={e=>setNeededSkills(e.target.value)} style={inp}/>
        </div>

        <button onClick={handleSubmit} disabled={loading}
          style={{width:'100%',padding:14,background:'#6c63ff',color:'#fff',border:'none',borderRadius:8,fontSize:16,fontWeight:700,cursor:'pointer',opacity:loading?0.7:1}}>
          {loading ? 'Creating account...' : 'Create Account 🚀'}
        </button>
        <p style={{marginTop:16,textAlign:'center',color:t.text2}}>Already have an account? <Link to="/login" style={{color:'#6c63ff',fontWeight:700}}>Log in</Link></p>
      </div>
    </div>
  );
}

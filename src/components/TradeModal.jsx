import { useState } from 'react';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export default function TradeModal({ user, onClose }) {
  const { t } = useTheme();
  const { addToast } = useToast();
  const [offeredSkills, setOfferedSkills] = useState(['']);
  const [requestedSkill, setRequestedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const addSkillField = () => setOfferedSkills([...offeredSkills, '']);
  const updateSkill = (i, val) => { const s=[...offeredSkills]; s[i]=val; setOfferedSkills(s); };
  const removeSkill = (i) => setOfferedSkills(offeredSkills.filter((_,idx)=>idx!==i));

  const handleSend = async () => {
    try {
      await api.post('/trades', { receiverId: user.id, offeredSkills: offeredSkills.filter(Boolean), requestedSkill, message });
      setSent(true);
      addToast('Trade request sent! They will be notified by email.');
    } catch { addToast('Failed to send request', 'error'); }
  };

  const overlay = {position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000};
  const modal = {background:t.card,borderRadius:16,padding:32,maxWidth:460,width:'100%',margin:'0 16px',color:t.text};
  const inp = {width:'100%',padding:'10px 14px',border:`2px solid ${t.border}`,borderRadius:8,fontSize:15,boxSizing:'border-box',marginBottom:8,background:t.bg2,color:t.text};
  const btn = {padding:'12px 24px',background:t.accent,color:'#fff',border:'none',borderRadius:8,fontWeight:700,cursor:'pointer'};

  return (
    <div style={overlay} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={modal}>
        {sent ? (
          <div style={{textAlign:'center',padding:'20px 0'}}>
            <div style={{fontSize:48,marginBottom:12}}>🎉</div>
            <h2>Request Sent!</h2>
            <p style={{color:t.text2}}>{user.name} got an email notification. Once they accept, you both get connected!</p>
            <button onClick={onClose} style={btn}>Close</button>
          </div>
        ) : (
          <>
            <h2 style={{marginTop:0}}>Trade with {user.name}</h2>
            <p style={{color:t.text2,marginBottom:16,fontSize:14}}>Propose your skills in exchange for theirs</p>

            <label style={{fontWeight:700,display:'block',marginBottom:6}}>Skills I will offer:</label>
            {offeredSkills.map((s, i) => (
              <div key={i} style={{display:'flex',gap:8,marginBottom:6}}>
                <input value={s} onChange={e=>updateSkill(i,e.target.value)} placeholder={`Skill ${i+1} (e.g. Guitar lessons)`} style={{...inp,marginBottom:0,flex:1}} />
                {offeredSkills.length > 1 && <button onClick={()=>removeSkill(i)} style={{background:'#c62828',color:'#fff',border:'none',borderRadius:8,padding:'0 12px',cursor:'pointer'}}>✕</button>}
              </div>
            ))}
            <button onClick={addSkillField} style={{color:t.accent,background:'none',border:`1px dashed ${t.accent}`,borderRadius:8,padding:'6px 14px',cursor:'pointer',marginBottom:14,fontSize:13}}>+ Add another skill</button>

            <label style={{fontWeight:700,display:'block',marginBottom:6}}>In exchange for:</label>
            <select value={requestedSkill} onChange={e=>setRequestedSkill(e.target.value)} style={inp}>
              <option value="">Select their skill...</option>
              {user.skillsOffered?.map(s=><option key={s} value={s}>{s}</option>)}
            </select>

            <label style={{fontWeight:700,display:'block',marginBottom:6,marginTop:8}}>Message (optional):</label>
            <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Hi! I would love to swap skills with you..." rows={3} style={{...inp,resize:'none'}} />

            <div style={{display:'flex',gap:10,marginTop:8}}>
              <button onClick={handleSend} style={btn} disabled={!offeredSkills[0] || !requestedSkill}>Send Request</button>
              <button onClick={onClose} style={{...btn,background:t.bg3,color:t.text}}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export default function Trades() {
  const { t } = useTheme();
  const { addToast } = useToast();
  const [tab, setTab] = useState('incoming');
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [history, setHistory] = useState([]);
  const [counterText, setCounterText] = useState('');
  const [showCounter, setShowCounter] = useState(null);
  const [meId, setMeId] = useState(null);

  useEffect(() => { api.get('/users/me').then(r => setMeId(r.data.id)); }, []);

  const load = async () => {
    const [inc, out, hist] = await Promise.all([
      api.get('/trades/incoming'), api.get('/trades/outgoing'), api.get('/trades/history')
    ]);
    setIncoming(inc.data); setOutgoing(out.data); setHistory(hist.data);
  };
  useEffect(() => { load(); }, []);

  const handleAccept = async (id) => { await api.put(`/trades/${id}/accept`); load(); addToast('Trade accepted! Both parties emailed.'); };
  const handleDecline = async (id) => { await api.put(`/trades/${id}/decline`); load(); addToast('Trade declined.', 'info'); };
  const handleCounter = async (id) => { await api.put(`/trades/${id}/counter`, { counterOffer: counterText }); load(); setShowCounter(null); addToast('Counter offer sent!'); };
  const handleComplete = async (id) => { await api.put(`/trades/${id}/complete`); load(); addToast('Marked as complete!'); };

  const badge = (status) => {
    const map = { PENDING:['#fff3cd','#856404'], ACCEPTED:['#d4edda','#155724'], DECLINED:['#f8d7da','#721c24'], EXPIRED:['#e2e3e5','#383d41'], COMPLETED:['#cce5ff','#004085'], COUNTER_OFFERED:['#e2d9f3','#4a235a'] };
    const [bg,col] = map[status] || ['#eee','#333'];
    return {background:bg, color:col, padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700, whiteSpace:'nowrap'};
  };

  const Card = ({ trade, isIncoming }) => {
    const isSender = trade.sender?.id === meId;
    return (
      <div style={{border:`2px solid ${t.border}`,borderRadius:12,padding:20,marginBottom:12,background:t.card,animation:'fadeUp 0.3s ease both'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
          <div>
            <p style={{margin:0,fontWeight:700,color:t.text}}>{isIncoming ? `From: ${trade.sender?.name}` : `To: ${trade.receiver?.name}`}</p>
            <p style={{margin:'4px 0',color:t.text2,fontSize:14}}>
              <strong>Offers:</strong> {trade.offeredSkills?.join(', ')} → <strong>Wants:</strong> {trade.requestedSkill}
            </p>
            {trade.message && <p style={{margin:'4px 0',color:t.text2,fontSize:13,fontStyle:'italic'}}>"{trade.message}"</p>}
            {trade.counterOffer && <p style={{margin:'4px 0',color:'#6c63ff',fontSize:13,fontWeight:600}}>💬 Counter offer: {trade.counterOffer}</p>}
            {trade.expiresAt && trade.status==='PENDING' && (
              <p style={{margin:'4px 0',color:'#e65100',fontSize:12}}>⏰ Expires: {new Date(trade.expiresAt).toLocaleDateString()}</p>
            )}
          </div>
          <span style={badge(trade.status)}>{trade.status}</span>
        </div>

        <div style={{display:'flex',gap:8,marginTop:12,flexWrap:'wrap'}}>
          {isIncoming && trade.status === 'PENDING' && <>
            <button onClick={()=>handleAccept(trade.id)} style={{padding:'8px 16px',background:'#2e7d32',color:'#fff',border:'none',borderRadius:6,fontWeight:700,cursor:'pointer'}}>Accept ✓</button>
            <button onClick={()=>handleDecline(trade.id)} style={{padding:'8px 16px',background:'#c62828',color:'#fff',border:'none',borderRadius:6,fontWeight:700,cursor:'pointer'}}>Decline ✗</button>
            <button onClick={()=>setShowCounter(trade.id)} style={{padding:'8px 16px',background:'#6c63ff',color:'#fff',border:'none',borderRadius:6,fontWeight:700,cursor:'pointer'}}>Counter 💬</button>
          </>}
          {trade.status === 'ACCEPTED' && <>
            {isSender && !trade.senderCompleted && <button onClick={()=>handleComplete(trade.id)} style={{padding:'8px 16px',background:'#1565c0',color:'#fff',border:'none',borderRadius:6,fontWeight:700,cursor:'pointer'}}>Mark Complete ✅</button>}
            {!isSender && !trade.receiverCompleted && <button onClick={()=>handleComplete(trade.id)} style={{padding:'8px 16px',background:'#1565c0',color:'#fff',border:'none',borderRadius:6,fontWeight:700,cursor:'pointer'}}>Mark Complete ✅</button>}
          </>}
        </div>

        {showCounter === trade.id && (
          <div style={{marginTop:12,display:'flex',gap:8}}>
            <input value={counterText} onChange={e=>setCounterText(e.target.value)} placeholder="Your counter offer..." style={{flex:1,padding:'8px 12px',border:`2px solid ${t.border}`,borderRadius:8,background:t.bg2,color:t.text}} />
            <button onClick={()=>handleCounter(trade.id)} style={{padding:'8px 16px',background:'#6c63ff',color:'#fff',border:'none',borderRadius:8,fontWeight:700,cursor:'pointer'}}>Send</button>
            <button onClick={()=>setShowCounter(null)} style={{padding:'8px 12px',background:t.bg3,border:'none',borderRadius:8,cursor:'pointer',color:t.text}}>Cancel</button>
          </div>
        )}
      </div>
    );
  };

  const tabs = [['incoming','📬 Incoming'],['outgoing','📤 Outgoing'],['history','📜 History']];
  const data = {incoming, outgoing, history};

  return (
    <div style={{maxWidth:750,margin:'0 auto',padding:'32px 24px',background:t.bg,minHeight:'100vh',color:t.text}}>
      <h2 style={{fontSize:28,fontWeight:800,marginBottom:20}}>My Trades</h2>
      <div style={{display:'flex',gap:8,marginBottom:24}}>
        {tabs.map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)}
            style={{padding:'10px 20px',borderRadius:10,border:'none',cursor:'pointer',fontWeight:700,fontSize:14,
              background:tab===key?t.accent:t.bg3, color:tab===key?'#fff':t.text}}>
            {label} {key!=='history' && data[key].filter(t=>t.status==='PENDING').length > 0 && `(${data[key].filter(t=>t.status==='PENDING').length})`}
          </button>
        ))}
      </div>
      {data[tab].length === 0
        ? <div style={{textAlign:'center',padding:'60px 0',color:t.text2}}>
            <div style={{fontSize:48,marginBottom:12}}>📭</div>
            <p>Nothing here yet</p>
          </div>
        : data[tab].map(trade=><Card key={trade.id} trade={trade} isIncoming={tab==='incoming'}/>)
      }
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

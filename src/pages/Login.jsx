import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function Login() {
  const { login } = useAuth();
  const { t } = useTheme();
  const { addToast } = useToast();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login({ id: data.userId, name: data.name }, data.token);
      nav('/');
    } catch {
      addToast('Invalid email or password', 'error');
    } finally { setLoading(false); }
  };

  const inp = {display:'block',width:'100%',padding:'12px 16px',marginBottom:12,border:`2px solid ${t.border}`,borderRadius:8,fontSize:15,boxSizing:'border-box',background:t.bg2,color:t.text};

  return (
    <div style={{minHeight:'100vh',background:t.bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{maxWidth:400,width:'100%',padding:'0 24px'}}>
        <h1 style={{fontSize:32,fontWeight:900,color:t.text,marginBottom:4}}>Welcome Back</h1>
        <p style={{color:t.text2,marginBottom:28}}>Log in to SkillSwap</p>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={inp} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={inp}
          onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
        <button onClick={handleLogin} disabled={loading}
          style={{width:'100%',padding:14,background:t.accent,color:'#fff',border:'none',borderRadius:8,fontSize:16,fontWeight:700,cursor:'pointer',opacity:loading?0.7:1}}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        <p style={{marginTop:16,color:t.text2}}>No account? <Link to="/register" style={{color:t.accent,fontWeight:700}}>Sign up free</Link></p>
      </div>
    </div>
  );
}

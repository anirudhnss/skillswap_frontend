import { createContext, useContext, useState, useCallback } from 'react';
const ToastContext = createContext();
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{position:'fixed',bottom:24,right:24,zIndex:9999,display:'flex',flexDirection:'column',gap:10}}>
        {toasts.map(toast => (
          <div key={toast.id} style={{
            padding:'14px 20px', borderRadius:10, color:'#fff', fontWeight:600,
            background: toast.type==='error' ? '#c62828' : toast.type==='info' ? '#1565c0' : '#2e7d32',
            boxShadow:'0 4px 20px rgba(0,0,0,0.2)', animation:'slideIn 0.3s ease',
            maxWidth:320, fontSize:14
          }}>
            {toast.type==='success'?'✅ ':toast.type==='error'?'❌ ':'ℹ️ '}{toast.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn{from{transform:translateX(100px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
    </ToastContext.Provider>
  );
}
export const useToast = () => useContext(ToastContext);

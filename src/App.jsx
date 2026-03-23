import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Browse from './pages/Browse';
import Profile from './pages/Profile';
import Trades from './pages/Trades';
import Bookmarks from './pages/Bookmarks';
import Navbar from './components/Navbar';
import { useTheme } from './context/ThemeContext';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function Layout({ children }) {
  const { t } = useTheme();
  return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>
      <Navbar />
      {children}
    </div>
  );

}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
              <Route path="/browse" element={<PrivateRoute><Layout><Browse /></Layout></PrivateRoute>} />
              <Route path="/trades" element={<PrivateRoute><Layout><Trades /></Layout></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
              <Route path="/bookmarks" element={<PrivateRoute><Layout><Bookmarks /></Layout></PrivateRoute>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

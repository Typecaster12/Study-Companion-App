import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './Component/AppLayout';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import AddFriend from './pages/AddFriend';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Help from './pages/Help';
import Dashboard from './Component/Dashboard';
import Chatbot from './Component/Chatbot';
import Pomodoro from './pages/Pomodoro';
import Notes from './pages/Notes';
import Flashcards from './pages/Flashcards';
import './App.css';

const queryClient = new QueryClient();

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="features" element={<Features />} />
              <Route path="add-friend" element={<AddFriend />} />
            </Route>
            <Route path="/pomodoro" element={<Pomodoro />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/help" element={<Help />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          </Routes>
          <Chatbot />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

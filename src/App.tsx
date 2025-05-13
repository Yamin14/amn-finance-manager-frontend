import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import StudentsPage from './pages/StudentsPage';
import BooksPage from './pages/BooksPage';
import Navbar from './components/Navbar'
import ProtectedRoute from './routes/ProtectedRoutes';
import GuestRoute from './routes/GuestRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
        <Navbar />
        <Routes>
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <SignupPage />
              </GuestRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <StudentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <BooksPage />
              </ProtectedRoute>
            }
          />
        </Routes>
    </AuthProvider>
  );
}

export default App;

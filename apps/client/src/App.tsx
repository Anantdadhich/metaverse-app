import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Components/Auth/AuthProvider';
import { LandingPage } from './Components/LandingPage';
import { LoginForm } from './Components/Auth/LoginForm';
import { RegisterForm } from './Components/Auth/RegisterForm';
import { ProtectedRoute } from './Components/Auth/ProtectedRoute';
import { SpacesList } from './Components/spaces/space-list';
import { VirtualSpace } from './Components/spaces/virtualspace';
import { SpaceEditor } from './Components/spaces/space-editor';



export const App = () => {


  const hasToken = !!localStorage.getItem('metaverse_token');

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing page / Home route */}
          <Route
            path="/"
            element={hasToken ? <Navigate to="/spaces" /> : <LandingPage />}
          />
          
          {/* Authentication routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          
          {/* Protected routes */}
          <Route
            path="/spaces"
            element={
              <ProtectedRoute>
                <SpacesList />
              </ProtectedRoute>
            }
          />
            <Route
            path="/spaces/:spaceId/edit"
            element={
              <ProtectedRoute>
                <SpaceEditor />
              </ProtectedRoute>
            }
          />
          
         
          
          <Route
            path="/spaces/:spaceId"
            element={
              <ProtectedRoute>
                <VirtualSpace />
              </ProtectedRoute>
            }
          />
          
          {/* Redirect any other routes back to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { StoryViewer } from './components/StoryViewer';
import { StoryGenerator } from './components/StoryGenerator';
import { StoryLibrary } from './components/StoryLibrary';
import { Logo } from './components/ui/Logo';
import { Library, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { ErrorBoundary } from './components/ErrorBoundary';
import { UserMenu } from './components/ui/UserMenu';
import { VoiceProfilePage } from './components/voice/VoiceProfilePage';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { ClerkProvider, SignedIn } from '@clerk/clerk-react';
import { neobrutalism } from '@clerk/themes';
import { useUser } from '@clerk/clerk-react';

function App() {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  console.log(clerkPubKey);
  if (!clerkPubKey) {
    console.error('Missing Clerk Publishable Key');
    return <div>Configuration Error</div>;
  }

  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={{
        baseTheme: neobrutalism,
        variables: { 
          colorPrimary: 'rgb(147, 51, 234)',
          colorText: 'rgb(17, 24, 39)',
          colorBackground: 'rgb(255, 255, 255)',
          colorInputBackground: 'rgb(249, 250, 251)',
          colorInputText: 'rgb(17, 24, 39)',
          colorSuccess: 'rgb(34, 197, 94)',
          colorDanger: 'rgb(239, 68, 68)',
          borderRadius: '1rem',
        },
        elements: {
          formButtonPrimary: 
            'bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-opacity',
          card: 
            'bg-white shadow-xl rounded-2xl',
          socialButtonsIconButton: 
            'hover:opacity-90 transition-opacity text-gray-700',
          socialButtonsBlockButton: 
            'text-gray-700 hover:text-gray-900',
          formFieldInput: 
            'rounded-xl border-gray-200 focus:ring-purple-600 focus:border-purple-600',
        }
      }}
    >
      <ErrorBoundary>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-purple-100">
            <SignedIn>
              <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                      <Logo />
                    </Link>
                    <div className="flex items-center gap-6">
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Link
                          to="/create"
                          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                          <span className="font-medium">Create Story</span>
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Link
                          to="/"
                          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
                        >
                          <Library className="w-5 h-5" />
                          <span className="font-medium">Library</span>
                        </Link>
                      </motion.div>
                      <div className="border-l h-6 border-gray-200" />
                      <UserMenu />
                    </div>
                  </div>
                </div>
              </nav>
            </SignedIn>

            <Routes>
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <StoryLibrary />
                  </RequireAuth>
                }
              />
              <Route
                path="/create"
                element={
                  <RequireAuth>
                    <StoryGenerator />
                  </RequireAuth>
                }
              />
              <Route
                path="/viewer"
                element={
                  <RequireAuth>
                    <StoryViewer />
                  </RequireAuth>
                }
              />
              <Route
                path="/story/:id"
                element={
                  <RequireAuth>
                    <StoryViewer />
                  </RequireAuth>
                }
              />
              <Route
                path="/voice-profile"
                element={
                  <RequireAuth>
                    <VoiceProfilePage />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<Navigate to="/sign-in" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ErrorBoundary>
    </ClerkProvider>
  );
}

// Add this component to handle protected routes
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

export default App;
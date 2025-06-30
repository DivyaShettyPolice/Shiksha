import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { InteractionProvider } from './contexts/InteractionContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import SubjectSyllabus from './pages/SubjectSyllabus';
import ChapterOnboarding from './pages/ChapterOnboarding';
import TopicLesson from './pages/TopicLesson';

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ProgressProvider>
          <InteractionProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/subject/:subject" element={
                      <ProtectedRoute>
                        <SubjectSyllabus />
                      </ProtectedRoute>
                    } />
                    <Route path="/chapter-onboarding/:subject" element={
                      <ProtectedRoute>
                        <ChapterOnboarding />
                      </ProtectedRoute>
                    } />
                    <Route path="/learn/:subject" element={
                      <ProtectedRoute>
                        <TopicLesson />
                      </ProtectedRoute>
                    } />
                    <Route path="/flashcards/:subject/:topic" element={
                      <ProtectedRoute>
                        <Flashcards />
                      </ProtectedRoute>
                    } />
                    <Route path="/quiz/:subject/:topic" element={
                      <ProtectedRoute>
                        <Quiz />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </InteractionProvider>
        </ProgressProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
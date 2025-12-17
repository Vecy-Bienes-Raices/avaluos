import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AvaluoPortales from './pages/AvaluoPortales';
const JanIAAgent = lazy(() => import('./pages/JanIAAgent'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/Terms'));

// Simple loading spinner for route transitions
const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-stone-900">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
);

function App() {
    return (
        <Router>
            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    {/* Main Landing Page (JanIA Agent) */}
                    <Route path="/" element={<JanIAAgent />} />

                    {/* Report Page (Dynamic: :id can be 'portales' or a DB ID) */}
                    <Route path="/avaluo/:id" element={<AvaluoPortales />} />

                    {/* Legal Pages */}
                    <Route path="/privacidad" element={<PrivacyPolicy />} />
                    <Route path="/terminos" element={<TermsAndConditions />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;

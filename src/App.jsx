import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AvaluoPortales from './pages/AvaluoPortales';
const JanIAAgent = lazy(() => import('./pages/JanIAAgent'));
const Planes = lazy(() => import('./pages/Planes'));
const Perfil = lazy(() => import('./pages/Perfil'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const PaymentResponse = lazy(() => import('./pages/PaymentResponse'));
const PaymentConfirmation = lazy(() => import('./pages/PaymentConfirmation'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/Terms'));
const AllyDashboard = lazy(() => import('./components/VecyPhoenix/AllyDashboard'));

import { ModalProvider } from './context/ModalContext';
import GlobalModal from './components/GlobalModal';

// Simple loading spinner for route transitions
const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-stone-900">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
);

function App() {
    return (
        <ModalProvider>
            <Router>
                <GlobalModal />
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        {/* Main Landing Page (JanIA Agent) */}
                        <Route path="/" element={<JanIAAgent />} />

                        {/* Report Page (Dynamic: :id can be 'portales' or a DB ID) */}
                        <Route path="/avaluo/:id" element={<AvaluoPortales />} />

                        {/* Navigation Pages */}
                        <Route path="/planes" element={<Planes />} />
                        <Route path="/perfil" element={<Perfil />} />

                        {/* Auth Callback */}
                        <Route path="/auth/callback" element={<AuthCallback />} />

                        {/* Payment Routes */}
                        <Route path="/payment-response" element={<PaymentResponse />} />
                        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />

                        {/* Legal Pages */}
                        <Route path="/privacidad" element={<PrivacyPolicy />} />
                        <Route path="/terminos" element={<TermsAndConditions />} />

                        {/* Ally Dashboard */}
                        <Route path="/socios" element={<AllyDashboard />} />
                    </Routes>
                </Suspense>
            </Router>
        </ModalProvider>
    );
}

export default App;

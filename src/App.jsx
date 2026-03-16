import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AvaluoPortales from './pages/AvaluoPortales';
const JanIAAgent = lazy(() => import('./pages/JanIAAgent'));
const Planes = lazy(() => import('./pages/Planes'));
const Perfil = lazy(() => import('./pages/Perfil'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const PaymentResponse = lazy(() => import('./pages/PaymentResponse'));
const PaymentConfirmation = lazy(() => import('./pages/PaymentConfirmation'));
const PrivacyPolicy = lazy(() => import('./pages/Privacy'));
const TermsAndConditions = lazy(() => import('./pages/Terms'));
const AllyDashboard = lazy(() => import('./components/VecyPhoenix/AllyDashboard'));
const SoyPerito = lazy(() => import('./pages/SoyPerito')); // 🚖 New Appraiser Landing
const Referidos = lazy(() => import('./pages/Referidos')); // 💰 Network Marketing Page
const ReportPage = lazy(() => import('./pages/ReportPage')); // 📄 Web Report Page

import { ModalProvider } from './context/ModalContext';
import GlobalModal from './components/GlobalModal';

// Simple loading spinner for route transitions
const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-stone-900">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
);

import ErrorBoundary from './components/ErrorBoundary';

function App() {
    return (
        <ModalProvider>
            <ErrorBoundary>
                <Router>
                    <GlobalModal />
                    <Suspense fallback={<LoadingSpinner />}>
                        <Routes>
                            {/* Main Landing Page (JanIA Agent) */}
                            <Route path="/" element={<JanIAAgent />} />

                            {/* Report Page (Dynamic: :id can be 'portales' or a DB ID) */}
                            <Route path="/avaluo/:id" element={<AvaluoPortales />} />
                            
                            {/* NEW: Clean AI Generated Web Report */}
                            <Route path="/avaluo-cafe" element={<ReportPage planRoute="cafe" />} />
                            <Route path="/avaluo-esmeralda" element={<ReportPage planRoute="esmeralda" />} />
                            <Route path="/avaluo-oro" element={<ReportPage planRoute="oro" />} />
                            <Route path="/reporte/:id" element={<ReportPage />} />

                            {/* Navigation Pages */}
                            <Route path="/planes" element={<Planes />} />
                            <Route path="/referidos" element={<Referidos />} />
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
                            <Route path="/soy-perito" element={<SoyPerito />} />
                        </Routes>
                    </Suspense>
                </Router>
            </ErrorBoundary>
        </ModalProvider>
    );
}

export default App;

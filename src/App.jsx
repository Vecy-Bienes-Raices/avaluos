import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import JanIAAgent from './pages/JanIAAgent';

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
                    {/* Main Landing Page (Report) */}
                    <Route path="/" element={<Home />} />

                    {/* JanIA AI Agent Interface */}
                    <Route path="/jania-agent" element={<JanIAAgent />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;

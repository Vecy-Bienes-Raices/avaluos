import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-red-500 p-10 flex flex-col items-center justify-center font-mono">
                    <h1 className="text-3xl font-bold mb-4">💥 CRASH DETECTADO</h1>
                    <div className="bg-stone-900 p-6 rounded-xl border border-red-900/50 max-w-4xl w-full overflow-auto">
                        <h2 className="text-xl text-white mb-2">{this.state.error && this.state.error.toString()}</h2>
                        <details className="whitespace-pre-wrap text-xs text-stone-400">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

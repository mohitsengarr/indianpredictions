import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
}

class ChartErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
          <AlertTriangle className="w-8 h-8 text-warning mb-3" />
          <h3 className="font-display font-bold text-sm mb-1">
            {this.props.fallbackTitle || 'Chart failed to load'}
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Something went wrong rendering this visualization.
          </p>
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <RefreshCw className="w-3 h-3" /> Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;

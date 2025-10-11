"use client";

import { Component, type ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <div className="mb-6 rounded-full bg-red-100 p-4 dark:bg-red-900/20">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Something went wrong
          </h2>
          
          <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </p>
          
          <div className="flex gap-3">
            <Button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Page
            </Button>
            
            <Button
              variant="outline"
              onClick={() => this.setState({ hasError: false })}
            >
              Try Again
            </Button>
          </div>
          
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-6 max-w-2xl">
              <summary className="cursor-pointer text-sm text-gray-500">
                Error Details (Development)
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-left text-xs dark:bg-gray-800">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
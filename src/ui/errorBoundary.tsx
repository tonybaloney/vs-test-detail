import * as React from "react";
import * as ReactDOM from "react-dom";

import {ErrorMessage} from "./errorWindow"

interface ErrorBoundaryProps {

}

interface ErrorBoundaryState {
    hasError: boolean;
    error: any;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true, error: error };
    }
  
    componentDidCatch(error, info) {
      // You can also log the error to an error reporting service
      return { hasError: true, error: error };
    }
  
    render() : JSX.Element {
      if (this.state.hasError) {
        return (
            <ErrorMessage message={this.state.error}/>
        );
      } else {
          return null;
      }
    }
  }
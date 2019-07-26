import * as React from "react";

import {ErrorMessage} from "./errorWindow"

interface ErrorBoundaryState {
    hasError: boolean;
    error: any;
}

export class ErrorBoundary extends React.Component<any, ErrorBoundaryState> {
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
  
    render() {
      if (this.state.hasError) {
        return (
            <ErrorMessage message={this.state.error}/>
        );
      } else {
        return this.props.children; 
      }
    }
  }
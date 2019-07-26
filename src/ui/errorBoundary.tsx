import * as React from "react";


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
      console.log(error);
      console.log(info);
    }
  
    render() : JSX.Element {
      if (this.state.hasError) {
        return (
            <h1>Error producing test details. See Console for details.</h1>
        );
      } else {
          // @ts-ignore
          return this.props.children;
      }
    }
  }
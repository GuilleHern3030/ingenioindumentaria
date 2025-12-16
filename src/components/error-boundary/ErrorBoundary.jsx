import { Component } from "react";
import { Navigate } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // opcional: log
    console.error("ErrorBoundary:", error, info);
  }

  render() {
    const { hasError } = this.state;
    const { to = "/error" } = this.props;

    if (hasError) {
      return <Navigate to={to} replace />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
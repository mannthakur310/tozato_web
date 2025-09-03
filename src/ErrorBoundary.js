import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // Keep a console log so Vercel logs will show the stack
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      const message = this.state.error?.toString() || 'Unknown error';
      return (
        <div style={{padding: 24, fontFamily: 'Arial, sans-serif'}}>
          <h1 style={{color: '#c00'}}>Application error</h1>
          <p>{message}</p>
          <details style={{whiteSpace: 'pre-wrap'}}>
            {this.state.errorInfo?.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

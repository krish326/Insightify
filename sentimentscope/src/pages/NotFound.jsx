import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="flex items-center justify-center w-24 h-24 bg-primary-50 rounded-full mx-auto mb-6">
            <Icon 
              name="Search" 
              size={48} 
              className="text-primary" 
              strokeWidth={1.5}
            />
          </div>
          
          <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Page Not Found
          </h2>
          <p className="text-text-secondary mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/product-analysis-dashboard"
            className="inline-flex items-center justify-center space-x-2 w-full px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-700 transition-smooth shadow-soft"
          >
            <Icon name="Home" size={20} strokeWidth={2} />
            <span>Go to Dashboard</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center space-x-2 w-full px-6 py-3 bg-surface text-text-primary font-medium border border-border rounded-lg hover:bg-secondary-100 transition-smooth"
          >
            <Icon name="ArrowLeft" size={20} strokeWidth={2} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

function Header() {
  const location = useLocation();
  const isDetailView = location.pathname === '/analysis-results-detail-view';

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link 
              to="/product-analysis-dashboard" 
              className="flex items-center space-x-3 transition-smooth hover:opacity-80"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Icon 
                  name="TrendingUp" 
                  size={20} 
                  color="white" 
                  strokeWidth={2.5}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-text-primary tracking-tight">
                  SentimentScope
                </span>
                <span className="text-xs text-text-secondary -mt-1 hidden sm:block">
                  Product Review Analysis
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-4">
            {isDetailView && (
              <Link
                to="/product-analysis-dashboard"
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-smooth rounded-lg hover:bg-secondary-100"
              >
                <Icon name="ArrowLeft" size={16} strokeWidth={2} />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Link>
            )}
            
            {/* Analysis Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-sm text-text-secondary hidden md:inline">
                Ready to Analyze
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
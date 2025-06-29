import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

function ResultsNavigationController({ 
  analysisData = null, 
  onViewDetails = null,
  onBackToDashboard = null 
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDetailView = location.pathname === '/analysis-results-detail-view';

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(analysisData);
    } else {
      navigate('/analysis-results-detail-view', { 
        state: { analysisData } 
      });
    }
  };

  const handleBackToDashboard = () => {
    if (onBackToDashboard) {
      onBackToDashboard();
    } else {
      navigate('/product-analysis-dashboard');
    }
  };

  if (isDetailView) {
    return (
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBackToDashboard}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-surface hover:bg-secondary-100 border border-border rounded-lg transition-smooth shadow-soft"
        >
          <Icon name="ArrowLeft" size={16} strokeWidth={2} />
          <span>Back to Dashboard</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="Eye" size={16} strokeWidth={2} />
            <span>Detailed Analysis View</span>
          </div>
          
          <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-primary hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-smooth">
            <Icon name="Share2" size={16} strokeWidth={2} />
            <span className="hidden sm:inline">Share</span>
          </button>
          
          <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-primary hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-smooth">
            <Icon name="Download" size={16} strokeWidth={2} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
    );
  }

  // Dashboard view - show expansion triggers
  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleViewDetails}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-smooth"
          >
            <Icon name="BarChart3" size={16} strokeWidth={2} />
            <span>View Detailed Analysis</span>
            <Icon name="ArrowRight" size={14} strokeWidth={2} />
          </button>
          
          <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-smooth">
            <Icon name="TrendingUp" size={16} strokeWidth={2} />
            <span className="hidden sm:inline">Compare Products</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-smooth">
            <Icon name="Share2" size={16} strokeWidth={2} />
          </button>
          
          <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-smooth">
            <Icon name="Download" size={16} strokeWidth={2} />
          </button>
          
          <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-smooth">
            <Icon name="Bookmark" size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultsNavigationController;
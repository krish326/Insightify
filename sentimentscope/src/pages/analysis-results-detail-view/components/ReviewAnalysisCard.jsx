import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import SentimentDisplay from 'components/ui/SentimentDisplay';

function ReviewAnalysisCard({ review }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const reviewDate = new Date(timestamp);
    const diffTime = Math.abs(now - reviewDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const getSentimentColor = (score) => {
    if (score >= 0.6) return 'text-success';
    if (score <= -0.6) return 'text-error';
    return 'text-warning';
  };

  const aspectEntries = Object.entries(review.aspectSentiments || {});
  const visibleAspects = isExpanded ? aspectEntries : aspectEntries.slice(0, 3);

  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:shadow-soft transition-smooth">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="User" size={16} className="text-primary" strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-text-primary">
                  {review.reviewer}
                </span>
                {review.verified && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-accent-50 text-accent-600 rounded-full text-xs">
                    <Icon name="CheckCircle" size={12} strokeWidth={2} />
                    <span>Verified</span>
                  </div>
                )}
              </div>
              <span className="text-xs text-text-secondary">
                {formatTimestamp(review.timestamp)}
              </span>
            </div>
          </div>
        </div>
        
        <SentimentDisplay
          sentiment={review.overallSentiment.label.toLowerCase()}
          score={review.overallSentiment.score}
          confidence={review.overallSentiment.confidence}
          size="small"
        />
      </div>

      {/* Review Text */}
      <div className="mb-4">
        <p className="text-sm text-text-primary leading-relaxed">
          {review.reviewText}
        </p>
      </div>

      {/* Aspect Sentiments */}
      {aspectEntries.length > 0 && (
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-text-primary">Aspect Analysis</h4>
            {aspectEntries.length > 3 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-primary hover:text-primary-700 transition-smooth"
              >
                {isExpanded ? 'Show Less' : `+${aspectEntries.length - 3} more`}
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {visibleAspects.map(([aspect, data]) => (
              <div key={aspect} className="flex items-center justify-between p-2 bg-background rounded-lg">
                <span className="text-xs font-medium text-text-primary truncate flex-1 mr-2">
                  {aspect}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink-0 w-16 bg-secondary-100 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        data.score >= 0.6 ? 'bg-success' :
                        data.score <= -0.6 ? 'bg-error' : 'bg-warning'
                      }`}
                      style={{ width: `${Math.abs(data.score) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs font-mono ${getSentimentColor(data.score)}`}>
                    {Math.round(data.score * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Metrics */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center space-x-4 text-xs text-text-secondary">
          <div className="flex items-center space-x-1">
            <Icon name="TrendingUp" size={12} strokeWidth={2} />
            <span>Score: {Math.round(review.overallSentiment.score * 100)}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Target" size={12} strokeWidth={2} />
            <span>Confidence: {Math.round(review.overallSentiment.confidence * 100)}%</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-1 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded transition-smooth">
            <Icon name="ThumbsUp" size={14} strokeWidth={2} />
          </button>
          <button className="p-1 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded transition-smooth">
            <Icon name="Flag" size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewAnalysisCard;
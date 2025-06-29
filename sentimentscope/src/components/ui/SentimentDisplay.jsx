import React, { useState } from 'react';
import Icon from '../AppIcon';

function SentimentDisplay({ 
  sentiment = 'neutral',
  score = 0,
  confidence = 0,
  aspectBreakdown = null,
  showTooltip = true,
  size = 'medium',
  detailed = false 
}) {
  const [showDetails, setShowDetails] = useState(false);

  const getSentimentConfig = (sentimentType, sentimentScore) => {
    if (sentimentScore >= 0.6) {
      return {
        label: 'Positive',
        color: 'success',
        bgClass: 'bg-success-50',
        textClass: 'text-success-600',
        borderClass: 'border-success-100',
        icon: 'TrendingUp'
      };
    } else if (sentimentScore <= -0.6) {
      return {
        label: 'Negative',
        color: 'error',
        bgClass: 'bg-error-50',
        textClass: 'text-error-600',
        borderClass: 'border-error-100',
        icon: 'TrendingDown'
      };
    } else {
      return {
        label: 'Neutral',
        color: 'warning',
        bgClass: 'bg-warning-50',
        textClass: 'text-warning-600',
        borderClass: 'border-warning-100',
        icon: 'Minus'
      };
    }
  };

  const config = getSentimentConfig(sentiment, score);
  
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-2 text-sm',
    large: 'px-4 py-3 text-base'
  };

  const formatScore = (value) => {
    return (value * 100).toFixed(1);
  };

  const ScoreBar = ({ value, label, color }) => (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-text-primary w-20 truncate">{label}</span>
      <div className="flex-1 bg-secondary-100 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ease-out bg-${color}`}
          style={{ width: `${Math.abs(value) * 100}%` }}
        ></div>
      </div>
      <span className="text-sm font-mono text-text-secondary w-12 text-right">
        {formatScore(value)}%
      </span>
    </div>
  );

  if (detailed && aspectBreakdown) {
    return (
      <div className="space-y-4">
        {/* Overall Sentiment */}
        <div className={`rounded-lg border p-4 ${config.bgClass} ${config.borderClass}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Icon name={config.icon} size={20} className={config.textClass} strokeWidth={2} />
              <span className={`font-semibold ${config.textClass}`}>
                Overall Sentiment: {config.label}
              </span>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${config.textClass}`}>
                {formatScore(score)}%
              </div>
              {confidence > 0 && (
                <div className="text-xs text-text-secondary">
                  {formatScore(confidence)}% confidence
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-surface rounded-lg p-3">
            <ScoreBar value={score} label="Overall" color={config.color} />
          </div>
        </div>

        {/* Aspect Breakdown */}
        <div className="bg-surface rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-text-primary">Aspect Analysis</h4>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-primary hover:text-primary-700 transition-smooth"
            >
              {showDetails ? 'Show Less' : 'Show More'}
            </button>
          </div>
          
          <div className="space-y-3">
            {Object.entries(aspectBreakdown).slice(0, showDetails ? undefined : 3).map(([aspect, data]) => {
              const aspectConfig = getSentimentConfig(data.sentiment, data.score);
              return (
                <ScoreBar 
                  key={aspect}
                  value={data.score} 
                  label={aspect} 
                  color={aspectConfig.color} 
                />
              );
            })}
          </div>
          
          {!showDetails && Object.keys(aspectBreakdown).length > 3 && (
            <button
              onClick={() => setShowDetails(true)}
              className="mt-3 text-sm text-primary hover:text-primary-700 transition-smooth"
            >
              +{Object.keys(aspectBreakdown).length - 3} more aspects
            </button>
          )}
        </div>
      </div>
    );
  }

  // Simple sentiment tag
  return (
    <div className="relative inline-block">
      <div 
        className={`inline-flex items-center space-x-2 rounded-lg border font-medium transition-smooth ${config.bgClass} ${config.borderClass} ${config.textClass} ${sizeClasses[size]}`}
        onMouseEnter={() => showTooltip && setShowDetails(true)}
        onMouseLeave={() => showTooltip && setShowDetails(false)}
      >
        <Icon name={config.icon} size={size === 'small' ? 14 : 16} strokeWidth={2} />
        <span>{config.label}</span>
        {score !== 0 && (
          <span className="font-mono">
            {formatScore(score)}%
          </span>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && showDetails && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-text-primary text-surface text-xs rounded-lg px-3 py-2 shadow-soft-lg whitespace-nowrap">
            <div>Sentiment Score: {formatScore(score)}%</div>
            {confidence > 0 && (
              <div>Confidence: {formatScore(confidence)}%</div>
            )}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-text-primary"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SentimentDisplay;
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

function AspectAnalysisPanel({ aspectSentiments }) {
  const [sortBy, setSortBy] = useState('score');
  
  const getSentimentConfig = (score) => {
    if (score >= 0.6) {
      return {
        color: 'success',
        bgClass: 'bg-success',
        textClass: 'text-success-600',
        icon: 'TrendingUp'
      };
    } else if (score <= -0.6) {
      return {
        color: 'error',
        bgClass: 'bg-error',
        textClass: 'text-error-600',
        icon: 'TrendingDown'
      };
    } else {
      return {
        color: 'warning',
        bgClass: 'bg-warning',
        textClass: 'text-warning-600',
        icon: 'Minus'
      };
    }
  };

  const sortedAspects = Object.entries(aspectSentiments).sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b[1].score - a[1].score;
      case 'confidence':
        return b[1].confidence - a[1].confidence;
      case 'alphabetical':
        return a[0].localeCompare(b[0]);
      default:
        return 0;
    }
  });

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="BarChart3" size={20} className="text-primary" strokeWidth={2} />
          <h3 className="text-lg font-semibold text-text-primary">Aspect Analysis</h3>
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1 text-sm border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="score">Sort by Score</option>
          <option value="confidence">Sort by Confidence</option>
          <option value="alphabetical">Sort A-Z</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedAspects.map(([aspect, data]) => {
          const config = getSentimentConfig(data.score);
          
          return (
            <div key={aspect} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={config.icon} 
                    size={16} 
                    className={config.textClass} 
                    strokeWidth={2} 
                  />
                  <span className="text-sm font-medium text-text-primary">
                    {aspect}
                  </span>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-semibold ${config.textClass}`}>
                    {Math.round(data.score * 100)}%
                  </div>
                  <div className="text-xs text-text-secondary">
                    {Math.round(data.confidence * 100)}% confidence
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-secondary-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${config.bgClass}`}
                    style={{ width: `${Math.abs(data.score) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-success">
              {sortedAspects.filter(([, data]) => data.score >= 0.6).length}
            </div>
            <div className="text-xs text-text-secondary">Positive</div>
          </div>
          
          <div>
            <div className="text-lg font-bold text-warning">
              {sortedAspects.filter(([, data]) => data.score > -0.6 && data.score < 0.6).length}
            </div>
            <div className="text-xs text-text-secondary">Neutral</div>
          </div>
          
          <div>
            <div className="text-lg font-bold text-error">
              {sortedAspects.filter(([, data]) => data.score <= -0.6).length}
            </div>
            <div className="text-xs text-text-secondary">Negative</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AspectAnalysisPanel;
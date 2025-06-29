import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import SentimentDisplay from 'components/ui/SentimentDisplay';

function DetailedSummaryCard({ productInfo, overallSentiment, aiSummary }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatMarkdown = (text) => {
    if (!text) return '';
    
    // Convert markdown-style formatting to HTML
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•/g, '•')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  };

  const formattedSummary = formatMarkdown(aiSummary);

  return (
    <div className="bg-surface rounded-lg border border-border shadow-soft overflow-hidden">
      {/* Product Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Image
              src={productInfo.imageUrl}
              alt={productInfo.name}
              className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-lg"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-lg lg:text-xl font-semibold text-text-primary mb-2 line-clamp-2">
              {productInfo.name}
            </h1>
            
            <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={16} className="text-warning fill-current" strokeWidth={2} />
                <span>{productInfo.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="MessageSquare" size={16} strokeWidth={2} />
                <span>{productInfo.totalReviews.toLocaleString()} reviews</span>
              </div>
              <div className="font-semibold text-text-primary">
                {productInfo.price}
              </div>
            </div>
            
            <SentimentDisplay
              sentiment={overallSentiment.label.toLowerCase()}
              score={overallSentiment.score}
              confidence={overallSentiment.confidence}
              size="large"
            />
          </div>
        </div>
      </div>

      {/* AI Summary Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Brain" size={20} className="text-primary" strokeWidth={2} />
            <h2 className="text-lg font-semibold text-text-primary">AI Analysis Summary</h2>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-smooth"
          >
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={20} 
              strokeWidth={2} 
            />
          </button>
        </div>

        {isExpanded && (
          <div className="prose prose-sm max-w-none">
            <div className="space-y-3 text-text-primary">
              {formattedSummary.map((line, index) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  // Section headers
                  return (
                    <h3 
                      key={index} 
                      className="text-base font-semibold text-text-primary mt-4 mb-2"
                      dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '$1') }}
                    />
                  );
                } else if (line.startsWith('•')) {
                  // Bullet points
                  return (
                    <div 
                      key={index} 
                      className="flex items-start space-x-2 ml-4"
                    >
                      <span className="text-primary mt-1">•</span>
                      <span 
                        className="text-sm text-text-primary flex-1"
                        dangerouslySetInnerHTML={{ __html: line.substring(1).trim() }}
                      />
                    </div>
                  );
                } else if (line.trim().length > 0) {
                  // Regular paragraphs
                  return (
                    <p 
                      key={index} 
                      className="text-sm text-text-primary leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: line }}
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round(overallSentiment.score * 100)}%
              </div>
              <div className="text-xs text-text-secondary">Sentiment Score</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {Math.round(overallSentiment.confidence * 100)}%
              </div>
              <div className="text-xs text-text-secondary">Confidence</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">
                {productInfo.totalReviews > 1000 ? 
                  `${Math.round(productInfo.totalReviews / 1000)}K` : 
                  productInfo.totalReviews
                }
              </div>
              <div className="text-xs text-text-secondary">Reviews</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailedSummaryCard;
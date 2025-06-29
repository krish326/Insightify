import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import SentimentDisplay from 'components/ui/SentimentDisplay';

function SummaryCard({ summary, productInfo, overallSentiment }) {
  const [expanded, setExpanded] = useState(false);

  const renderMarkdown = (text) => {
    if (!text) return null;

    return text
      .split('\n')
      .map((line, index) => {
        // Handle bullet points
        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
          const content = line.replace(/^[•-]\s*/, '').trim();
          return (
            <li key={index} className="mb-1">
              {renderInlineFormatting(content)}
            </li>
          );
        }
        
        // Handle regular paragraphs
        if (line.trim()) {
          return (
            <p key={index} className="mb-2">
              {renderInlineFormatting(line)}
            </p>
          );
        }
        
        return null;
      })
      .filter(Boolean);
  };

  const renderInlineFormatting = (text) => {
    // Handle bold text **text**
    return text.split(/(\*\*.*?\*\*)/).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-text-primary">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const truncateText = (text, maxLength = 300) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-surface rounded-xl border border-border shadow-soft overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-50 rounded-lg">
              <Icon name="FileText" size={20} className="text-primary" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                Analysis Summary
              </h2>
              <p className="text-sm text-text-secondary">
                AI-generated insights from customer reviews
              </p>
            </div>
          </div>
          
          {overallSentiment && (
            <SentimentDisplay
              sentiment={overallSentiment.label}
              score={overallSentiment.score}
              confidence={overallSentiment.confidence}
              size="medium"
            />
          )}
        </div>

        {/* Product Info */}
        {productInfo && (
          <div className="bg-secondary-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Package" size={16} className="text-secondary mt-1" strokeWidth={2} />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-text-primary truncate">
                  {productInfo.name || 'Product Analysis'}
                </h3>
                {productInfo.brand && (
                  <p className="text-sm text-text-secondary">
                    by {productInfo.brand}
                  </p>
                )}
                {productInfo.price && (
                  <p className="text-sm font-medium text-accent">
                    {productInfo.price}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Content */}
      <div className="p-6">
        {summary ? (
          <div className="prose prose-sm max-w-none">
            <div className="text-text-primary leading-relaxed">
              {summary.includes('•') || summary.includes('-') ? (
                <ul className="space-y-1 list-none pl-0">
                  {renderMarkdown(expanded ? summary : truncateText(summary))}
                </ul>
              ) : (
                <div className="space-y-3">
                  {renderMarkdown(expanded ? summary : truncateText(summary))}
                </div>
              )}
            </div>
            
            {summary.length > 300 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-4 flex items-center space-x-2 text-sm font-medium text-primary hover:text-primary-700 transition-smooth"
              >
                <span>{expanded ? 'Show Less' : 'Read More'}</span>
                <Icon 
                  name={expanded ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  strokeWidth={2}
                />
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="FileText" size={48} className="text-secondary mx-auto mb-4" strokeWidth={1} />
            <p className="text-text-secondary">
              Summary will appear here after analysis
            </p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {summary && (
        <div className="px-6 py-4 bg-secondary-50 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={14} className="text-secondary" strokeWidth={2} />
                <span className="text-text-secondary">
                  Generated {new Date().toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon name="Zap" size={14} className="text-accent" strokeWidth={2} />
                <span className="text-text-secondary">AI-Powered</span>
              </div>
            </div>
            
            <button className="flex items-center space-x-1 text-text-secondary hover:text-text-primary transition-smooth">
              <Icon name="Share2" size={14} strokeWidth={2} />
              <span>Share</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SummaryCard;
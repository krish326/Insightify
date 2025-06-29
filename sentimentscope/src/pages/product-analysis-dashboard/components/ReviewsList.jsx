import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import SentimentDisplay from 'components/ui/SentimentDisplay';

function ReviewsList({ reviews = [], totalReviews = 0 }) {
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const [sortBy, setSortBy] = useState('recent'); // recent, positive, negative, helpful

  const toggleReviewExpansion = (reviewId) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const sortReviews = (reviews, sortType) => {
    const sorted = [...reviews];
    switch (sortType) {
      case 'positive':
        return sorted.sort((a, b) => (b.overallSentiment?.score || 0) - (a.overallSentiment?.score || 0));
      case 'negative':
        return sorted.sort((a, b) => (a.overallSentiment?.score || 0) - (b.overallSentiment?.score || 0));
      case 'helpful':
        return sorted.sort((a, b) => (b.helpfulVotes || 0) - (a.helpfulVotes || 0));
      case 'recent':
      default:
        return sorted.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    }
  };

  const sortedReviews = sortReviews(reviews, sortBy);

  const truncateText = (text, maxLength = 200) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const renderAspectSentiments = (aspectSentiments) => {
    if (!aspectSentiments || typeof aspectSentiments !== 'object') return null;

    return (
      <div className="mt-4 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-text-primary mb-3">
          Aspect Analysis
        </h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(aspectSentiments).map(([aspect, sentimentData]) => (
            <div key={aspect} className="flex items-center space-x-2">
              <span className="text-xs font-medium text-text-secondary capitalize">
                {aspect}:
              </span>
              <SentimentDisplay
                sentiment={sentimentData.sentiment || sentimentData.label}
                score={sentimentData.score}
                confidence={sentimentData.confidence}
                size="small"
                showTooltip={true}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-surface rounded-xl border border-border shadow-soft overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent-50 rounded-lg">
              <Icon name="MessageSquare" size={20} className="text-accent" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                Customer Reviews
              </h2>
              <p className="text-sm text-text-secondary">
                {totalReviews > 0 ? `${totalReviews} reviews analyzed` : `${reviews.length} reviews`}
              </p>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <Icon name="ArrowUpDown" size={16} className="text-secondary" strokeWidth={2} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary"
            >
              <option value="recent">Most Recent</option>
              <option value="positive">Most Positive</option>
              <option value="negative">Most Critical</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="max-h-96 overflow-y-auto">
        {sortedReviews.length > 0 ? (
          <div className="divide-y divide-border">
            {sortedReviews.map((review, index) => {
              const isExpanded = expandedReviews.has(review.id || index);
              const reviewText = review.content || review.text || review.review || '';
              const shouldTruncate = reviewText.length > 200;

              return (
                <div key={review.id || index} className="p-6 hover:bg-secondary-50 transition-smooth">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                        <Icon name="User" size={16} className="text-primary" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">
                          {review.author || review.reviewer || `Customer ${index + 1}`}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-text-secondary">
                          <span>{formatDate(review.date)}</span>
                          {review.verified && (
                            <>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Icon name="CheckCircle" size={12} className="text-success" strokeWidth={2} />
                                <span>Verified</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Overall Sentiment */}
                    {review.overallSentiment && (
                      <SentimentDisplay
                        sentiment={review.overallSentiment.label || review.overallSentiment.sentiment}
                        score={review.overallSentiment.score}
                        confidence={review.overallSentiment.confidence}
                        size="small"
                      />
                    )}
                  </div>

                  {/* Review Content */}
                  <div className="mb-3">
                    {review.title && (
                      <h4 className="font-medium text-text-primary mb-2">
                        {review.title}
                      </h4>
                    )}
                    
                    <p className="text-text-primary leading-relaxed">
                      {isExpanded || !shouldTruncate 
                        ? reviewText 
                        : truncateText(reviewText)
                      }
                    </p>

                    {shouldTruncate && (
                      <button
                        onClick={() => toggleReviewExpansion(review.id || index)}
                        className="mt-2 text-sm font-medium text-primary hover:text-primary-700 transition-smooth"
                      >
                        {isExpanded ? 'Show Less' : 'Read More'}
                      </button>
                    )}
                  </div>

                  {/* Rating */}
                  {review.rating && (
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={14}
                            className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-secondary-300'}
                            strokeWidth={1}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-text-secondary">
                        {review.rating}/5
                      </span>
                    </div>
                  )}

                  {/* Aspect Sentiments */}
                  {isExpanded && renderAspectSentiments(review.aspectSentiments)}

                  {/* Review Footer */}
                  <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center space-x-4 text-sm text-text-secondary">
                      {review.helpfulVotes > 0 && (
                        <div className="flex items-center space-x-1">
                          <Icon name="ThumbsUp" size={14} strokeWidth={2} />
                          <span>{review.helpfulVotes} helpful</span>
                        </div>
                      )}
                      
                      {review.source && (
                        <div className="flex items-center space-x-1">
                          <Icon name="ExternalLink" size={14} strokeWidth={2} />
                          <span>{review.source}</span>
                        </div>
                      )}
                    </div>

                    <button className="text-sm text-text-secondary hover:text-text-primary transition-smooth">
                      <Icon name="Flag" size={14} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Icon name="MessageSquare" size={48} className="text-secondary mx-auto mb-4" strokeWidth={1} />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No Reviews Yet
            </h3>
            <p className="text-text-secondary">
              Reviews will appear here after analysis is complete
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {reviews.length > 0 && (
        <div className="px-6 py-4 bg-secondary-50 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">
              Showing {reviews.length} of {totalReviews || reviews.length} reviews
            </span>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 text-text-secondary hover:text-text-primary transition-smooth">
                <Icon name="Download" size={14} strokeWidth={2} />
                <span>Export</span>
              </button>
              
              <button className="flex items-center space-x-1 text-text-secondary hover:text-text-primary transition-smooth">
                <Icon name="Filter" size={14} strokeWidth={2} />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewsList;
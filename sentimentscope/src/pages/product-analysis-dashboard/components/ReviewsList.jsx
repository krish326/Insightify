import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import SentimentDisplay from 'components/ui/SentimentDisplay';

// The component receives the original 'reviews' prop from the parent
function ReviewsList({ reviews: initialReviews = [], totalReviews = 0 }) {
    const [expandedReviews, setExpandedReviews] = useState(new Set());
    const [sortBy, setSortBy] = useState('recent');

    // =========================================================================================
    // *** FIX: Transform the raw data from the backend into the structure this component needs ***
    // =========================================================================================
    const transformedReviews = initialReviews.map((review, index) => {
        return {
            // --- Use original data fields that exist ---
            ...review,

            // --- Fix Mismatched Names ---
            id: review.id || index, // Use existing ID or fall back to index
            content: review.reviewText || '', // Map backend's 'reviewText' to 'content'

            // --- Create Placeholders for Missing Data ---
            author: review.author || `Customer ${index + 1}`,
            date: review.date || new Date().toISOString(),
            rating: review.rating || 4, // Default to 4 stars
            helpfulVotes: review.helpfulVotes || 0,
            verified: review.verified || false,

            // --- Fix Structural Mismatches ---
            // Transform sentiment string (e.g., "Positive") into an object
            overallSentiment: {
                label: review.overallSentiment,
                score: (review.overallSentiment === "Positive" || review.overallSentiment === "Very positive") ? 0.9 : 0.2,
            },
            // Transform aspect sentiment strings into objects
            aspectSentiments: Object.entries(review.aspectSentiments || {}).reduce(
                (acc, [aspect, sentiment]) => {
                    acc[aspect] = {
                        sentiment: sentiment,
                        score: (sentiment === "Positive" || sentiment === "Very positive") ? 0.9 : 0.2,
                    };
                    return acc;
                },
                {}
            ),
        };
    });
    // =========================================================================================


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

    const sortedReviews = sortReviews(transformedReviews, sortBy);

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
        if (!aspectSentiments || typeof aspectSentiments !== 'object' || Object.keys(aspectSentiments).length === 0) return null;

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
                                size="small"
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-surface rounded-xl border border-border shadow-soft overflow-hidden">
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

            <div className="max-h-96 overflow-y-auto">
                {sortedReviews.length > 0 ? (
                    <div className="divide-y divide-border">
                        {sortedReviews.map((review) => {
                            const isExpanded = expandedReviews.has(review.id);
                            const reviewText = review.content || '';
                            const shouldTruncate = reviewText.length > 200;

                            return (
                                <div key={review.id} className="p-6 hover:bg-secondary-50 transition-smooth">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                                                <Icon name="User" size={16} className="text-primary" strokeWidth={2} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-text-primary">
                                                    {review.author}
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

                                        {review.overallSentiment && (
                                            <SentimentDisplay
                                                sentiment={review.overallSentiment.label}
                                                score={review.overallSentiment.score}
                                                size="small"
                                            />
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        {review.title && (
                                            <h4 className="font-medium text-text-primary mb-2">
                                                {review.title}
                                            </h4>
                                        )}

                                        <p className="text-text-primary leading-relaxed">
                                            {isExpanded || !shouldTruncate
                                                ? reviewText
                                                : truncateText(reviewText)}
                                        </p>

                                        {shouldTruncate && (
                                            <button
                                                onClick={() => toggleReviewExpansion(review.id)}
                                                className="mt-2 text-sm font-medium text-primary hover:text-primary-700 transition-smooth"
                                            >
                                                {isExpanded ? 'Show Less' : 'Read More'}
                                            </button>
                                        )}
                                    </div>

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

                                    {isExpanded && renderAspectSentiments(review.aspectSentiments)}
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
        </div>
    );
}

export default ReviewsList;
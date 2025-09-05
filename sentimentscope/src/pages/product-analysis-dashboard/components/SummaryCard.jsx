import React from 'react';
import Icon from 'components/AppIcon';
import SentimentDisplay from 'components/ui/SentimentDisplay';

function SummaryCard({ analysisResult }) {
    // Use optional chaining (?.) to safely access the data.
    // This prevents the app from crashing if the data is not ready yet.
    const structuredSummary = analysisResult?.structuredSummary;
    const overallSentiment = analysisResult?.overallSentiment;
    const productInfo = analysisResult?.productInfo;

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
                            <h2 className="text-xl font-semibold text-text-primary">Analysis Summary</h2>
                            <p className="text-sm text-text-secondary">AI-generated insights from reviews</p>
                        </div>
                    </div>
                    {/* Safely display sentiment */}
                    {overallSentiment && (
                        <SentimentDisplay
                            sentiment={overallSentiment.label}
                            score={overallSentiment.score}
                            confidence={overallSentiment.confidence}
                            size="medium"
                        />
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {/* Check if we have a summary to display */}
                {structuredSummary?.summary_paragraph ? (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-text-primary mb-2">Overall Assessment</h3>
                            <p className="text-sm text-text-primary leading-relaxed">
                                {structuredSummary.summary_paragraph}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
                            <div>
                                <div className="flex items-center space-x-2 mb-3">
                                    <Icon name="ThumbsUp" size={20} className="text-success" strokeWidth={2} />
                                    <h3 className="font-semibold text-text-primary">Pros</h3>
                                </div>
                                <ul className="space-y-2">
                                    {/* Safely map over pros, providing a fallback empty array */}
                                    {(structuredSummary.pros || []).map((pro, index) => (
                                        <li key={`pro-${index}`} className="flex items-start space-x-2">
                                            <Icon name="CheckCircle" size={16} className="text-success mt-1 flex-shrink-0" />
                                            <span className="text-sm text-text-secondary">{pro}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <div className="flex items-center space-x-2 mb-3">
                                    <Icon name="ThumbsDown" size={20} className="text-error" strokeWidth={2} />
                                    <h3 className="font-semibold text-text-primary">Cons</h3>
                                </div>
                                <ul className="space-y-2">
                                    {/* Safely map over cons */}
                                    {(structuredSummary.cons || []).map((con, index) => (
                                        <li key={`con-${index}`} className="flex items-start space-x-2">
                                            <Icon name="XCircle" size={16} className="text-error mt-1 flex-shrink-0" />
                                            <span className="text-sm text-text-secondary">{con}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Fallback message if there's no summary
                    <div className="text-center py-8">
                        <Icon name="FileText" size={48} className="text-secondary mx-auto mb-4" strokeWidth={1} />
                        <p className="text-text-secondary">
                            Summary will appear here after analysis.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SummaryCard;
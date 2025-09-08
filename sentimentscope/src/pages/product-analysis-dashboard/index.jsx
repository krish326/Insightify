import React, { useState } from 'react';
import axios from 'axios';
import Header from 'components/ui/Header';
import AnalysisStateIndicator from 'components/ui/AnalysisStateIndicator';
import ResultsNavigationController from 'components/ui/ResultsNavigationController';

import Icon from 'components/AppIcon';
import UrlInputSection from './components/UrlInputSection';
import SummaryCard from './components/SummaryCard';
import ReviewsList from './components/ReviewsList';
import OverallSentimentChart from 'components/OverallSentimentChart';
import AspectChart from 'components/AspectChart';

function ProductAnalysisDashboard() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

    const handleAnalyze = async () => {
        if (!url.trim()) {
            setError('Please enter a valid product URL');
            return;
        }

        setLoading(true);
        setError(null);
        setProgress(0);
        setAnalysisResult(null);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + Math.random() * 15;
            });
        }, 500);

        try {
            const response = await axios.post('http://localhost:8080/api/scrape', {
                url: url.trim()
            });

            clearInterval(progressInterval);
            setProgress(100);

            const analysisData = response.data;

            if (analysisData.summary && typeof analysisData.summary === 'string') {
                try {
                    analysisData.structuredSummary = JSON.parse(analysisData.summary);
                } catch (e) {
                    console.error("Failed to parse summary JSON:", e);
                    analysisData.structuredSummary = {
                        summary_paragraph: "Sorry, the AI response was not in a readable format.",
                        pros: [],
                        cons: []
                    };
                }
            }

            setTimeout(() => {
                setAnalysisResult(analysisData);
                setLoading(false);
                setProgress(0);
            }, 500);

        } catch (err) {
            clearInterval(progressInterval);
            setLoading(false);
            setProgress(0);
            setError('Analysis failed. Please check your connection and try again.');
        }
    };

  const handleRetry = () => {
    setError(null);
    handleAnalyze();
  };

  const handleClearResults = () => {
    setAnalysisResult(null);
    setError(null);
    setUrl('');
  };

  return (
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mx-auto mb-6">
                <Icon
                    name="TrendingUp"
                    size={32}
                    color="white"
                    strokeWidth={2}
                />
              </div>

              <h1 className="text-4xl font-bold text-text-primary mb-4">
                Product Sentiment Analysis
              </h1>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Get AI-powered insights from customer reviews. Simply enter a product URL to analyze sentiment patterns and make informed purchasing decisions.
              </p>
            </div>

            {/* URL Input Section */}
            <UrlInputSection
                url={url}
                setUrl={setUrl}
                onAnalyze={handleAnalyze}
                loading={loading}
                hasResults={!!analysisResult}
                onClearResults={handleClearResults}
            />

            {/* Analysis State Indicator */}
            <div className="mb-8">
              <AnalysisStateIndicator
                  state={loading ? 'loading' : error ? 'error' : analysisResult ? 'success' : 'idle'}
                  progress={progress}
                  message={error}
                  onRetry={handleRetry}
              />
            </div>

            {/* Results Section */}
            {analysisResult && (
                <div className="space-y-12">
                  {/* Results Navigation */}
                  <ResultsNavigationController analysisData={analysisResult} />

                  {/* --- NEW VISUALIZATION SECTION --- */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                    <div className="lg:col-span-2 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <OverallSentimentChart
                          reviewAnalyses={analysisResult.reviewAnalyses}
                      />
                    </div>
                    <div className="lg:col-span-3 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <AspectChart
                          aspectBreakdown={analysisResult.aspectBreakdown}
                      />
                    </div>
                  </div>

                  {/* --- EXISTING SUMMARY & REVIEWS --- */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Summary Section */}
                    <div className="lg:col-span-1">
                        <SummaryCard
                            analysisResult={analysisResult}
                        />




                    </div>

                    {/* Reviews Section */}


                    <div className="lg:col-span-1">
                      <ReviewsList
                          reviews={analysisResult.reviewAnalyses || []}
                          totalReviews={analysisResult.totalReviews}
                      />
                    </div>
                  </div>

                  {/* Additional Insights */}
                  {analysisResult.insights && (
                      <div className="bg-surface rounded-xl border border-border p-6 shadow-soft">
                        <div className="flex items-center space-x-3 mb-4">
                          <Icon name="Lightbulb" size={24} className="text-accent" strokeWidth={2} />
                          <h3 className="text-lg font-semibold text-text-primary">
                            Key Insights
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {analysisResult.insights.map((insight, index) => (
                              <div key={index} className="bg-accent-50 rounded-lg p-4 border border-accent-100">
                                <div className="flex items-start space-x-3">
                                  <Icon
                                      name="CheckCircle"
                                      size={20}
                                      className="text-accent mt-0.5"
                                      strokeWidth={2}
                                  />
                                  <p className="text-sm text-text-primary">{insight}</p>
                                </div>
                              </div>
                          ))}
                        </div>
                      </div>
                  )}
                </div>
            )}

            {/* Empty State */}
            {!loading && !analysisResult && !error && (
                <div className="text-center py-16">
                  <div className="flex items-center justify-center w-20 h-20 bg-secondary-100 rounded-full mx-auto mb-6">
                    <Icon
                        name="BarChart3"
                        size={40}
                        className="text-secondary"
                        strokeWidth={1.5}
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Ready to Analyze
                  </h3>
                  <p className="text-text-secondary max-w-md mx-auto">
                    Enter a product URL above to get started with AI-powered sentiment analysis of customer reviews.
                  </p>
                </div>
            )}
          </div>
        </main>
      </div>
  );
}

export default ProductAnalysisDashboard;

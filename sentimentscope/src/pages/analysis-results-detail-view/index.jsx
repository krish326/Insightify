import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from 'components/ui/Header';
import Icon from 'components/AppIcon';

import AnalysisStateIndicator from 'components/ui/AnalysisStateIndicator';
import DetailedSummaryCard from './components/DetailedSummaryCard';
import ReviewAnalysisCard from './components/ReviewAnalysisCard';
import SentimentFilterChips from './components/SentimentFilterChips';
import AspectAnalysisPanel from './components/AspectAnalysisPanel';

function AnalysisResultsDetailView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedSentimentFilter, setSelectedSentimentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock analysis data - in real app this would come from API or location state
  const mockAnalysisData = {
    productInfo: {
      name: "Sony WH-1000XM4 Wireless Noise Canceling Headphones",
      url: "https://amazon.com/sony-wh1000xm4-headphones",
      imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop",
      price: "$348.00",
      rating: 4.4,
      totalReviews: 15847
    },
    overallSentiment: {
      score: 0.72,
      confidence: 0.89,
      label: "Positive"
    },
    aiSummary: `**Overall Assessment:** The Sony WH-1000XM4 headphones receive overwhelmingly positive feedback from customers, with particular praise for their exceptional noise cancellation and sound quality.

**Key Strengths:**
• **Noise Cancellation:** Industry-leading active noise cancellation technology that effectively blocks ambient noise
• **Sound Quality:** Rich, balanced audio with deep bass and clear highs that satisfy audiophiles
• **Battery Life:** Impressive 30-hour battery life with quick charge functionality
• **Comfort:** Well-padded ear cups and adjustable headband for extended listening sessions
• **Smart Features:** Touch controls, voice assistant integration, and adaptive sound control

**Areas for Improvement:**
• **Build Quality:** Some users report concerns about plastic construction feeling less premium
• **Touch Controls:** Occasional sensitivity issues with touch panel responsiveness
• **Price Point:** Higher cost compared to competitors may deter budget-conscious buyers

**Recommendation:** Highly recommended for users prioritizing noise cancellation and sound quality, particularly for travel and professional use.`,
    aspectSentiments: {
      "Sound Quality": { score: 0.85, confidence: 0.92, sentiment: "positive" },
      "Noise Cancellation": { score: 0.91, confidence: 0.95, sentiment: "positive" },
      "Comfort": { score: 0.68, confidence: 0.78, sentiment: "positive" },
      "Battery Life": { score: 0.79, confidence: 0.84, sentiment: "positive" },
      "Build Quality": { score: 0.45, confidence: 0.71, sentiment: "neutral" },
      "Value for Money": { score: 0.32, confidence: 0.69, sentiment: "neutral" },
      "Touch Controls": { score: -0.23, confidence: 0.65, sentiment: "negative" }
    },
    reviews: [
      {
        id: 1,
        reviewText: "These headphones are absolutely incredible! The noise cancellation is phenomenal - I can\'t hear anything when they\'re on. Perfect for flights and working in noisy environments.",
        overallSentiment: { score: 0.89, confidence: 0.94, label: "Positive" },
        aspectSentiments: {
          "Noise Cancellation": { score: 0.95, confidence: 0.97 },
          "Sound Quality": { score: 0.87, confidence: 0.89 },
          "Comfort": { score: 0.78, confidence: 0.82 }
        },
        timestamp: new Date(Date.now() - 86400000 * 2),
        reviewer: "AudioEnthusiast2023",
        verified: true
      },
      {
        id: 2,
        reviewText: "Good sound quality but the touch controls are frustrating. Sometimes they don\'t respond properly and I accidentally pause music when adjusting the headphones.",
        overallSentiment: { score: 0.34, confidence: 0.76, label: "Neutral" },
        aspectSentiments: {
          "Sound Quality": { score: 0.72, confidence: 0.85 },
          "Touch Controls": { score: -0.68, confidence: 0.91 },
          "Build Quality": { score: 0.45, confidence: 0.67 }
        },
        timestamp: new Date(Date.now() - 86400000 * 5),
        reviewer: "TechReviewer99",
        verified: true
      },
      {
        id: 3,
        reviewText: "Expensive but worth every penny. The battery lasts forever and the sound is crystal clear. Best headphones I\'ve ever owned.",
        overallSentiment: { score: 0.81, confidence: 0.88, label: "Positive" },
        aspectSentiments: {
          "Battery Life": { score: 0.92, confidence: 0.94 },
          "Sound Quality": { score: 0.89, confidence: 0.91 },
          "Value for Money": { score: 0.65, confidence: 0.73 }
        },
        timestamp: new Date(Date.now() - 86400000 * 7),
        reviewer: "MusicLover42",
        verified: false
      },
      {
        id: 4,
        reviewText: "The plastic feels cheap for the price point. While the audio is great, I expected better build quality from Sony at this price range.",
        overallSentiment: { score: -0.12, confidence: 0.82, label: "Negative" },
        aspectSentiments: {
          "Build Quality": { score: -0.78, confidence: 0.89 },
          "Value for Money": { score: -0.65, confidence: 0.81 },
          "Sound Quality": { score: 0.71, confidence: 0.84 }
        },
        timestamp: new Date(Date.now() - 86400000 * 10),
        reviewer: "QualityFirst",
        verified: true
      },
      {
        id: 5,
        reviewText: "Comfortable for long listening sessions. Great for work calls and music. The adaptive sound feature is really smart.",
        overallSentiment: { score: 0.76, confidence: 0.85, label: "Positive" },
        aspectSentiments: {
          "Comfort": { score: 0.84, confidence: 0.88 },
          "Sound Quality": { score: 0.79, confidence: 0.82 },
          "Smart Features": { score: 0.73, confidence: 0.79 }
        },
        timestamp: new Date(Date.now() - 86400000 * 12),
        reviewer: "WorkFromHome2023",
        verified: true
      }
    ]
  };

  useEffect(() => {
    // In real app, this would fetch data from API or get from location state
    if (location.state?.analysisData) {
      setAnalysisData(location.state.analysisData);
    } else {
      // Use mock data for demo
      setAnalysisData(mockAnalysisData);
    }
  }, [location.state]);

  useEffect(() => {
    if (analysisData?.reviews) {
      let filtered = [...analysisData.reviews];
      
      // Apply sentiment filter
      if (selectedSentimentFilter !== 'all') {
        filtered = filtered.filter(review => {
          const sentiment = review.overallSentiment.label.toLowerCase();
          return sentiment === selectedSentimentFilter;
        });
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'sentiment':
            return b.overallSentiment.score - a.overallSentiment.score;
          case 'confidence':
            return b.overallSentiment.confidence - a.overallSentiment.confidence;
          case 'date':
          default:
            return new Date(b.timestamp) - new Date(a.timestamp);
        }
      });
      
      setFilteredReviews(filtered);
    }
  }, [analysisData, selectedSentimentFilter, sortBy]);

  const handleBackToDashboard = () => {
    navigate('/product-analysis-dashboard');
  };

  const handleExport = () => {
    // Mock export functionality
    const dataStr = JSON.stringify(analysisData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sentiment-analysis-results.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Product Sentiment Analysis Results',
          text: `Check out this sentiment analysis for ${analysisData?.productInfo?.name}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <AnalysisStateIndicator 
            state="loading" 
            message="Loading detailed analysis..." 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-surface hover:bg-secondary-100 border border-border rounded-lg transition-smooth shadow-soft"
            >
              <Icon name="ArrowLeft" size={16} strokeWidth={2} />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="BarChart3" size={16} strokeWidth={2} />
                <span>Detailed Analysis View</span>
              </div>
              
              <button 
                onClick={handleShare}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-primary hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-smooth"
              >
                <Icon name="Share2" size={16} strokeWidth={2} />
                <span className="hidden sm:inline">Share</span>
              </button>
              
              <button 
                onClick={handleExport}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-primary hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-smooth"
              >
                <Icon name="Download" size={16} strokeWidth={2} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Left Sidebar - Summary */}
            <div className="lg:col-span-4 space-y-6">
              <DetailedSummaryCard 
                productInfo={analysisData.productInfo}
                overallSentiment={analysisData.overallSentiment}
                aiSummary={analysisData.aiSummary}
              />
              
              <AspectAnalysisPanel 
                aspectSentiments={analysisData.aspectSentiments}
              />
            </div>

            {/* Main Content - Reviews */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-surface rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Individual Review Analysis
                  </h2>
                  <div className="flex items-center space-x-4">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="date">Sort by Date</option>
                      <option value="sentiment">Sort by Sentiment</option>
                      <option value="confidence">Sort by Confidence</option>
                    </select>
                  </div>
                </div>

                <SentimentFilterChips
                  selectedFilter={selectedSentimentFilter}
                  onFilterChange={setSelectedSentimentFilter}
                  reviewCounts={{
                    all: analysisData.reviews.length,
                    positive: analysisData.reviews.filter(r => r.overallSentiment.label.toLowerCase() === 'positive').length,
                    neutral: analysisData.reviews.filter(r => r.overallSentiment.label.toLowerCase() === 'neutral').length,
                    negative: analysisData.reviews.filter(r => r.overallSentiment.label.toLowerCase() === 'negative').length
                  }}
                />

                <div className="space-y-4 mt-6">
                  {filteredReviews.map((review) => (
                    <ReviewAnalysisCard
                      key={review.id}
                      review={review}
                    />
                  ))}
                </div>

                {filteredReviews.length === 0 && (
                  <div className="text-center py-12">
                    <Icon name="Filter" size={48} className="text-secondary mx-auto mb-4" strokeWidth={1.5} />
                    <h3 className="text-lg font-medium text-text-primary mb-2">No reviews match your filter</h3>
                    <p className="text-text-secondary">Try adjusting your sentiment filter to see more results.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            <DetailedSummaryCard 
              productInfo={analysisData.productInfo}
              overallSentiment={analysisData.overallSentiment}
              aiSummary={analysisData.aiSummary}
            />

            <AspectAnalysisPanel 
              aspectSentiments={analysisData.aspectSentiments}
            />

            <div className="bg-surface rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text-primary">
                  Review Analysis
                </h2>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="sentiment">Sort by Sentiment</option>
                  <option value="confidence">Sort by Confidence</option>
                </select>
              </div>

              <SentimentFilterChips
                selectedFilter={selectedSentimentFilter}
                onFilterChange={setSelectedSentimentFilter}
                reviewCounts={{
                  all: analysisData.reviews.length,
                  positive: analysisData.reviews.filter(r => r.overallSentiment.label.toLowerCase() === 'positive').length,
                  neutral: analysisData.reviews.filter(r => r.overallSentiment.label.toLowerCase() === 'neutral').length,
                  negative: analysisData.reviews.filter(r => r.overallSentiment.label.toLowerCase() === 'negative').length
                }}
              />

              <div className="space-y-4 mt-4">
                {filteredReviews.map((review) => (
                  <ReviewAnalysisCard
                    key={review.id}
                    review={review}
                  />
                ))}
              </div>

              {filteredReviews.length === 0 && (
                <div className="text-center py-8">
                  <Icon name="Filter" size={40} className="text-secondary mx-auto mb-3" strokeWidth={1.5} />
                  <h3 className="text-base font-medium text-text-primary mb-2">No matching reviews</h3>
                  <p className="text-sm text-text-secondary">Try adjusting your filter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalysisResultsDetailView;
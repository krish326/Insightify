import React, { useState } from 'react';
import Icon from 'components/AppIcon';

function UrlInputSection({ 
  url, 
  setUrl, 
  onAnalyze, 
  loading, 
  hasResults, 
  onClearResults 
}) {
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze();
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const urlValid = url.trim() && isValidUrl(url.trim());

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input */}
        <div className="relative">
          <div className={`relative rounded-xl border-2 transition-all duration-200 ${
            focused 
              ? 'border-primary shadow-soft-lg' 
              : 'border-border hover:border-secondary-300'
          }`}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon 
                name="Link" 
                size={20} 
                className={focused ? 'text-primary' : 'text-secondary'} 
                strokeWidth={2}
              />
            </div>
            
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Enter product URL for analysis (e.g. Amazon, Flipkart, etc.)"
              disabled={loading}
              className="w-full pl-12 pr-4 py-4 text-lg bg-surface rounded-xl border-0 focus:outline-none focus:ring-0 placeholder-text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            {url && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  disabled={loading}
                  className="p-1 text-secondary hover:text-text-primary transition-smooth rounded-full hover:bg-secondary-100 disabled:opacity-50"
                >
                  <Icon name="X" size={16} strokeWidth={2} />
                </button>
              </div>
            )}
          </div>
          
          {/* URL Validation Indicator */}
          {url && (
            <div className="absolute -bottom-6 left-0 flex items-center space-x-2">
              <Icon 
                name={urlValid ? "CheckCircle" : "AlertCircle"} 
                size={16} 
                className={urlValid ? 'text-success' : 'text-error'} 
                strokeWidth={2}
              />
              <span className={`text-sm ${urlValid ? 'text-success' : 'text-error'}`}>
                {urlValid ? 'Valid URL format' : 'Please enter a valid URL'}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            type="submit"
            disabled={!urlValid || loading}
            className="flex-1 flex items-center justify-center space-x-3 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth shadow-soft"
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={20} className="animate-spin" strokeWidth={2} />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Icon name="Search" size={20} strokeWidth={2} />
                <span>Analyze Product</span>
              </>
            )}
          </button>

          {hasResults && (
            <button
              type="button"
              onClick={onClearResults}
              disabled={loading}
              className="flex items-center justify-center space-x-2 px-6 py-4 bg-surface text-text-secondary font-medium border border-border rounded-xl hover:bg-secondary-100 hover:text-text-primary focus:outline-none focus:ring-4 focus:ring-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              <Icon name="RotateCcw" size={20} strokeWidth={2} />
              <span>New Analysis</span>
            </button>
          )}
        </div>
      </form>

      {/* Quick Examples */}
      <div className="mt-8 text-center">
        <p className="text-sm text-text-secondary mb-3">
          Try with popular e-commerce platforms:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {['Amazon', 'Flipkart'].map((platform) => (
            <span 
              key={platform}
              className="px-3 py-1 bg-secondary-100 text-secondary-600 text-sm rounded-full"
            >
              {platform}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UrlInputSection;
import React from 'react';
import Icon from '../AppIcon';

function AnalysisStateIndicator({ 
  state = 'idle', 
  progress = 0, 
  message = '', 
  onRetry = null 
}) {
  const getStateConfig = () => {
    switch (state) {
      case 'loading':
        return {
          icon: 'Loader2',
          iconClass: 'animate-spin text-primary',
          bgClass: 'bg-primary-50 border-primary-100',
          textClass: 'text-primary-700',
          showProgress: true
        };
      case 'success':
        return {
          icon: 'CheckCircle',
          iconClass: 'text-success',
          bgClass: 'bg-success-50 border-success-100',
          textClass: 'text-success-600',
          showProgress: false
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          iconClass: 'text-error',
          bgClass: 'bg-error-50 border-error-100',
          textClass: 'text-error-600',
          showProgress: false
        };
      case 'warning':
        return {
          icon: 'AlertTriangle',
          iconClass: 'text-warning',
          bgClass: 'bg-warning-50 border-warning-100',
          textClass: 'text-warning-600',
          showProgress: false
        };
      default:
        return {
          icon: 'Activity',
          iconClass: 'text-secondary',
          bgClass: 'bg-secondary-100 border-secondary-200',
          textClass: 'text-secondary-600',
          showProgress: false
        };
    }
  };

  const config = getStateConfig();

  if (state === 'idle') return null;

  return (
    <div className={`rounded-lg border p-4 transition-smooth ${config.bgClass}`}>
      <div className="flex items-start space-x-3">
        <Icon 
          name={config.icon} 
          size={20} 
          className={config.iconClass}
          strokeWidth={2}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${config.textClass}`}>
              {message || getDefaultMessage(state)}
            </p>
            
            {state === 'error' && onRetry && (
              <button
                onClick={onRetry}
                className="ml-3 text-sm font-medium text-error hover:text-error-600 transition-smooth"
              >
                Retry
              </button>
            )}
          </div>
          
          {config.showProgress && progress > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-primary-600 mb-1">
                <span>Processing...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-primary-100 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {state === 'loading' && !config.showProgress && (
            <div className="mt-2 flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getDefaultMessage(state) {
  switch (state) {
    case 'loading':
      return 'Analyzing product reviews and sentiment patterns...';
    case 'success':
      return 'Analysis completed successfully';
    case 'error':
      return 'Analysis failed. Please check your URL and try again.';
    case 'warning':
      return 'Analysis completed with some limitations';
    default:
      return 'Ready to analyze';
  }
}

export default AnalysisStateIndicator;
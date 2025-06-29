import React from 'react';
import Icon from 'components/AppIcon';

function SentimentFilterChips({ selectedFilter, onFilterChange, reviewCounts }) {
  const filters = [
    {
      id: 'all',
      label: 'All Reviews',
      icon: 'List',
      count: reviewCounts.all,
      bgClass: 'bg-secondary-100 hover:bg-secondary-200',
      textClass: 'text-text-primary',
      activeClass: 'bg-primary text-white'
    },
    {
      id: 'positive',
      label: 'Positive',
      icon: 'TrendingUp',
      count: reviewCounts.positive,
      bgClass: 'bg-success-50 hover:bg-success-100',
      textClass: 'text-success-600',
      activeClass: 'bg-success text-white'
    },
    {
      id: 'neutral',
      label: 'Neutral',
      icon: 'Minus',
      count: reviewCounts.neutral,
      bgClass: 'bg-warning-50 hover:bg-warning-100',
      textClass: 'text-warning-600',
      activeClass: 'bg-warning text-white'
    },
    {
      id: 'negative',
      label: 'Negative',
      icon: 'TrendingDown',
      count: reviewCounts.negative,
      bgClass: 'bg-error-50 hover:bg-error-100',
      textClass: 'text-error-600',
      activeClass: 'bg-error text-white'
    }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = selectedFilter === filter.id;
        
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`
              inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth
              ${isActive 
                ? filter.activeClass 
                : `${filter.bgClass} ${filter.textClass}`
              }
            `}
          >
            <Icon 
              name={filter.icon} 
              size={14} 
              strokeWidth={2}
              color={isActive ? 'white' : 'currentColor'}
            />
            <span>{filter.label}</span>
            <span className={`
              px-1.5 py-0.5 rounded-full text-xs font-semibold
              ${isActive 
                ? 'bg-white bg-opacity-20 text-white' :'bg-white bg-opacity-60 text-text-primary'
              }
            `}>
              {filter.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default SentimentFilterChips;
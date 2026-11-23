package com.krish.project.Sentiment.Analysis.Service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SentimentBreakdown {
    private int positive = 0;
    private int negative = 0;
    private int neutral = 0;

    // Helper methods to increment counts
    public void incrementPositive() { this.positive++; }
    public void incrementNegative() { this.negative++; }
    public void incrementNeutral() { this.neutral++; }
}
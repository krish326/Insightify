package com.krish.project.Sentiment.Analysis.Service;

public class SentimentBreakdown {
    private int positive = 0;
    private int negative = 0;
    private int neutral = 0;

    // Getters and Setters
    public int getPositive() { return positive; }
    public void setPositive(int positive) { this.positive = positive; }
    public int getNegative() { return negative; }
    public void setNegative(int negative) { this.negative = negative; }
    public int getNeutral() { return neutral; }
    public void setNeutral(int neutral) { this.neutral = neutral; }

    // Helper methods to increment counts
    public void incrementPositive() { this.positive++; }
    public void incrementNegative() { this.negative++; }
    public void incrementNeutral() { this.neutral++; }
}
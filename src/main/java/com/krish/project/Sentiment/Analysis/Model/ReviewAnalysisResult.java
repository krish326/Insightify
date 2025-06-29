package com.krish.project.Sentiment.Analysis.Model; // Or your chosen package

import java.util.Map;

public class ReviewAnalysisResult {

    private String reviewText;
    private String overallSentiment;
    private Map<String, String> aspectSentiments;

    // Constructors
    public ReviewAnalysisResult() {
    }

    public ReviewAnalysisResult(String reviewText, String overallSentiment, Map<String, String> aspectSentiments) {
        this.reviewText = reviewText;
        this.overallSentiment = overallSentiment;
        this.aspectSentiments = aspectSentiments;
    }

    // Getters and Setters
    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public String getOverallSentiment() {
        return overallSentiment;
    }

    public void setOverallSentiment(String overallSentiment) {
        this.overallSentiment = overallSentiment;
    }

    public Map<String, String> getAspectSentiments() {
        return aspectSentiments;
    }

    public void setAspectSentiments(Map<String, String> aspectSentiments) {
        this.aspectSentiments = aspectSentiments;
    }

    @Override
    public String toString() {
        return "ReviewAnalysisResult{" +
                "reviewText='" + reviewText + '\'' +
                ", overallSentiment='" + overallSentiment + '\'' +
                ", aspectSentiments=" + aspectSentiments +
                '}';
    }
}
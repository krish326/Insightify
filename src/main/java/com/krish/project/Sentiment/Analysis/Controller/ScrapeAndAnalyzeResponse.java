package com.krish.project.Sentiment.Analysis.Controller;

import com.krish.project.Sentiment.Analysis.Model.ReviewAnalysisResult;
import com.krish.project.Sentiment.Analysis.Service.SentimentBreakdown;

import java.util.List;
import java.util.Map;

public class ScrapeAndAnalyzeResponse {

    private String summary;
    private List<ReviewAnalysisResult> reviewAnalyses;

    private String overallSentiment;
    private Map<String, SentimentBreakdown> aspectBreakdown;;
    private int totalReviews;


    public String getOverallSentiment() {
        return overallSentiment;
    }

    public void setOverallSentiment(String overallSentiment) {
        this.overallSentiment = overallSentiment;
    }

    public int getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(int totalReviews) {
        this.totalReviews = totalReviews;
    }
    public Map<String, SentimentBreakdown> getAspectBreakdown() {
        return aspectBreakdown;
    }
    public void setAspectBreakdown(Map<String, SentimentBreakdown> aspectBreakdown) {
        this.aspectBreakdown = aspectBreakdown;
    }


    // Existing Getters and Setters...
    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<ReviewAnalysisResult> getReviewAnalyses() {
        return reviewAnalyses;
    }

    public void setReviewAnalyses(List<ReviewAnalysisResult> reviewAnalyses) {
        this.reviewAnalyses = reviewAnalyses;
    }
}
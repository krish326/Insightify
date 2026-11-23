package com.krish.project.Sentiment.Analysis.Controller;

import com.krish.project.Sentiment.Analysis.Model.ReviewAnalysisResult;
import com.krish.project.Sentiment.Analysis.Service.SentimentBreakdown;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScrapeAndAnalyzeResponse {

    private String summary;
    private List<ReviewAnalysisResult> reviewAnalyses;

    private String overallSentiment;
    private Map<String, SentimentBreakdown> aspectBreakdown;;
    private int totalReviews;
}
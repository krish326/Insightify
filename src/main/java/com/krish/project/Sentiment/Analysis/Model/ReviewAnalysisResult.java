package com.krish.project.Sentiment.Analysis.Model; // Or your chosen package

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ReviewAnalysisResult {

    private String reviewText;
    private String overallSentiment;
    private Map<String, String> aspectSentiments;
}
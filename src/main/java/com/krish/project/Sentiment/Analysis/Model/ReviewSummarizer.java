package com.krish.project.Sentiment.Analysis.Model;

import com.google.cloud.vertexai.VertexAI;
import com.google.cloud.vertexai.api.GenerateContentResponse;
import com.google.cloud.vertexai.generativeai.GenerativeModel;
import com.google.cloud.vertexai.generativeai.ResponseHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewSummarizer {

    // Your Google Cloud Project ID and Location from application.properties
    @Value("${google.cloud.project.id}")
    private String projectId;

    @Value("us-central1")
    private String location;

    public String summarizeReviews(List<String> reviews) {
        if (reviews == null || reviews.isEmpty()) {
            return "No reviews available to summarize.";
        }

        System.out.println("Summarizer: Initializing VertexAI client for project: " + projectId);

        // This 'try-with-resources' statement automatically closes the VertexAI client.
        try (VertexAI vertexAi = new VertexAI(projectId, location)) {
            GenerativeModel model = new GenerativeModel("gemini-2.0-flash-001", vertexAi);

            String prompt = "You are an expert product review analyst. Based on the following user reviews, provide a concise and balanced summary of the main pros and cons. Use bullet points for pros and cons. The reviews are: \n\n";

            String allReviewsText = reviews.stream()
                    .map(review -> "- " + review)
                    .collect(Collectors.joining("\n"));

            // To avoid making the API request too large, we can truncate if necessary
            if (allReviewsText.length() > 30000) {
                allReviewsText = allReviewsText.substring(0, 30000);
            }

            System.out.println("Summarizer: Sending " + reviews.size() + " reviews to Gemini API...");

            GenerateContentResponse response = model.generateContent(prompt + allReviewsText);

            String summary = ResponseHandler.getText(response);

            System.out.println("Summarizer: Successfully received summary from API.");
            return summary;

        } catch (IOException e) {
            System.err.println("Error calling Gemini API: " + e.getMessage());
            e.printStackTrace();
            return "Could not generate summary due to an API error.";
        }
    }
}
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

    // This now correctly reads the project ID from your application.properties
    @Value("${google.cloud.project.id}")
    private String projectId;

    // *** FIX #1: This now correctly reads the location from your application.properties ***
    @Value("us-central1")
    private String location;

    public String summarizeReviews(List<String> reviews) {
        if (reviews == null || reviews.isEmpty()) {
            return "No reviews available to summarize.";
        }

        System.out.println("Summarizer: Initializing VertexAI client for project: " + projectId + " in location: " + location);

        try (VertexAI vertexAi = new VertexAI(projectId, location)) {

            // *** FIX #2: Using the stable "gemini-1.0-pro" model name ***
            GenerativeModel model = new GenerativeModel("gemini-2.0-flash-001", vertexAi);

            String prompt = "You are an expert product review analyst. Analyze the following user reviews for a mobile phone."
                    + " Your response MUST be a single, valid JSON object and nothing else. Do not wrap it in markdown."
                    + " The JSON object should have the following structure:"
                    + " { "
                    + "  \"pros\": [\"A short bullet point for a key strength.\", \"Another strength.\"], "
                    + "  \"cons\": [\"A short bullet point for a key weakness.\", \"Another weakness.\"], "
                    + "  \"summary_paragraph\": \"A balanced one-paragraph summary of the reviews.\" "
                    + " } "
                    + " Here are the reviews:\n\n";

            String allReviewsText = reviews.stream()
                    .map(review -> "- " + review)
                    .collect(Collectors.joining("\n"));

            if (allReviewsText.length() > 30000) {
                allReviewsText = allReviewsText.substring(0, 30000);
            }

            System.out.println("Summarizer: Sending " + reviews.size() + " reviews to Gemini API...");
            GenerateContentResponse response = model.generateContent(prompt + allReviewsText);
            String rawResponse = ResponseHandler.getText(response);

            System.out.println("Summarizer: Received raw response. Cleaning for JSON...");

            int firstBrace = rawResponse.indexOf('{');
            int lastBrace = rawResponse.lastIndexOf('}');

            if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
                // Extract the clean JSON string
                String cleanedJson = rawResponse.substring(firstBrace, lastBrace + 1);
                System.out.println("Summarizer: Successfully extracted JSON from response.");
                return cleanedJson;
            } else {
                // If for some reason we can't find the JSON, return an error
                System.err.println("Could not find a valid JSON object in the model's response.");
                return "{\"error\": \"Failed to parse summary from model response.\"}";
            }

        } catch (IOException e) {
            System.err.println("Error calling Gemini API: " + e.getMessage());
            e.printStackTrace();
            return "{\"error\": \"Could not generate summary due to an API error.\"}";
        }
    }
}
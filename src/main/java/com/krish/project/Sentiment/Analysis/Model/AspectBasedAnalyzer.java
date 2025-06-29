package com.krish.project.Sentiment.Analysis.Model;

import java.util.*;

public class AspectBasedAnalyzer {

    // Use a Map to group related keywords under a canonical aspect name
    private final Map<String, List<String>> aspectKeywords;

    public AspectBasedAnalyzer() {
        aspectKeywords = new HashMap<>();
        aspectKeywords.put("camera", Arrays.asList("camera", "photo", "photos", "picture", "pictures", "lens", "image quality", "zoom", "portrait"));
        aspectKeywords.put("battery", Arrays.asList("battery", "charging", "charger", "power", "lasts", "mah"));
        aspectKeywords.put("display", Arrays.asList("display", "screen", "amoled", "lcd", "brightness", "refresh rate"));
        aspectKeywords.put("performance", Arrays.asList("performance", "speed", "fast", "slow", "lag", "smooth", "processor", "gaming", "heating"));
        aspectKeywords.put("design", Arrays.asList("design", "build", "look", "feel", "looks", "hand", "premium", "finish"));
        aspectKeywords.put("sound", Arrays.asList("sound", "speaker", "speakers", "audio", "dolby", "music", "loud"));
        aspectKeywords.put("price", Arrays.asList("price", "cost", "value", "money", "budget", "expensive", "cheap"));
    }

    /**
     * Extracts canonical aspects from the review text by searching for related keywords.
     * @param text The review text.
     * @return A Set of canonical aspect names found in the text.
     */
    public Set<String> extractAspects(String text) {
        Set<String> foundAspects = new HashSet<>();
        String loweredText = text.toLowerCase();

        // Iterate through the map of aspects and their keywords
        for (Map.Entry<String, List<String>> entry : aspectKeywords.entrySet()) {
            String canonicalAspect = entry.getKey();
            List<String> keywords = entry.getValue();

            // Check if any keyword for the current aspect is in the review text
            for (String keyword : keywords) {
                if (loweredText.contains(keyword)) {
                    foundAspects.add(canonicalAspect);
                    break; // Move to the next aspect once one keyword is found for this aspect
                }
            }
        }
        return foundAspects;
    }
}
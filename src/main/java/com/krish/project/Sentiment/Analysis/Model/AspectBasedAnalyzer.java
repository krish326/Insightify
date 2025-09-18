package com.krish.project.Sentiment.Analysis.Model;

import java.util.*;

public class AspectBasedAnalyzer {

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


    public Set<String> extractAspects(String text) {
        Set<String> foundAspects = new HashSet<>();
        String loweredText = text.toLowerCase();

        // Iterate through the map of aspects and their keywords
        for (Map.Entry<String, List<String>> entry : aspectKeywords.entrySet()) {
            String canonicalAspect = entry.getKey();
            List<String> keywords = entry.getValue();

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
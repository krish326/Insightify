package com.krish.project.Sentiment.Analysis.Model;

import edu.stanford.nlp.pipeline.CoreDocument;
import edu.stanford.nlp.pipeline.CoreSentence;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;
import java.util.*;

@Service
public class SentimentAnalyzer {

    private final StanfordCoreNLP pipeline;
    private final AspectBasedAnalyzer analyzer;

    public SentimentAnalyzer() {
        this.analyzer = new AspectBasedAnalyzer();
        Properties props = new Properties();
        props.setProperty("annotators", "tokenize,ssplit,parse,sentiment");
        this.pipeline = new StanfordCoreNLP(props);
    }

    public String getOverallSentiment(String text) {
        if (text == null || text.trim().isEmpty()) {
            return "Neutral";
        }
        CoreDocument doc = new CoreDocument(text);
        pipeline.annotate(doc);

        // Calculate the sentiment of all sentences and find the dominant sentiment
        Map<String, Long> sentimentCounts = doc.sentences().stream()
                .collect(Collectors.groupingBy(CoreSentence::sentiment, Collectors.counting()));

        // Find the sentiment with the highest count
        return sentimentCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Neutral");
    }

    public Map<String, String> analyzeAspectSentimentsSimple(String text, List<String> aspects) {
        Map<String, String> aspectSentiments = new HashMap<>();
        CoreDocument doc = new CoreDocument(text);
        pipeline.annotate(doc);
        List<CoreSentence> sentences = doc.sentences();

        for (String aspect : aspects) {
            String mostRelevantSentiment = "Neutral";
            for (CoreSentence sentence : sentences) {
                if (sentence.text().toLowerCase().contains(aspect.toLowerCase())) {
                    mostRelevantSentiment = sentence.sentiment();
                    break;
                }
            }
            aspectSentiments.put(aspect, mostRelevantSentiment);
        }

        return aspectSentiments;
    }

    public Map<String, String> analyzeAspects(String review) {
        List<String> aspects = new ArrayList<>(analyzer.extractAspects(review));
        return analyzeAspectSentimentsSimple(review, aspects);
    }
}
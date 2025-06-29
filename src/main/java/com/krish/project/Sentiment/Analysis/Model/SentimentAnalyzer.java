package com.krish.project.Sentiment.Analysis.Model;

import edu.stanford.nlp.pipeline.CoreDocument;
import edu.stanford.nlp.pipeline.CoreSentence;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SentimentAnalyzer {

    private final StanfordCoreNLP pipeline;

    private AspectBasedAnalyzer analyzer;

    public SentimentAnalyzer() {
        this.analyzer = new AspectBasedAnalyzer();

        Properties props = new Properties();
        props.setProperty("annotators", "tokenize,ssplit,parse,sentiment");
        this.pipeline = new StanfordCoreNLP(props);
    }

    public String getOverallSentiment(String text) {
        if (text == null || text.trim().isEmpty()) {
            return "Neutral"; // Or handle as an error/unknown
        }
        CoreDocument doc = new CoreDocument(text);
        pipeline.annotate(doc);
        List<CoreSentence> sentences = doc.sentences();
        if (sentences != null && !sentences.isEmpty()) {
            return sentences.get(0).sentiment(); // Returns the sentiment of the first sentence
        }
        return "Neutral"; // Default if no sentences are found
    }


    public Map<String, String> analyzeAspectSentimentsSimple(String text, List<String> aspects) {
        Map<String, String> aspectSentiments = new HashMap<>();
        String[] clauses = text.split("(?i)but|however|\\.|,|;|!|\\?");

        for (String aspect : aspects) {
            for (String clause : clauses) {
                if (clause.toLowerCase().contains(aspect.toLowerCase())) {
                    // Analyze sentiment for this clause
                    CoreDocument doc = new CoreDocument(clause);
                    pipeline.annotate(doc);

                    for (CoreSentence sentence : doc.sentences()) {
                        String sentiment = sentence.sentiment();
                        aspectSentiments.put(aspect, sentiment); // Keep latest for now
                    }
                    break; // Stop after first match
                }
            }
            // Default to Neutral if nothing found
            aspectSentiments.putIfAbsent(aspect, "Neutral");
        }

        return aspectSentiments;
    }


    public Map<String, String> analyzeAspects(String review) {
        List<String> aspects = new ArrayList<>(analyzer.extractAspects(review));
        return analyzeAspectSentimentsSimple(review, aspects);
    }
}

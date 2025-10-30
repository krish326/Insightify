SentimentScope: AI-Powered Product Review Analyzer

SentimentScope (also referred to as Insightify) is a full-stack web application designed to scrape, analyze, and visualize customer sentiment from e-commerce product pages.

Users can enter a URL from a supported site (like Amazon or Flipkart), and the application will fetch, process, and summarize hundreds of reviews. It provides an AI-generated summary, an overall sentiment score, and a detailed breakdown of sentiment towards specific product features (e.g., "camera," "battery").

✨ Core Features

    E-commerce Scraper: Uses a Selenium-based backend to scrape product reviews directly from Amazon and Flipkart product pages.

    AI-Powered Summarization: Leverages the Google Gemini (VertexAI) API to read all scraped reviews and generate a concise, AI-powered summary with "Pros" and "Cons".

    NLP Sentiment Analysis: Employs the Stanford CoreNLP library to perform sentiment analysis on each individual review, determining if it's positive, negative, or neutral.

    Aspect-Based Analysis: Intelligently identifies sentiment for specific, hard-coded product aspects (e.g., "camera," "battery," "display," "performance") to give a more granular understanding of product strengths and weaknesses.

    Interactive Dashboard: A modern React + Vite frontend provides a clean interface for users to submit URLs and view the results through interactive charts and filterable review lists.

🔧 Tech Stack

The project is a monorepo divided into a Spring Boot backend and a React frontend.

Backend (Java / Spring Boot)

    Framework: Spring Boot 3.4.6

    Language: Java 21

    Web Scraping: Selenium 4.33.0

    NLP: Stanford CoreNLP 4.5.4

    AI Summarization: Google Cloud VertexAI (Gemini)

    Build Tool: Maven

    API: Spring Web (REST)

Frontend (sentimentscope)

    Framework: React 18

    Build Tool: Vite

    Styling: TailwindCSS

    Data Visualization: Chart.js 4.4.1

    API Client: Axios

🚀 How It Works: Architecture & Data Flow

Here is a visualization of the application's data flow from user input to final result:

[User @ React Frontend]
       |
       1. Enters Product URL (e.g., amazon.com/...)
       |
       v
[POST /api/scrape] -> [Spring Boot Backend (ReviewRestController)]
                                |
                                2. Detects URL (Amazon/Flipkart)
                                |
       +------------------------+--------------------------+
       |                                                   |
       v                                                   v
[AmazonReviewScraper]                             [FlipkartReviewScraper]
       |                                                   |
       |  3. Use Selenium WebDriver to load page,           |
       |     scroll, click "Read More", and extract         |
       |     all review text.                             |
       |                                                   |
       +------------------------+--------------------------+
                                |
                                v
                [Aggregated List<String> of all reviews]
                                |
       +------------------------+--------------------------+
       |                                                   |
       v                                                   v
[ReviewSummarizer]                                  [SentimentAnalyzer]
       |                                                   |
       | 4a. Calls Google Gemini API                       | 4b. Uses Stanford CoreNLP
       |    to generate AI summary                         |    for overall & aspect
       |    (Pros, Cons, Paragraph).                       |    sentiment on *each* review.
       |                                                   |
       v                                                   v
[JSON Summary Object]                         [List<ReviewAnalysisResult>]
       |                                                   |
       +------------------------+--------------------------+
                                |
                                v
                   [ScrapeAndAnalyzeResponse (JSON)]
                                |
                                5. API Response sent to frontend
                                |
                                v
[React Frontend]
       |
       6. State is updated, results are rendered in:
          - SummaryCard (AI Summary)
          - OverallSentimentChart (Doughnut)
          - AspectChart (Stacked Bar)
          - ReviewsList (Individual Reviews)

🐞 Known Bugs & Technical Debt

Here is an analysis of potential bugs and areas for improvement based on the current codebase.

    Scraping is Extremely Fragile:

        Problem: The AmazonReviewScraper and FlipkartReviewScraper rely on hardcoded, specific CSS selectors (e.g., div.col.EPCmJX.Ma1fCG, span[data-hook=review-body]). Amazon and Flipkart change their website layouts frequently, which will break these selectors and cause the entire application to fail.

        Evidence: The FlipkartReviewScraper already has "Fallback selectors," which confirms that the primary selectors are known to be unstable.

    Frontend/Backend Data Mismatch:

        Problem: The frontend ReviewsList.jsx component was clearly designed for a different data structure than what the backend API provides.

        Evidence: The component has a large "transformation" block at the top to force the backend data (from ReviewAnalysisResult) into the shape it expects. It maps reviewText to content and, most critically, fakes sentiment scores (e.g., (review.overallSentiment === "Positive" ... ) ? 0.9 : 0.2) because the backend only provides a "Positive" or "Negative" string, not a numerical score. This is inefficient and ignores the rich data from the detailed analysis view.

    Poor Performance & Synchronous API:

        Problem: The scraping process is synchronous and very slow. The API request waits for the entire process (Selenium startup, page loads, scrolling, multiple Thread.sleep() calls, NLP analysis, AI summary) to finish.

        Evidence: The scrapers use hardcoded Thread.sleep() calls for 3-5 seconds. A long analysis will likely cause an HTTP timeout. The frontend product-analysis-dashboard uses a simulated progress bar, which masks the true (and very long) wait time from the user. This should be an asynchronous job-based system (e.g., with WebSockets or polling).

    Limited & Generic Error Handling:

        Problem: If the backend fails, the user sees a generic message.

        Evidence: The catch block in product-analysis-dashboard/index.jsx sets a generic error: "Analysis failed. Please check your connection and try again." The backend might fail from a bad URL, a broken scraper, an invalid API key, or a timeout, but the user gets no specific feedback.

    Hardcoded Aspect Analysis:

        Problem: The Aspect-Based Analysis is not dynamic. It can only identify aspects (and their related keywords) that are hardcoded in AspectBasedAnalyzer.java.

        Evidence: The aspectKeywords map only contains keywords for "camera," "battery," "display," "performance," "design," "sound," and "price." This works for mobile phones but will fail to find relevant aspects for headphones (e.g., "comfort," "noise cancellation") or any other product category.

📊 In-App Visualizations

The application generates two primary charts on the main dashboard to visualize the aggregated data:

1. Overall Review Sentiment (Doughnut Chart)

    File: sentimentscope/src/components/OverallSentimentChart.jsx

    Purpose: To show the high-level distribution of all analyzed reviews.

    Description: This is a Doughnut chart that displays the total count of reviews categorized as "Positive," "Negative," and "Neutral." It gives a quick, at-a-glance understanding of the general product reception.

2. Sentiment Breakdown by Product Feature (Horizontal Stacked Bar Chart)

    File: sentimentscope/src/components/AspectChart.jsx

    Purpose: To show how customers feel about specific features of the product.

    Description: This is a horizontal stacked bar chart. Each bar represents one product aspect (e.g., "Battery," "Camera," "Performance"). The bar is then divided into three colored sections showing the count of positive, negative, and neutral mentions for that specific aspect, allowing for a detailed comparison of product strengths and weaknesses.

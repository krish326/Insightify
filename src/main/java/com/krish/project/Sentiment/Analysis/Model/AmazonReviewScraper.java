package com.krish.project.Sentiment.Analysis.Model;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

import java.util.ArrayList;
import java.util.List;

@Service
public class AmazonReviewScraper {

    private final WebDriver driver;
    private static final String REVIEW_CONTAINER_SELECTOR = "div.a-row.a-spacing-small.review-data";
    private static final String READ_MORE_SELECTOR = "a[data-hook='expand-collapse-read-more-less']";
    private static final String REVIEW_TEXT_SELECTOR = "span[data-hook=review-body]";


    @Autowired
    public AmazonReviewScraper(WebDriver driver) {
        this.driver = driver;
    }

    public List<String> scrapeReviews(String productUrl) {
        List<String> reviews = new ArrayList<>();
        try {
            System.out.println("ReviewScraper: Navigating to URL: " + productUrl);
            driver.get(productUrl);
            System.out.println("ReviewScraper: Page navigation complete. Waiting for initial dynamic content...");
            Thread.sleep(5000); // Initial wait

            // --- Enhanced Scrolling Logic ---
            System.out.println("ReviewScraper: Attempting to scroll to load more reviews...");
            JavascriptExecutor js = (JavascriptExecutor) driver;
            int maxScrolls = 10; // Maximum number of scroll attempts
            int noChangeCount = 0; // Counter for scrolls with no new reviews
            int previousReviewCount = 0;

            for (int i = 0; i < maxScrolls; i++) {
                js.executeScript("window.scrollTo(0, document.body.scrollHeight);");
                System.out.println("ReviewScraper: Scrolled down (" + (i + 1) + "/" + maxScrolls + "). Waiting for new content...");
                Thread.sleep(3500); // Wait for new reviews to load

                // Check if new reviews were loaded by counting elements with Selenium
                List<WebElement> currentReviewElementsOnPage = driver.findElements(By.cssSelector(REVIEW_CONTAINER_SELECTOR));
                int currentReviewCount = currentReviewElementsOnPage.size();
                System.out.println("ReviewScraper: Found " + currentReviewCount + " review containers via Selenium after scroll " + (i + 1));

                if (currentReviewCount > previousReviewCount) {
                    previousReviewCount = currentReviewCount;
                    noChangeCount = 0; // Reset noChangeCount because new reviews were loaded
                } else {
                    noChangeCount++;
                }

                if (noChangeCount >= 2) { // If 2 consecutive scrolls yield no new reviews, stop
                    System.out.println("ReviewScraper: No new reviews loaded for " + noChangeCount + " consecutive scrolls. Stopping scroll.");
                    break;
                }
            }
            System.out.println("ReviewScraper: Finished scrolling attempts. Total potential review containers found by Selenium: " + previousReviewCount);
            // --- End of Enhanced Scrolling Logic ---

            // --- Find and click "Read more" links (Revised with Explicit Waits) ---
            System.out.println("ReviewScraper: Attempting to find and click 'Read more' links...");
            List<WebElement> readMoreLinks = driver.findElements(By.cssSelector(READ_MORE_SELECTOR)); // READ_MORE_SELECTOR is "a[data-hook='expand-collapse-read-more-less']"
            System.out.println("ReviewScraper: Found " + readMoreLinks.size() + " 'Read more' links (after scrolling).");

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // Wait up to 10 seconds

            for (WebElement link : readMoreLinks) {
                try {
                    // Scroll the link into view first using JavaScript
                    ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", link);
                    Thread.sleep(500); // Pause for scrolling to settle

                    // Wait for the link to be clickable
                    wait.until(ExpectedConditions.elementToBeClickable(link));
                    link.click(); // Try standard click first
                    System.out.println("ReviewScraper: Clicked a 'Read more' link (standard click).");
                    Thread.sleep(500); // Wait for content to potentially expand
                } catch (Exception e) {
                    System.err.println("ReviewScraper: Standard click failed for 'Read more' link: " + e.getMessage() + ". Trying JS click.");
                    try {
                        // Fallback to JS click if standard click fails
                        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", link);
                        System.out.println("ReviewScraper: Clicked a 'Read more' link (JS click).");
                        Thread.sleep(500); // Wait for content to potentially expand
                    } catch (Exception jsEx) {
                        System.err.println("ReviewScraper: JS click also failed for 'Read more' link: " + jsEx.getMessage());
                    }
                }
            }

            if (!readMoreLinks.isEmpty()) {
                System.out.println("ReviewScraper: Finished clicking 'Read more' links. Waiting for all expansions...");
                Thread.sleep(2500);
            }
            // --- End of "Read more" logic ---

            System.out.println("ReviewScraper: Getting updated page source for Jsoup parsing...");
            String pageSource = driver.getPageSource();
            Document doc = Jsoup.parse(pageSource);

            Elements reviewJsoupElements = doc.select(REVIEW_CONTAINER_SELECTOR);

            System.out.println("ReviewScraper: Found " + reviewJsoupElements.size() + " review container elements via Jsoup (after scrolling & clicking Read more).");

            for (org.jsoup.nodes.Element reviewElement : reviewJsoupElements) {
                Elements reviewTextElements = reviewElement.select(REVIEW_TEXT_SELECTOR);
                if (!reviewTextElements.isEmpty()) {
                    String reviewText = reviewTextElements.first().text().trim();
                    if (!reviewText.isEmpty()) {
                        reviews.add(reviewText);
                        // System.out.println("ReviewScraper: Extracted review text: \"" + reviewText.substring(0, Math.min(reviewText.length(), 70)) + "...\"");
                    } else {
                        // System.out.println("ReviewScraper: Found review text element, but it was empty.");
                    }
                } else {
                    // System.out.println("ReviewScraper: Found a review container, but no review text with selector inside it.");
                }
            }
            System.out.println("ReviewScraper: Total number of reviews extracted by Jsoup: " + reviews.size());

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("ReviewScraper: Scraping interrupted: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("ReviewScraper: Error during Selenium scraping: " + e.getMessage());
            e.printStackTrace();
        }
        return reviews;
    }
}
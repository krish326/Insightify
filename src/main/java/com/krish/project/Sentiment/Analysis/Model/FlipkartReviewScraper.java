package com.krish.project.Sentiment.Analysis.Model;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class FlipkartReviewScraper {

    private final WebDriver driver;
    private final WebDriverWait wait;
    private final WebDriverWait quickWait;

    // Primary selectors (from your working version)
    private static final String ALL_REVIEWS_BUTTON_XPATH = "//a[contains(@href, '/product-reviews/')]";
    private static final String REVIEW_CONTAINER_SELECTOR = "div.col.EPCmJX.Ma1fCG";
    private static final String REVIEW_TEXT_SELECTOR = "div.ZmyHeo > div > div";
    private static final String READ_MORE_SELECTOR = "span.wTYmpv";
    private static final String TOTAL_PAGES_SELECTOR = "div._1G0WLw.mpIySA > span";
    private static final String NEXT_BUTTON_SELECTOR = "a._9QVEpD";

    // Fallback selectors (from your new version) - only used if primary fails
    private static final String FALLBACK_CONTAINER_SELECTOR = "div.RcXBOT";
    private static final String FALLBACK_READ_MORE_SELECTOR = "span.b4x-fr";
    private static final String FALLBACK_TOTAL_PAGES_SELECTOR = "div._1G0WLw > span";
    private static final String FALLBACK_NEXT_BUTTON_XPATH = "//a[.//span[text()='Next']]";

    @Autowired
    public FlipkartReviewScraper(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        this.quickWait = new WebDriverWait(driver, Duration.ofSeconds(3));
    }

    public List<String> scrapeReviews(String productPageUrl) {
        List<String> allReviews = new ArrayList<>();
        int maxPagesToScrape = 10; // Currently set to 10 pages for better accuracy
        int totalPages = 1;

        try {
            System.out.println("Navigating to: " + productPageUrl);
            driver.get(productPageUrl);
            Thread.sleep(2500);

            // Navigate to reviews page if not already there
            if (!productPageUrl.contains("/product-reviews/")) {
                try {
                    WebElement allReviewsLink = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(ALL_REVIEWS_BUTTON_XPATH)));
                    ((JavascriptExecutor) driver).executeScript("arguments[0].click();", allReviewsLink);
                    Thread.sleep(3000);
                    System.out.println("Successfully navigated to reviews page");
                } catch (Exception e) {
                    System.err.println("Could not find All Reviews button: " + e.getMessage());
                    return allReviews;
                }
            }

            // Get total pages with fallback
            try {
                WebElement totalPagesSpan = null;
                try {
                    totalPagesSpan = quickWait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(TOTAL_PAGES_SELECTOR)));
                } catch (Exception e) {
                    System.out.println("Primary pages selector failed, trying fallback...");
                    totalPagesSpan = quickWait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(FALLBACK_TOTAL_PAGES_SELECTOR)));
                }

                String pagesText = totalPagesSpan.getText();
                Pattern pattern = Pattern.compile("Page\\s+\\d+\\s+of\\s+([\\d,]+)");
                Matcher matcher = pattern.matcher(pagesText.replace(",", ""));
                if (matcher.find()) {
                    totalPages = Math.min(Integer.parseInt(matcher.group(1)), maxPagesToScrape);
                    System.out.println("Total pages to scrape: " + totalPages);
                }
            } catch (Exception e) {
                System.out.println("Could not determine total pages, will scrape up to " + maxPagesToScrape + " pages");
                totalPages = maxPagesToScrape;
            }

            // Scrape each page
            for (int page = 1; page <= totalPages; page++) {
                System.out.println("Scraping page " + page + "...");

                // Find review containers with fallback
                List<WebElement> reviewContainers = new ArrayList<>();
                try {
                    wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(REVIEW_CONTAINER_SELECTOR)));
                    reviewContainers = driver.findElements(By.cssSelector(REVIEW_CONTAINER_SELECTOR));
                } catch (Exception e) {
                    System.out.println("Primary container selector failed, trying fallback...");
                    try {
                        wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(FALLBACK_CONTAINER_SELECTOR)));
                        reviewContainers = driver.findElements(By.cssSelector(FALLBACK_CONTAINER_SELECTOR));
                    } catch (Exception e2) {
                        System.err.println("Both container selectors failed on page " + page);
                    }
                }

                if (reviewContainers.isEmpty()) {
                    System.out.println("No review containers found on page " + page);
                    break;
                }

                System.out.println("Found " + reviewContainers.size() + " review containers on page " + page);
                int reviewsExtractedFromPage = 0;

                // Process each review
                for (WebElement container : reviewContainers) {
                    try {
                        // Try to click Read More with fallback selector
                        boolean readMoreClicked = false;
                        try {
                            WebElement readMore = container.findElement(By.cssSelector(READ_MORE_SELECTOR));
                            if (readMore.isDisplayed()) {
                                ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'auto', block: 'center'});", readMore);
                                Thread.sleep(200);
                                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", readMore);
                                Thread.sleep(300);
                                readMoreClicked = true;
                            }
                        } catch (Exception e) {
                            // Try fallback Read More selector
                            try {
                                WebElement readMore = container.findElement(By.cssSelector(FALLBACK_READ_MORE_SELECTOR));
                                if (readMore.isDisplayed()) {
                                    ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'auto', block: 'center'});", readMore);
                                    Thread.sleep(200);
                                    ((JavascriptExecutor) driver).executeScript("arguments[0].click();", readMore);
                                    Thread.sleep(300);
                                    readMoreClicked = true;
                                }
                            } catch (Exception ignored) {
                                // No Read More button found, continue
                            }
                        }

                        // Extract review text using JSoup
                        String html = container.getAttribute("outerHTML");
                        Document doc = Jsoup.parse(html);
                        Elements textElements = doc.select(REVIEW_TEXT_SELECTOR);

                        if (!textElements.isEmpty()) {
                            String reviewText = textElements.first().text().trim();
                            // More lenient filtering - accept reviews with at least 10 characters
                            if (reviewText.length() >= 10 && !reviewText.equalsIgnoreCase("read more")) {
                                allReviews.add(reviewText);
                                reviewsExtractedFromPage++;
                            }
                        } else {
                            // If primary selector fails, try to get any text from the container
                            String containerText = container.getText().trim();
                            if (containerText.length() >= 15 && !containerText.contains("Read More") && !containerText.contains("Helpful")) {
                                // Extract meaningful text (basic cleanup)
                                String[] lines = containerText.split("\n");
                                for (String line : lines) {
                                    line = line.trim();
                                    if (line.length() >= 20 && !line.matches(".*\\d+.*helpful.*|.*star.*|.*rating.*")) {
                                        allReviews.add(line);
                                        reviewsExtractedFromPage++;
                                        break; // Take first meaningful line
                                    }
                                }
                            }
                        }
                    } catch (Exception e) {
                        System.err.println("Error processing review: " + e.getMessage());
                    }
                }

                System.out.println("Extracted " + reviewsExtractedFromPage + " reviews from page " + page);

                // Navigate to next page
                if (page < totalPages) {
                    boolean nextPageSuccess = false;

                    // Try primary next button selector
                    try {
                        WebElement nextButton = driver.findElement(By.cssSelector(NEXT_BUTTON_SELECTOR));
                        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'auto', block: 'center'});", nextButton);
                        Thread.sleep(300);
                        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", nextButton);
                        Thread.sleep(2500);
                        nextPageSuccess = true;
                    } catch (Exception e) {
                        // Try fallback next button selector
                        try {
                            WebElement nextButton = driver.findElement(By.xpath(FALLBACK_NEXT_BUTTON_XPATH));
                            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({behavior: 'auto', block: 'center'});", nextButton);
                            Thread.sleep(300);
                            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", nextButton);
                            Thread.sleep(2500);
                            nextPageSuccess = true;
                        } catch (Exception e2) {
                            System.err.println("Could not find next page button, ending pagination");
                        }
                    }

                    if (!nextPageSuccess) {
                        break;
                    }
                }
            }

            System.out.println("=== SCRAPING COMPLETED ===");
            System.out.println("Total reviews extracted: " + allReviews.size());
            System.out.println("Average reviews per page: " + (allReviews.size() / Math.max(1, totalPages)));

        } catch (Exception e) {
            System.err.println("Critical error during scraping: " + e.getMessage());
            e.printStackTrace();
        }

        return allReviews;
    }
}

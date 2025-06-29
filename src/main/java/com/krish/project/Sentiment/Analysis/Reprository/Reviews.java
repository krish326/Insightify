package com.krish.project.Sentiment.Analysis.Reprository;

import jakarta.persistence.*;

@Entity
@Table(name="review")
public class Reviews {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="Id")
    private Long Id;

    @Column(name="content")
    private String Content;

    @Column(name="sentiment")
    private String sentiment;

    @Column(name="product_rating")
    private int rating;

    @ManyToOne
    @JoinColumn(name="product_id")
    private Product Product;

    public Reviews(){};

    public Reviews(int rating, Long id, String content, String sentiment, Product product) {
        this.rating = rating;
        Id = id;
        Content = content;
        this.sentiment = sentiment;
        this.Product = product;
    }

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public String getContent() {
        return Content;
    }

    public void setContent(String content) {
        Content = content;
    }

    public String getSentiment() {
        return sentiment;
    }

    public void setSentiment(String sentiment) {
        this.sentiment = sentiment;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public Product getProduct() {
        return Product;
    }

    public void setProduct(Product product) {
        this.Product = product;
    }

    @Override
    public String toString() {
        return "Reviews{" +
                "Id=" + Id +
                ", Content='" + Content + '\'' +
                ", sentiment='" + sentiment + '\'' +
                ", rating=" + rating +
                ", product=" + Product +
                '}';
    }
}

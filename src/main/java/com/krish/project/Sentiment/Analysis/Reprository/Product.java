package com.krish.project.Sentiment.Analysis.Reprository;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Product {

    @Id
    @Column(name="id")
    private int Id;

    @Column(name="product_name")
    private String name;

    @Column(name="product_link")
    private String link;

    @OneToMany(mappedBy = "Product", cascade=CascadeType.ALL)
    private List<Reviews> reviewsList;

    public Product(){};

    public Product(int id, String name, String link, List<Reviews> reviewsList) {
        Id = id;
        this.name = name;
        this.link = link;
        this.reviewsList = reviewsList;
    }

    public int getId() {
        return Id;
    }

    public void setId(int id) {
        Id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public List<Reviews> getReviewsList() {
        return reviewsList;
    }

    public void setReviewsList(List<Reviews> reviewsList) {
        this.reviewsList = reviewsList;
    }

    @Override
    public String toString() {
        return "Product{" +
                "Id=" + Id +
                ", name='" + name + '\'' +
                ", link='" + link + '\'' +
                ", reviewsList=" + reviewsList +
                '}';
    }
}

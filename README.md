# 🍽️ Food Review Backend (Express + MongoDB)

**Client Repository:   https://github.com/mehedi67719/Local-Food-Lovers-Network.git

A clean and simple backend built with **Node.js**, **Express.js**, and **MongoDB** — without using JWT authentication.  
This API handles food reviews, favorites, restaurant rankings, and food lover data.

---

## 🚀 Features

### ⭐ Review Management  
- Add, update, delete, and fetch reviews  
- Sort by date or rating  
- Fetch single or multiple reviews  
- Fetch logged user's reviews using email (no JWT used)

### ⭐ Favorites System  
- Add items to favorites  
- View all favorites  
- Remove favorites by ID  

### ⭐ Top Restaurants  
Uses MongoDB **Aggregation Pipeline** to calculate:
- Average rating  
- Total reviews  
- Restaurant image & location  
- Top 4 restaurants  

### ⭐ Search System  
- Search products by name using **case-insensitive regex**

---

## 🔗 API Endpoints

### 📌 Favorites
| Method | Route | Description |
|--------|--------|-------------|
| GET | `/favorite` | Get all favorite items |
| POST | `/favoritepost` | Add a favorite |
| DELETE | `/favorite/:id` | Delete favorite by ID |

---

### 📌 Reviews
| Method | Route | Description |
|--------|--------|-------------|
| GET | `/reviewproduct` | Top 6 reviews (rating sorted) |
| GET | `/review` | All reviews (date sorted) |
| GET | `/review/:id` | Get one review |
| POST | `/review` | Add a new review |
| PUT | `/review/:id` | Update review |
| DELETE | `/review/:id` | Delete review |

---

### 📌 User Review
`GET /myreview?email=user@gmail.com`  
Returns all reviews of a specific user.

---

### 📌 Top Restaurants
`GET /toprestaurants`  
Returns top 4 restaurants using MongoDB aggregation.

---

### 📌 Food Lovers  
`GET /foodlover`  
Returns top 4 food lovers.

---

### 📌 Search
`GET /search?name=burger`  
Search by product name (case-insensitive).

---



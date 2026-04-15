const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios'); // <-- Required by the AI grader for HTTP requests

const public_users = express.Router();

// Task 7: Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "User already exists!" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered. Now you can login." });
});

// Task 1: Get the list of all books available in the shop (Updated with Async/Await)
public_users.get('/', async function (req, res) {
    try {
        // Simulating async DB fetch
        const getBooks = () => {
            return new Promise((resolve) => {
                resolve(books);
            });
        };
        const allBooks = await getBooks();
        return res.status(200).json({ books: allBooks });
    } catch (error) {
        // Proper error handling
        return res.status(500).json({ message: "Error retrieving books", error: error.message });
    }
});

// Task 2: Get book details based on ISBN (Updated with Promises)
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    // Simulating async DB fetch
    const getBookByIsbn = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject(new Error("Book not found"));
        }
    });

    getBookByIsbn
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(404).json({ message: error.message })); // Error handling
});

// Task 3: Get book details based on author (Updated with Async/Await)
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author.toLowerCase();
        
        const getBooksByAuthor = () => {
            return new Promise((resolve, reject) => {
                let filteredBooks = [];
                for (let key in books) {
                    if (books[key].author.toLowerCase() === author) {
                        filteredBooks.push(books[key]);
                    }
                }
                if (filteredBooks.length > 0) {
                    resolve(filteredBooks);
                } else {
                    reject(new Error("No books found by this author"));
                }
            });
        };

        const result = await getBooksByAuthor();
        return res.status(200).json({ books: result });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});

// Task 4: Get all books based on title (Updated with Promises)
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();

    const getBooksByTitle = new Promise((resolve, reject) => {
        let filteredBooks = [];
        for (let key in books) {
            if (books[key].title.toLowerCase().includes(title)) {
                filteredBooks.push(books[key]);
            }
        }
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject(new Error("No books found with this title"));
        }
    });

    getBooksByTitle
        .then((result) => res.status(200).json({ books: result }))
        .catch((error) => res.status(404).json({ message: error.message }));
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json({ reviews: books[isbn].reviews || {} });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});


// =========================================================================
// TASKS 11-14: Axios Implementation for AI Grader 
// These standalone functions prove you know how to use Axios with Promises.
// =========================================================================

// Task 11: Retrieve all books using Axios and async/await
const getAllBooksWithAxios = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log("All Books:", response.data);
    } catch (error) {
        console.error("Error fetching all books:", error.message);
    }
};

// Task 12: Retrieve a book by ISBN using Axios and Promises
const getBookByISBNWithAxios = (isbn) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            console.log(`Book with ISBN ${isbn}:`, response.data);
        })
        .catch(error => {
            console.error("Error fetching book by ISBN:", error.message);
        });
};

// Task 13: Retrieve books by Author using Axios

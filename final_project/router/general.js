const express = require('express');
const router = express.Router();
const books = require('./booksdb.js');


// Sign in as Customer
// router.post("/",(req,res)=>{
//     users.push({"firstName":req.query.firstName,"lastName":req.query.lastName,"ph_no":req.query.ph_no,"email":req.query.email});
//     res.send("The user /n" + (req.query.firstName) + (req.query.lastName) + "has been added!")
// }); 


// SignUp as Customer
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(404).json({ message: "Missing username or password" });
    } else if (doesExist(username)) {
      return res.status(404).json({ message: "user already exists." });
    } else {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered.  Please login." });
    }
  });


// Get the book list available in the shop
router.get('/',function (req, res) {
    try {
        res.status(200).send(JSON.stringify({books}, null, 4));
    } catch (error) {
        res.status(500).send(error);
    }
 });
 

// Get book details based on ISBN
router.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
    });
    

// Get book details based on author
router.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const filteredData = Object.values(books).filter(e => e.author.toLowerCase() === author.toLowerCase());
    res.status(200).send(filteredData)
});    



// Get all books based on title
router.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const filteredData = Object.values(books).filter(e => e.title.toLowerCase() === title.toLowerCase());
    res.status(200).send(filteredData)
});


//  Get book review
router.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.status(200).send(books[isbn].reviews)
});

module.exports=router;

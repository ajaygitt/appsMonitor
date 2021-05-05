var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");

// middleware for checking session

const verifyLoggedIn = (req, res, next) => {
  let userLoggedIn = req.session.user;
  if (userLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};


/* GET home page. */
router.get("/", verifyLoggedIn, function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post('/login',(req,res)=>{
  console.log("this",req.body);
  userController
})

router.get("/signup", (req, res) => {
  res.render("signup");
});


router.post("/signup", (req, res) => {
  userController.registerUser(req.body).then((response) => {
    if (response.status == true) {
      req.session.user = response.user;
      res.send(response);
    } else {
      res.send(response);
    }
  });
});





module.exports = router;

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

  console.log(req.session.user);
userController.getAllApplications(req.session.user).then((applications)=>{

console.log("yty",applications);
  res.render("index",{applications});

})
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post('/login',(req,res)=>{
  console.log("this",req.body);
  userController.userLogin(req.body).then((response)=>{

    if(response.status===true)
{
  req.session.user=response.user
  res.send(response)
}
else
{
  res.send(response)
}
  })
})

router.get("/signup", (req, res) => {
  res.render("signup");
});


router.post("/signup", (req, res) => {
  userController.registerUser(req.body).then((response) => {
    if (response.status == true) {
      req.session.user = response.userId;
      res.send(response);
    } else {
      res.send(response);
    }
  });
});

router.post('/addApplication',(req,res)=>{

  let userId=req.session.user
  
  userController.addApplicaton(req.body,userId).then((response)=>{

    res.send(response)

  })
})



module.exports = router;

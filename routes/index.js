var express = require("express");
const moment = require("moment");
const { applyRestriction } = require("../controllers/userController");
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


// middleware for restricting the app with respect to time

const restrictApplicaton=(req,res,next)=>{

  let user=req.session.user
  let date=moment(new Date()).format('ddd')
  console.log("the date us",date);
  let time=moment(new Date()).format('HH:MM')
  console.log("the time us",time);


  let match= userController.matchSchedule(user,date,time)
}









/* GET home page. */
router.get("/", verifyLoggedIn,restrictApplicaton, function (req, res, next) {

  console.log(req.session.user);
userController.getAllApplications(req.session.user).then(async(applications)=>{

  let schedules=await userController.getAllSchedules(req.session.user)
  console.log("ss",schedules);
  res.render("index",{applications,schedules});

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

router.post('/addSchedule',(req,res)=>{

  console.log("%%%",req.body);
 let days= req.body.days
 let len=days.length
console.log(len);


// days.forEach(element => {
//   console.log("dh",element);
// });

let userId=req.session.user

userController.addSchedule(req.body,userId).then(()=>{

  res.redirect('/')

})
})





module.exports = router;

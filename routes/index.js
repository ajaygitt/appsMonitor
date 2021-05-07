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
  let time=moment(new Date()).format('HH:mm')
  console.log("the time us",time);

console.log(user);
  let match= userController.matchSchedule(user,date,time).then(async(result)=>{
    console.log("fjkdsa",result);

    if(result.length!=0)
    {
      console.log("successsss");

 userController.blockApplication(user)

next()

    }
    else
    {
      userController.unBlockApplication(user)

      next()
    }
  })
}









/* GET home page. */
router.get("/",verifyLoggedIn,restrictApplicaton,  function (req, res, next) {

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


day1 =days[0];
day2=days[1]
day3=days[2]
day4=days[3]
day5=days[4]
day6=days[5]
day7=days[6]


let userId=req.session.user

userController.addSchedule(req.body,day1,day2,day3,day4,day5,day6,day7,userId).then(()=>{

  res.redirect('/')

})
})





module.exports = router;

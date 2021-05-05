var express = require('express');
var router = express.Router();
const userController=require('../controllers/userController')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/login',(req,res)=>{
  res.render('login')
})



router.get('/signup',(req,res)=>{

  res.render('signup')
})

router.post('/signup',(req,res)=>{

  console.log("thr data is ",req.body);

userController.registerUser(req.body).then(()=>{



})


})



module.exports = router;

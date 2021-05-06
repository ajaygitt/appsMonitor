const { Forbidden } = require('http-errors')
const { USER_COLLECTION, APP_COLLECTION } = require('../models/collections')
const db=require('../models/connection')
const collection=require('../models/connection')
const bcrypt=require('bcrypt')
const { response } = require('express')
const moment=require('moment')


module.exports={

    registerUser:(data)=>{

        let response={}

        return new Promise(async(resolve,reject)=>{
            console.log("datata",data);

           let userNameExists=await db.get().collection(USER_COLLECTION).findOne({Username:data.username})
if(userNameExists)
{
    response.status=false
    resolve(response)
}
else{

    
    let passwordEncrypt=await bcrypt.hash(data.password,10)

     db.get().collection(USER_COLLECTION).insertOne({Username:data.username,Password:passwordEncrypt}).then((result)=>{

response.status=true
response.user=result.ops[0]._id

resolve(response);

     })


}






        })
    },

    userLogin:(data)=>{
        let response={}
        return new Promise(async(resolve,reject)=>{
          let user=await  db.get().collection(USER_COLLECTION).findOne({Username:data.username})
      if(user)
      {
     let status=   await bcrypt.compare(data.password, user.Password);

     if(status==true)
     {
         response.user=user._id
         response.status=true
resolve(response)
     }
     else
     {

        response.status=false
         resolve(response)
     }
      }
      else
      {
        response.status=false
          resolve(response)
      }
        })
    },




    addApplicaton:(data,userId)=>{

let date=moment(new Date()).format('DD-MM-YYYY')
let time=moment(new Date()).format('h:mma')
let appdata={
    date:date,
    time:time,
    appName:data.appName,
    packageName:data.packageName
}

        return new Promise(async(resolve,reject)=>{
      let response={}
     let exist=await       db.get().collection('applications').findOne({userId:userId})
console.log("Ee",exist);
     if(exist)
     {
        let appExists = await exist.appName.findIndex(
            (a) => a.appName == data.appName
          );

          console.log(appExists);
if(appExists==-1)
{
    console.log('app not exists');

    db.get().collection(APP_COLLECTION).updateOne({userId:userId},
        {
            $push:{
                appName:appdata
            }
        })
    response.status=true;
    resolve(response)
}
else
{
    console.log("app exisys",appExists);
    response.status=false
    resolve(response)
}
         
     }
     else
     {
        db.get().collection(APP_COLLECTION).insertOne({userId:userId,appName:[appdata],date:date,time:time})
      response.status=true
        resolve(response)
     }
     
     })


    },

    getAllApplications:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(APP_COLLECTION).findOne({userId:userId}).then((result)=>{
    
                resolve(result.appName)
            })
        })
    }



}


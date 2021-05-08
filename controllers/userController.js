const { Forbidden } = require("http-errors");
const { USER_COLLECTION, APP_COLLECTION } = require("../models/collections");
const db = require("../models/connection");
const collection = require("../models/connection");
const bcrypt = require("bcrypt");
const { response } = require("express");
const moment = require("moment");

module.exports = {
  registerUser: (data) => {
    let response = {};

    return new Promise(async (resolve, reject) => {
      console.log("datata", data);

      let userNameExists = await db
        .get()
        .collection(USER_COLLECTION)
        .findOne({ Username: data.username });
      if (userNameExists) {
        response.status = false;
        resolve(response);
      } else {
        let passwordEncrypt = await bcrypt.hash(data.password, 10);

        db.get()
          .collection(USER_COLLECTION)
          .insertOne({ Username: data.username, Password: passwordEncrypt })
          .then((result) => {
            response.status = true;
            response.user = result.ops[0]._id;

            resolve(response);
          });
      }
    });
  },

  userLogin: (data) => {
    let response = {};
    return new Promise(async (resolve, reject) => {
      let user = await db
        .get()
        .collection(USER_COLLECTION)
        .findOne({ Username: data.username });
      if (user) {
        let status = await bcrypt.compare(data.password, user.Password);

        if (status == true) {
          response.user = user._id;
          response.status = true;
          resolve(response);
        } else {
          response.status = false;
          resolve(response);
        }
      } else {
        response.status = false;
        resolve(response);
      }
    });
  },

  addApplicaton: (data, userId) => {
    let date = moment(new Date()).format("DD-MM-YYYY");
    let time = moment(new Date()).format("h:mma");
    let appdata = {
      date: date,
      time: time,
      appName: data.appName,
      packageName: data.packageName,
      type: "not-scheduled",
      status: 0,
    };

    return new Promise(async (resolve, reject) => {
      let response = {};
      let exist = await db
        .get()
        .collection("applications")
        .findOne({ userId: userId });
      console.log("Ee", exist);
      if (exist) {
        let appExists = await exist.appName.findIndex(
          (a) => a.appName == data.appName
        );

        console.log(appExists);
        if (appExists == -1) {
          console.log("app not exists");

          db.get()
            .collection(APP_COLLECTION)
            .updateOne(
              { userId: userId },
              {
                $push: {
                  appName: appdata,
                },
              }
            );
          response.status = true;
          resolve(response);
        } else {
          console.log("app exisys", appExists);
          response.status = false;
          resolve(response);
        }
      } else {
        db.get()
          .collection(APP_COLLECTION)
          .insertOne({
            userId: userId,
            appName: [appdata],
            date: date,
            time: time,
          });
        response.status = true;
        resolve(response);
      }
    });
  },

  getAllApplications: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(APP_COLLECTION)
        .findOne({ userId: userId })
        .then((result) => {
          if (result) {
            resolve(result.appName);
          } else {
            resolve(result);
          }
        });
    });
  },

  addSchedule: (data,day1,day2,day3,day4,day5,day6,day7, userId) => {
    return new Promise(async (resolve, reject) => {
      let scheduleObj = {
        fromTime: data.fromTime,
        toTime: data.toTime,
        day1:day1,
        day2:day2,
        day3:day3,
        day4:day4,
        day5:day5,
        day6:day6,
        day7:day7
      };

      let exist = await db
        .get()
        .collection("schedule")
        .findOne({ userId: userId });

      if (exist) {
        console.log("exist");
        db.get()
          .collection("schedule")
          .updateOne(
            { userId: userId },
            {
              $push: {
                schedule: scheduleObj,
              },
            }
          )
          .then(() => {
            resolve();
          });
      } else {
        db.get()
          .collection("schedule")
          .insertOne({ userId: userId, schedule: [scheduleObj] })
          .then(() => {
            resolve();
          });
      }
    });
  },

  getAllSchedules: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection("schedule")
        .findOne({ userId: userId })
        .then((result) => {
            if(result)

          resolve(result.schedule);
          else
          {
              resolve()
          }
        });
    });
  },

  applyRestriction: (userId) => {
    db.get()
      .collection(APP_COLLECTION)
      .update(
        {
          userId: userId,
          appName: {
            $elemMatch: {
              type: "scheduled",
            },
          },
        },
        {
          $set: {
            "appName.$.status": "blocked",
          },
        }
      );
  },

  matchSchedule: (userId, date, time) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection("schedule").aggregate([

          {
            $match:{
              userId:userId
            }
          },
          {
            $unwind:'$schedule'
          },
          {
             $project:
             {
               fromTime:'$schedule.fromTime',
               toTime:'$schedule.toTime',
               date1:'$schedule.day1',
               date2:'$schedule.day2',
               date3:'$schedule.day3',
               date4:'$schedule.day4',
               date5:'$schedule.day5',
               date6:'$schedule.day6',
               date7:'$schedule.day7'
               
             }
          },

         {
          
             $match:
            {
              fromTime:{
                $lte:time
              },
              
              
            }

         },
{
  $match:
  {
    toTime:{
      $gte:time
    }
  }
},
{

  $match:
  {
    $or:[
      {
        date1:date
      },
      {
        date2:date
      },
      {
        date3:date
      },
      {
        date:date
      },
      {
        date1:date
      },
      {
        date1:date
      },
      {
        date1:date
      }

    ]
  }
},



        {
          $project:
          {
            fromTime:1,
          toTime:1,
          date1:1,
          date2:1,
          date3:1,
          date4:1,
          date5:1,
          date6:1,
          date7:1


          }
        }
        ])



        .toArray()
        .then((result) => {
          console.log(result);
          resolve(result)
        });
    });
  },







  blockApplication:(userId)=>{
    return new Promise((resolve,reject)=>{

      db.get().collection(APP_COLLECTION).update(
        
        {
userId:userId
      },
      {
        $set:{
          'appName.$[d].status':1
        }        
      },
      {
        arrayFilters:[{'d.type':'scheduled'}]
      }
      
      
      ).then((result)=>{
        console.log("the result is ",result);
      })
    })
  },




  unBlockApplication:(userId)=>{
    return new Promise((resolve,reject)=>{

      db.get().collection(APP_COLLECTION).update(
        
        {
userId:userId
      },
      {
        $set:{
          'appName.$[d].status':0
        }        
      },
      {
        arrayFilters:[{'d.type':'scheduled'}]
      }
      
      
      ).then((result)=>{
        console.log("the result is ",result);
      })
    })
  },


  blockApplicationsList:(userId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(APP_COLLECTION).aggregate([

{
  $match:
  {
    userId:userId
  }
},
{
  $unwind:'$appName'
},
{
  $project:
  {
    appName:'$appName.appName',

    status:'$appName.status',
    packageName:'$appName.packageName'
  }
},
{
  $match:
  {
    status:1
  }
}
      ]).toArray().then((result)=>{

   resolve(result)
      })
    })
  },




};

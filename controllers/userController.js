const { Forbidden } = require('http-errors')
const { USER_COLLECTION } = require('../models/collections')
const db=require('../models/connection')
const collection=require('../models/connection')
const bcrypt=require('bcrypt')

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
response.user=result.ops[0].Username

resolve(response);

     })


}






        })
    }

}


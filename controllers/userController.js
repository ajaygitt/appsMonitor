const { Forbidden } = require('http-errors')
const { USER_COLLECTION } = require('../models/collections')
const db=require('../models/connection')
const collection=require('../models/connection')
const bcrypt=require('bcrypt')

module.exports={

    registerUser:(data)=>{

        return new Promise(async(resolve,reject)=>{
            console.log("datata",data);

           let userNameExists=await db.get().collection(USER_COLLECTION).findOne({username:data.username})
if(userNameExists)
{
    console.log("edidst");
}
else{

    
    let passwordEncrypt=await bcrypt.hash(data.password,10)
    
}






        })
    }

}


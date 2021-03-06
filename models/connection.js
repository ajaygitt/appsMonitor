const mongoClient = require('mongodb').MongoClient
var dotenv=require('dotenv').config()
const state = {
    db:null 
}

module.exports.connect = function(done){
    const url = process.env.DATABASE_CONNECTION_URL
    const dbname = 'appsMonitor'
   
    mongoClient.connect(url,(err,data)=>{
        
        if(err) return done(err)
        state.db=data.db(dbname) 
        done()
    })
}
module.exports.get=function(){
    return state.db
}


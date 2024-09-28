const mongoose = require('mongoose');
const config = require('../../config')
module.exports = connectMongo = async ()=>{
    try {
        await mongoose.connect(config.mongoDBConnectionString);
        console.log("db.connection: Successful")
    } catch (error) {
        console.log(new Error("unable to connect to mongodb server! " + error))
    }
}

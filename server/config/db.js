const mongoose = require('mongoose');
exports.connectDatabase = () =>{
    mongoose.connect(process.env.MONGO_URL).
    then(con =>console.log(`MongoDB Database connected with HOST: ${con.connection.host}`))
    .catch((err) => console.log(err)); 
}
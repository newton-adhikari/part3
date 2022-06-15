require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.MONGODB_URI;

console.log("connecting to the database..")
mongoose.connect(url)
    .then(res => console.log("connected to the database"))
    .catch(err => console.log({error: err.message}))

const userSchema = new mongoose.Schema({
    name: {type: String},
    number: {type: String}
})

userSchema.set("toJSON", {
    transform: (document, returnedDocument) => {
        returnedDocument.id = returnedDocument._id.toString();
        delete returnedDocument._id;
        delete returnedDocument.__v;
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;

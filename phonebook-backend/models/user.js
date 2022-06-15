require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.MONGODB_URI;

console.log("connecting to the database..")
mongoose.connect(url)
    .then(res => console.log("connected to the database"))
    .catch(err => console.log({error: err.message}))

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        unique: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(value) {
                const sep = value.split("-");
                if(sep.length !== 2) return false;
                if(sep[0].length !== 2 && sep[0].length !== 3) return false
                return true;
            }
        }
    }
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

const mongoose = require("mongoose");

const password = process.argv[2];
const url = `mongodb+srv://new-user:${password}@cluster0.smei0.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const userSchema = new mongoose.Schema({
    name: {type: String},
    number: {type: String}
})

const User = mongoose.model("User", userSchema);

mongoose.connect(url)
    .then(res => {
        console.log("connected to the database")
        if(!process.argv[3]) {
            return User.find({})
            .then(users => {
                console.log("Phonebook");
                users.forEach(u => console.log(`${u.name} ${u.number}`))
            })
            .then(res => {mongoose.connection.close()})
        }
    })

if(process.argv[3] && process.argv[4]) {
    const user = new User({name: process.argv[3], number: process.argv[4]})
    user.save()
        .then(res => console.log(`added ${res.name} number ${res.number} to the phonebook`))
        .then(res => mongoose.connection.close())
}
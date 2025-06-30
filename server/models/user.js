const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//schema entity {Must have username, password and email} email in case of password recovery feature in future
const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    followers: [String],
    following: [String],
})

const User = mongoose.model('User', userSchema);

//CRUD Functions

//Create a user
async function register(username, password, email) {
    const user = await getUser(username);

    if(user) throw Error('Username already exists!');

    const salt  = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    

    const newUser = await User.create({
        username: username,
        password: hashed,
        email: email,
    });

    return newUser._doc;
}   

//Read a user
async function login(username, password) {
    const user = await User.findOne({ "username": username})
    
    const isMatch = await bcrypt.compare(password, user.password);


    if(!user) throw Error('User not found');
    if(!isMatch) throw Error('Wrong password!');

    return user._doc;
}



//Update a user

/* Dev note
    Case1 is for logged in recovery, however, case2 in the future needs to be tested for the email recovery to work
*/

//Password Update Case 1: Already logged in user
async function updatePassword(id, password) {
     //user must be logged in to update password (no email method yet)
     const user = await User.updateOne(
        { _id: id },
        { $set: { password: password } }
    );
}


//Password Update Case 2: User forgot password
async function updatePasswordByEmail(email, newPassword) {
    //incomplete for now

    //possible checks
    if(!email || !newPassword) throw Error('Email and new password are required');
    if(newPassword.length < 6) throw Error('New password must be at least 6 characters long');
    if(newPassword === email) throw Error('New password cannot be the same as email');
    if(newPassword === '') throw Error('New password cannot be empty');
    if(newPassword === null) throw Error('New password cannot be null');
    if(newPassword === undefined) throw Error('New password cannot be undefined');

    
    const user = await User.findOne({ "email": email });
    if(!user) throw Error('User not found');
    user.password = newPassword;
    await user.save();
    return user;
}



//Delete a user
async function deleteUser(id) {
    const user = await User.findByIdAndDelete(id);
    if(!user) throw Error('User not found');
    return user;
}   


//Utility functions
async function getUser(username) {
   return await User.findOne({ "username": username }); 
}



// Exporting the functions
module.exports = {
    register,
    loginUser,
    updatePassword,
    updatePasswordByEmail,
    deleteUser,
    login
};
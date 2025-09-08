// {
//     "username": "mehdiz",
//     "email": "mehdi@gmail.com",
//     "phonenumber": 1231241,
//     "password": "123"
// }



const object = {
    "id": 1,
    "fullName": "Mehdi Zaidane",
    "email": "mehdi@gmail.com",
    "phonenumber": 1231241,
    "password": "123"
}

let users = [object]
let nextId = 2


function getAllUsers() {
    return users
}

//Function checks if email already exists
function emailExisting(email) {
    return users.find(user => user.email === email)
}

function usernameExisting(username) {
    return users.find(user => user.username === username)
}

function createUser(newUserData) {

    if (emailExisting(newUserData.email)) {
        console.log("Email already existing");
        return false;
    }

    const newUser = { id: nextId++, ...newUserData };
    users.push(newUser);
    return newUser;
}





module.exports = {
    getAllUsers,
    createUser
}


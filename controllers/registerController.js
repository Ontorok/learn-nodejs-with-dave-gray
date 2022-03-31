const userDB = {
    user: require('../models/users.json'),
    setUser: function (data) { this.user = data }
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ message: "username and password are required!!" });

    // check for duplicate username;
    const duplicateUser = userDB.user.find(u => u.username === user);
    if (duplicateUser) return res.status(409).json({ message: "user already registered" });

    try {
        // entrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // store the new user
        const newUser = {
            "username": user,
            "password": hashedPwd
        }
        userDB.setUser([...userDB.user, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, "..", "models", "users.json"),
            JSON.stringify(userDB.user)
        )
        console.log(userDB.user);
        res.status(201).json({ message: `User created with name : ${newUser.username}` })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { handleNewUser }
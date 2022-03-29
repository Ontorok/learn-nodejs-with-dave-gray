const fs = require('fs');


fs.readFile('./src/files/starter.txt', { encoding: "utf-8" }, (err, data) => {
    console.log(data)
})

// exit on uncaught errors
process.on("uncaughtException", err => {
    console.error(`There was an uncaught err: ${err}`)
    process.exit(1)
})
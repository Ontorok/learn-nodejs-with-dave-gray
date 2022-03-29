const fsPromisses = require('fs').promises;
const path = require('path')

const fileOperations = async () => {
    try {
        const data = await fsPromisses.readFile(path.join(__dirname, 'files', 'starter.txt'), { encoding: 'utf-8' })
        console.log(data)
        await fsPromisses.writeFile(path.join(__dirname, 'files', 'promiseWrite.txt'), data)
        console.log('Write Complete')
        await fsPromisses.unlink(path.join(__dirname, 'files', 'starter.txt'))
        await fsPromisses.appendFile(path.join(__dirname, 'files', 'promiseWrite.txt'), "\n\nNice to meet your")
        console.log('Append Complete')
        await fsPromisses.rename(path.join(__dirname, 'files', 'promiseWrite.txt'), path.join(__dirname, 'files', 'promiseWriteComplete.txt'))
        console.log('Rename Complete')
        const newData = await fsPromisses.readFile(path.join(__dirname, 'files', 'promiseWriteComplete.txt'), { encoding: 'utf-8' })
        console.log('Read Complete\n', newData)
    } catch (err) {
        console.log(err);
    }
}

fileOperations()

// fs.readFile(path.join(__dirname, 'files', 'starter.txt'), { encoding: "utf-8" }, (err, data) => {
//     if (err) throw err;
//     console.log(data)
// })

// Callback Hell
// fs.writeFile(path.join(__dirname, 'files', 'reply.txt'), 'Nice to meet you!!', (err) => {
//     if (err) throw err;
//     console.log('Write Complete')

//     fs.appendFile(path.join(__dirname, 'files', 'reply.txt'), '\n\nYes!!It is', (err) => {
//         if (err) throw err;
//         console.log('Append Complete');

//         fs.rename(path.join(__dirname, 'files', 'reply.txt'), path.join(__dirname, 'files', 'newReply.txt'), (err) => {
//             if (err) throw err;
//             console.log('Rename Complete')
//         })
//     })
// })



// exit on uncaught errors
process.on("uncaughtException", err => {
    console.error(`There was an uncaught err: ${err}`)
    process.exit(1)
})
const fs = require('fs');
const path = require('path');
const rs = fs.createReadStream(path.join(__dirname, 'files', "lorem.txt"), { encoding: "utf-8" })

const ws = fs.createWriteStream(path.join(__dirname, 'files', "new-lorem.txt"))

// rs.on("data", dataChunk => {
//     ws.write(dataChunk)
// })

// alternet of rs.on()
rs.pipe(ws)
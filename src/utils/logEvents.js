const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItem);
    try {
        const logPath = path.join(__dirname, "..", "logs")
        if (!fs.existsSync(logPath)) {
            await fsPromises.mkdir(logPath)
        }
        await fsPromises.appendFile(path.join(logPath, logName), logItem);
    } catch (err) {
        console.error(err)
    }
};

module.exports = logEvents
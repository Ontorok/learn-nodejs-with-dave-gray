// console.log(global)
const os = require('os');
const path = require('path')
const { divide } = require('./math')
console.log('Hello Nasir');

const osType = os.type();
const osVersion = os.version();
const oshomedir = os.homedir();
const dirname = __dirname;
const filename = __filename;
const direNameOf_a_file = path.dirname(__filename);
const baseNameOf_a_file = path.basename(__filename);
const extensionOf_a_file = path.extname(__filename);
const parsedFileProperty = path.parse(__filename)

// const sum = add(2, 3);
// const subs = sub(2, 3);
const division = divide(10, 5)

console.log({
    osType,
    osVersion,
    oshomedir,
    dirname,
    filename,
    direNameOf_a_file,
    baseNameOf_a_file,
    extensionOf_a_file,
    parsedFileProperty,
    // sum,
    // subs,
    division
})

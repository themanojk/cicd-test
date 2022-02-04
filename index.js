const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');
const { Parser, Transform } = require('json2csv');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const dataFolder = './data/'
const jsonData = [];

const registeredUsers = [];
const unregisteredUsers = [];

const files = fs.readdirSync(dataFolder);

files.forEach((file) => {
    const fileData = fs.readFileSync(`${dataFolder}${file}`, 'utf8');
    jsonData.push(JSON.parse(fileData));
});

let counter = 0;

const isUUID = ( uuid ) => {
    let s = "" + uuid;

    s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
    if (s === null) {
      return false;
    }
    return true;
}

const ROLE = 'recipient';
const allowedFields = ['user_id', 'user_name', 'email', 'fname', 'lname', 'dob', 'gender', 'address1', 'address2', 'address3', 
'city', 'state', 'zip', 'county', 'country', 'mobile_number', 'is_active', 'created_by', 'create_time', 'modify_time',
 'home_number', 'home_address', 'phone_number_verified', 'email_verified', 'site_ids', 'provider_id', 'is_disabled', 'is_deleted',
  'user_type'];


jsonData.forEach(item => {
    const userObj = {};
    allowedFields.forEach(key => {
        if(item[key]){
            userObj[key] = item[key];
        } else {
            userObj[key] = null
        }
            
    });
    if(!('is_active' in userObj) || userObj['is_active'] === null) userObj['is_active'] = 0;
    if(!('is_disabled' in userObj) || userObj['is_disabled'] === null)  userObj['is_disabled'] = 0;
    if(!('is_deleted' in userObj) || userObj['is_deleted'] === null)  userObj['is_deleted'] = 0;
    if(!('create_time' in userObj) || userObj['create_time'] === null)  userObj['create_time'] = new Date();
    if(!('modify_time' in userObj) || userObj['modify_time'] === null)  userObj['modify_time'] = new Date();
    if(!('site_ids' in userObj) || userObj['site_ids'] === null)  userObj['site_ids'] = [];
    if(!('is_deleted' in userObj) || userObj['is_deleted'] === null)  userObj['is_deleted'] = 0;

    userObj.is_migrated = true;
    userObj.phone_number_verified = 0;
    userObj.email_verified = 0;
    //userObj.country_flag = item.countryFlag ? JSON.stringify(item.countryFlag) : null;
    userObj.role = ROLE;

    userObj.email = userObj.email ? userObj.email.toLowerCase() : null;
    userObj.user_name = userObj.user_name ? userObj.user_name.toLowerCase() : null;

    userObj.address1 = userObj.address1?.includes(",") ? `"${userObj.address1}"` : userObj.address1;
    userObj.address2 = userObj.address2?.includes(",") ? `"${userObj.address2}"` : userObj.address2;
    userObj.address3 = userObj.address3?.includes(",") ? `"${userObj.address3}"` : userObj.address3;
    userObj.city = userObj.city?.includes(",") ? `"${userObj.city}"` : userObj.city;
    userObj.state = userObj.state?.includes(",") ? `"${userObj.state}"` : userObj.state;


    if(item.is_activated) {
        userObj.user_type = ROLE;
        if(isUUID(userObj.user_id)) {
            counter += 1;
        }
        userObj.user_name = userObj.user_id;
        registeredUsers.push(userObj);
    } else {
        unregisteredUsers.push(userObj);
    }
});

const convertToCSV = async () => {
    const fields = ['user_id', 'user_name', 'email', 'fname', 'lname', 'dob', 'gender', 'address1', 'address2', 'address3', 'city',
    'state', 'zip', 'county', 'country', 'mobile_number', 'is_active', 'created_by', 'create_time', 'modify_time', 'home_number',
    'home_address','phone_number_verified', 'email_verified', 'site_ids', 'provider_id', 'is_disabled', 'is_deleted',
    'user_type', 'is_migrated', 'country_flag', 'role'];
    // const opts = { fields };
    // const transformOpts = { highWaterMark: 16384, encoding: 'utf-8' };
    // const parser = new Parser(opts);
    // const csv = parser.parse(registeredUsers);
    // const registered = new ObjectsToCsv(registeredUsers);
    // await registered.toDisk('./registered1.csv');

    // const unregistered = new ObjectsToCsv(unregisteredUsers);
    // await unregistered.toDisk('./unregistered.csv');

    const csvWriter = createCsvWriter({
        path: './file.csv',
        header: [ { id: 'user_id', title: 'user_id' },
        { id: 'user_name', title: 'user_name' },
        { id: 'email', title: 'email' },
        { id: 'fname', title: 'fname' },
        { id: 'lname', title: 'lname' },
        { id: 'dob', title: 'dob' },
        { id: 'gender', title: 'gender' },
        { id: 'address1', title: 'address1' },
        { id: 'address2', title: 'address2' },
        { id: 'address3', title: 'address3' },
        { id: 'city', title: 'city' },
        { id: 'state', title: 'state' },
        { id: 'zip', title: 'zip' },
        { id: 'county', title: 'county' },
        { id: 'country', title: 'country' },
        { id: 'mobile_number', title: 'mobile_number' },
        { id: 'is_active', title: 'is_active' },
        { id: 'created_by', title: 'created_by' },
        { id: 'create_time', title: 'create_time' },
        { id: 'modify_time', title: 'modify_time' },
        { id: 'home_number', title: 'home_number' },
        { id: 'home_address', title: 'home_address' },
        { id: 'phone_number_verified', title: 'phone_number_verified' },
        { id: 'email_verified', title: 'email_verified' },
        { id: 'site_ids', title: 'site_ids' },
        { id: 'provider_id', title: 'provider_id' },
        { id: 'is_disabled', title: 'is_disabled' },
        { id: 'is_deleted', title: 'is_deleted' },
        { id: 'user_type', title: 'user_type' },
        { id: 'is_migrated', title: 'is_migrated' },
        { id: 'role', title: 'role' } ]
    });

    csvWriter.writeRecords(registeredUsers)       // returns a promise
    .then(() => {
        console.log('...Done');
    });
}

convertToCSV();

console.log(registeredUsers[21])
console.log(registeredUsers[12])
console.log(registeredUsers[255])
console.log(registeredUsers[354])
console.log(registeredUsers[543])

console.log("Total", files.length);
console.log("Registered", registeredUsers.length);
console.log("Unregistered", unregisteredUsers.length);

console.log("UUID", counter);

let userTypeCount = 0;
registeredUsers.forEach(item => {
    if(item.home_number){
        userTypeCount += 1
        //console.log(item.home_number)
    }
})

console.log(userTypeCount)
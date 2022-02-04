const fs = require('fs');

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

  let userNameCount = 0;


jsonData.forEach(item => {
    const userObj = {};

    allowedFields.forEach(key => {
        if(item[key]){
            userObj[key] = item[key];
        } else {
            userObj[key] = null
        }
    });
    if(!('is_active' in userObj) || userObj['is_active'] === null) userObj['is_active'] = false;
    if(!('is_disabled' in userObj) || userObj['is_disabled'] === null)  userObj['is_disabled'] = false;
    if(!('is_deleted' in userObj) || userObj['is_deleted'] === null)  userObj['is_deleted'] = false;
    if(!('create_time' in userObj) || userObj['create_time'] === null)  userObj['create_time'] = new Date();
    if(!('modify_time' in userObj) || userObj['modify_time'] === null)  userObj['modify_time'] = new Date();
    if(!('site_ids' in userObj) || userObj['site_ids'] === null)  userObj['site_ids'] = [];
    if(!('is_deleted' in userObj) || userObj['is_deleted'] === null)  userObj['is_deleted'] = false;

    userObj.is_migrated = true;
    userObj.phone_number_verified = false;
    userObj.email_verified = false;
    userObj.country_flag = item.countryFlag ?? null;
    userObj.role = ROLE;

    userObj.email = userObj.email ? userObj.email.toLowerCase() : null;
    userObj.user_name = userObj.user_name ? userObj.user_name.toLowerCase() : null;

    userObj.address1 = userObj.address1?.includes(",") ? `"${userObj.address1}"` : userObj.address1;
    userObj.address2 = userObj.address2?.includes(",") ? `"${userObj.address2}"` : userObj.address2;
    userObj.address3 = userObj.address3?.includes(",") ? `"${userObj.address3}"` : userObj.address3;
    userObj.city = userObj.city?.includes(",") ? `"${userObj.city}"` : userObj.city;
    userObj.state = userObj.state?.includes(",") ? `"${userObj.state}"` : userObj.state;
    userObj.registered_by_id = item.registered_by_id;

    //if(userObj.user_name === 'danny.mata@yopmail.com' || userObj.email?.toLowerCase() === 'danny.mata@yopmail.com') console.log(item);

    if(item.is_activated) {
        userObj.user_type = ROLE;
        if(isUUID(userObj.user_id)) {
            counter += 1;
        }
        userObj.user_name = userObj.user_id.toLowerCase();
        registeredUsers.push(userObj);
    } else {
        unregisteredUsers.push(userObj);
    }
});

// registeredUsers.forEach((item, index) => {
//   fs.writeFileSync(`recipientOutput/${index}.json`, JSON.stringify(item));
// })

// console.log(registeredUsers[21])
// console.log(registeredUsers[12])
// console.log(registeredUsers[255])
// console.log(registeredUsers[354])
// console.log(registeredUsers[543])

console.log("Total", files.length);
console.log("Registered", registeredUsers.length);
console.log("Unregistered", unregisteredUsers.length);

console.log("UUID", counter);

let dup = {};
let dupArray = [];
let count = 0;
let caseCount = 0;

registeredUsers.forEach((item, index) => {
  // if(item.user_name !== item.user_name.toLowerCase()) {
  //   caseCount += 1;
  //   //console.log(item)
  //   //console.log(index)
  // }
  dup[item.user_name] = dup[item.user_name] ? dup[item.user_name] + 1 : 1;
})

registeredUsers.forEach(item => {
  if(dup[item.user_name] > 1) {
    //console.log(item.user_name,item.recipient_type)
    dupArray.push(item)
  }
})
Object.keys(dup).forEach(key => {
  if(dup[key] > 1) {
    console.log(key, dup[key], )
    count = count + dup[key] - 1
  }
})
console.log(dupArray.length)
console.log(count, registeredUsers.length - count)
console.log("registered",caseCount)
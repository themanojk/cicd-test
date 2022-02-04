const fs = require('fs');

const dataFolder = './user/data/'
const jsonData = [];

const usersData = [];

const files = fs.readdirSync(dataFolder);

//fetching json data and putting in array
files.forEach((file) => {
    const fileData = fs.readFileSync(`${dataFolder}${file}`, 'utf8');
    jsonData.push(JSON.parse(fileData));
});


jsonData.forEach(item => {
  if(!('is_active' in item) || item['is_active'] === null) item['is_active'] = false;
  if(!('is_disabled' in item) || item['is_disabled'] === null)  item['is_disabled'] = false;
  if(!('is_deleted' in item) || item['is_deleted'] === null)  item['is_deleted'] = false;
  if(!('create_time' in item) || item['create_time'] === null)  item['create_time'] = new Date();
  if(!('modify_time' in item) || item['modify_time'] === null)  item['modify_time'] = new Date();
  if(!('site_ids' in item) || item['site_ids'] === null)  item['site_ids'] = [];
  if(!('is_deleted' in item) || item['is_deleted'] === null)  item['is_deleted'] = false;

  item.is_migrated = true;
  item.phone_number_verified = false;
  item.email_verified = false;
  item.country_flag = item.countryFlag ?? null;
  item.role = item.user_type;

  item.email = item.email ? item.email.toLowerCase() : null;
  item.user_name = item.user_name ? item.user_name.toLowerCase() : null;

  usersData.push(item);
});

// Writing json data
// usersData.forEach((item, index) => {
//   fs.writeFileSync(`userOutput/${index}.json`, JSON.stringify(item));
// })

console.log(usersData[21])
console.log(usersData[12])
console.log(usersData[255])
console.log(usersData[354])
console.log(usersData[543])

console.log("Total", files.length);
console.log("users", usersData.length);
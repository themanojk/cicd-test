const fs = require('fs');

const dataFolder = '../question/'
const jsonData = [];

const files = fs.readdirSync(dataFolder);

//fetching json data and putting in array
files.forEach((file) => {
    const fileData = fs.readFileSync(`${dataFolder}${file}`, 'utf8');
    jsonData.push(JSON.parse(fileData));
});

const visitData = [];
const passed = [];
const processed = [];

jsonData.forEach(item => {
  let pass = true;
  item.dynamic_questionnaire_answers.forEach((row, index) => {
    if(row.QuestionnaireAnswer) {
      row.questionnaireanswer = row.QuestionnaireAnswer;
      delete row.QuestionnaireAnswer;
    }
    if(!('editQuestion' in row) || row['editQuestion'] === null) row['editQuestion'] = false;
  });

  visitData.push(item)
});

// Writing json data
visitData.forEach((item, index) => {
  fs.writeFileSync(`visitsOutput/${index}.json`, JSON.stringify(item));
})

console.log(visitData[2])
console.log(visitData[4])
console.log(visitData[10])
console.log(visitData[13])

console.log("Total", files.length);
console.log("visitData", visitData.length);
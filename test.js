console.log(new Date().toLocaleDateString());
let [year, month, day] = new Date().toLocaleDateString().split("-");
if (month.length === 1) month = `0${month}`;
if (day.length === 1) day = `0${day}`;

const todayLocalDate = Date.parse(`${year}-${month}-${day}`);
console.log(todayLocalDate === Date.parse("2019-11-03"));

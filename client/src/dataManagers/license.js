import * as data from "./blueOak.json";

const gold_standard = data.ratings[1].licenses;
const clean_gold_standard = gold_standard.map((license) => {
  return license.name.toLowerCase();
});

const silver_standard = data.ratings[2].licenses;
const clean_silver_standard = silver_standard.map((license) => {
  return license.name.toLowerCase();
});

const bronze_standard = data.ratings[3].licenses;
const clean_bronze_standard = bronze_standard.map((license) => {
  return license.name.toLowerCase();
});




const _colors = [
  "rgb(225, 187, 50)",
  "gray",
  "rgb(225, 127, 50)",
  "blue"
];

const indices = {};
let count = 0; // note: can use size of indices instead

function getAllColors() {
  const mappings = [];
  for (const license of Object.keys(indices)) {
    mappings.push({
      name: getName(license.toLowerCase()),
      color: getColor(license.toLowerCase()),
    });
  }
  return mappings;
}

function getName(license) {

   if (clean_gold_standard.includes(license)) {
      return "Gold"
   } else if (clean_silver_standard.includes(license)) {
      return "Silver"
   } else if (clean_bronze_standard.includes(license)) {
      return "Bronze"
   }
   else {
      return "Other" 
   }
}


function getColor(license) {
  if (license == undefined){
    return "blue"
  }
  license = license.toLowerCase();
   if (license in indices) return _colors[indices[license]];
   if (clean_gold_standard.includes(license)) {
      return "rgb(225, 187, 50)"
   } else if (clean_silver_standard.includes(license)) {
      return "gray"
   } else if (clean_bronze_standard.includes(license)) {
      return "rgb(225, 127, 50)"
   }
   else {
      return "blue" 
   }
}

function push(license) {
  if (license in indices) return;

  indices[license] = count;
  count++;
}

const licenseManager = {
  getAllColors,
  getColor,
  push,
};

export default licenseManager;
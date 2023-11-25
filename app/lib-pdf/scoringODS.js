const XLSX = require('xlsx');
// const fs = require('fs')

// const workbook = new ExcelJS.Workbook();

let scoring = async function (file) {
  try {
    console.log({file})
    const workbook = XLSX.readFile(filePath);

    let result = [];

    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(worksheet);
      result = result.concat(sheetData)
    });

    console.log(result)
    return result;
  } catch (error) {
    console.error('Error reading ODS file:', error.message);
    return []
  }
}

// main()

module.exports = scoring
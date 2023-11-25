const ExcelJS = require('exceljs');
const fs = require('fs')

const workbook = new ExcelJS.Workbook();

let scoring = async function (file) {
  try {
    await workbook.xlsx.readFile(file);

    let result = [];

    workbook.eachSheet((worksheet, sheetId) => {
      const sheetData = [];
      const headers = [];

      worksheet.eachRow((row, rowNumber) => {
        const rowData = {};
        row.eachCell((cell, colNumber) => {
          if (rowNumber === 1) {
            // Store headers from the first row
            headers.push(cell.value);
          } else {
            // Use headers as keys for subsequent rows
            rowData[headers[colNumber - 1]] = cell.value;
          }
        });

        // Skip processing the first row, as it contains headers
        if (rowNumber > 1) {
          sheetData.push(rowData);
        }
      });

      result = result.concat(sheetData)
    });

    return result;
  } catch (error) {
    console.error('Error reading ODS file:', error.message);
    return []
  }
}

// main()

module.exports = scoring
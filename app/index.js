// const ShellSpawn = require('./lib/ShellSpawn')
const GetFiles = require('./lib/GetFiles')

const path = require('path')
const fs = require('fs')

const ExtractAnnotation = require('./lib-pdf/ExtractAnnotation.js')
const scoring = require('./lib-pdf/scoring.js')
const GeneralScoreScript = require('./lib-pdf/GeneralScoreScript.js')
const SplitPDF = require('./lib-pdf/SplitPDF.js')

const ExtractSplitInformation = require('./lib-pdf/ExtractSplitInformation.js')

const ShellSpawn = require('./lib/ShellSpawn')

let main = async function () {
  let files = GetFiles()

  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    if (file.endsWith('.pdf') === false) {
      continue
    }

    const fileNameWithoutExt = path.basename(file, path.extname(file))
    // -----------------

    let annotations = await ExtractAnnotation(file)
    annotations = annotations.join('\n')
    let {scores, idTotalList} = scoring(annotations)

    fs.writeFileSync(path.resolve('/output/', fileNameWithoutExt + '.csv'), scores, 'utf-8')

    // -----------------

    let {adjTotalJS, plusAdjTotalJS, testJS} = GeneralScoreScript(idTotalList, fileNameWithoutExt)

    fs.writeFileSync(path.resolve('/output/', fileNameWithoutExt + '_adj-total.js'), adjTotalJS, 'utf-8')
    fs.writeFileSync(path.resolve('/output/', fileNameWithoutExt + '_plus-adj-total.js'), plusAdjTotalJS, 'utf-8')
    fs.writeFileSync(path.resolve('/output/', fileNameWithoutExt + '_test.js'), testJS, 'utf-8')

    // -----------------

    if (fs.existsSync(path.resolve('/output/', fileNameWithoutExt)) === false) {
      let splitInformation = await ExtractSplitInformation(file)
      // console.log(splitInformation)
      await SplitPDF(file, splitInformation)
    }

    if (fs.existsSync(path.resolve('/output/', fileNameWithoutExt + '.zip')) === false) {
      await ShellSpawn(`cd /output/${fileNameWithoutExt}; echo zip -r ../${fileNameWithoutExt}.zip . -i *`)
    } 
  }
}

main()
// const ShellSpawn = require('./lib/ShellSpawn')
const GetFiles = require('./lib/GetFiles')

const path = require('path')
const fs = require('fs')

const ExtractAnnotation = require('./lib-pdf/ExtractAnnotation.js')
const scoring = require('./lib-pdf/scoring.js')
const GeneralScoreScript = require('./lib-pdf/GeneralScoreScript.js')
const SplitPDF = require('./lib-pdf/SplitPDF.js')

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

    let {adjTotalJS, plusAdjTotalJS} = GeneralScoreScript(idTotalList)

    fs.writeFileSync(path.resolve('/output/', fileNameWithoutExt + '_adj-total.js'), adjTotalJS, 'utf-8')
    fs.writeFileSync(path.resolve('/output/', fileNameWithoutExt + '_plus-adj-total.js'), plusAdjTotalJS, 'utf-8')

    // -----------------

    let splitInformation = await ExtractSplitInformation(file)
    // console.log(splitInformation)
    await SplitPDF(file, splitInformation)
  }
}

main()
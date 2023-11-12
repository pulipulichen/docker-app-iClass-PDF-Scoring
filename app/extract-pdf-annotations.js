// const ShellSpawn = require('./lib/ShellSpawn')
const GetExistedArgv = require('./lib/GetExistedArgv')

const path = require('path')
const fs = require('fs')

const ExtractAnnotation = require('./lib-pdf/ExtractAnnotation.js')
// const SplitPDF = require('./lib-pdf/SplitPDF.js')

let main = async function () {
  let files = GetExistedArgv()

  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    if (file.endsWith('.pdf') === false) {
      continue
    }

    let filename = path.basename(file)
    let filenameNoExt = filename
    if (filenameNoExt.endsWith('.pdf')) {
      filenameNoExt = filenameNoExt.slice(0, -4)
    }

    // -----------------------

    let annotations = await ExtractAnnotation(file)
    // console.log(annotations)
    let dirname = path.dirname(file)
    let outputFilePath = path.resolve(dirname, filenameNoExt + '.anno.txt')
    fs.writeFileSync(outputFilePath, annotations.join('\n'), 'utf-8')
    
    // console.log(splitInformation)
    // await SplitPDF(cacheFile, splitInformation)

    // -----------------------
    
    // let commandsEnd = [
    //   [`rm`, `"/cache/${filename}"`],
    //   ["mv", `/cache/*.pdf`, `/input/`]
    // ]


    // for (let j = 0; j < commandsEnd.length; j++) {
    //   await ShellSpawn(commandsEnd[j])
    // }
  }
}

main()
const path = require('path')
const fs = require('fs')



function GeneralScoreScript(idTotalList, prependFilename) {
  

  let adjTotalJS = {}
  let plusAdjTotalJS = {}
  let testJS = {}

  // ----------------------------------------------------------------

  idTotalList.forEach(({id, adjTotal, plusAdjTotal, comment}, i) => {
    adjTotalJS[id] = {score: adjTotal, comment}
    plusAdjTotalJS[id] = {score: plusAdjTotal, comment}

    if (i < 3) {
      testJS[id] = {score: plusAdjTotal, comment}
    }
  })

  adjTotalJS = createJS(adjTotalJS, prependFilename)
  plusAdjTotalJS = createJS(plusAdjTotalJS, prependFilename)
  testJS = createJS(testJS, prependFilename)
  
  // ----------------------------------------------------------------
  return {
    adjTotalJS,
    plusAdjTotalJS,
    testJS
  }
}

function createJS (scores, prependFilename) {
  let doScoringScript = fs.readFileSync(path.resolve(__dirname, './doScoringScript.js'), 'utf8')

  return `scores = ${JSON.stringify(scores)}
prependFilename = "${prependFilename}"

${doScoringScript}`
}

module.exports = GeneralScoreScript
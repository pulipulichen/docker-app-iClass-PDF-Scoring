const path = require('path')
const fs = require('fs')



function GeneralScoreScript(idTotalList, prependFilename) {
  

  let adjTotalJS = {}
  let plusAdjTotalJS = {}

  // ----------------------------------------------------------------

  idTotalList.forEach(({id, adjTotal, plusAdjTotal, comment}) => {
    adjTotalJS[id] = {score: adjTotal, comment}
    plusAdjTotalJS[id] = {score: plusAdjTotal, comment}
  })

  adjTotalJS = createJS(adjTotalJS, prependFilename)
  plusAdjTotalJS = createJS(plusAdjTotalJS, prependFilename)

  // ----------------------------------------------------------------
  return {
    adjTotalJS,
    plusAdjTotalJS
  }
}

function createJS (scores, prependFilename) {
  let doScoringScript = fs.readFileSync(path.resolve(__dirname, './doScoringScript.js'), 'utf8')

  return `scores = ${JSON.stringify(scores)}
prependFilename = "${prependFilename}"

${doScoringScript}`
}

module.exports = GeneralScoreScript
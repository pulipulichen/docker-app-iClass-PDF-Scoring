const path = require('path')
const fs = require('fs')



function GeneralScoreScript(idTotalList) {
  

  let adjTotalJS = {}
  let plusAdjTotalJS = {}

  // ----------------------------------------------------------------

  idTotalList.forEach(({id, adjTotal, plusAdjTotal}) => {
    adjTotalJS[id] = adjTotal
    plusAdjTotalJS[id] = plusAdjTotal
  })

  adjTotalJS = createJS(adjTotalJS)
  plusAdjTotalJS = createJS(plusAdjTotalJS)

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
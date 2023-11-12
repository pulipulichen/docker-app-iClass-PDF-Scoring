const path = require('path')
const fs = require('fs')

function GeneralScoreScript(idTotalList) {
  let doScoringScript = fs.readFileSync(path.resolve(__dirname, './doScoringScript.js'), 'utf8')

  let adjTotalJS = {}
  let plusAdjTotalJS = {}

  // ----------------------------------------------------------------

  idTotalList.forEach(({id, adjTotal, plusAdjTotal}) => {
    adjTotalJS[id] = adjTotal
    plusAdjTotalJS[id] = plusAdjTotal
  })

  adjTotalJS = JSON.stringify(adjTotalJS) + '\n' + doScoringScript
  plusAdjTotalJS = JSON.stringify(plusAdjTotalJS) + '\n' + doScoringScript

  // ----------------------------------------------------------------
  return {
    adjTotalJS,
    plusAdjTotalJS
  }
}

module.exports = GeneralScoreScript
const path = require('path')
const fs = require('fs')



function GeneralScoreScript(idTotalList, prependFilename) {
  

  let adjTotalJS = {}
  let plusAdjTotalJS = {}
  let testJS = {}

  let ratio110JS = {}
  let ratio120JS = {}
  let ratio130JS = {}

  // ----------------------------------------------------------------

  idTotalList.forEach(({id, adjTotal, plusAdjTotal, comment, ratio110_adj, ratio120_adj, ratio130_adj}, i) => {
    adjTotalJS[id] = {score: adjTotal, comment}
    plusAdjTotalJS[id] = {score: plusAdjTotal, comment}

    if (i < 3) {
      testJS[id] = {score: plusAdjTotal, comment}
    }

    ratio110JS[id] = {score: ratio110_adj, comment}
    ratio120JS[id] = {score: ratio120_adj, comment}
    ratio130JS[id] = {score: ratio130_adj, comment}
  })

  adjTotalJS = createJS(adjTotalJS, prependFilename)
  plusAdjTotalJS = createJS(plusAdjTotalJS, prependFilename)
  testJS = createJS(testJS, prependFilename)

  ratio110JS = createJS(ratio110JS, prependFilename)
  ratio120JS = createJS(ratio120JS, prependFilename)
  ratio130JS = createJS(ratio130JS, prependFilename)
  
  // ----------------------------------------------------------------
  return {
    adjTotalJS,
    plusAdjTotalJS,
    testJS,
    ratio110JS,
    ratio120JS,
    ratio130JS
  }
}

function createJS (scores, prependFilename) {
  let doScoringScript = fs.readFileSync(path.resolve(__dirname, './assets/doScoringScript.js'), 'utf8')

  return `scores = ${JSON.stringify(scores)}
prependFilename = "${prependFilename}"

${doScoringScript}`
}

module.exports = GeneralScoreScript
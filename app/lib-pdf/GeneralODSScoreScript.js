const path = require('path')
const fs = require('fs')



function GeneralODSScoreScript(scores) {

  let scoreJS = {}
  let testJS = {}

  // ----------------------------------------------------------------

  scores.forEach(({id, score, comment}, i) => {
    scoreJS[id] = {score: score, comment}

    if (i < 3) {
      testJS[id] = {score: score, comment}
    }
  })

  scoreJS = createJS(scoreJS)
  testJS = createJS(testJS)
  
  // ----------------------------------------------------------------
  return {
    scoreJS,
    testJS
  }
}

function createJS (scores) {
  let doScoringScript = fs.readFileSync(path.resolve(__dirname, './assets/doScoringScript.js'), 'utf8')

  return `scores = ${JSON.stringify(scores)}

${doScoringScript}`
}

module.exports = GeneralODSScoreScript
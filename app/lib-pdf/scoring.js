// const ShellSpawn = require('./lib/ShellSpawn')
const GetExistedArgv = require('../lib/GetExistedArgv')

const path = require('path')
const fs = require('fs')

// const ExtractAnnotation = require('./lib-pdf/ExtractAnnotation.js')
// const SplitPDF = require('./lib-pdf/SplitPDF.js')

// let main = async function () {
//   let files = GetExistedArgv()

//   for (let i = 0; i < files.length; i++) {
//     let file = files[i]
//     if (file.endsWith('.anno.txt') === false) {
//       continue
//     }

//     let filename = path.basename(file)
//     let filenameNoExt = filename
//     if (filenameNoExt.endsWith('.anno.txt')) {
//       filenameNoExt = filenameNoExt.slice(0, -4)
//     }

//     // -----------------------

//     let annotations = fs.readFileSync(file, 'utf-8')
//     // console.log(annotations)
//     let dirname = path.dirname(file)
//     let outputFilePath = path.resolve(dirname, filenameNoExt + '.anno.csv')
//     fs.writeFileSync(outputFilePath, scoring(annotations), 'utf-8')
//   }
// }

let scoreSplitor = [',', '，', '。', '；', ':', '/']

let calcAdjTotal = function(score, ratio = 1) {
  score = Math.round(score * ratio)
  if (score > 100) {
    return 100
  }
  else {
    return score
  }
}

let scoring = function (annotations) {
  let lines = annotations.trim().split('\n').map(line => line.trim()).filter(line => (line !== ''))

  let students = {}
  let studentsComment = {}

  let id = null
  let qArray = []

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim()
    console.log(line)

    if (line.startsWith('|')) {
      line = line.slice(1).trim()
      id = Number(line)
      continue
    }
    else if (line.startsWith('q') && line.indexOf('.') > -1 && id !== null) {
      let parts = line.slice(1).split('.').map(p => {
        p = p.trim()
        if (p === '') {
          return NaN
        }

        if (p.indexOf(' ') > -1) {
          p = p.slice(0, p.indexOf(' '))
        }
        p = p.trim()
        let result = Number(p)
        // return Number(p.trim())
        if (!isNaN(result)) {
          return result
        }
        
        for (let i = 0; i < scoreSplitor.length; i++) {
          let splitor = scoreSplitor[i]
          if (p.indexOf(splitor) > -1) {
            let result = p.slice(0, p.indexOf(splitor)).trim()
            result = Number(result)
            if (!isNaN(result)) {
              return result
            }
          }
        }
        return result
      })
      let q = parts[0]
      let score = parts[1]

      if (!students[id]) {
        students[id] = {}
        studentsComment[id] = {}
      }

      if (students[id][q]) {
        throw Error(`overwrite!! ${id} : q${q}`)
      }

      students[id][q] = score
      studentsComment[id][q] = line.trim()

      if (qArray.indexOf(q) === -1) {
        qArray.push(q)
      }
    }
  }

  // -------------
  // 輸出

  qArray.sort()
  console.log(qArray)

  let idArray = Object.keys(students).map(s => Number(s))
  idArray.sort()

  let output = [
    ['id'].concat(['total', 'adj_total', 'ratio110_adj', 'ratio120_adj', 'ratio130_adj', 'plus_adj_total']).concat(qArray).concat(['Comment']).join(',')
  ]

  console.log(idArray)
  let scoreArray = {}
  // let commentArray = {}
  let qList = []

  let totalList = []
  let adjTotalList = []
  let plusAdjTotalList = []
  let ratio110AdjTotalList = []
  let ratio120AdjTotalList = []
  let ratio130AdjTotalList = []
  
  let idTotalList = []

  
  for (let i = 0; i < idArray.length; i++) {
    let id = idArray[i]
    console.log(id)
    let line = [
      id
    ]

    let scores = []
    let comments = []
    let total = 0

    for (let j = 0; j < qArray.length; j++) {
      let q = qArray[j]
      let score = 0
      if (students[id][q] !== undefined){
        score = students[id][q]
        comments.push(studentsComment[id][q])
      }

      scores.push(score)
      total = total + score

      if (!scoreArray[q]) {
        scoreArray[q] = []
        qList.push(q)
      }
      scoreArray[q].push(score)
    }

    // line = line.concat(scores)
    // line = []
    line.push(total)
    totalList.push(total)

    let adjTotal = total
    if (adjTotal > 100) {
      // line.push(100)
      adjTotal = 100
    }
    // else {
    //   line.push(total)
    // }
    line.push(adjTotal)
    adjTotalList.push(adjTotal)

    let plusAdjTotal = parseInt(Math.sqrt(adjTotal)*10)
    line.push(plusAdjTotal)
    plusAdjTotalList.push(plusAdjTotal)

    ratio110AdjTotalList.push(calcAdjTotal(total, 1.1))
    ratio120AdjTotalList.push(calcAdjTotal(total, 1.2))
    ratio130AdjTotalList.push(calcAdjTotal(total, 1.3))

    line = line.concat(scores)
    line.push(comments.join(' / '))
    // ----------------------------------------------------------------

    output.push(line.join(','))

    idTotalList.push({
      id,
      adjTotal,
      ratio110_adj: calcAdjTotal(total, 1.1),
      ratio120_adj: calcAdjTotal(total, 1.2),
      ratio130_adj: calcAdjTotal(total, 1.3),
      plusAdjTotal,
      comment: comments.join(' / ')
    })
  }

  // -------------------

  qList = qList.sort()
  const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

  let scoreArrayAvg = []
  let scoreArrayMax = []
  let scoreArrayPercent = []
  for (let i = 0; i < qList.length; i++) {
    let q = qList[i]

    // let scoreList = scoreArray[q]
    let scoreList = scoreArray[q]
    let avg = average(scoreList)
    avg = Math.round(avg * 10) / 10
    scoreArrayAvg.push(avg)

    let max = Math.max(...scoreList)
    scoreArrayMax.push(max)
    
    let percent = Math.round((avg / max) * 100)
    scoreArrayPercent.push(percent)
  }

  // let prependArray = ['', '', '']

  let avgTotalList = Math.round(average(totalList))
  let avgAdjTotalList = Math.round(average(adjTotalList))
  let avgPlusTotalList = Math.round(average(plusAdjTotalList))

  let avgRatio110AdjTotalList = Math.round(average(ratio110AdjTotalList))
  let avgRatio120AdjTotalList = Math.round(average(ratio120AdjTotalList))
  let avgRatio130AdjTotalList = Math.round(average(ratio130AdjTotalList))

  let maxTotalList = Math.max(...totalList)
  let maxAdjTotalList = Math.max(...adjTotalList)
  let maxPlusTotalList = Math.max(...plusAdjTotalList)
  let maxRatio110AdjTotalList = Math.max(...ratio110AdjTotalList)
  let maxRatio120AdjTotalList = Math.max(...ratio120AdjTotalList)
  let maxRatio130AdjTotalList = Math.max(...ratio130AdjTotalList)

  let percentTotalList = Math.round((avgTotalList / maxTotalList) * 100)
  let percentAdjTotalList = Math.round((avgAdjTotalList / maxAdjTotalList) * 100)
  let percentPlusTotalList = Math.round((avgPlusTotalList / maxPlusTotalList) * 100)
  let percentRatio110AdjTotalList = Math.round((avgRatio110AdjTotalList / maxRatio110AdjTotalList) * 100)
  let percentRatio120AdjTotalList = Math.round((avgRatio120AdjTotalList / maxRatio120AdjTotalList) * 100)
  let percentRatio130AdjTotalList = Math.round((avgRatio130AdjTotalList / maxRatio130AdjTotalList) * 100)

  

  output.push('')
  output.push(['average'].concat([avgTotalList, avgAdjTotalList, avgPlusTotalList, avgRatio110AdjTotalList, avgRatio120AdjTotalList, avgRatio130AdjTotalList]).concat(scoreArrayAvg).join(','))
  output.push(['max'].concat([maxTotalList, maxAdjTotalList, maxPlusTotalList, maxRatio110AdjTotalList, maxRatio120AdjTotalList, maxRatio130AdjTotalList]).concat(scoreArrayMax).join(','))
  output.push(['percent'].concat([percentTotalList, percentAdjTotalList, percentPlusTotalList, percentRatio110AdjTotalList, percentRatio120AdjTotalList, percentRatio130AdjTotalList]).concat(scoreArrayPercent).join(','))

  let passTotalCount = Math.round(totalList.filter(s => s >= 60).length / totalList.length * 100) + '%'
  let passAdjTotalCount = Math.round(adjTotalList.filter(s => s >= 60).length / adjTotalList.length * 100)  + '%'
  let passPlusAdjTotalCount = Math.round(plusAdjTotalList.filter(s => s >= 60).length / plusAdjTotalList.length * 100)  + '%'
  let passRatio110AdjTotalCount = Math.round(ratio110AdjTotalList.filter(s => s >= 60).length / ratio110AdjTotalList.length * 100)  + '%'
  let passRatio120AdjTotalCount = Math.round(ratio120AdjTotalList.filter(s => s >= 60).length / ratio120AdjTotalList.length * 100)  + '%'
  let passRatio130AdjTotalCount = Math.round(ratio130AdjTotalList.filter(s => s >= 60).length / ratio130AdjTotalList.length * 100)  + '%'

  // let passTotalCount = totalList.filter(s => s >= 60).length
  // let passAdjTotalCount = adjTotalList.filter(s => s >= 60).length
  // let passPlusAdjTotaCount = plusAdjTotalList.filter(s => s >= 60).length

  output.push('')
  output.push(['passed percent'].concat([passTotalCount, passAdjTotalCount, passPlusAdjTotalCount, passRatio110AdjTotalCount, passRatio120AdjTotalCount, passRatio130AdjTotalCount]))

  // -------------------

  output.push(`participants,${idArray.length}`)

  // -------------------

  console.log(output.join('\n'))
  return {
    scores: output.join('\n'),
    idTotalList
  }
}

// main()

module.exports = scoring
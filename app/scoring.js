// const ShellSpawn = require('./lib/ShellSpawn')
const GetExistedArgv = require('./lib/GetExistedArgv')

const path = require('path')
const fs = require('fs')

// const ExtractAnnotation = require('./lib-pdf/ExtractAnnotation.js')
// const SplitPDF = require('./lib-pdf/SplitPDF.js')

let main = async function () {
  let files = GetExistedArgv()

  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    if (file.endsWith('.anno.txt') === false) {
      continue
    }

    let filename = path.basename(file)
    let filenameNoExt = filename
    if (filenameNoExt.endsWith('.anno.txt')) {
      filenameNoExt = filenameNoExt.slice(0, -4)
    }

    // -----------------------

    let annotations = fs.readFileSync(file, 'utf-8')
    // console.log(annotations)
    let dirname = path.dirname(file)
    let outputFilePath = path.resolve(dirname, filenameNoExt + '.anno.csv')
    fs.writeFileSync(outputFilePath, scoring(annotations), 'utf-8')
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
        if (p.indexOf(' ') > -1) {
          p = p.slice(0, p.indexOf(' '))
        }
        return Number(p.trim())
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
    ['id'].concat(['total', 'adj_total', 'plus_adj_total']).concat(qArray).concat(['Comment']).join(',')
  ]

  console.log(idArray)
  let scoreArray = {}
  // let commentArray = {}
  let qList = []

  let totalList = []
  let adjTotalList = []
  let plusAdjTotalList = []

  
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

    line = line.concat(scores)
    line.push(comments.join(' / '))
    // ----------------------------------------------------------------

    output.push(line.join(','))
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

  let prependArray = ['', '', '']

  let avgTotalList = Math.round(average(totalList))
  let avgAdjTotalList = Math.round(average(adjTotalList))
  let avgPlusTotalList = Math.round(average(plusAdjTotalList))

  let maxTotalList = Math.max(...totalList)
  let maxAdjTotalList = Math.max(...adjTotalList)
  let maxPlusTotalList = Math.max(...plusAdjTotalList)

  let percentTotalList = Math.round((avgTotalList / maxTotalList) * 100)
  let percentAdjTotalList = Math.round((avgAdjTotalList / maxAdjTotalList) * 100)
  let percentPlusTotalList = Math.round((avgPlusTotalList / maxPlusTotalList) * 100)

  

  output.push('')
  output.push(['average'].concat([avgTotalList, avgAdjTotalList, avgPlusTotalList]).concat(scoreArrayAvg).join(','))
  output.push(['max'].concat([maxTotalList, maxAdjTotalList, maxPlusTotalList]).concat(scoreArrayMax).join(','))
  output.push(['percent'].concat([percentTotalList, percentAdjTotalList, percentPlusTotalList]).concat(scoreArrayPercent).join(','))

  let passTotalCount = Math.round(totalList.filter(s => s >= 60).length / totalList.length * 100) 
  let passAdjTotalCount = Math.round(adjTotalList.filter(s => s >= 60).length / adjTotalList.length * 100) 
  let passPlusAdjTotaCount = Math.round(plusAdjTotalList.filter(s => s >= 60).length / plusAdjTotalList.length * 100) 

  // let passTotalCount = totalList.filter(s => s >= 60).length
  // let passAdjTotalCount = adjTotalList.filter(s => s >= 60).length
  // let passPlusAdjTotaCount = plusAdjTotalList.filter(s => s >= 60).length

  output.push('')
  output.push(['pass'].concat([passTotalCount, passAdjTotalCount, passPlusAdjTotaCount]))

  // -------------------

  output.push(`participants,${idArray.length}`)

  // -------------------

  console.log(output.join('\n'))
  return output.join('\n')
}

main()

const {AnnotationFactory} = require('annotpdf');
const path = require('path')

module.exports = async function (inputFile) {

  // console.log(AnnotationFactory.loadFile)
  let factory = await AnnotationFactory.loadFile(inputFile)
  let filename = path.basename(inputFile)
  if (filename.indexOf('.') > -1) {
    filename = filename.slice(0, filename.lastIndexOf('.'))
  }
  
  let pages = await factory.getAnnotations()

  let output = []
  // console.log()
  pages.forEach((annotations, page_number) => {
    console.log('Page', page_number)

    let outputInPage = []
    annotations.forEach(annotation => {
      // console.log(annotation.length)
      // console.log(annotation)

      if (annotation.type !== '/FreeText') {
        // console.log(annotation)
        return false
      }

      let x = annotation.rect[2]
      let y = annotation.rect[3]

      let contents = annotation.contents.trim()
      // console.log(contents)

      outputInPage.push({
        y,
        x,
        contents
      })
    })

    
    outputInPage = outputInPage.sort((a, b) => {
      if (a.y !== b.y) {
        return b.y - a.y
      }
      else if (a.x !== b.x) {
        return a.x - b.x
      }
      else {
        return (a.contents > b.contents)
      }
    })

    // console.log(outputInPage)

    // outputInPage.sort((a, b) => {
    //   let a1 = a.trim().slice(0, 1)
    //   let b1 = b.trim().slice(0, 1)
    //   if (a1 === '|') {
    //     return false
    //   }
    //   else if (b1 === '|') {
    //     return true
    //   }

    //   return (a > b)
    // })
    // outputInPage.sort()
    
    output = output.concat(outputInPage.map(o => o.contents))
  })

  return output
}
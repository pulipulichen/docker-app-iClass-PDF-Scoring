const fs = require('fs')

module.exports = function () {
  let args = process.argv
  console.log({args})
  if (args.length < 3) {
    return []
  }

  args = args.slice(2)
  args = args.filter(arg => {
    return fs.existsSync(arg)
  })
  return args
}
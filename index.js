const ShellSpawn = require('./app/lib/ShellSpawn')
const GetExistedArgv = require('./app/lib/GetExistedArgv')
const SetDockerComposeYML = require('./app/lib/SetDockerComposeYML')

let main = async function () {
  // 1. 先取得輸入檔案的列表
  let files = GetExistedArgv()

  for (let i = 0; i < files.length; i++) {
    let file = files[i]

    // console.log(file)

    if (file.endsWith('.pdf') === false) {
      continue
    }
    
    SetDockerComposeYML(file)
    await ShellSpawn('docker-compose up')
  }
}

main()

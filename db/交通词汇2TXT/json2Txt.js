const fs = require('fs')
const path = require('path')

const file2Jsons = (p) => {
  const p1 = new Promise(resolve => {
    fs.readFile(p, 'utf-8', function(error, data) {
      if (error) return console.log('读取文件失败,内容是' + error.message)
      resolve(data.split('\n'))
    })
  })
  return p1
}

async function Start() {
  const content = await file2Jsons(path.resolve(__dirname, './交通词汇.json'))
  const writeContent = content.map(word => {
    const w = JSON.parse(word)
    const line = `${w.word} 【${(w.trans.map(item => item.tranCn)).join(', ')}】`
    return JSON.stringify(line)
  })
  const res = writeContent.join('\r\n')
  const file = `./预习.txt`
  fs.writeFile(path.resolve(__dirname, file), res, function(error) {
    if (error) {
      console.log('写入失败')
    } else {
      console.log(`写入${file}`)
    }
  })
}

Start()

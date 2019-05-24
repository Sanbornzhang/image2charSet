const cv = require('opencv4nodejs')

const asciiChar = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`\'. '

function image2charSet(imageBuffer) {
  const textList = []
  return cv.imdecodeAsync(imageBuffer)
  .then(image=>{
   
    const r = image.rows > 300 ? parseInt(image.rows/4) : image.rows
    const c = image.cols > 300 ? parseInt(image.cols/4) : image.cols
    return image.resizeAsync(r, c, 0, 0, cv.INTER_AREA)
  })
  .then(image=>{
    return image.cvtColorAsync(cv.COLOR_BGR2GRAY)
  })
  .then(image=>{
    return image.adaptiveThresholdAsync(255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2)
  })
  .then(image=>{
    for (let i = 0; i < image.rows; i++) {
      let line = ''
      for (let j = 0; j < image.cols; j++) {
        const pixel =image.at(i,j)
        line += getChar(pixel)
      }
      textList.push(line)
    }
    const result = {}
    result.text = textList
    result.cols = image.cols
    result.rows = image.rows
    return result
  })
}

function getChar(grayNumber){
  const length = asciiChar.length
  const unit = (256.0 + 1)/length
  const index = parseInt(Number(grayNumber/unit))
  return `${asciiChar[index]}`
}

module.exports = image2charSet
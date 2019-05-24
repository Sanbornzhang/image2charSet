const imageHeaders = [{
    header: [0x42, 0x4D],
    type: 'bmp'
  }, //bmp
  {
    header: [0xFF, 0xD8, 0xFF],
    type: 'jpeg'
  }, //jpeg
  {
    header: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
    type: 'png'
  }, //png
  // {header:[0x47, 0x49, 0x46], type: 'gif'}, //gif
  {
    header: [0x57, 0x45, 0x42, 0x50],
    options: {
      offset: 8
    },
    type: 'webp'
  }, //webp
  // {header:[0x46, 0x4C, 0x49, 0x46], type: 'flif'}, //flif
]

function check(fileBuffer, checkArray, options = {
  offset: 0
}) {
  if(!(fileBuffer && fileBuffer.length)){
    return false
  }
  for (let i = 0; i < checkArray.length; i++) {
    if (checkArray[i] !== fileBuffer[i + options.offset]) {
      return false;
    }
  }

  return true;
}

function isImage(fileBuffer) {
  for (let imageHeaderConfig of imageHeaders) {
    if (check(fileBuffer, imageHeaderConfig.header, imageHeaderConfig.options)) return true
  }
}


function imageFileBuffer(fsStream) {

  return new Promise((resolve, reject) => {
    const buff = []

    function onReadable() {
      const chunk = fsStream.read(36)
      if (isImage(chunk)) {
        fsStream.removeListener('readable', onReadable)
        // buff = []
        // fsStream.unshift(chunk)
        fsStream.resume()
      } else {
        fsStream.destroy(new Error('Only Support [bmp,jpeg,png,webp]'))
      }
    }
    fsStream.on('readable', onReadable)

    fsStream.on('data', chunk=> {
      buff.push(chunk)
    })

    fsStream.on('end', _=> {
      const buffer = Buffer.concat(buff);
      return resolve(buffer)
    })
    fsStream.on('error', _=> {
      return reject(_)
    })
  })

}
module.exports = imageFileBuffer
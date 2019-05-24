const fs = require('fs')
const util = require('util')
const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body');

const imageFileBuffer = require('./fileType')
const image2chatSet = require('./image2charSet')
const router = new Router()
const app = new Koa()



router.post('/file',   koaBody({
  multipart: true,
}), (ctx,next)=>{

    if(! ctx.request.files) return Promise.reject(new Error('pls upload file'))
    const files = ctx.request.files
    if(Object.keys(files).length !== 1 ) return Promise.reject(new Error('Only upload 1 file'))
    const file = ctx.request.files[Object.keys(files)[0]]

    const fileStream = fs.createReadStream(file.path) //TODO: using _writeStream 
    return imageFileBuffer(fileStream)
    .then(data=>{
      return image2chatSet(data)
    })
    .then(data=>{
      ctx.set('Access-Control-Allow-Origin', '*')
      ctx.response.body = data
      ctx.response.status = 200
      return next()
    })
    .catch(err=>{
      const error = {}
      error.name = err.name
      error.message = err.message
      error.status = util.isNumber(err.code) ? err.code : 500
      ctx.set('Access-Control-Allow-Origin', '*')
      ctx.response.status = error.status
      ctx.response.body = error
      return next()
    })
    
})


app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000)


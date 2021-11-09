import express from 'express'
import path from 'path'
import cors from 'cors'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'
import axios from 'axios'
import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

require('colors')

const { readFile, writeFile, unlink } = require('fs').promises

let Root
try {
  // eslint-disable-next-line import/no-unresolved
  Root = require('../dist/assets/js/ssr/root.bundle').default
} catch {
  console.log('SSR not found. Please run "yarn run build:ssr"'.red)
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  express.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

const pathToGoodsList = `${__dirname}/data/data.json`
const pathToCart = `${__dirname}/data/cart.json`
const pathToLogs = `${__dirname}/data/logs.json`
const getFileContent = (pathToFile) =>
  readFile(pathToFile, { encoding: 'utf8' })
    .then((text) => JSON.parse(text))
    .catch(() => {
      return []
    })


server.get('/api/goodsList', async (req, res) => {
  const list = await getFileContent(pathToGoodsList)
  res.json(list)
})

server.post('/api/goodsList', async (req, res) => {
  const data = req.body
  writeFile(pathToGoodsList, JSON.stringify(data), 'utf8')
  res.json({ status: 'success' })
})

server.get('/api/rates/:currency', async (req, res) => {
  const { currency } = req.params
  const allCurrencyObj = await axios('https://api.exchangerate.host/latest?base=USD&symbols=USD,EUR,CAD')
    .then((result) => result.data.rates)
    .catch(err => console.log(err))
  const rate = allCurrencyObj[currency.toUpperCase()]
  res.json(rate)
})


server.get('/api/cart', async (req, res) => {
const goodsList = await getFileContent(pathToCart)
const totalCount = goodsList.reduce((acc, rec) => {
  return acc + rec.count
}, 0)
  res.json(totalCount)
})

server.get('/api/cart/list', async (req, res) => {
  const goodsList = await getFileContent(pathToCart)
  res.json(goodsList)
})

server.get('/api/logs', async (req, res) => {
  const logsList = await getFileContent(pathToLogs)
  res.json(logsList)
})

server.post('/api/logs', async (req, res) => {
  const data = {Time: +new Date(), ...req.body}
  const logsList = await getFileContent(pathToLogs)
  const updatedLogsList = [...logsList, data]
  writeFile(pathToLogs, JSON.stringify(updatedLogsList), 'utf8')
  res.json({ status: 'success' })
})

server.post('/api/cartList', async (req, res) => {
  const data = req.body
  writeFile(pathToCart, JSON.stringify(data), 'utf8')
  res.json({ status: 'success' })
})

server.get('/api/cart/:id', async (req, res) => {
  const { id } = req.params
  const goodsList = await getFileContent(pathToCart)
  let count = 0
  goodsList.map((item) => {
    if(item.id === id) {
     count = item.count
    }
    return count})
  res.json(count)
})

server.post('/api/cart/', async (req, res) => {
  const data = req.body
  const goodsList = await getFileContent(pathToCart)
  const isExist = goodsList.find((item) => item.id === data.id)
  let updatedList = []
  if(isExist){
    updatedList = goodsList.map((obj) =>
    obj.id === data.id ? { ...obj, count: obj.count + 1 } : obj
  )
  }else {
    updatedList = [... goodsList, {...data, count: 1} ]
  }
  writeFile(pathToCart, JSON.stringify(updatedList), 'utf8')
  res.json({ status: 'success' })
})

server.patch('/api/cart/:id', async (req, res) => {
  const { id } = req.params
  const { count } = req.body
  const goodsList = await getFileContent(pathToCart)
  let updatedList = []
  if(count > 1) {
    updatedList = goodsList.map((item) =>
        item.id === id ? { ...item, count: item.count - 1 } : item
      )
  } else {
    updatedList = goodsList.filter(it => it.id !==id)
  }
  writeFile(pathToCart, JSON.stringify(updatedList), 'utf8')
  res.json({ status: 'success' })
})

server.delete('/api/logs', async (req, res) => {
  unlink(pathToLogs)
  res.json({status: "success"})
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)

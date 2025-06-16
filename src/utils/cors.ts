import { NextApiRequest, NextApiResponse } from 'next'

const allowCors = (fn: any) => async (req: NextApiRequest, res: NextApiResponse) => {
  // res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  // FROM Middleware
  //'Authorization, Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,X-Auth-Token,X-XSRF-TOKEN,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range'
  // Original 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Accept, Origin, DNT, X-CustomHeader, Keep-Alive, User-Agent, X-Requested-With, X-Auth-Token, X-XSRF-TOKEN, If-Modified-Since, Cache-Control, Content-Type, Content-Range, Range, x-api-key, x-company-id'
  )
  res.setHeader(
    'Access-Control-Request-Headers',
    'Authorization, Accept, Origin, DNT, X-CustomHeader, Keep-Alive, User-Agent, X-Requested-With, X-Auth-Token, X-XSRF-TOKEN, If-Modified-Since, Cache-Control, Content-Type, Content-Range, Range, x-api-key, x-company-id'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  await fn(req, res)
}

export default allowCors

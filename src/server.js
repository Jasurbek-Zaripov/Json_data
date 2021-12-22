const express = require('express')
const { read_db, write_db } = require('./module/module')
const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

app.get('/', (req, res) => {
  return res.json({
    Routes: [
      'GET:    /posts',
      'GET:    /posts/<postId>',
      'GET:    /comments?postId=<postId>',
      'POST:   /posts              {!title, !body, !userId}',
      'PUT:    /posts/<postId>     {title?, body?, !userId}',
      'DELETE: /posts/<postId>     (comments will not be deleted!)',
    ],
  })
})

app.get('/posts', async (req, res) => {
  try {
    res.json(await read_db('post'))
  } catch (xato) {
    console.log(xato)
  }
})

app.get('/posts/:num', async (req, res) => {
  try {
    let { num } = req.params
    let posts = await read_db('post')

    res.json(posts.find(obj => obj['id'] == num))
  } catch (xato) {
    console.log(xato)
  }
})

app.get('/posts/:num/comments', async (req, res) => {
  try {
    let { num } = req.params
    let comments = await read_db('comment')
    res.json(comments.filter(obj => obj['postId'] == num))
  } catch (xato) {
    console.log(xato)
  }
})

app.get('/comments', async (req, res) => {
  try {
    let { postId } = req.query
    let comments = await read_db('comment')

    res.json(comments.filter(obj => obj['postId'] == postId))
  } catch (xato) {
    console.log(xato)
  }
})

app.post('/posts', async (req, res) => {
  let { title, body, userId } = req.body
  userId = +userId

  if (title && body && userId) {
    title += ''
    body += ''
    if (title.length > 20 || body.length > 40) {
      return res.json({ Yomon_habar: 'Juda uzun!' })
    }

    let posts = await read_db('post')
    let id = 1

    posts.forEach(obj => {
      if (obj['id'] > id) {
        id = obj['id']
      }
    })

    id = id + 1

    let newPost = {
      userId,
      id,
      title,
      body,
    }
    posts.push(newPost)

    await write_db('post', posts)
    return res.json(newPost)
  }
  return res.json({ Yomon_habar: "to'g'ri so'rov junating!" })
})

app.put('/posts/:num', async (req, res) => {
  let { title, body, userId } = req.body
  let { num } = req.params
  if (!+num) {
    return res.json({ Yomon_habar: 'the type of postid should be a number!' })
  }
  userId = +userId
  title = title || 'kav_!@'
  body = body || 'kav_!@'
  if (title && body && userId) {
    title += ''
    body += ''
    if (title.length > 20 || body.length > 40) {
      return res.json({ Yomon_habar: 'Juda uzun!' })
    }

    let posts = await read_db('post')
    let user_post = posts.find(
      obj => obj['userId'] == userId && obj['id'] == num
    )

    if (!user_post) {
      return res.json({ Yomon_habar: 'bu user yoki post topilmadi!' })
    }

    user_post['title'] = title.replace('kav_!@', '') || user_post['title']
    user_post['body'] = body.replace('kav_!@', '') || user_post['body']

    await write_db('post', posts)
    return res.json(user_post)
  }
  return res.json({ Yomon_habar: "to'g'ri so'rov junating!" })
})

app.delete('/posts/:num', async (req, res) => {
  try {
    let { num } = req.params

    if (!+num) {
      return res.json({ Yomon_habar: 'the type of postid should be a number!' })
    }

    let posts = await read_db('post')
    let idx = -1

    posts.find((obj, i) => {
      if (obj['id'] == num) {
        idx = i
        return true
      }
    })

    if (idx == -1) {
      return res.json({ Yomon_habar: 'post topilmadi!' })
    }
    posts.splice(idx, 1)
    await write_db('post', posts)
    return res.json({ Essiz: 'post uchirildi!' })
  } catch (xato) {
    console.log(xato)
  }
})

app.listen(PORT, () =>
  console.log('Server is running http://localhost:' + PORT)
)

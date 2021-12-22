const fs = require('fs/promises')
const { join } = require('path')

/**
 *
 * @param {"post" | "comment"} qaysi
 */
async function read_db(qaysi) {
  let posts = '{}'
  if (qaysi == 'post') {
    posts = await fs.readFile(
      join(process.cwd(), 'src', 'database', 'posts.db.json')
    )
    return JSON.parse(posts)
  } else {
    posts = await fs.readFile(
      join(process.cwd(), 'src', 'database', 'comments.db.json')
    )
    return JSON.parse(posts)
  }
}
/**
 *
 * @param { "post" | "comment" } qaysi
 * @param { Object } data
 */
async function write_db(qaysi, data) {
  if (qaysi == 'post') {
    await fs.writeFile(
      join(process.cwd(), 'src', 'database', 'posts.db.json'),
      JSON.stringify(data, null, 4)
    )
  } else {
    await fs.writeFile(
      join(process.cwd(), 'src', 'database', 'comments.db.json'),
      JSON.stringify(data, null, 4)
    )
  }
}

module.exports = {
  read_db,
  write_db,
}

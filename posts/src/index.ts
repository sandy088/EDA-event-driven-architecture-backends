import { Hono } from 'hono'
import postRoute from './routes/posts'
import { connect } from './config/db.config'

const app = new Hono()

connect()

app.route('/posts', postRoute)

export default app

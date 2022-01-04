import config from '../common/config'
import app from './server'

config()

const port = Number(process.env.PORT ?? 3000)
app().then(app => app.listen(port, () => {
  console.log(`Express server started on port ${port}.`)
})).catch(err => console.error(err))

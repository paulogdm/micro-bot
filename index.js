const Discord = require('discord.js')
const { router, get } = require('microrouter')
const { send } = require('micro')
var client

process.BOT_LOCK = false

// pong
const pong = msg => msg.reply('Pong!')

const msgHandler = msg => {
  const str = msg.toString()

  if (!str.startsWith('!')) {
    return
  }

  if (str === '!ping') {
    return pong(msg)
  }
}

const launchDiscordClient = async (token) => {
  client = new Discord.Client()

  client.on('message', msgHandler)

  await client.login(token)

  return client.user.tag + ' is alive!'
}

const setup = async (req, res) => {
  const { token } = req.query

  if (!token) {
    return send(res, 400, {err: 'Bad Params',
      message: 'Please provide a token.',
      data: {
        eg: '.../new?token=<BOTTOKEN>'
      }
    })
  }

  return launchDiscordClient(token)
}

const notfound = (req, res) => send(res, 404, 'Not found route')

module.exports = router(
  get('/new', setup),
  get('/*', notfound)
)

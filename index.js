const Discord = require('discord.js')
const { router, get } = require('microrouter')
const { send } = require('micro')
const Over = require('oversmash')
const oversmash = Over.default()
let client

const pong = msg => msg.reply('Pong!')

const msgHandler = msg => {
  const str = msg.toString()

  if (!str.startsWith('!')) {
    return
  }

  if (str === '!ping') {
    return pong(msg)
  }

  if (str.includes('!player')) {
    return fetchPlayer(msg)
  }
}

const fetchPlayer = async msg => {
  const str = msg.toString()

  if (!str.includes('#')) msg.reply('Hmmm, something is not right. Try !player "nick#12345"')

  const player = str.split(' ').pop().split('#').join('-')
  try {
    const {name, stats} = await oversmash.playerStats(player, 'us', 'pc')

    if (stats && stats.competitiveRank) {
      msg.reply(name.split('-').join('#') + ' is SR' + stats.competitiveRank)
    } else {
      msg.reply(name.split('-').join('#') + ' not ranked yet...')
    }
  } catch (err) {
    console.error(err)
    msg.reply('I\'m dead sir...')
  }
}

const launchDiscordClient = async (token) => {
  if (client) return

  client = new Discord.Client()

  client.on('message', msgHandler)

  await client.login(token)

  return client.user.tag + ' is alive!'
}

const setup = async (req, res) => {
  // Query provided by microrouter
  const { token } = req.query

  // No token is provided. Bad Params man...
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

const notfound = (req, res) => send(res, 404, 'Not Found =(')

module.exports = router(
  get('/new', setup),
  get('/*', notfound)
)

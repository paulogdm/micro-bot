// Micro deps
const { send } = require('micro')
const { router, get } = require('microrouter')

// Discord
const Discord = require('discord.js')
const client = new Discord.Client()
client.login(process.env.TOKEN)

// Utils
const Over = require('oversmash')
const oversmash = Over.default()

const pong = msg => msg.reply('Pong!')

const msgHandler = msg => {
  const str = msg.toString()

  if (!str.startsWith('!')) {
    return
  }

  if (str === '!ping') {
    return pong(msg)
  }

  if (str.includes('!sr')) {
    return fetchPlayer(msg)
  }
}

client.on('message', msgHandler)

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

const notfound = (req, res) => send(res, 404, 'Not Found =(')

module.exports = router(
  get('/*', notfound)
)

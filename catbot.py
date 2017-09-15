# Import this module to start Catbot.
from asyncio import sleep
from discord import Game, User
from discord.ext import commands
from wolframalpha import Client
from requests import get
from random import randint, randrange
from logging import basicConfig, DEBUG
from db_interface import get_api_key, is_admin
from database import ApiKey
from constants import BOT_HELP_TEXT, BOT_ROLL_DEFAULT_MAX, CATFACT_URL, CATBOT_GOODSHIT_TEXT, WOLFRAM_IDENTIFY_URL, \
    STATUS_CHANGE_TIMEOUT_SECS, CATBOT_JACK_IN_TEXT, CATBOT_PET_TEXT
from helpers import get_channel_by_id
# Change this import line to change GPP
from gpp.catbot_default import NAME, PLAYING, RESPONSES
basicConfig(level=DEBUG)

# Bot client object
client = commands.Bot(command_prefix='!catbot ')

# If set to False, disables replies
client_reply_state = True


@client.event
async def on_ready():
    await client.edit_profile(username=NAME)
    print('{} with id {} is ready, myan!'.format(client.user.name, client.user.id))
    await client.change_presence(game=Game(name=PLAYING[randrange(len(PLAYING))]))
    # await shuffle_status_and_loop()  # Loops forever

async def shuffle_status_and_loop():
    while True:
        await client.change_presence(game=Game(name=PLAYING[randrange(len(PLAYING))]))
        await sleep(STATUS_CHANGE_TIMEOUT_SECS)

@client.event
async def on_message(message):
    if client.user.id not in message.content or not client_reply_state:
        await client.process_commands(message)
        return

    # Catbot was mentioned
    await client.send_message(message.channel, RESPONSES[randrange(len(PLAYING))])
    await client.process_commands(message)


# COMMANDS

@client.command(name='alpha')
async def catbot_alpha(*, query: str):
    wolfram_client = Client(get_api_key(ApiKey.WOLFRAM))
    raw_result = wolfram_client.query(query)

    if raw_result.success == 'false':
        await client.say('¯\_(=ツ=)_/¯ Ｉ　ｄｕｎｎｏ　ｌｏｌ')
        return
    await client.say('```{}```'.format(next(raw_result.results).text))

@client.command(name='catfact')
async def catbot_catfact():
    await client.say('```{}```'.format(get(CATFACT_URL).json()['text']))

@client.command(name='goodshit')
async def catbot_goodshit():
    await client.say(CATBOT_GOODSHIT_TEXT)

@client.command(name='identify')
async def catbot_identify(img_url: str):
    result = get(WOLFRAM_IDENTIFY_URL.format(img_url)).json()

    if 'identify' not in result or 'title' not in result['identify']:
        await client.say('arr, dun knｏｗ　ｗｔｆ　ｉｓ　ｔｈａｔ　ｓｏｎ =｀ェ´=')
        return
    await client.say('That looks like **{}**!!'.format(result['identify']['title']))

@client.command(name='jack in')
async def catbot_jack_in():
    await client.say(CATBOT_JACK_IN_TEXT)

@client.command(name='pet')
async def catbot_pet():
    await client.say(CATBOT_PET_TEXT)

@client.command(name='play', pass_context=True)
async def catbot_play(ctx):
    message_text = ctx.clean_content
    pass  # TODO

@client.command(name='roll')
async def catbot_roll(roll_min_or_max=None, roll_max: int=None):
    # Convert 'd20' to 20
    roll_min_or_max = int(roll_min_or_max.replace('d', ''))

    if not roll_min_or_max and not roll_max:
        # Roll a default value
        roll_min = 1
        roll_max = BOT_ROLL_DEFAULT_MAX
    elif not roll_max:
        # Then first param is max, starting from 0
        roll_min = 1
        roll_max = int(roll_min_or_max)
    else:
        # Then roll the range provided
        roll_min = int(roll_min_or_max)
        roll_max = int(roll_max)
    result = randint(roll_min, roll_max)

    # Special messages
    if roll_min == roll_max:
        special_msg = '_The cat rolls a one-sided dice. It looks like nothing you\'ve ever seen._\n'
    elif result == roll_min:
        special_msg = '**Critical failure... :c**\n'
    elif result == roll_max:
        special_msg = '**=ㅇㅅㅇ❀= THE KETTERS HAVE BLESSED YOU TODAY =ㅇㅅㅇ❀=**\n'
    else:
        special_msg = ''

    await client.say('{}The cat baps a die. It falls on **{}**!'.format(special_msg, result))

@client.command(name='say', pass_context=True)
async def catbot_say(ctx):
    message_text = ctx.clean_content
    pass  # TODO

@client.command(name='shut up')
async def catbot_shut_up():
    await catbot_stop()

@client.command(name='stop')
async def catbot_stop():
    pass  # TODO

@client.command(name='video', pass_context=True)
async def catbot_video(ctx):
    message_text = ctx.clean_content
    pass  # TODO

@client.command(name='volume', pass_context=True)
async def catbot_volume(ctx):
    message_text = ctx.clean_content
    pass  # TODO

@client.group(name='_admin', pass_context=True)
async def admin():
    pass

@admin.command(name='chat', pass_context=True)
async def catbot_admin_chat(ctx, channel_id: str, message: str):
    user = ctx.message.author
    channel = get_channel_by_id(client, channel_id)

    if not user or not channel or not is_admin(user.id):
        return
    await client.send_message(channel, message)

@admin.command(name='join_v', pass_context=True)
async def catbot_admin_join_v(ctx, channel_id: str):
    user = ctx.message.author
    channel = get_channel_by_id(client, channel_id)

    if not user or not is_admin(user.id):
        return
    await client.join_voice_channel(channel)

@admin.command(name='t_reply', pass_context=True)
async def catbot_admin_t_reply(ctx):
    global client_reply_state
    user = ctx.message.author

    if not user or not is_admin(user.id):
        return

    # Toggle replies on or off
    client_reply_state = not client_reply_state
    await client.send_message(
        ctx.message.channel,
        'Reply state is now {}, myan!'.format(client_reply_state)
    )


@client.command(name='help2', pass_context=True)
async def catbot_help():
    await client.say(BOT_HELP_TEXT)

"""
TODO commands

"!catbot alpha"
"!catbot catfact"
"!catbot goodshit"
"!catbot identify"
"!catbot img"
"!catbot jack in"
"!catbot pet"
"!catbot play"
"!catbot react"
"!catbot roll"
"!catbot say"
"!catbot shut up"
"!catbot stop"
"!catbot video"
"!catbot volume"
"!catbot _admin chat"
"!catbot _admin join_v"
"!catbot _admin t_reply"
"!catbot help"
"""

# Connect and start
print("STARTING")
client.run(get_api_key(ApiKey.DISCORD))

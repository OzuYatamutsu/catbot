# Import this module to start Catbot.
from discord import Game
from discord.ext import commands
from wolframalpha import Client
from requests import get
from random import randint
from logging import basicConfig, DEBUG
from db_interface import get_api_key, is_admin
from database import ApiKey
from constants import BOT_HELP_TEXT, BOT_ROLL_DEFAULT_MAX, CATFACT_URL, CATBOT_GOODSHIT_TEXT, WOLFRAM_IDENTIFY_URL
basicConfig(level=DEBUG)

# Bot client object
client = commands.Bot(command_prefix='!catbot ')

@client.event
async def on_ready():
    await client.edit_profile(username="Catbot_v2_testing")
    await client.change_presence(game=Game(name="PAINFUL REPROGRAMMING MEMES"))
    print('{} with id {} is ready, myan!'.format(client.user.name, client.user.id))

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

@client.command(name='img', pass_context=True)
async def catbot_img(ctx):
    message_text = ctx.clean_content
    pass  # TODO

@client.command(name='jack in', pass_context=True)
async def catbot_jack_in(ctx):
    message_text = ctx.clean_content
    pass  # TODO

@client.command(name='pet', pass_context=True)
async def catbot_pet(ctx):
    message_text = ctx.clean_content
    pass  # TODO

@client.command(name='play', pass_context=True)
async def catbot_play(ctx):
    message_text = ctx.clean_content
    pass  # TODO

@client.command(name='react', pass_context=True)
async def catbot_react(ctx):
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

@client.command(name='shut up', pass_context=True)
async def catbot_shut_up(ctx):
    message_text = ctx.clean_content
    pass  # TODO

@client.command(name='stop', pass_context=True)
async def catbot_stop(ctx):
    message_text = ctx.clean_content
    pass  # TODO

@client.command(name='video', pass_context=True)
async def catbot_video(ctx):
    message_text = ctx.clean_content
    pass  # TODO

@client.command(name='volume', pass_context=True)
async def catbot_volume(ctx):
    message_text = ctx.clean_content
    pass  # TODO

@client.command(name='_admin chat', pass_context=True)
async def catbot_admin_chat(ctx):
    message_text = ctx.clean_content
    pass  # TODO

@client.command(name='_admin join_v', pass_context=True)
async def catbot_admin_join_v(ctx):
    message_text = ctx.clean_content
    pass  # TODO

@client.command(name='_admin t_reply', pass_context=True)
async def catbot_admin_t_reply(ctx):
    message_text = ctx.clean_content
    pass  # TODO

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

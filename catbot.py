# Import this module to start Catbot.
from asyncio import sleep
from uuid import uuid4
from ctypes.util import find_library
from discord import Game
from discord.ext import commands
from discord.opus import load_opus
from gtts import gTTS
from wolframalpha import Client
from requests import get
from random import randint, randrange
from logging import basicConfig, DEBUG
from db_interface import get_api_key, is_admin
from database import ApiKey
from constants import BOT_HELP_TEXT, BOT_ROLL_DEFAULT_MAX, CATFACT_URL, CATBOT_GOODSHIT_TEXT, WOLFRAM_IDENTIFY_URL, \
    STATUS_CHANGE_TIMEOUT_SECS, CATBOT_JACK_IN_TEXT, CATBOT_PET_TEXT, DISABLE_STATUS_LOOP
from helpers import get_channel_by_id, get_channel_by_server_and_name, prep_tmp_directory, match_in_command_list
# Change this import line to change GPP
from gpp.catbot_default import NAME, PLAYING, RESPONSES
basicConfig(level=DEBUG)

# Bot client object
client = commands.Bot(command_prefix='!catbot ')
client.remove_command('help')  # Remove built-in help formatter

# If set to False, disables replies
client_reply_state = True

# Ensure only one voice stream is playing at a time
active_voice_channel = None
active_audio_stream = None


@client.event
async def on_ready():
    load_opus(find_library('opus'))
    prep_tmp_directory()
    if client.user.name != NAME:
        await client.edit_profile(username=NAME)
    print('{} with id {} is ready, myan!'.format(client.user.name, client.user.id))
    if not DISABLE_STATUS_LOOP:
        await shuffle_status_and_loop()  # Loops forever

async def shuffle_status_and_loop():
    while True:
        await client.change_presence(game=Game(name=PLAYING[randrange(len(PLAYING))]))
        await sleep(STATUS_CHANGE_TIMEOUT_SECS)

@client.event
async def on_message(message):
    if client.user.id not in message.content or not client_reply_state:
        await client.process_commands(message)
        return
    if client.user.id in message.content and match_in_command_list(client, message.clean_content):
        # @Catbot was used to invoke a command instead of !catbot
        message.content = message.content.replace('<@{}>'.format(client.user.id), '!catbot')
        await client.process_commands(message)
        return

    # Catbot was mentioned, but not as a command
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
async def catbot_play(ctx, channel_name: str, youtube_link: str):
    global active_audio_stream
    global active_voice_channel

    voice_channel = get_channel_by_server_and_name(client, ctx.message.server, channel_name)
    if not voice_channel:
        await client.say('Couldn\'t find channel named {}, myan! :c'.format(channel_name))
        return

    await _reset_voice_state()
    active_voice_channel = await client.join_voice_channel(voice_channel)
    active_audio_stream = await active_voice_channel.create_ytdl_player(youtube_link)
    active_audio_stream.start()


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
async def catbot_say(ctx, channel_name: str, *, tts_text: str):
    global active_audio_stream
    global active_voice_channel

    voice_channel = get_channel_by_server_and_name(client, ctx.message.server, channel_name)
    if not voice_channel:
        await client.say('Couldn\'t find channel named {}, myan! :c'.format(channel_name))
        return

    await _reset_voice_state()

    speech_text = gTTS(text=tts_text, lang='en', slow=True)
    speech_tmp_file = 'tmp/{}.mp3'.format(uuid4().hex)
    speech_text.save(speech_tmp_file)
    active_voice_channel = await client.join_voice_channel(voice_channel)
    active_audio_stream = active_voice_channel.create_ffmpeg_player(speech_tmp_file)
    active_audio_stream.start()

@client.group(name='shut', pass_context=True)
async def shut():
    pass  # Only exists for the meme immediately below

@shut.command(name='up')
async def catbot_shut_up():
    await client.say('Okay :c')
    await _reset_voice_state()

@client.command(name='stop')
async def catbot_stop():
    await _reset_voice_state()

@client.command(name='volume')
async def catbot_volume(percent):
    global active_audio_stream

    if not active_audio_stream:
        await client.say('I\'m not playin\' anything, myan! >:c')
        return

    percent = percent.replace('%', '')
    await client.say('Okay!! Setting volume to {}%! :3'.format(percent))
    active_audio_stream.volume = float(percent) * 0.01

@client.group(name='_admin', pass_context=True)
async def admin():
    pass  # Leave this here to establish command group

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

    await _reset_voice_state()
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

@admin.command(name='set_status', pass_context=True)
async def catbot_admin_set_status(ctx, message: str):
    user = ctx.message.author

    if not user or not is_admin(user.id):
        return
    await client.change_presence(game=Game(name=message))

@client.command(name='help', pass_context=True)
async def catbot_help():
    await client.say(BOT_HELP_TEXT)

async def _reset_voice_state():
    global active_audio_stream
    global active_voice_channel

    try:
        if active_audio_stream:
            await active_audio_stream.stop()
            active_audio_stream = None
    except Exception as e:
        print("Swallowing voice warning: {}".format(e))

    try:
        if active_voice_channel:
            await active_voice_channel.disconnect()
            active_voice_channel = None
    except Exception as e:
        print("Swallowing voice warning: {}".format(e))

# Connect and start
print("STARTING")
client.run(get_api_key(ApiKey.DISCORD))

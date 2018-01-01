DATA_FILE = 'catbot-data.sqlite3'

DB_API_KEY_CREATE_TABLE_QUERY = """CREATE TABLE IF NOT EXISTS api_keys
                                   (type string PRIMARY KEY, value string)"""
DB_ADMINS_CREATE_TABLE_QUERY = """CREATE TABLE IF NOT EXISTS admins
                                  (user_id real PRIMARY KEY)"""
DB_USER_CHANGES_CREATE_TABLE_QUERY = """CREATE TABLE IF NOT EXISTS user_changes
                                  (guild_id NUMERIC, user_id NUMERIC, username TEXT,
                                   status_change TEXT, timestamp INTEGER , PRIMARY KEY (guild_id, user_id, timestamp));"""


DB_CHECK_TABLE_EXIST_QUERY = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name=?"
DB_API_KEY_INSERT_QUERY = "INSERT INTO api_keys VALUES (?,?)"
DB_ADMIN_INSERT_QUERY = "INSERT INTO admins VALUES (?)"
DB_USER_CHANGES_INSERT_QUERY = "INSERT INTO user_changes VALUES (?,?,?,?,?)"
DB_GET_API_KEY = "SELECT value FROM api_keys WHERE type=?"
DB_GET_ADMIN = "SELECT user_id FROM admins WHERE user_id=?"

DB_DISCORD_API_KEY_NAME = 'discord'
DB_GOOGLE_API_KEY_NAME = 'google'
DB_GOOGLE_IMAGES_API_KEY_NAME = 'google_images'
DB_WOLFRAM_API_KEY_NAME = 'wolfram'

COMMAND_TOKEN_MATCH_LIST = []

BOT_HELP_TEXT = """
`ａｈｈ　ｙｉｓｓ，　ｄａ　ＨＥＬＰＴＥＸＴ　ｙｏｕ　ｏｒｄｅｒ　=｀ω´=`

**Voice channels**
`!catbot play <voice_channel> <youtube_link>` - Plays a YouTube video in <voice_channel>.

`!catbot say <voice_channel> <text>` - Catbot says <text> in <voice_channel>.

`!catbot volume <percent>` - Sets Catbot's voice volume.

`!catbot stop` - Stops Catbot from playing audio in voice channels.

**Text channels**
`!catbot alpha <search>` - Interprets <search> and gives you an answer (Wolfram|Alpha).

`!catbot catfact` - Returns a random catfact.

`!catbot roll <num> [num2]` - Rolls a random number between 0 - <num>, or <num> - [num2].

`!catbot identify <image_link>` - Tries to tell you what your picture looks like!

`!catbot img <search>` - Finds <search> on Google Images.

```
"Talk to your ket!! =´∇｀="
 - Jinhai.
```
"""

BOT_ROLL_DEFAULT_MAX = 20
DISABLE_STATUS_LOOP = True
CATFACT_URL = "https://caas.steakscorp.org/api/"
CATBOT_GOODSHIT_TEXT = "👌 👀 👌 👀 👌 👀 👌 👀 👌 👀 ｇｏｏｄ　ｓｈＩｔ　ｇｏＯＤ　ＳＨＩ　Ｔ 👌 ｔ　ｈａｔ＇ｓ　ｓｏｍｅ　" \
                       "ＧＯＯＤ　ＫＥＴ　✔ ｒｉｇht dere b0ss . =｀ω´= 🙀 🙀 🙀 some gOODSHhit right 👌 👌 there 👌 👌 👌 " \
                       "right ✔ ✔ there ✔ ✔ if iｇｏ　ｋｅｔ　ｍ　ｙ　ｓｅｌ　ｆ 💯 I sssａｙ　ｓｏ 💯 ｔｈａｔ　ｗａｔ　" \
                       "ｉ　ｔａｌｋ　ａｂｏｕｔ　ｒｉｇｈｔ　ｄｅｒｅ　ｂ０ｓｓ　．"
WOLFRAM_IDENTIFY_URL = "https://www.imageidentify.com/objects/user-26a7681f-4b48-4f71-8f9f-93030898d70d/prd/urlapi?image={}"
STATUS_CHANGE_TIMEOUT_SECS = 1800
CATBOT_JACK_IN_TEXT = "http://steakscorp.org/expressions.png/Jacking_in.mp3"
CATBOT_PET_TEXT = "=´ω｀="

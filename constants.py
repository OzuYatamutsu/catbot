DATA_FILE = 'catbot-data.sqlite3'

DB_API_KEY_CREATE_TABLE_QUERY = """CREATE TABLE IF NOT EXISTS api_keys
                                   (type string PRIMARY KEY, value string)"""
DB_ADMINS_CREATE_TABLE_QUERY = """CREATE TABLE IF NOT EXISTS admins
                                  (user_id real PRIMARY KEY)"""

DB_CHECK_TABLE_EXIST_QUERY = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name=?"
DB_API_KEY_INSERT_QUERY = "INSERT INTO api_keys VALUES (?,?)"
DB_ADMIN_INSERT_QUERY = "INSERT INTO admins VALUES (?)"
DB_GET_API_KEY = "SELECT value FROM api_keys WHERE type=?"
DB_GET_ADMIN = "SELECT user_id FROM admins WHERE user_id=?"

DB_DISCORD_API_KEY_NAME = 'discord'
DB_GOOGLE_API_KEY_NAME = 'google'
DB_GOOGLE_IMAGES_API_KEY_NAME = 'google_images'
DB_WOLFRAM_API_KEY_NAME = 'wolfram'

from constants import DATA_FILE, DB_DISCORD_API_KEY_NAME, DB_GOOGLE_API_KEY_NAME, \
    DB_GOOGLE_IMAGES_API_KEY_NAME, DB_WOLFRAM_API_KEY_NAME
from sqlite3 import connect, Connection
from enum import Enum

_db = None


class DatabaseSingleton:
    """
    Recycling is good! Let's recycle db connection objects :3
    """

    def __init__(self):
        global _db
        if _db is None:
            _db = connect(DATA_FILE)

    def get_db(self) -> Connection:
        """
        Returns the currently open (hopefully) handler to the sqlite3 db
        """

        global _db
        return _db

    def close(self):
        """
        Cleanup connection
        """

        global _db
        if _db is not None:
            _db.close()


class ApiKey(Enum):
    DISCORD = 0,
    GOOGLE = 1,
    GOOGLE_IMAGES = 2,
    WOLFRAM = 3

DB_API_KEY_ENUM_TO_VALUE_MAP = {
    ApiKey.DISCORD: DB_DISCORD_API_KEY_NAME,
    ApiKey.GOOGLE: DB_GOOGLE_API_KEY_NAME,
    ApiKey.GOOGLE_IMAGES: DB_GOOGLE_IMAGES_API_KEY_NAME,
    ApiKey.WOLFRAM: DB_WOLFRAM_API_KEY_NAME
}
from database import DatabaseSingleton, ApiKey, DB_API_KEY_ENUM_TO_VALUE_MAP
from constants import DB_DISCORD_API_KEY_NAME, DB_API_KEY_INSERT_QUERY, DB_CHECK_TABLE_EXIST_QUERY, \
    DB_API_KEY_CREATE_TABLE_QUERY, DB_ADMINS_CREATE_TABLE_QUERY, DB_ADMIN_INSERT_QUERY, DB_GET_API_KEY, \
    DB_GET_ADMIN, DB_USER_CHANGES_CREATE_TABLE_QUERY, DB_USER_CHANGES_INSERT_QUERY


def insert_api_key(key_type: ApiKey, value: str):
    """
    Inserts a key into the api_keys table.
    """

    if not does_table_exist('api_keys'):
        _create_api_key_table()

    db = DatabaseSingleton().get_db()
    cursor = db.cursor()

    cursor.execute(
        DB_API_KEY_INSERT_QUERY, (DB_API_KEY_ENUM_TO_VALUE_MAP[key_type], value)
    )

    db.commit()

def get_api_key(key_type: ApiKey) -> str:
    """
    Returns an API key of a given type.
    """

    db = DatabaseSingleton().get_db()
    cursor = db.cursor()

    cursor.execute(DB_GET_API_KEY, (DB_API_KEY_ENUM_TO_VALUE_MAP[key_type],))
    return cursor.fetchone()[0]

def is_admin(user_id: int) -> bool:
    """
    Returns True if the given user_id is an admin.
    """

    db = DatabaseSingleton().get_db()
    cursor = db.cursor()

    cursor.execute(DB_GET_ADMIN, (user_id,))
    return len(cursor.fetchall()) >= 1

def insert_admin(user_id: int):
    """
    Inserts a new admin (by user id) into the admins table.
    """

    if not does_table_exist('admins'):
        _create_admins_table()

    db = DatabaseSingleton().get_db()
    cursor = db.cursor()

    cursor.execute(
        DB_ADMIN_INSERT_QUERY, (user_id, )
    )

    db.commit()

def does_table_exist(table_name: str) -> bool:
    """
    Returns True if the table exists.
    """

    db = DatabaseSingleton().get_db()
    cursor = db.cursor()

    return cursor.execute(DB_CHECK_TABLE_EXIST_QUERY, (table_name, )).fetchone() == 1

def _create_api_key_table():
    db = DatabaseSingleton().get_db()
    cursor = db.cursor()

    cursor.execute(DB_API_KEY_CREATE_TABLE_QUERY)
    db.commit()

def _create_admins_table():
    db = DatabaseSingleton().get_db()
    cursor = db.cursor()

    cursor.execute(DB_ADMINS_CREATE_TABLE_QUERY)
    db.commit()

def _create_user_changes_table():
    db = DatabaseSingleton().get_db()
    cursor = db.cursor()

    cursor.execute(DB_USER_CHANGES_CREATE_TABLE_QUERY)
    db.commit()

def insert_user_change(guild_id, user_id, username, status_change):
    if not does_table_exist('user_changes'):
        _create_user_changes_table()

    db = DatabaseSingleton().get_db()
    cursor = db.cursor()

    cursor.execute(DB_USER_CHANGES_INSERT_QUERY,
    (guild_id, user_id, username, status_change))

    db.commit()

from db_interface import insert_api_key, insert_admin
from database import ApiKey
from constants import DATA_FILE
from logging import getLogger
from discord import Client
log = getLogger(__name__)


# Interactive first-time setup
def run_setup():
    log.info('Setting up Catbot for first time use, myan!')

    discord_token = input('What is your bot\'s token? ')
    
    admin_ids = input('Which users should have admin powers over this bot? Enter their IDs, separated by commas: ')\
        .replace(' ', '').split(',')

    for admin_id in admin_ids:
        if not admin_id.isdigit():
            raise ValueError('Error: {} is not a valid ID. (Discord IDs are numbers.)'.format(admin_id))

    google_api_key = input('What is your Google API key? ')
    google_image_api_key = input('What is your Google Image API key? ')
    wolfram_api_key = input('What is your Wolfram API key? ')

    log.info("Committing to db.")
    insert_api_key(ApiKey.DISCORD, discord_token.strip())
    insert_api_key(ApiKey.GOOGLE, google_api_key.strip())
    insert_api_key(ApiKey.GOOGLE_IMAGES, google_image_api_key.strip())
    insert_api_key(ApiKey.WOLFRAM, wolfram_api_key.strip())
    for admin_id in admin_ids:
        insert_admin(int(admin_id))

    log.info("...done! To modify values later, check %s.", DATA_FILE)

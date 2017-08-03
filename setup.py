from logging import getLogger
log = getLogger(__name__)


# Interactive first-time setup
def run_setup():
    log.info('Setting up Catbot for first time use.')

    token = input('What is your bot\'s token? ')
    log.info('Testing connectivity to Discord.')
    # TODO test connection here
    # TODO insert into sqlite3

    admin_ids = input('Which users should have admin powers over this bot? Enter their IDs, separated by commas: ')\
        .replace(' ', '').split(',')
    # TODO check regex and strip ids which don't fit
    # TODO insert into sqlite3

    # TODO Google API key
    # TODO Google image API key
    # TODO Wolfram API key

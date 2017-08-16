from constants import DATA_FILE
from bot_handler import run_bot
from setup import run_setup
from os.path import isfile

# Check to see if we need to run setup
if not isfile(DATA_FILE):
    run_setup()

run_bot()
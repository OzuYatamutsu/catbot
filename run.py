from catbot.constants import DATA_FILE
from catbot.setup import run_setup()
from os.path import isfile

# Check to see if we need to run setup
if not isfile(DATA_FILE):

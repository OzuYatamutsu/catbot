from constants import DATA_FILE
from setup import run_setup
from os.path import isfile

# Check to see if we need to run setup
if not isfile(DATA_FILE):
    run_setup()

# Start bot from module-level code and import handlers
from catbot import *

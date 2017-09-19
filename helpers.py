from shutil import rmtree
from os import makedirs, path, getcwd, sep
from discord import Server, Channel, ChannelType
from discord.utils import get


def get_channel_by_id(client, channel_id: str) -> Channel:
    """
    Returns the Channel object corresponding to the given ID
    """

    return get(
        client.get_all_channels(),
        id=channel_id
    )

def get_channel_by_server_and_name(client, server: Server, channel_name: str) -> Channel:
    """
    Returns the Channel object corresponding to the given Server and name.
    This search is case-insensitive.
    """

    case_insensitive_channels = list(client.get_all_channels())
    for channel in case_insensitive_channels:
        setattr(channel, 'name', channel.name.lower())

    return get(
        case_insensitive_channels,
        server=server,
        name=channel_name.lower(),
        type=ChannelType.voice
    )

def prep_tmp_directory():
    """
    Cleans ./tmp of any temporary files. If it does not exist, creates it.
    """

    tmp_path = '{}{}{}'.format(getcwd(), sep, 'tmp')
    if path.isdir(tmp_path):
        rmtree(tmp_path)
    makedirs(tmp_path)

def match_in_command_list(client, message_text: str) -> bool:
    """
    Returns True if an @Catbot mention corresponds to a !catbot command.
    """

    return any(
        cmd_token.lower() in message_text.lower() for cmd_token in [
            command.format('@{}'.format(client.user.name.lower())) for command in list(client.commands)
        ]
    )

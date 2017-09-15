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

    # Get the ID; don't return the channel object itself, 'cause it's been transformed above
    channel_id = get(
        case_insensitive_channels,
        server=server,
        name=channel_name.lower(),
        type=ChannelType.voice
    ).id

    return get(
        client.get_all_channels(),
        server=server,
        type=ChannelType.voice,
        id=channel_id
    )

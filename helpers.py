from discord import Channel
from discord.utils import get


def get_channel_by_id(client, channel_id: str) -> Channel:
    """
    Returns the Channel object corresponding to the given ID
    """

    return get(
        client.get_all_channels(),
        id=channel_id
    )
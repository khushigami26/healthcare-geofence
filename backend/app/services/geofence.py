from math import radians, sin, cos, sqrt, atan2


EARTH_RADIUS_METERS = 6371000


def calculate_distance(
    latitude1: float,
    longitude1: float,
    latitude2: float,
    longitude2: float
) -> float:
    """
    Calculate the distance between two GPS coordinates in meters.
    """

    latitude1 = radians(latitude1)
    longitude1 = radians(longitude1)

    latitude2 = radians(latitude2)
    longitude2 = radians(longitude2)

    latitude_difference = latitude2 - latitude1
    longitude_difference = longitude2 - longitude1

    value = (
        sin(latitude_difference / 2) ** 2
        + cos(latitude1)
        * cos(latitude2)
        * sin(longitude_difference / 2) ** 2
    )

    angle = 2 * atan2(
        sqrt(value),
        sqrt(1 - value)
    )

    return EARTH_RADIUS_METERS * angle


def check_geofence(
    current_latitude: float,
    current_longitude: float,
    location_latitude: float,
    location_longitude: float,
    radius: float
) -> tuple[bool, float]:

    distance = calculate_distance(
        current_latitude,
        current_longitude,
        location_latitude,
        location_longitude
    )

    is_inside = distance <= radius

    return is_inside, distance
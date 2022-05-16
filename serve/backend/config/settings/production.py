from .base import *


DEBUG = False

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql_psycopg2',
#         'NAME': 'occupancy_tracker',
#         'USER': 'ubuntu',
#         'PASSWORD': 'passThis20', # FIXME: Use environment variables instead
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }

INTERNAL_IPS = [
    '127.0.0.1',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'occupancy_tracker',
        'USER': 'postgres',
        'PASSWORD': 'postgres', # FIXME: Use environment variables instead
        'HOST': 'postgres',
        'PORT': '5432',
    }
}

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static/')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')

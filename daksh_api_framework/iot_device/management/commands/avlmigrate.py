import os

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.core.management.base import BaseCommand
from django.db import connection, ProgrammingError

if hasattr(settings, 'PROJECT_ROOT'):
    ROOT = settings.PROJECT_ROOT

else:
    raise ImproperlyConfigured('Set "PROJECT_ROOT" as project root in settings.py')


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument(
            '-i',
            '--initial',
            action='store_true',
            default=False,
            help='Make migration folder for all the apps'
        )
        parser.add_argument(
            '-d',
            '--delete',
            action='store_true',
            default=False,
            help='Deletes all migration folders for all apps and clears migration history from db'
        )

    manage_py = os.path.join(ROOT, 'manage.py')

    def find_app_migrations_path(self, app_name):
        app = __import__(app_name)
        if "." in app_name:
            # FOR apps like widgets.* and screens.*
            path = os.path.join(os.path.dirname(app.__file__), app_name.split(".")[-1:][0], "migrations")
        else:
            path = os.path.join(os.path.dirname(app.__file__), "migrations")
        return path

    def make_initial(self, app_name):
        migrations_path = self.find_app_migrations_path(app_name)
        os.system("mkdir %s" % migrations_path)
        init_path = os.path.join(migrations_path, "__init__.py")
        os.system("touch %s" % init_path)

    def delete(self, app_name):
        migrations_path = self.find_app_migrations_path(app_name)
        os.system("rm -rf %s " % migrations_path)

    def handle(self, *args, **options):
        myapps = list(settings.OUR_APPS)
        if options['initial']:
            print('Creating migration folder for all apps. You may now run python3 manage.py makemigrations')
            for app in myapps:
                self.make_initial(app)
        elif options['delete']:
            print('Deleting folders with migrations...')
            for app in myapps:
                self.delete(app)
            print('Deleting migrations from database...')
            # MigrationHistory.objects.all().delete()
            cursor = connection.cursor()
            try:
                cursor.execute("DELETE FROM django_migrations")
            except ProgrammingError:
                print("No django_migrations table. Seems like you haven't created database yet. If not, something is " \
                      "wrong")

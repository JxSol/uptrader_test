import subprocess

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.core.management import call_command

class Command(BaseCommand):
    help = 'Fast run project'

    def handle(self, *args, **options):
        call_command('makemigrations')
        call_command('migrate')
        if not User.objects.filter(username='admin').exists():
            superuser = User.objects.create_superuser('admin', password='admin')
            print('Суперпользователь "admin" успешно создан')
        call_command('runserver')

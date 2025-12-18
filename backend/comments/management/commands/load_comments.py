import json
import os
from django.core.management.base import BaseCommand
from comments.models import Comment
from dateutil import parser
from django.conf import settings

class Command(BaseCommand):
    help = 'Load comments from JSON'

    def handle(self, *args, **kwargs):
       
        file_path = os.path.join(settings.BASE_DIR.parent, 'comments.json')
        
        with open(file_path, 'r') as file:
            data = json.load(file)
            for item in data['comments']:
                if not Comment.objects.filter(id=item['id']).exists():
                    Comment.objects.create(
                        id=item['id'],
                        author=item['author'],
                        text=item['text'],
                        date=parser.parse(item['date']),
                        likes=item['likes'],
                        image=item['image']
                    )
        self.stdout.write(self.style.SUCCESS('Data loaded successfully!'))
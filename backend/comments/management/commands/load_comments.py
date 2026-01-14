import json
import os
from django.core.management.base import BaseCommand
from comments.models import Comment
from dateutil import parser
from django.conf import settings

class Command(BaseCommand):
    help = 'Load comments from JSON into PostgreSQL'

    def handle(self, *args, **kwargs):

        file_path = os.path.join(settings.BASE_DIR.parent, 'comments.json')
        
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'File not found at: {file_path}'))
            return

        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            count = 0
            
           
            sorted_comments = sorted(data['comments'], key=lambda x: int(x['id']))

            for item in sorted_comments:
                
                raw_parent = item.get('parent', "")
            
                p_id = int(raw_parent) if (raw_parent and str(raw_parent).isdigit()) else None

                
                obj, created = Comment.objects.update_or_create(
                    id=item['id'],
                    defaults={
                        'author': item['author'],
                        'text': item['text'],
                        'date': parser.parse(item['date']),
                        'likes': item['likes'],
                        'image': item['image'],
                       
                        'parent_id': p_id, 
                    }
                )
                
                if created:
                    count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully processed data! Added {count} new records.'))
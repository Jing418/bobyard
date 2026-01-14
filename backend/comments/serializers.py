from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'author', 'text', 'date', 'likes', 'image', 'parent']
        read_only_fields = ['author', 'date']
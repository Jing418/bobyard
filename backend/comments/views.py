from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Comment
from .serializers import CommentSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    # set author as Admin
    def perform_create(self, serializer):
        serializer.save(author="Admin")
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommentViewSet

# Using Router enables the automatic generation of 
# GET (), POST (), PATCH (), and DELETE()
router = DefaultRouter()
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
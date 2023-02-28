from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('batman/', views.batman, name='batman'),
    path('mario/', views.mario, name='mario'),
    path('edit/', views.edit, name='edit'),
    path('<path:anything>/', views.everything, name='everything'),
]

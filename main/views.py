from django.http import HttpResponse
from django.shortcuts import render


def index(request):
    return HttpResponse('Главная страница')


def batman(request):
    return render(request, 'main/batman.html')


def mario(request):
    return render(request, 'main/mario.html')


def everything(request, anything):
    context = {'path': anything.split('/')}
    return render(request, 'main/everything.html', context=context)

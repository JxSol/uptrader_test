from typing import NoReturn

from django import forms
from django.core.validators import RegexValidator
from django.urls import reverse, NoReverseMatch

from .models import Node, Menu

URL_REGEX = r'((http|https)\:\/\/)?(?:localhost|(?:[a-zA-Z0-9\.\/\?\:@\-_=#]+\.(?:[a-zA-Z]){2,6})|(?:(?:(?:[0-9])|(?:[1-9][0-9])|(?:1[0-9]{2})|(?:2(?:[0-4][0-9]|5[0-5])))\.){3}(?:(?:(?:1[0-9]{2})|(?:2(?:[0-4][0-9]|5[0-5]))|(?:[0-9])|[1-9][0-9]))(?::\d{1,4})?)(?:[a-zA-Z0-9\.\&\/\?\:@\-_=#])*'

def validate_url(value: str) -> NoReturn:
    """ Проверяет является ли значение действующим URL или именем URL в проекте. """
    validator = RegexValidator(URL_REGEX)
    try:
        validator(value)
    except forms.ValidationError:
        try:
            reverse(value)
        except NoReverseMatch:
            raise forms.ValidationError('Нет URL с таким именем или адресом.')


class NodeForm(forms.ModelForm):
    title = forms.CharField(
        label='Название',
        label_suffix=':',
        max_length=100,
        required=True,
    )
    url = forms.CharField(
        label='URL',
        label_suffix=':',
        max_length=255,
        required=False,
        validators=[
            validate_url,
        ],
    )


    def make_url(self, data: str) -> str:
        """ Преобразует ссылки и имена url в URL """
        validator = RegexValidator(URL_REGEX)
        try:
            validator(data)
            url = data
        except forms.ValidationError:
            domain = self.data.get('domain')
            url = f'{domain}{reverse(data)}'

        if '://' not in url:
            url = 'http://' + url
        return url

    def clean_url(self):
        url = self.cleaned_data.get('url')
        if url:
            url = self.make_url(url)
        return url


    class Meta:
        model = Node
        fields = (
            'title',
            'url',
        )


class MenuForm(forms.ModelForm):
    class Meta:
        model = Menu
        fields = (
            'title',
            'structure',
        )
        widgets = {
            'structure': forms.HiddenInput(),
        }

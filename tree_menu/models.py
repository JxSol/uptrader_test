from django.db import models


class Menu(models.Model):
    """ Модель меню. """
    title = models.SlugField(
        verbose_name='Название меню',
        max_length=50,
        help_text='Только латинские буквы, цифры, знаки "_" и "-".',
        unique=True,
    )

    structure = models.JSONField(
        verbose_name='Структура меню',
        blank=True,
        null=True,
    )

    class Meta:
        ordering = ['title']
        verbose_name = 'меню'
        verbose_name_plural = 'меню'

    def __str__(self):
        return self.title

from django.db import models


class Node(models.Model):
    """ Модель пункта меню. Не идёт в БД. """
    title = models.CharField(
        verbose_name='Название пункта меню',
        max_length=100,
    )

    url = models.URLField(
        verbose_name='Ссылка',
        max_length=255,
        blank=True,
    )

    class Meta:
        ordering = ['title']
        verbose_name = 'пункт меню'
        verbose_name_plural = 'пункты меню'
        abstract = True
        managed = False

    def __str__(self):
        return self.title


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

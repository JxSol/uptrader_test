from django import template

from tree_menu.models import Menu

register = template.Library()


@register.inclusion_tag('../templates/tree_menu/tree_menu.html')
def draw_menu(menu_name):
    menu_structure = Menu.objects.filter(title=menu_name).first()
    return {
        'menu_name': menu_structure,
    }

from django.contrib import admin
from django.urls import path

from .forms import NodeForm, MenuForm
from .models import Menu
from .views import clean_node


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    change_form_template = 'admin/tree_menu/menu_change.html'

    def change_view(self, request, object_id, form_url="", extra_context=None):
        extra_context = extra_context or {}
        extra_context['add_node_form'] = NodeForm()
        return super().change_view(
            request, object_id, form_url, extra_context=extra_context,
        )

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path('clean_node/', self.admin_site.admin_view(clean_node), name='clean_node')
        ]
        return my_urls + urls

    def get_form(self, request, obj=None, **kwargs):
        return MenuForm


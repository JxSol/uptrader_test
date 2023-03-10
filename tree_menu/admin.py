from django.contrib import admin
from django.shortcuts import redirect
from django.urls import path, reverse

from .forms import NodeForm, MenuForm
from .models import Menu
from .views import clean_node


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    change_form_template = 'admin/tree_menu/menu_change.html'

    def response_add(self, request, obj, post_url_continue=None):
        super().response_add(request, obj, post_url_continue=post_url_continue)
        edit_url = reverse('admin:tree_menu_menu_change', args=[obj.pk])
        return redirect(edit_url)

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


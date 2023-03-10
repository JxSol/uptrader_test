from django.http import JsonResponse
from django.views.decorators.http import require_POST

from tree_menu.forms import NodeForm


@require_POST
def clean_node(request):
    form = NodeForm(request.POST)
    if form.is_valid():
        node = form.cleaned_data
        return JsonResponse({'success': True, 'data': node})
    else:
        return JsonResponse({'success': False, 'errors': form.errors})

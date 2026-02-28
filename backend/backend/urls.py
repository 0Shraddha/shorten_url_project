from django.contrib import admin
from django.urls import path, re_path
from django.views.generic import TemplateView
from api.views import message_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/message/', message_view),

    # React frontend
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]
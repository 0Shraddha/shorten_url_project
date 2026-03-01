
from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404
from django.utils import timezone
import json

from .models import URL, Click
from .rate_limiter import is_rate_limited

from django.views.generic import TemplateView

class ReactAppView(TemplateView):
    template_name = "index.html"

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0]
    return request.META.get('REMOTE_ADDR')


@csrf_exempt
@require_POST
def shorten_url(request):
    ip = get_client_ip(request)
    limited, retry_after = is_rate_limited(ip)

    if limited:
        return JsonResponse(
            {
                "error": "Rate limit exceeded",
                "retry_after_seconds": retry_after
            },
            status=429
        )

    try:
        body = json.loads(request.body)
        original_url = body.get("url")

        if not original_url:
            return JsonResponse({"error": "URL is required"}, status=400)

        # Check if the URL already exists
        url, created = URL.objects.get_or_create(original_url=original_url)

        return JsonResponse({
            "short_url": f"http://localhost:8000/{url.short_code}",
            "alias": url.short_code
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
     
def redirect_url(request, short_code):
    url = get_object_or_404(URL, short_code=short_code)

    # Track click
    Click.objects.create(url=url, timestamp=timezone.now())

    return HttpResponseRedirect(url.original_url)  # Fixed field name
from django.http import JsonResponse

def message_view(request):
    return JsonResponse({"message": "Hello from Django API!"})
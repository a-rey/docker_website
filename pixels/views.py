from django.core.urlresolvers import reverse
from django.shortcuts import redirect
from django.shortcuts import render
from django.http import JsonResponse

from pixels.models import Routine
from pixels.models import Running

def home(request):
  """
  request handler for '/'
  """
  context = {}
  # get a list of all current routines in the DB
  context['routines'] = [routine for routine in Routine.objects.all()]
  # find the currently running routine
  running_pk = Running.objects.get(pk=1).routine_pk
  for routine in context['routines']:
    if routine.pk == running_pk:
      context['running'] = routine
      context['routines'].remove(routine)
      break
  return render(request, 'pixels/index.html', context)


def download(request):
  """
  request handler for '/download'
  """
  response = JsonResponse({'foo': 'bar'})
  return response
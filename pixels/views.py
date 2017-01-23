from django.core.urlresolvers import reverse
from django.shortcuts import get_object_or_404
from django.shortcuts import redirect
from django.shortcuts import render
from django.http import JsonResponse

from pixels.models import Routine
from pixels.models import Running

import base64

def home(request):
  """
  request handler for '/'
  """
  context = {}
  running = Running.objects.get(pk=1)
  if request.method == 'POST':
    # set the new running routine
    print request.POST
  # get a list of all current routines in the DB
  context['routines'] = [routine for routine in Routine.objects.all()]
  # find the currently running routine
  running_pk = running.routine_pk
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
  # find the currently running routine
  running = Routine.objects.get(pk=Running.objects.get(pk=1).routine_pk)
  response = JsonResponse({'title': running.title,
                           'code': base64.b64encode(bytes(running.code))})
  return response

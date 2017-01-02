from django.core.urlresolvers import reverse
from django.shortcuts import redirect
from django.shortcuts import render


def home(request):
  """
  request handler for '/'.
  """
  return render(request, 'pixels/index.html', {})
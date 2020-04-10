import datetime
import django.shortcuts


def main(request):
  """
  request handler for '/'.
  """
  return django.shortcuts.render(request, 'website/index.html', {})

###############################################################################
# Global error handlers for website
###############################################################################

def error_404(request):
  """
  request handler for a 404 error.
  """
  context = {
    't': datetime.datetime.now(),
    'err': '[404 Page Not Found] Invalid path: ' + request.path,
  }
  return django.shortcuts.render(request, 'website/error.html', context)

def error_500(request):
  """
  request handler for a 500 error.
  """
  context = {
    't': datetime.datetime.now(),
    'err': '[500 Server Error] Bad Request: ' + request.path,
  }
  return django.shortcuts.render(request, 'website/error.html', context)

def error_403(request):
  """
  request handler for a 403 error.
  """
  context = {
    't': datetime.datetime.now(),
    'err': '[403 Permission Denied] Invalid permissions for: ' + request.path,
  }
  return django.shortcuts.render(request, 'website/error.html', context)

def error_400(request):
  """
  request handler for a 400 error.
  """
  context = {
    't': datetime.datetime.now(),
    'err': '[400 Bad Request] Bad Request: ' + request.path,
  }
  return django.shortcuts.render(request, 'website/error.html', context)

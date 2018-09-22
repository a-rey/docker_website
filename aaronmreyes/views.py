from django.shortcuts import render

import datetime

def main(request):
  """
  request handler for '/'.
  """
  return render(request, 'aaronmreyes/index.html', {})

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
  return render(request, 'aaronmreyes/error.html', context)

def error_500(request):
  """
  request handler for a 500 error.
  """
  context = {
    't': datetime.datetime.now(),
    'err': '[500 Server Error] Bad Request: ' + request.path,
  }
  return render(request, 'aaronmreyes/error.html', context)

def error_403(request):
  """
  request handler for a 403 error.
  """
  context = {
    't': datetime.datetime.now(),
    'err': '[403 Permission Denied] Invalid permissions for: ' + request.path,
  }
  return render(request, 'aaronmreyes/error.html', context)

def error_400(request):
  """
  request handler for a 400 error.
  """
  context = {
    't': datetime.datetime.now(),
    'err': '[400 Bad Request] Bad Request: ' + request.path,
  }
  return render(request, 'aaronmreyes/error.html', context)

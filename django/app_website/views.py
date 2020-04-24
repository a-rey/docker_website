import django.shortcuts


def main(request):
  """
  request handler for '/'.
  """
  return django.shortcuts.render(request, 'app_website/index.html', {})


# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# global error handlers for app_website
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


def error_400(request, exception):
  """
  request handler for a 400 error.
  """
  context = {
    'err': '[400 Bad Request] Path: ' + request.path,
  }
  return django.shortcuts.render(request, 'app_website/error.html', context)


def error_403(request, exception):
  """
  request handler for a 403 error.
  """
  context = {
    'err': '[403 Permission Denied] Path: ' + request.path,
  }
  return django.shortcuts.render(request, 'app_website/error.html', context)


def error_404(request, exception):
  """
  request handler for a 404 error.
  """
  context = {
    'err': '[404 Page Not Found] Path: ' + request.path,
  }
  return django.shortcuts.render(request, 'app_website/error.html', context)


def error_500(request):
  """
  request handler for a 500 error.
  """
  context = {
    'err': '[500 Server Error] Path: ' + request.path,
  }
  return django.shortcuts.render(request, 'app_website/error.html', context)

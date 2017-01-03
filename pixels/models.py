from django.core.validators import MinLengthValidator
from django.contrib.auth.models import User
from django.db import models


class Running(models.Model):
  """
  represents the currently running routine
  """
  routine_pk = models.IntegerField()


class Routine(models.Model):
  """
  represents a routine to be downloaded and run
  """
  MAX_TITLE_LEN = 50
  MAX_ROUTINE_LEN = 100000

  title = models.CharField(max_length=MAX_TITLE_LEN)
  code = models.BinaryField() # base64 encoded code


from django.contrib import admin

from whoami.models import Asn
from whoami.models import Block
from whoami.models import Location

admin.site.register(Asn)
admin.site.register(Block)
admin.site.register(Location)

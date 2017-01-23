from django.contrib import admin

from pixels.models import Routine
from pixels.models import Running


class RoutineAdmin(admin.ModelAdmin):
  list_display = ('get_title',)

  def get_title(self, obj):
    return obj.title

  get_title.admin_order_field = 'title' # Allows column order sorting
  get_title.short_description = 'Title' # Renames column head in UI


class RunningAdmin(admin.ModelAdmin):
  list_display = ('get_routine_pk',)

  def get_routine_pk(self, obj):
    return obj.routine_pk

  get_routine_pk.admin_order_field = 'routine_pk'          # Allows column order sorting
  get_routine_pk.short_description = 'Routine Primary Key' # Renames column head in UI


# register all admin models
admin.site.register(Routine, RoutineAdmin)
admin.site.register(Running, RunningAdmin)

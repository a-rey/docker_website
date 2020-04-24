import django.db.models
import django.db.migrations
import django.utils.timezone


class Migration(django.db.migrations.Migration):
  initial = True

  dependencies = [
  ]

  operations = [
    django.db.migrations.CreateModel(
      name='AsnBlock',
      fields=[
        ('id', django.db.models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('ipv4', django.db.models.BooleanField(default=True)),
        ('ip_start', django.db.models.DecimalField(max_digits=39, decimal_places=0)),
        ('ip_end', django.db.models.DecimalField(max_digits=39, decimal_places=0)),
        ('autonomous_system_organization', django.db.models.CharField(max_length=256)),
        ('created_at', django.db.models.DateTimeField(default=django.utils.timezone.now, editable=False)),
      ],
    ),
    django.db.migrations.CreateModel(
      name='CityBlock',
      fields=[
        ('id', django.db.models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('ipv4', django.db.models.BooleanField(default=True)),
        ('ip_start', django.db.models.DecimalField(max_digits=39, decimal_places=0)),
        ('ip_end', django.db.models.DecimalField(max_digits=39, decimal_places=0)),
        ('geoname_id', django.db.models.IntegerField()),
        ('latitude', django.db.models.FloatField()),
        ('longitude', django.db.models.FloatField()),
        ('created_at', django.db.models.DateTimeField(default=django.utils.timezone.now, editable=False)),
      ],
    ),
    django.db.migrations.CreateModel(
      name='CityLocation',
      fields=[
        ('id', django.db.models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('geoname_id', django.db.models.IntegerField()),
        ('continent_name', django.db.models.CharField(max_length=256)),
        ('country_name', django.db.models.CharField(max_length=256)),
        ('city_name', django.db.models.CharField(max_length=256)),
        ('created_at', django.db.models.DateTimeField(default=django.utils.timezone.now, editable=False)),
      ],
    ),
  ]

# Generated by Django 4.1.7 on 2023-07-03 15:54

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_alter_activeorder_side'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activeorder',
            name='expiration',
            field=models.DateTimeField(default=datetime.datetime(2023, 7, 3, 0, 0)),
        ),
    ]

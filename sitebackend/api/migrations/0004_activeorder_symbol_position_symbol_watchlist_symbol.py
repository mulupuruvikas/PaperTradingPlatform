# Generated by Django 4.1.7 on 2023-06-05 15:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_remove_activeorder_symbol_remove_position_symbol_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='activeorder',
            name='symbol',
            field=models.CharField(default=None, max_length=6),
        ),
        migrations.AddField(
            model_name='position',
            name='symbol',
            field=models.CharField(default=None, max_length=6),
        ),
        migrations.AddField(
            model_name='watchlist',
            name='symbol',
            field=models.CharField(default=None, max_length=6),
        ),
    ]
# Generated by Django 4.1.7 on 2023-07-12 18:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_remove_activeorder_expiration_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activeorder',
            name='type',
            field=models.CharField(choices=[('LIM', 'Limit'), ('MAR', 'Market'), ('MOC', 'MarketonClose'), ('LOC', 'LimitOnClose'), ('STP', 'Stop'), ('STOPLIMIT', 'STOPLIMIT')], max_length=9),
        ),
    ]

# Generated by Django 5.1.4 on 2025-03-26 07:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('owner', '0002_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='owner',
            name='store_name',
        ),
    ]

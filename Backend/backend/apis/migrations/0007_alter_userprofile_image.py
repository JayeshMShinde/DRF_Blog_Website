# Generated by Django 4.2.6 on 2023-10-28 04:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0006_alter_userprofile_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='image',
            field=models.ImageField(default='default.png', upload_to='profile_pics/'),
        ),
    ]
from django.db import models
from django.contrib.auth.models import User

class Owner(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    phone_number=models.CharField(max_length=12)
    address=models.TextField()

    def __str__(self):
        return self.store_name

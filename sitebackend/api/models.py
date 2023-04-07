from django.db import models

# Create your models here.
class User(models.Model):
	name = models.CharField(max_length=100)
	email = models.EmailField(unique=True)
	password = models.CharField(max_length=100)
	balance = models.DecimalField(max_digits=10, decimal_places=2)

class Trade(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)

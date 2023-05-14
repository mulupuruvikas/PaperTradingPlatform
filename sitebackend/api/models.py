from django.db import models

# Create your models here.
class User(models.Model):
	name = models.CharField(max_length=100)
	email = models.EmailField(unique=True)
	password = models.CharField(max_length=100)
	 
	def __str__(self):
		return self.name

class Portfolio(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	created = models.DateTimeField(auto_now_add=True)
	cash = models.DecimalField(max_digits=10, max_decimal_places=2)
	value = models.DecimalField(max_digits=10, max_decimal_places=2)

	 
	def __str__(self):
		return self.user.name

class Holding(models.Model):
	portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
	symbol = models.CharField(max_length=10)
	quantity = models.IntegerField()
	price = models.DecimalField(max_digits=10, max_decimal_places=2)
	
	def __str__(self):
		return self.symbol

class Order(models.Model):
	portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
	symbol = models.CharField(max_length=10)
	quantity = models.IntegerField()
	price = models.DecimalField(max_digits=10, max_decimal_places=2)
	action = models.BooleanField(default=True)
	status = models.CharField(max_length=10, choices=(('OPEN', 'Open'), ('FILLED', 'Filled'), ('CANCELLED', 'Cancelled')))
    created_at = models.DateTimeField(auto_now_add=True)

class Watchlist(models.Model):
	portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)

class WatchShare(models.Model):
	symbol = models.CharField(max_length=10)
	price = models.DecimalField(max_digits=10, max_decimal_places=2)
	volume = models.IntegerField()
	day_low = models.DecimalField(max_digits=10, max_decimal_places=2)
	day_high = models.DecimalField(max_digits=10, max_decimal_places=2)

class Position(models.Model):
	symbol = models.CharField(max_length=10)
	purchase_price = models.DecimalField(max_digits=10, max_decimal_places=2)
	current_price = models.DecimalField(max_digits=10, max_decimal_places=2)
	quantity = models.IntegerField()
	day_change = models.DecimalField(max_digits=10, max_decimal_places=2)
	ytd_change = models.DecimalField(max_digits=10, max_decimal_places=2)
	total_change = models.DecimalField(max_digits=10, max_decimal_places=2)

	def __str__(self):
		return self.symbol


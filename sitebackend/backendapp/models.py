from django.db import models

# Create your models here.
class User(models.Model):
	guid = models.CharField(max_length=100)
	username = models.CharField(max_length=100)
	portfolio = models.ForeignKey('PORTFOLIO', on_delete=models.CASCADE);
	created = models.DateTimeField(auto_now_add=True);

	def __str__(self):
		return f"{guid}"

class Portfolio(models.Model):
	guid = models.CharField(max_length=100)
	user_id = models.CharField(max_length=100)
	cash = models.DecimalField(decimal_places=2)
	value_change_percent = models.DecimalField(decimal_places=2)
	value_change_dollar = models.DecimalField(decimal_places=2)
	watchlist = models.ManyToManyField(Stock)
	holdings = models.ManyToManyField(Position)
	activity = models.ManyToManyField(Active)

	def __str__(self):
		return f"{guid}"

class Stock(models.Model):
	symbol = models.CharField(max_length=10)
	price = models.DecimalField(max_digits=15, decimal_places=2)
	volume = models.IntegerField()
	day_low = models.DecimalField(max_digits=15, decimal_places=2)
	day_high = models.DecimalField(max_digits=15, decimal_places=2)
	wk_low = models.DecimalField(max_digits=15, decimal_places=2)
	wk_high = models.DecimalField(max_digits=15, decimal_places=2)
	ytd_low = models.DecimalField(max_digits=15, decimal_places=2)
	ytd_high = models.DecimalField(max_digits=15, decimal_places=2)

	def __str__(self):
		return f"{symbol}"


class Active(models.Model):
	symbol = models.CharField(max_length=10)
	limit = models.DecimalField(max_digits=15, decimal_places=2)
	stop = models.DecimalField(max_digits=15, decimal_places=2)
	qty = models.IntegerField()
	time = models.DateTimeField();
	OPEN = 'O'
    FILLED = 'F'
    CANCELED = 'C'
    STATUS_CHOICES = (
        (OPEN, 'Open'),
        (FILLED, 'Filled'),
        (CANCELED, 'Canceled'),
    )
	status = models.CharField(max_length=1, choices=STATUS_CHOICES)

	def __str__(self):
		f"{qty} shares of {symbol} bought for {limit} at {time}."

class Position(models.Model):
	symbol = models.CharField(max_length=10)
	bought_at = models.DecimalField(max_digits=15, decimal_places=2)
	current_price = models.DecimalField(max_digits=15, decimal_places=2)
	qty = IntegerField();
	value_change_day = models.DecimalField(max_digits=15, decimal_places=2)
	value_change_week = models.DecimalField(max_digits=15, decimal_places=2)
	value_change_year = models.DecimalField(max_digits=15, decimal_places=2)
	value_change_total = models.DecimalField(max_digits=15, decimal_places=2)

	def __str__(self):
		f"{qty} shares of {symbol} owned."

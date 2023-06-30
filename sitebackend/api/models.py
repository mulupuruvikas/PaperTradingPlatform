from django.db import models

# Create your models here.
from django.db import models

class ActiveOrder(models.Model):
    STATUS_CHOICES = [('W', 'Working'), ('F', 'Filled'), ('C', 'Cancelled')]
    SIDE_CHOICES = [('B', 'Buy'), ('S', 'Sell')]
    TIF_CHOICES = [('IOC', 'ImmediateOrCancelled'), ('GFD', 'GoodForDay'), ('GTC', 'GoodTilCanceled'),
                   ('AON', 'AllOrNone'), ('FOK', 'FillOrKill'), ('OCO', 'OneCancelsOther')]
    
    user = models.ForeignKey('User', on_delete=models.RESTRICT)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES)
    side = models.CharField(max_length=1, choices=SIDE_CHOICES)
    quantity = models.SmallIntegerField()
    tif = models.CharField(max_length=3, choices=TIF_CHOICES)
    symbol = models.CharField(max_length=6, default=None)

class Watchlist(models.Model):
    symbol = models.CharField(max_length=6, default=None)
    user = models.ForeignKey('User', on_delete=models.RESTRICT)

class Position(models.Model):
    user = models.ForeignKey('User', on_delete=models.RESTRICT)
    symbol = models.CharField(max_length=6, default=None)
    bought_at = models.DecimalField(max_digits=10, decimal_places=2)

class Portfolio(models.Model):
    cash = models.DecimalField(max_digits=20, decimal_places=2, default=200000)
    stock_buying_power = models.DecimalField(max_digits=20, decimal_places=2, default=300000)
    option_buying_power = models.DecimalField(max_digits=20, decimal_places=2, default=200000)

class User(models.Model):
    email = models.EmailField(unique=True)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
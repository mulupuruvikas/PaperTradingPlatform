from django.db import models
from datetime import datetime, date

# Create your models here.
from django.db import models

class ActiveOrder(models.Model):
    STATUS_CHOICES = [('W', 'Working'), ('F', 'Filled'), ('C', 'Cancelled')]
    SIDE_CHOICES = [('BUY', 'Buy'), ('SELL', 'Sell')]
    TIME_CHOICES = [('Day', 'Day'), ('GTC', 'GoodTilCanceled')]
    TYPE_CHOICES = [('LIMIT','Limit'), ('MARKET','Market'), ('MOC', 'MarketonClose'), ('LOC', 'LimitOnClose'), ('STOP', 'Stop'), ('STOPLIMIT', 'STOPLIMIT')]
    
    user = models.ForeignKey('User', on_delete=models.RESTRICT)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES)
    side = models.CharField(max_length=4, choices=SIDE_CHOICES)
    tif = models.CharField(max_length=3, choices=TIME_CHOICES)
    type = models.CharField(max_length=9, choices=TYPE_CHOICES)
    expiration_date = models.DateTimeField(default=datetime.now().replace(hour=0, minute=0, second=0, microsecond=0))
    order_date = models.DateTimeField(default=datetime.now().replace(hour=0, minute=0, second=0, microsecond=0))
    num_shares = models.IntegerField()
    symbol = models.CharField(max_length=6, default=None)
    ask = models.DecimalField(max_digits=10, decimal_places=2)
    activation_price = models.DecimalField(max_digits=10, decimal_places=2)

class Watchlist(models.Model):
    symbol = models.CharField(max_length=6, default=None)
    user = models.ForeignKey('User', on_delete=models.RESTRICT)

class Position(models.Model):
    user = models.ForeignKey('User', on_delete=models.RESTRICT)
    symbol = models.CharField(max_length=6, default=None)
    bought_at = models.DecimalField(max_digits=10, decimal_places=2)
    num_shares = models.IntegerField()

class Portfolio(models.Model):
    cash = models.DecimalField(max_digits=20, decimal_places=2, default=200000)
    stock_buying_power = models.DecimalField(max_digits=20, decimal_places=2, default=300000)
    option_buying_power = models.DecimalField(max_digits=20, decimal_places=2, default=200000)

class User(models.Model):
    email = models.EmailField(unique=True)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
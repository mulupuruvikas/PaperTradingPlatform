from django.db import models

# Create your models here.
from django.db import models

class Stock(models.Model):
    symbol = models.CharField(max_length=4)
    price = models.DecimalField(max_digits=10, decimal_places=2)

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
    stock = models.OneToOneField(Stock, on_delete=models.RESTRICT)

class Watchlist(models.Model):
    stock = models.OneToOneField(Stock, on_delete=models.RESTRICT)
    user = models.ForeignKey('User', on_delete=models.RESTRICT)

class Position(models.Model):
    user = models.ForeignKey('User', on_delete=models.RESTRICT)
    stock = models.ForeignKey(Stock, on_delete=models.RESTRICT)
    bought_at = models.DecimalField(max_digits=10, decimal_places=2)
    p_l_day = models.DecimalField(max_digits=6, decimal_places=2)
    p_l_total = models.DecimalField(max_digits=6, decimal_places=2)

class Portfolio(models.Model):
    value = models.DecimalField(max_digits=20, decimal_places=2)
    cash = models.DecimalField(max_digits=20, decimal_places=2)
    p_l = models.DecimalField(max_digits=6, decimal_places=2)
    stock_buying_power = models.DecimalField(max_digits=20, decimal_places=2)
    option_buying_power = models.DecimalField(max_digits=20, decimal_places=2)

class User(models.Model):
    name = models.CharField(max_length=15)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
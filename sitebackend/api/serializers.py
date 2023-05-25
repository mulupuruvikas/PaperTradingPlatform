from rest_framework import serializers
from .models import Stock, ActiveOrder, Watchlist, Position, Portfolio, User

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['id', 'symbol', 'price']

class ActiveOrderSerializer(serializers.ModelSerializer):
    stock = StockSerializer()

    class Meta:
        model = ActiveOrder
        fields = ['id', 'user', 'status', 'side', 'quantity', 'tif', 'stock']

class WatchlistSerializer(serializers.ModelSerializer):
    stock = StockSerializer()

    class Meta:
        model = Watchlist
        fields = ['id', 'stock', 'user']



class PositionSerializer(serializers.ModelSerializer):
    stock = StockSerializer()

    class Meta:
        model = Position
        fields = ['id', 'user', 'stock', 'bought_at', 'p_l_day', 'p_l_total']

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'value', 'cash', 'p_l', 'value_buying_power', 'option_buying_power']

class UserSerializer(serializers.ModelSerializer):
    portfolio = PortfolioSerializer()

    class Meta:
        model = User
        fields = ['id', 'name', 'portfolio']

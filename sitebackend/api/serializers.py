from rest_framework import serializers
from .models import Stock, ActiveOrder, Watchlist, Position, Portfolio, User

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'

class ActiveOrderSerializer(serializers.ModelSerializer):
    stock = StockSerializer()

    class Meta:
        model = ActiveOrder
        fields = '__all__'

class WatchlistSerializer(serializers.ModelSerializer):
    stock = StockSerializer()

    class Meta:
        model = Watchlist
        fields = '__all__'

class PositionSerializer(serializers.ModelSerializer):
    stock = StockSerializer()

    class Meta:
        model = Position
        fields = '__all__'

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    portfolio = PortfolioSerializer()

    class Meta:
        model = User
        fields = '__all__'
from rest_framework import serializers
from .models import ActiveOrder, Watchlist, Position, Portfolio, User

class ActiveOrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = ActiveOrder
        fields = ['id', 'user', 'status', 'side', 'quantity', 'tif', 'symbol']

    def validate(self, attrs):
        if attrs.get('symbol') is None:
            raise serializers.ValidationError('Symbol field is required')
        return attrs

class WatchlistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Watchlist
        fields = ['id', 'user', 'symbol']

    def validate(self, attrs):
        if attrs.get('symbol') is None:
            raise serializers.ValidationError('Symbol field is required')
        return attrs

class PositionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Position
        fields = ['id', 'user', 'bought_at', 'symbol']

    def validate(self, attrs):
        if attrs.get('symbol') is None:
            raise serializers.ValidationError('Symbol field is required')
        return attrs
         
class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'cash', 'stock_buying_power', 'option_buying_power']

class UserSerializer(serializers.ModelSerializer):
    portfolio = PortfolioSerializer()

    class Meta:
        model = User
        fields = ['id', 'email', 'portfolio']

    def create(self, validated_data):
        portfolio_data = validated_data.pop('portfolio')
        portfolio = Portfolio.objects.create(**portfolio_data)

        user = User.objects.create(portfolio=portfolio, **validated_data)
        return user

    def update(self, instance, validated_data):
        portfolio_data = validated_data.pop('portfolio')
        portfolio = instance.portfolio
        # Update the nested portfolio object
        for attr, value in portfolio_data.items():
            setattr(portfolio, attr, value)
        portfolio.save()
        # Update the user object
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
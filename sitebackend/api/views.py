from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Stock, ActiveOrder, Watchlist, Position, Portfolio, User
from .serializers import StockSerializer, ActiveOrderSerializer, WatchlistSerializer, PositionSerializer, PortfolioSerializer, UserSerializer

class StockListCreateView(generics.ListCreateAPIView):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

class StockRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

class ActiveOrderListCreateView(generics.ListCreateAPIView):
    queryset = ActiveOrder.objects.all()
    serializer_class = ActiveOrderSerializer

class ActiveOrderRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ActiveOrder.objects.all()
    serializer_class = ActiveOrderSerializer

class WatchlistListCreateView(generics.ListCreateAPIView):
    queryset = Watchlist.objects.all()
    serializer_class = WatchlistSerializer

class WatchlistRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Watchlist.objects.all()
    serializer_class = WatchlistSerializer

class PositionListCreateView(generics.ListCreateAPIView):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer

class PositionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer

class PortfolioListCreateView(generics.ListCreateAPIView):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer

class PortfolioRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

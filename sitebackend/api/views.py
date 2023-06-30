from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from .models import ActiveOrder, Watchlist, Position, Portfolio, User
from .serializers import ActiveOrderSerializer, WatchlistSerializer, PositionSerializer, PortfolioSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView
from django.conf import settings
import requests
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    user_exists = User.objects.filter(email=email).exists()

    return Response({'exists': user_exists})

class ActiveOrderListCreateView(generics.ListCreateAPIView):
    queryset = ActiveOrder.objects.all()
    serializer_class = ActiveOrderSerializer

class ActiveOrderRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ActiveOrder.objects.all()
    serializer_class = ActiveOrderSerializer

class WatchlistListCreateView(generics.ListCreateAPIView):
    queryset = Watchlist.objects.all()
    serializer_class = WatchlistSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user')
        queryset = Watchlist.objects.filter(user=user_id)
        return queryset

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
    print("entering view")

    def post(self, request, *args, **kwargs):
        print("entering post method")
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        print("")
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class PortfolioRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    def get_queryset(self):
        email = self.request.query_params.get('email')
        queryset = User.objects.all()
        if email:
            queryset = queryset.filter(email=email)
        return queryset

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        user_exists = User.objects.filter(email=email).exists()
        if user_exists:
            return Response({'exists': True})
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)

class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
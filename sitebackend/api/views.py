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

    def get_queryset(self):
        queryset = ActiveOrder.objects.all()
        user = self.request.query_params.get('user')
        if user is not None:
            queryset = queryset.filter(user=user)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Add any additional logic or validations before saving the instance
        # For example, you can retrieve the user object using the user_id
        user_id = request.data.get('user')
        user = User.objects.get(id=user_id)
        serializer.validated_data['user'] = user

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class ActiveOrderRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ActiveOrder.objects.all()
    serializer_class = ActiveOrderSerializer

class WatchlistListCreateView(generics.ListCreateAPIView):
    serializer_class = WatchlistSerializer

    def get_queryset(self):
        queryset = Watchlist.objects.all()
        user = self.request.query_params.get('user')
        symbol = self.request.query_params.get('symbol')
        if user is not None and symbol is not None:
            queryset = queryset.filter(user=user, symbol=symbol)
        elif user is not None:
            queryset = queryset.filter(user=user)
        elif symbol is not None:
            queryset = queryset.filter(symbol=symbol)
        return queryset

    def create(self, request, *args, **kwargs):
        user_id = request.data.get('user')
        symbol = request.data.get('symbol')
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Invalid user ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        watchlist = Watchlist(user=user, symbol=symbol)
        watchlist.save()
        serializer = self.get_serializer(watchlist)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class WatchlistRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WatchlistSerializer
    queryset = Watchlist.objects.all()

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

class PositionListCreateView(generics.ListCreateAPIView):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer

    def get_queryset(self):
        queryset = Position.objects.all()
        user = self.request.query_params.get('user')
        if user is not None:
            queryset = queryset.filter(user=user)
        return queryset

class PositionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer

class PortfolioListCreateView(generics.ListCreateAPIView):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer

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
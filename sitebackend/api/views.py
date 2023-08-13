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
from datetime import datetime, timedelta

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
        symbol = self.request.query_params.get('symbol')
        expiration_start_date = self.request.query_params.get('expiration_start_date')
        expiration_end_date = self.request.query_params.get('expiration_end_date')

        if user is not None:
            queryset = queryset.filter(user=user)
        if symbol is not None:
            queryset = queryset.filter(symbol=symbol)
        if expiration_start_date is not None and expiration_end_date is not None:
            # Parse the start and end dates to datetime objects
            start_date = datetime.strptime(expiration_start_date, '%Y-%m-%d').date()
            end_date = datetime.strptime(expiration_end_date, '%Y-%m-%d').date() + timedelta(days=1)  # Add 1 day to include the end date

            # Filter ActiveOrders with expiration date falling within the specified range
            queryset = queryset.filter(expiration_date__range=(start_date, end_date))

        return queryset

    def create(self, request, *args, **kwargs):
        user_id = request.data.get('user')
        symbol = request.data.get('symbol')
        stat = request.data.get('status')
        side = request.data.get('side')
        tif = request.data.get('tif')
        type = request.data.get('type')
        expiration_date = request.data.get('expiration_date')
        order_date = request.data.get('order_date')
        num_shares = request.data.get('num_shares')
        ask = request.data.get('ask')
        activation_price = request.data.get('activation_price')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Invalid user ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        order = ActiveOrder(user=user, symbol=symbol, status=stat, side=side, tif=tif, type=type, expiration_date=expiration_date, order_date=order_date, num_shares=num_shares, ask=ask, activation_price=activation_price)
        order.save()
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ActiveOrderRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ActiveOrder.objects.all()
    serializer_class = ActiveOrderSerializer

    def delete(self, request, *args, **kwargs):
        data = request.data
        expiration_start_date = data.get('expiration_start_date')
        expiration_end_date = data.get('expiration_end_date')

        if expiration_start_date is not None and expiration_end_date is not None:
            # Parse the start and end dates to datetime objects
            start_date = datetime.strptime(expiration_start_date, '%Y-%m-%d').date()
            end_date = datetime.strptime(expiration_end_date, '%Y-%m-%d').date() + timedelta(days=1)  # Add 1 day to include the end date

            # Filter ActiveOrders with expiration date falling within the specified range
            queryset = ActiveOrder.objects.filter(expiration_date__range=(start_date, end_date))
            
            # Perform the delete operation for the filtered queryset
            queryset.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)       

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
        bought_at = request.data.get('bought_at')
        num_shares = request.data.get('num_shares')
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Invalid user ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        position = Position(user=user, symbol=symbol, bought_at=bought_at, num_shares=num_shares)
        position.save()
        serializer = self.get_serializer(position)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class PositionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        new_price = request.data.get('bought_at')
        new_shares = request.data.get('num_shares')  # Extract the new cash amount from the request data

        # Update the cash amount of the portfolio instance
        instance.num_shares = new_shares
        instance.bought_at = new_price
        instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

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

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        new_cash_amount = request.data.get('cash_amount')  # Extract the new cash amount from the request data

        # Update the cash amount of the portfolio instance
        instance.cash_amount = new_cash_amount
        instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

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
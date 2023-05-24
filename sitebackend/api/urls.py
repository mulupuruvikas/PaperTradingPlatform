from django.urls import path
from .views import (
    StockListCreateView, StockRetrieveUpdateDestroyView,
    ActiveOrderListCreateView, ActiveOrderRetrieveUpdateDestroyView,
    WatchlistListCreateView, WatchlistRetrieveUpdateDestroyView,
    PositionListCreateView, PositionRetrieveUpdateDestroyView,
    PortfolioListCreateView, PortfolioRetrieveUpdateDestroyView,
    UserListCreateView, UserRetrieveUpdateDestroyView,
)

urlpatterns = [
    path('stocks/', StockListCreateView.as_view(), name='stock-list'),
    path('stocks/<int:pk>/', StockRetrieveUpdateDestroyView.as_view(), name='stock-detail'),
    path('active-orders/', ActiveOrderListCreateView.as_view(), name='active-order-list'),
    path('active-orders/<int:pk>/', ActiveOrderRetrieveUpdateDestroyView.as_view(), name='active-order-detail'),
    path('watchlist/', WatchlistListCreateView.as_view(), name='watchlist-list'),
    path('watchlist/<int:pk>/', WatchlistRetrieveUpdateDestroyView.as_view(), name='watchlist-detail'),
    path('positions/', PositionListCreateView.as_view(), name='position-list'),
    path('positions/<int:pk>/', PositionRetrieveUpdateDestroyView.as_view(), name='position-detail'),
    path('portfolios/', PortfolioListCreateView.as_view(), name='portfolio-list'),
    path('portfolios/<int:pk>/', PortfolioRetrieveUpdateDestroyView.as_view(), name='portfolio-detail'),
    path('users/', UserListCreateView.as_view(), name='user-list'),
    path('users/<str:pk>/', UserRetrieveUpdateDestroyView.as_view(), name='user-detail'),
]
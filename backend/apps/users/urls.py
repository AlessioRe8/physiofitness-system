from django.urls import path
from .views import RegisterView, UserProfileView, UserListView, UserDetailView, MyTokenObtainPairView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user-register'),
    path('me/', UserProfileView.as_view(), name='user-profile'),
    path('', UserListView.as_view(), name='user_list'),
    path('<int:pk>/', UserDetailView.as_view(), name='user_detail'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
]
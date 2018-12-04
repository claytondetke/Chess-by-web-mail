"""chess_server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.contrib.auth import views as auth_views

from chess import views

urlpatterns = [
    path('', views.home, name='home'),
    path('signup', views.signup, name='signup'),
    path('login', auth_views.LoginView.as_view(), name='login'),
    path('logout', auth_views.LogoutView.as_view(), name='logout'),
    path('inbox', views.inbox, name='inbox'),
    path('game/<int:game_id>', views.game, name='game'),
    path('game/<int:game_id>/data', views.game_data, name='game_data'),
    path('game/<int:game_id>/move', views.game_move, name='game_move'),
    path('game/<int:game_id>/quit', views.game_quit, name='game_quit'),
    path('new_game', views.new_game, name='new_game'),
    path('admin/', admin.site.urls),
]

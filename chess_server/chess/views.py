import json

from django.utils.translation import gettext as _
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, HttpResponseNotAllowed
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import models as auth_models
from django.forms import ValidationError

from .forms import NewGameForm
from . import models


# Create your views here.
def home(request):
    return render(request, 'chess/home.html')


def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            auth_user = form.save()
            models.User(auth_user=auth_user).save()
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'registration/signup.html', {'form': form})


@login_required
def inbox(request):
    def render_status_black(status):
        if status == 'TW':
            return "Opponent's turn"
        if status == 'TB':
            return "Your turn"
        if status == 'EW':
            return "Lost"
        if status == 'EB':
            return "Won"
        return "Draw"

    def render_status_white(status):
        if status == 'TB':
            return "Opponent's turn"
        if status == 'TW':
            return "Your turn"
        if status == 'EB':
            return "Lost"
        if status == 'EW':
            return "Won"
        return "Draw"

    black_games = [{
        'id': game.id,
        'name': game.name,
        'opponent': game.white_user.auth_user.username,
        'status': render_status_black(game.game_state)
    } for game in request.user.chess_user.game_black_set.all()]
    white_games = [{
        'id': game.id,
        'name': game.name,
        'opponent': game.black_user.auth_user.username,
        'status': render_status_white(game.game_state)
    } for game in request.user.chess_user.game_white_set.all()]

    return render(request, 'chess/inbox.html',
                  {'games': black_games + white_games})


@login_required
def game(request, game_id):
    return render(request, 'chess/game.html', {'game_id': game_id})

@login_required
def game_data(request, game_id):
    game_m = get_object_or_404(models.Game, id=game_id)
    game_dict = {
        'name': game_m.name,
        'black_user': game_m.black_user.auth_user.username,
        'black_present': game_m.black_present,
        'white_user': game_m.white_user.auth_user.username,
        'white_present': game_m.white_present,
        'board_state': game_m.board_state,
        'game_state': game_m.game_state,
    }
    return HttpResponse(json.dumps(game_dict), content_type='application/json')


@login_required
def game_move(request, game_id):
    #TODO
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    return redirect('game', game_id=game_id)


@login_required
def game_quit(request, game_id):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    game_m = get_object_or_404(models.Game, id=game_id)
    if game_m.black_user == request.user.chess_user:
        game_m.black_present = False
    else:
        game_m.white_present = False
    if not game_m.black_present and not game_m.white_present:
        game_m.delete()
    else:
        game_m.save()
    return redirect('inbox')


@login_required
def new_game(request):
    if request.method == 'POST':
        form = NewGameForm(request.POST)
        if form.is_valid():
            opponent = form.cleaned_data['opponent'].chess_user
            my_color = form.cleaned_data['my_color']
            name = form.cleaned_data['name']
            current_user = request.user.chess_user
            if current_user != opponent:
                if my_color == 'B':
                    game_m = models.Game(
                        name=name,
                        black_user=current_user,
                        white_user=opponent)
                else:
                    game_m = models.Game(
                        name=name,
                        white_user=opponent,
                        black_user=current_user)
                game_m.save()
                return redirect('game', game_id=game_m.id)
            form.add_error(
                'opponent',
                ValidationError(
                    _('Cannot play a game against yourself'),
                    code='self_opponent'))
    else:
        form = NewGameForm()
    return render(request, 'chess/new_game.html', {'form': form})

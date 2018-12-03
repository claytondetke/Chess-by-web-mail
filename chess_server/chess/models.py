from django.db import models
from django.contrib.auth import models as auth_models

# Create your models here.
class User(models.Model):
    auth_user = models.OneToOneField(auth_models.User, on_delete=models.CASCADE)

class Game(models.Model):
    DEFAULT_BOARD_STATE = ''

    GS_WHITE_TURN = 'TW'
    GS_BLACK_TURN = 'TB'
    GS_WHITE_WON = 'EW'
    GS_BLACK_WON = 'EB'
    GS_DRAW = 'ED'
    GAME_STATE_CHOICES = (
        ('in-progress', (
            (GS_WHITE_TURN, "White's turn"),
            (GS_BLACK_TURN, "Black's turn"),
        )),
        ('ended', (
            (GS_WHITE_WON, "White won"),
            (GS_BLACK_WON, "Black won"),
            (GS_DRAW, "Draw"),
        )),
    )

    black_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game_black_set')
    black_present = models.BooleanField(default=True)
    white_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game_white_set')
    white_present = models.BooleanField(default=True)
    board_state = models.CharField(max_length=64, default=DEFAULT_BOARD_STATE)
    game_state = models.CharField(
        max_length=2,
        choices=GAME_STATE_CHOICES,
        default=GS_WHITE_TURN,
    )

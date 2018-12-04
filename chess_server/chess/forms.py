from django import forms
from django.contrib.auth import models as auth_models
from django.utils.translation import gettext as _

from . import models


class NewGameForm(forms.Form):
    name = forms.CharField(
        label='Game Name',
        required=False,
        max_length=100,
        empty_value='Unnamed Game')
    opponent = forms.CharField(label='Opponent', max_length=150)
    my_color = forms.ChoiceField(
        label='Your Color', choices=[('W', 'White'), ('B', 'Black')])

    def clean_opponent(self):
        data = self.cleaned_data['opponent']
        try:
            return auth_models.User.objects.get(username=data)
        except auth_models.User.DoesNotExist:
            raise forms.ValidationError(
                _('Opponent username not found'), code='no_opponent')

class GameMoveForm(forms.Form):
    board_state = forms.CharField(max_length=128)
    game_state = forms.ChoiceField(choices=models.Game.GAME_STATE_CHOICES)

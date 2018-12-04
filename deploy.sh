#!/bin/bash
(cd frontend-website && npm run build)
cd chess_server
source ~/my_env/bin/activate
sed -i 's/DEBUG = True/DEBUG = False/' chess_server/settings.py
python manage.py check --deploy
python manage.py collectstatic

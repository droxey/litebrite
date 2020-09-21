from dotenv import load_dotenv

load_dotenv()


import os
import pusher
from flask import Flask, render_template


app = Flask(__name__)


channels_client = pusher.Pusher(
    app_id=os.getenv("PUSHER_APP_ID"),
    key=os.getenv("PUSHER_APP_KEY"),
    secret=os.getenv("PUSHER_APP_SECRET"),
    cluster=os.getenv("PUSHER_APP_CLUSTER"),
    ssl=True,
)


@app.route("/")
def index():
    channels_client.trigger("litebrite", "joined-game", {"message": "hello world"})
    return render_template("index.html")


if __name__ == "__main__":
    app.run()

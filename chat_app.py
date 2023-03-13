import os

import openai
from flask import Flask, redirect, render_template, request, url_for, jsonify, send_file

static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "static")

openai.api_key_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "openai_api_key.txt")
favicon_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "static/favicon.ico")
print("favicon", favicon_path)

app = Flask(
    __name__,
    static_url_path="/static",
    static_folder=static_file_dir,

)
openai.api_key = os.getenv("OPENAI_API_KEY")


AGATHA = (
    "You are a medieval peasant farmer named Agatha. You are approached by a "
    "coroner who is investigating the murder of the town miller. Respond to "
    "the user as Agatha using medieval affectations. You are not guilty of "
    "any crime."
)
message_history = [{"role": "system", "content": AGATHA}]

@app.route("/chat", methods=("GET", "POST"))
def chat():
    message_history.append({"role": "user", "content": request.args["p"]})
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=message_history,
        temperature=0.6,
    )
    message_history.append({"role": "assistant", "content": response.choices[0]["message"]["content"]})
    return jsonify({"text": response})

@app.route("/", methods=("GET", "POST"))
def index():
    return render_template("index.html")

@app.route("/favicon.ico", methods=["GET"])
def favicon():
    return send_file(path_or_file=favicon_path, mimetype="image/ico")

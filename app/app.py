import flask

from oauth2client import client
from werkzeug.contrib.fixers import ProxyFix
from httplib2 import Http

from contractor import Contractor
from helpers.admin import add_user_to_domain
from helpers.drive import add_and_share_drive_folder
from helpers.gmail import get_user_email
from helpers.gmail import send_info_email
from helpers.gmail import send_login_email
from helpers.slack import invite_to_slack
from helpers.trello import create_trello_board

app = flask.Flask(__name__, instance_relative_config=True)
app.secret_key = "hash me please!!"
app.wsgi_app = ProxyFix(app.wsgi_app)


@app.route("/")
def main():
    if "credentials" not in flask.session:
        return flask.redirect(flask.url_for("oauth2callback"))
    credentials = client.OAuth2Credentials.from_json(flask.session["credentials"])
    if credentials.access_token_expired:
        return flask.redirect(flask.url_for("oauth2callback"))
    else:
        return flask.render_template("index.html")


@app.route("/oauth2callback")
def oauth2callback():
    flow = client.flow_from_clientsecrets(
        "client_secret.json",
        scope="https://www.googleapis.com/auth/drive https://mail.google.com/",
        redirect_uri=flask.url_for("oauth2callback", _external=True))
    if "code" not in flask.request.args:
        auth_uri = flow.step1_get_authorize_url() + "&hd=7hci.com"
        return flask.redirect(auth_uri)
    else:
        auth_code = flask.request.args.get("code")
        credentials = flow.step2_exchange(auth_code)
        flask.session["credentials"] = credentials.to_json()
        return flask.redirect(flask.url_for("main"))


@app.route("/onboard", methods=["POST"])
def onboard():
    first_name = flask.request.form["first_name"]
    last_name = flask.request.form["last_name"]
    is_resident = "resident" in flask.request.form
    email = flask.request.form["email"]
    contractor = Contractor(first_name, last_name, is_resident, email)

    credentials = client.OAuth2Credentials.from_json(flask.session["credentials"])
    http_auth = credentials.authorize(Http())

    email = get_user_email(http_auth)
    if is_domain_valid(email):
        flask.session["email"] = email
    else:
        return flask.render_template("error.html")

    completed_tasks = [add_user_to_domain(http_auth, contractor),
                       send_login_email(http_auth, contractor, email),
                       create_trello_board(contractor),
                       invite_to_slack(contractor),
                       add_and_share_drive_folder(http_auth, contractor),
                       send_info_email(http_auth, contractor)]

    return flask.render_template("index.html", messages=completed_tasks, contractor=contractor)


def is_domain_valid(email):
    return "7hci.com" == email.split("@")[1].lower()

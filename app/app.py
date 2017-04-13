import flask
import gevent

from gevent.event import Event
from flask import request
from oauth2client import client
from werkzeug.contrib.fixers import ProxyFix
from httplib2 import Http

from contractor import Contractor
from helpers.admin import add_user_to_domain
from helpers.drive import add_and_share_drive_folder
from helpers.gmail import get_user_email
from helpers.gmail import send_drive_email
from helpers.gmail import send_login_email
from helpers.slack import invite_to_slack
from helpers.trello import create_trello_board

app = flask.Flask(__name__, instance_relative_config=True)
app.secret_key = "hash me please!!"
app.wsgi_app = ProxyFix(app.wsgi_app)

checkbox_options = [{"name": "add_user_to_domain", "text": "Add contractor to 7hci domain"},
                    {"name": "send_login_email", "text": "E-mail credentials to contractor"},
                    {"name": "add_and_share_drive_folder", "text": "Create HR folder for contractor"},
                    {"name": "send_drive_email", "text": "Send document instructions to contractor"},
                    {"name": "create_trello_board", "text": "Create Trello board for onboarding tasks"},
                    {"name": "invite_to_slack", "text": "Invite contractor to Slack"}]


@app.route("/")
def main():
    # Redirect to sign in with Google account if credentials are expired or not found
    if "credentials" not in flask.session:
        return flask.redirect(flask.url_for("oauth2callback"))
    credentials = client.OAuth2Credentials.from_json(flask.session["credentials"])
    if credentials.access_token_expired:
        return flask.redirect(flask.url_for("oauth2callback"))
    else:
        return flask.render_template("index.html", tasks=checkbox_options)


@app.route("/oauth2callback")
def oauth2callback():
    flow = client.flow_from_clientsecrets(
        "client_secret.json",
        scope="https://www.googleapis.com/auth/drive "
              "https://mail.google.com/ "
              "https://www.googleapis.com/auth/admin.directory.user",
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
    # Collect form data from request and build Contractor instance
    first_name = request.form["first_name"]
    last_name = request.form["last_name"]
    is_resident = "resident" in request.form
    private_email = request.form["email"]
    contractor = Contractor(first_name, last_name, is_resident, private_email)

    # Generate http object used for service discovery inside helper functions
    credentials = client.OAuth2Credentials.from_json(flask.session["credentials"])
    http_auth = credentials.authorize(Http())

    # Retrieve user e-mail (not stored in credentials), validate domain and show error page if not @7hci.com
    email = get_user_email(http_auth)
    if is_domain_valid(email):
        flask.session["email"] = email
    else:
        return flask.render_template("error.html", error="Access restricted due to domain mismatch.")

    tasks_to_run = []
    email_created = Event()

    # Spawn a Greenlet for each task the user selected to kick off, waiting for add_user_to_domain if necessary
    if "add_user_to_domain" in request.form:
        tasks_to_run.append(gevent.spawn(add_user_to_domain, http_auth, contractor, email_created))
    else:
        email_created.set()
    if "send_login_email" in request.form:
        tasks_to_run.append(gevent.spawn(send_login_email, http_auth, contractor, email_created))
    if "add_and_share_drive_folder" in request.form:
        tasks_to_run.append(gevent.spawn(add_and_share_drive_folder, http_auth, contractor, email_created))
    if "send_drive_email" in request.form:
        tasks_to_run.append(gevent.spawn(send_drive_email, http_auth, contractor, email_created))
    if "create_trello_board" in request.form:
        tasks_to_run.append(gevent.spawn(create_trello_board, http_auth, contractor))
    if "invite_to_slack" in request.form:
        tasks_to_run.append(gevent.spawn(invite_to_slack, contractor, email_created))

    gevent.joinall(tasks_to_run)

    return flask.render_template("index.html", messages=tasks_to_run, contractor=contractor)


def is_domain_valid(email):
    return "7hci.com" == email.split("@")[1].lower()
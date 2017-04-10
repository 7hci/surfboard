from apiclient import discovery
from string import Template
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from base64 import urlsafe_b64encode
from flask import session


def get_user_email(http_auth):
    gmail = discovery.build("gmail", "v1", http_auth)
    info = gmail.users().getProfile(userId="me").execute()

    return info["emailAddress"]


def send_info_email(http_auth, contractor):
    # TODO: Take me out for production!!!
    return {"text": "Sent document request to contractor", "status": "success"}

    gmail = discovery.build("gmail", "v1", http_auth)

    message = MIMEMultipart()
    message["to"] = contractor.get_email()
    message["from"] = session["email"]
    message["subject"] = "Required Documents"

    with open("welcome.txt", "U") as message_file:
        file_text = Template(message_file.read())
        if contractor.is_resident:
            form_type = "W-9"
        else:
            form_type = "W-8BEN"
        message_text = file_text.substitute(name=contractor.get_full_name(), form=form_type)
        message.attach(MIMEText(message_text))

    complete_message = {"raw": urlsafe_b64encode(message.as_string())}

    gmail.users().messages().send(userId="me", body=complete_message).execute()

    return {"text": "Sent document request to contractor", "status": "success"}


def send_login_email(http_auth, contractor, email):
    # TODO: Take me out for production!!!
    return {"text": "Sent e-mail to contractor", "status": "success"}

    gmail = discovery.build("gmail", "v1", http_auth)

    message = MIMEMultipart()
    message["to"] = email
    message["from"] = session["email"]
    message["subject"] = "New E-mail Account Credentials"

    with open("login.txt", "U") as message_file:
        file_text = Template(message_file.read())
        message_text = file_text.substitute(name=contractor.get_full_name(), address=contractor.get_email())
        message.attach(MIMEText(message_text))

    complete_message = {"raw": urlsafe_b64encode(message.as_string())}

    gmail.users().messages().send(userId="me", body=complete_message).execute()

    return {"text": "Sent login info to contractor", "status": "success"}

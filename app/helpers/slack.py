from requests import post
from ..config import *


def invite_to_slack(contractor, email_created):
    # Wait until e-mail has been created for contractor
    email_created.wait()

    # TODO: Take me out for production!!!
    # return {"text": "Sent slack invite", "status": "success"}

    slack_url = "https://slack.com/api/users.admin.invite"
    payload = {"token": SLACK_TOKEN, "email": contractor.get_email()}

    try:
        slack_response = post(slack_url, params=payload)
        ok = slack_response.json()["ok"]
        if ok:
            return {"text": "Sent slack invite", "status": "success"}
        else:
            return {"text": "Problem sending slack invite", "status": "failure"}
    except:
        return {"text": "Problem sending slack invite", "status": "failure"}

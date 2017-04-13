import gevent

from requests import post
from .drive import get_tasks_from_spreadsheet
from ..config import *

payload = {"token": TRELLO_TOKEN, "key": TRELLO_KEY}

def create_trello_board(http_auth, contractor):
    # TODO: Take me out for production!!!
    # return {"text": "Created board on Trello", "status": "success"}

    try:
        board_url = "https://api.trello.com/1/boards"
        board_name = "Onboarding: " + contractor.get_full_name()
        board_data = {"name": board_name,
                      "defaultLists": "false",
                      "idOrganization": TRELLO_TEAM,
                      "prefs_permissionLevel": "org"
                      }
        board_response = post(board_url, params=payload, data=board_data)
        board_id = board_response.json()["id"]

        #TODO: Add members as admin to board


        lists = ["Done", "In Progress", "On Deck", "To Do"]
        list_url = "https://api.trello.com/1/lists"
        for list_name in lists:
            list_data = {"name": list_name, "idBoard": board_id}
            list_response = post(list_url, params=payload, data=list_data)
            if list_name == "To Do":
                list_id = list_response.json()["id"]

                requests = []
                for task in get_tasks_from_spreadsheet(http_auth):
                    description = task.split(",")[0]
                    member = task.split(",")[1]
                    requests.append(gevent.spawn(make_card_request, list_id, description, MEMBER_IDS[member]))
                gevent.joinall(requests)

        return {"text": "Created board on Trello", "status": "success"}

    except:
        return {"text": "Problem creating board on Trello", "status": "failure"}


def make_card_request(list_id, task, member_id):
    card_url = "https://api.trello.com/1/cards" + "?key=" + TRELLO_KEY + "&token=" + TRELLO_TOKEN
    card_data = {"name": task, "idList": list_id, "idMembers": member_id}
    card_response = post(card_url, params=payload, data=card_data)

    return card_response.json()["id"]

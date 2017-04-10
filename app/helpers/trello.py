from requests import post
from ..config import *

payload = {"token": TRELLO_TOKEN, "key": TRELLO_KEY}


def create_trello_board(contractor):
    # TODO: Take me out for production!!!
    return {"text": "Created board on Trello", "status": "success"}

    daniel_id = "58d6db171f559cef25b99a06"
    scott_id = "5862acf5027bbf822d0b5de9"
    red_id = "5865435cc37998ee473adbce"

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

        lists = ["Done", "In Progress", "To Do", "On Deck"]
        list_url = "https://api.trello.com/1/lists"
        for list_name in lists:
            list_data = {"name": list_name, "idBoard" : board_id}
            list_response = post(list_url, params=payload, data=list_data)
            if list_name == "On Deck":
                list_id = list_response.json()["id"]

                add_card(list_id, "Add user to ClickTime", daniel_id)
                add_card(list_id, "Upload resume to Google Drive", daniel_id)
                add_card(list_id, "Sign and upload MSSA to Google Drive", daniel_id)
                add_card(list_id, "Verify W9/W8 is complete", daniel_id)
                add_card(list_id, "Verify direct deposit form is complete", daniel_id)
                add_card(list_id, "Verify background check authorization form", daniel_id)
                add_card(list_id, "Submit direct deposit form", red_id)
                add_card(list_id, "Submit background check form", red_id)
                add_card(list_id, "Submit project sheet to client", scott_id)
        return {"text": "Created board on Trello", "status": "success"}

    except:
        return {"text": "Problem creating board on Trello", "status": "failure"}


def add_card(list_id, task, member_id):
    card_url = "https://api.trello.com/1/cards"
    card_data = {"name": task, "idList" : list_id, "idMembers" : member_id}
    card_response = post(card_url, params=payload, data=card_data)
    return card_response.json()["id"]

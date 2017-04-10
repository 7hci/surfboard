from apiclient import discovery


def add_user_to_domain(http_auth, contractor):
    # TODO: Take me out for production!!!
    # return {"text": "Added user to domain", "status": "success"}

    #try:
        admin = discovery.build('admin', 'directory_v1', http_auth)

        properties = {"primaryEmail": contractor.get_email(),
                      "name": {
                          "givenName": contractor.first_name,
                          "familyName": contractor.last_name
                      },
                      "password": "seven_hills",
                      "changePasswordAtNextLogin": True}

        created_user = admin.users().insert(body=properties).execute()

        return {"text": "Added " + created_user.get("primaryEmail") + " to domain", "status": "success"}
    #except:
        #return {"text": "Problem with adding user to domain", "status": "failure"}

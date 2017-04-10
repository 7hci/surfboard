from apiclient import discovery
from ..config import *


def add_and_share_drive_folder(http_auth, contractor):
    # TODO: Take me out for production!!!
    return {"text": "Set up new folder in Google Drive", "status": "success"}

    try:
        drive = discovery.build("drive", "v2", http_auth)

        folder_id = create_folder(drive, contractor.get_full_name())
        add_files(drive, folder_id, contractor.is_resident)
        share_folder(drive, folder_id, contractor.get_email())

        return {"text": "Set up new folder in Google Drive", "status": "success"}
    except:
        return {"text": "Problem with setting up Google Drive", "status": "failure"}


def create_folder(drive, name):
    file_metadata = {
        "title": name,
        "parents": [{"id": HR_CONTRACTOR_FOLDER}],
        "mimeType": "application/vnd.google-apps.folder"}
    file = drive.files().insert(body=file_metadata, fields="id").execute()

    return file.get("id")


def add_files(drive, folder_id, is_resident):
    files_to_share = [BACKGROUND_CHECK,
                      DIRECT_DEPOSIT,
                      MSSA]
    if is_resident:
        files_to_share.append(W9)
    else:
        files_to_share.append(W8)

    hr_forms_folder = HR_FORMS_FOLDER

    for file_id in files_to_share:
        copy_body = {"title": file_id}
        copy_file = drive.files().copy(fileId=file_id, body=copy_body).execute()
        copy_file_id = copy_file.get("id")
        drive.files().update(fileId=copy_file_id, addParents=folder_id, removeParents=hr_forms_folder).execute()


def share_folder(drive, folder_id, email):
    user_permission = {
        "type": "user",
        "role": "writer",
        "emailAddress": email,
        "value": email}
    shared = drive.permissions().insert(
        fileId=folder_id,
        body=user_permission,
        fields="id",
    ).execute()

    return shared.get("id")

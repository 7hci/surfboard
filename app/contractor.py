import re


class Contractor(object):
    def __init__(self, first_name, last_name, is_resident, email):
        self.first_name = first_name
        self.last_name = last_name
        self.is_resident = is_resident
        self.email = email

        # TODO: remove email from constructor once admin.py is implemented and tested

    def get_full_name(self):
        return self.first_name + " " + self.last_name

    def get_email(self):
        # return self.email

        # TODO: remove above return statement to return generated address

        pattern = re.compile("[^a-zA-Z ]")
        sanitized_first = pattern.sub(self.first_name, "")
        sanitized_last = pattern.sub(self.first_name, "")

        return sanitized_first + "." + sanitized_last + "@7hci.com"

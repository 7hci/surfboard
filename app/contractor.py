import re


class Contractor(object):
    def __init__(self, first_name, last_name, is_resident, private_email):
        self.first_name = first_name
        self.last_name = last_name
        self.is_resident = is_resident
        self.private_email = private_email

    def get_full_name(self):
        return self.first_name + " " + self.last_name

    def get_email(self):
        pattern = re.compile("[^a-zA-Z]")
        sanitized_first = pattern.sub("", self.first_name,).lower()
        sanitized_last = pattern.sub("", self.last_name).lower()

        return sanitized_first + "." + sanitized_last + "@7hci.com"

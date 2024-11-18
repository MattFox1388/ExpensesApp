import json


class YearStatsDto():
    def __init__(self, year, needs, wants, savings, paycheck, other):
        self.year = year
        self.needs= needs
        self.wants= wants
        self.savings= savings
        self.paycheck= paycheck
        self.other= other

    def toJSON(self):
        return json.dumps(
            self,
            default=lambda o: o.__dict__,
            sort_keys=True,
            indent=3)

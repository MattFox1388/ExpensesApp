from enum import Enum, auto


class AutoName(Enum):
    def _generate_next_value_(name, start, count, last_values):
        return name.lower()


class Modifier_Categories(AutoName):
    NEEDS = auto()
    WANTS = auto()
    SAVINGS = auto()
    PAYCHECK = auto()


class Checking_Category(AutoName):
    NEEDS = auto()
    WANTS = auto()
    SAVINGS = auto()
    WANTORNEED = auto()
    IGNORE = auto()
    UNKNOWN = auto()


class Saving_Category(AutoName):
    NEEDS = auto()
    IGNORE = auto()
    ISEXPENSE = auto()
    WANTS = auto()
    PAYCHECK = auto()
    INTEREST = auto()
    OTHER = auto()
    UNKNOWN = auto()


class Disc_Category(AutoName):
    NEEDS = auto()
    WANTS = auto()
    WANTSORNEED = auto()
    SAVINGS = auto()
    PAYCHECK = auto()
    IGNORE = auto()
    UNKNOWN = auto()


class TransactionCategoryToSavingsCategory():
    def default_action(self):
        return Saving_Category.UNKNOWN

    def cable_satellite(self):
        return Saving_Category.NEEDS

    def online_services(self):
        return Saving_Category.ISEXPENSE

    def telephone_services(self):
        return Saving_Category.NEEDS

    def utilites(self):
        return Saving_Category.NEEDS

    def insurance(self):
        return Saving_Category.NEEDS

    def other_expenses(self):
        return Saving_Category.ISEXPENSE

    def atm_cash_withdrawals(self):
        return Saving_Category.WANTS

    def transfers(self):
        return Saving_Category.ISEXPENSE

    def securities_trade(self):
        return Saving_Category.ISEXPENSE

    def deposits(self):
        return Saving_Category.PAYCHECK

    def interest(self):
        return Saving_Category.INTEREST

    def __init__(self):
        self.lookup = {
            'Cable & Satellite': self.cable_satellite,
            'Online Services': self.online_services,
            'Telephone Services': self.telephone_services,
            'Utilites': self.utilites,
            'Insurance': self.insurance,
            'Other Expenses': self.other_expenses,
            'ATM/Cash Withdrawals': self.atm_cash_withdrawals,
            'Transfers': self.transfers,
            'Securities Trade': self.securities_trade,
            'Deposits': self.deposits,
            'Interest': self.interest
        }


class TransactionCategoryToCheckingCategory():

    def default_action(self):
        return Checking_Category.UNKNOWN

    def automotive_expenses(self):
        return Checking_Category.NEEDS

    def gasoline_fuel(self):
        return Checking_Category.NEEDS

    def travel_commute(self):
        return Checking_Category.NEEDS

    def clothing(self):
        return Checking_Category.WANTS

    def home_supplies(self):
        return Checking_Category.WANTS

    def shopping(self):
        return Checking_Category.WANTORNEED

    def education(self):
        return Checking_Category.SAVINGS

    def entertainment(self):
        return Checking_Category.WANTS

    def groceries(self):
        return Checking_Category.WANTORNEED

    def restaurants_dining(self):
        return Checking_Category.WANTS

    def healthcare_pharmacy(self):
        return Checking_Category.NEEDS

    def personal_care_fitness(self):
        return Checking_Category.SAVINGS

    def online_services(self):
        return Checking_Category.WANTORNEED

    def telephone_services(self):
        return Checking_Category.WANTORNEED

    def utilites(self):
        return Checking_Category.WANTORNEED

    def charges_and_services(self):
        return Checking_Category.NEEDS

    def atm_cash_withdrawals(self):
        return Checking_Category.WANTS

    def transfers(self):
        return Checking_Category.UNKNOWN

    def __init__(self):
        self.lookup = {
            'Automotive Expenses': self.automotive_expenses,
            'Gasoline/Fuel': self.gasoline_fuel,
            'Travel & Commute': self.travel_commute,
            'Clothing': self.clothing,
            'Home Supplies': self.home_supplies,
            'Shopping': self.shopping,
            'Education': self.education,
            'Entertainment': self.entertainment,
            'Groceries': self.groceries,
            'Restaurants & Dining': self.restaurants_dining,
            'Healthcare & Pharmacy': self.healthcare_pharmacy,
            'Personal Care & Fitness': self.personal_care_fitness,
            'Online Services': self.online_services,
            'Telephone Services': self.telephone_services,
            'Utilites': self.utilites,
            'Service Charges & Fees': self.charges_and_services,
            'ATM/Cash Withdrawals': self.atm_cash_withdrawals,
            'Transfers': self.transfers
        }


class TransactionCategoryToDiscCategory():

    def default_action(self):
        return Disc_Category.UNKNOWN

    def supermarkets(self):
        return Disc_Category.NEEDS

    def services(self):
        return Disc_Category.WANTSORNEED

    def restaurants(self):
        return Disc_Category.WANTS

    def travel_and_entertainment(self):
        return Disc_Category.WANTS

    def gasoline(self):
        return Disc_Category.WANTSORNEED

    def merchandise(self):
        return Disc_Category.WANTSORNEED

    def awards_and_rebate_credits(self):
        return Disc_Category.PAYCHECK

    def medical(self):
        return Disc_Category.NEEDS

    def automotive(self):
        return Disc_Category.NEEDS

    def __init__(self):
        self.lookup = {
            'Supermarkets': self.supermarkets,
            'Services': self.services,
            'Restaurants': self.restaurants,
            'Travel/ Entertainment': self.travel_and_entertainment,
            'Gasoline': self.gasoline,
            'Merchandise': self.merchandise,
            'Awards and Rebate Credits': self.awards_and_rebate_credits,
            'Medical Services': self.medical,
            'Automotive': self.automotive
        }
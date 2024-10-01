
def get_month_stat_category_amounts(category, amount, month, year):
    needs = 0
    wants = 0
    savings = 0
    paycheck = 0
    other = 0
    amount = float(amount)

    category = category.lower()
    if category == 'needs':
        needs += amount
    elif category == 'wants':
        wants += amount
    elif category == 'savings':
        savings += amount
    elif category == 'paycheck':
        paycheck += amount
    elif category == 'interest':
        other += amount
    return needs, other, paycheck, savings, wants

from models.dtos.year_stats_dto import YearStatsDto
from models.monthStat import MonthStat


def build_year_stats(year: int, month_stats: list[MonthStat]) -> YearStatsDto:
    result = YearStatsDto(
        year = year,
        needs = 0,
        wants = 0,
        savings = 0,
        paycheck = 0,
        other = 0
    )
    for month_stat in month_stats:
        result.needs += month_stat.needs_actual
        result.wants+= month_stat.wants_actual
        result.savings += month_stat.savings_actual
        result.paycheck += month_stat.paycheck_actual
        result.other += month_stat.other_actual

    return result


class YearService():
    pass


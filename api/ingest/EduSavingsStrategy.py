from ingest.IngestStrategy import IngestStrategy
from services.parse_savings import ParseSavings


class EduSavingsStrategy(IngestStrategy):
    def ingest(self, db, data) -> int:
        edu_savings_service= ParseSavings(db)
        return edu_savings_service.process_rows(data)
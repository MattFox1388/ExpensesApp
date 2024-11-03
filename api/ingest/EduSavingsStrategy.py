from ingest.IngestStrategy import IngestStrategy
from services.parse_savings import ParseSavings
from shared.exceptions import InvalidIngestRequestDataException


class EduSavingsStrategy(IngestStrategy):
    def ingest(self, db, data) -> int:
        edu_savings_service= ParseSavings(db)
        if data['username'] is None:
            raise InvalidIngestRequestDataException("Username doesn't exist on request data")
        return edu_savings_service.process_rows(data['rows'], data['username'])
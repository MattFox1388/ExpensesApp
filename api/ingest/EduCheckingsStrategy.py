from ingest.IngestStrategy import IngestStrategy
from services.parse_checkings import ParseCheckings
from shared.exceptions import InvalidIngestRequestDataException


class EduCheckingsStrategy(IngestStrategy) :
    def ingest(self, db, data)-> int:
        edu_checkings_service = ParseCheckings(db)
        if data['username'] is None:
            raise InvalidIngestRequestDataException("Username doesn't exist on request data")
        return edu_checkings_service.process_rows(data['rows'], data['username'])
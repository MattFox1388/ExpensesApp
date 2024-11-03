from ingest.IngestStrategy import IngestStrategy
from services.parse_disc import ParseDisc
from shared.exceptions import InvalidIngestRequestDataException


class DiscoverStrategy(IngestStrategy):
    def ingest(self, db, data) -> int:
        discover_service = ParseDisc(db)
        if data['username'] is None:
            raise InvalidIngestRequestDataException("Username doesn't exist on request data")
        return discover_service.process_rows(data['rows'], data['username'])
from ingest.IngestStrategy import IngestStrategy
from services.parse_disc import ParseDisc


class DiscoverStrategy(IngestStrategy):
    def ingest(self, db, data) -> int:
        discover_service = ParseDisc(db)
        return discover_service.process_rows(data)
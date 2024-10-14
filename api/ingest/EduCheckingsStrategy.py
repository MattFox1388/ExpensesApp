from ingest.IngestStrategy import IngestStrategy
from services.parse_checkings import ParseCheckings


class EduCheckingsStrategy(IngestStrategy) :
    def ingest(self, db, data)-> int:
        edu_checkings_service = ParseCheckings(db)
        return edu_checkings_service.process_rows(data)
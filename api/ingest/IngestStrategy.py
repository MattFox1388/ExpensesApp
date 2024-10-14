from abc import abstractmethod


class IngestStrategy:
    @abstractmethod
    def ingest(self, db, data) -> int:
        pass
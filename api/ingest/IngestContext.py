from typing import Optional

from ingest.IngestStrategy import IngestStrategy


class IngestContext:
    strategy: Optional[IngestStrategy] = None
    def __init__(self):
        pass

    def set_strategy(self, ingest_strategy):
        self.strategy = ingest_strategy

    def ingest(self, db, ingest):
        return self.strategy.ingest(db, ingest)
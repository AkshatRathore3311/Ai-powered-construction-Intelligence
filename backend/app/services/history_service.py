from datetime import datetime, timezone
from typing import List, Dict, Any
from ..schemas.history import AnalysisRecord, HistoryListResponse
from .supabase_service import SupabaseService

class HistoryService:
    # In-memory registry ensuring analyses persist across API requests
    _records: List[AnalysisRecord] = [
        AnalysisRecord(
            id="HIS-9012",
            timestamp="2026-10-24 16:30",
            category="Safety Monitoring",
            title="Zone 4 Scaffolding Scan",
            site_name="Metro Heights Tower A",
            summary="2 PPE violations identified; 1 unlatched toe-board.",
            status="Completed",
            badge_color="rose",
            metadata={"confidence": 0.94}
        ),
        AnalysisRecord(
            id="HIS-9011",
            timestamp="2026-10-24 14:15",
            category="Crack Detection",
            title="Retention Wall Segment B",
            site_name="Riverfront Residential Park",
            summary="Hairline shrink crack (0.8mm). Non-structural, monitor quarterly.",
            status="Completed",
            badge_color="emerald",
            metadata={"confidence": 0.91}
        ),
        AnalysisRecord(
            id="HIS-9010",
            timestamp="2026-10-23 11:00",
            category="Real Estate Valuation",
            title="Commercial Shell Val-Estimate",
            site_name="Apex Industrial Logistics Hub",
            summary="Valuation estimated at $4.2M based on regional cap rates.",
            status="Completed",
            badge_color="blue",
            metadata={"estimated_value": 4200000}
        ),
        AnalysisRecord(
            id="HIS-9009",
            timestamp="2026-10-22 09:45",
            category="Project Planning",
            title="Milestone Schedule Revision 3",
            site_name="Metro Heights Tower A",
            summary="Substructure timeline accelerated by 6 calendar days.",
            status="Completed",
            badge_color="amber",
            metadata={"milestone_count": 5}
        ),
    ]

    @classmethod
    async def add_record(
        cls,
        id_str: str,
        category: str,
        title: str,
        site_name: str,
        summary: str,
        status: str,
        badge_color: str,
        metadata: Dict[str, Any]
    ) -> AnalysisRecord:
        record = AnalysisRecord(
            id=id_str,
            timestamp=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M"),
            category=category,
            title=title,
            site_name=site_name,
            summary=summary,
            status=status,
            badge_color=badge_color,
            metadata=metadata
        )
        cls._records.insert(0, record)

        # Sync to Supabase table if configured
        if SupabaseService.is_configured():
            await SupabaseService.insert_record("analyses", {
                "record_id": id_str,
                "category": category,
                "title": title,
                "site_name": site_name,
                "summary": summary,
                "status": status,
                "metadata": metadata
            })

        return record

    @classmethod
    def get_all_records(cls) -> HistoryListResponse:
        return HistoryListResponse(
            total_count=len(cls._records),
            items=cls._records
        )

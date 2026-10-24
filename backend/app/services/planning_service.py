import uuid
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List
from ..schemas.planning import PlanningRequest, PlanningResponse, MilestoneItem, MaterialTakeoff

class PlanningService:
    @classmethod
    def generate_project_plan(cls, req: PlanningRequest) -> PlanningResponse:
        total_days = req.target_duration_months * 30
        
        # Deterministic Critical Path Method (CPM) milestone staging
        # Phase duration percentages of total project timeframe
        phases_config = [
            ("Substructure & Foundation Pouring", 0.20, "Soil Testing Approval", "Low", "Foundations signoff & pile load tests"),
            ("Reinforced Concrete Core & Columns", 0.30, "Foundation Curing (14d)", "Medium", "Structural frame milestone"),
            ("Structural Steel Truss Assembly", 0.20, "Core Wall Clearances", "High", "Heavy lift erection & bolt torque inspection"),
            ("Exterior Envelope & Architectural Glazing", 0.18, "Truss Stabilization", "Medium", "Weather-tight building enclosure"),
            ("MEP Rough-in & Interior Commissioning", 0.12, "Building Enclosure Sign-off", "Low", "Final MEP testing & occupancy clearance"),
        ]

        milestones: List[MilestoneItem] = []
        current_day_offset = 0
        critical_path_names = []

        for idx, (phase_name, frac, dep, risk, deliverable) in enumerate(phases_config, 1):
            phase_duration = max(7, int(total_days * frac))
            start_offset = current_day_offset
            end_offset = start_offset + phase_duration
            current_day_offset = end_offset
            critical_path_names.append(phase_name)

            milestones.append(MilestoneItem(
                id=idx,
                phase=phase_name,
                duration_days=phase_duration,
                start_day_offset=start_offset,
                completion_day_offset=end_offset,
                dependency=dep,
                risk_level=risk,
                status="In Progress" if idx == 1 else "Pending",
                key_deliverable=deliverable
            ))

        target_completion = (datetime.now(timezone.utc) + timedelta(days=current_day_offset)).strftime("%B %Y")

        # Deterministic Material Bill of Quantities (BOM) based on site area
        concrete_m3 = round(req.site_area_sqft * 0.08, 0)
        rebar_tons = round(concrete_m3 * 0.14, 1)
        steel_tons = round(req.site_area_sqft * 0.006, 1)
        glass_sqm = round(req.site_area_sqft * 0.12, 0)

        concrete_cost = concrete_m3 * 180
        rebar_cost = rebar_tons * 950
        steel_cost = steel_tons * 2100
        glass_cost = glass_sqm * 180
        total_materials = concrete_cost + rebar_cost + steel_cost + glass_cost

        materials = [
            MaterialTakeoff(
                item="Ready-Mix High-Strength Concrete (C35/45)",
                estimated_quantity=f"{concrete_m3:,.0f} cu.m",
                unit_cost_estimate="$180 / cu.m",
                total_cost_allocation=f"${concrete_cost:,.0f}"
            ),
            MaterialTakeoff(
                item="Deformed Rebar Steel (ASTM A615 Grade 60)",
                estimated_quantity=f"{rebar_tons:,.1f} metric tons",
                unit_cost_estimate="$950 / metric ton",
                total_cost_allocation=f"${rebar_cost:,.0f}"
            ),
            MaterialTakeoff(
                item="Structural Wide-Flange Steel (ASTM A992)",
                estimated_quantity=f"{steel_tons:,.1f} metric tons",
                unit_cost_estimate="$2,100 / metric ton",
                total_cost_allocation=f"${steel_cost:,.0f}"
            ),
            MaterialTakeoff(
                item="High-Performance Low-E Curtain Wall Glazing",
                estimated_quantity=f"{glass_sqm:,.0f} sq.m",
                unit_cost_estimate="$180 / sq.m",
                total_cost_allocation=f"${glass_cost:,.0f}"
            ),
        ]

        # Deterministic scheduling conflict check
        potential_conflicts = []
        if req.target_duration_months < 4 and req.site_area_sqft > 30000:
            potential_conflicts.append("High compression conflict: Target timeframe < 4 months requires double-shift concrete pours.")
        if total_materials > req.target_budget * 0.60:
            potential_conflicts.append("Budget allocation warning: Raw material estimate exceeds 60% of baseline budget ceiling.")
        potential_conflicts.append("Weather sensitivity: Heavy crane assembly requires wind velocity monitoring below 38 km/h.")

        variance_status = "Within Target Range" if total_materials <= req.target_budget else "Budget Extension Advisory"

        return PlanningResponse(
            id=f"PLN-{uuid.uuid4().hex[:8].upper()}",
            timestamp=datetime.now(timezone.utc).isoformat(),
            project_name=req.project_name,
            total_duration_days=current_day_offset,
            target_completion_formatted=target_completion,
            total_estimated_cost_band=f"${(req.target_budget * 0.95):,.0f} - ${(req.target_budget * 1.08):,.0f}",
            budget_variance_status=variance_status,
            critical_path=critical_path_names,
            potential_conflicts_and_risks=potential_conflicts,
            milestones=milestones,
            materials_bill_of_quantities=materials,
            deterministic_validation={
                "scheduled_days": current_day_offset,
                "input_target_days": total_days,
                "dependency_graph_acyclic": True,
                "materials_cost_sum": total_materials
            }
        )

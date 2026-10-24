import io
import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app.main import app

client = TestClient(app)

def create_test_image_bytes():
    file = io.BytesIO()
    image = Image.new("RGB", (320, 240), color=(180, 160, 140))
    image.save(file, format="JPEG")
    return file.getvalue()

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "environment" in data
    assert "ai_configured" in data

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "platform" in data
    assert data["platform"] == "BuildIntel AI"

def test_valuation_endpoint():
    payload = {
        "property_type": "commercial",
        "built_up_area_sqft": 15000,
        "location_tier": "prime",
        "structural_grade": "grade_a",
        "construction_age_stage": "new",
        "transit_proximity_miles": 0.5,
        "is_leed_certified": True
    }
    response = client.post("/api/valuation/estimate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["estimated_total_value"] > 0
    assert "formatted_value" in data
    assert len(data["comparables"]) > 0

def test_planning_endpoint():
    payload = {
        "project_name": "Skyline Logistics Wing B",
        "site_area_sqft": 30000,
        "target_budget": 4500000,
        "target_duration_months": 8,
        "construction_method": "Cast-in-place Concrete Core with Steel Frame"
    }
    response = client.post("/api/planning/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["milestones"]) == 5
    assert len(data["materials_bill_of_quantities"]) > 0
    assert data["total_duration_days"] > 0

def test_assistant_endpoint():
    payload = {
        "message": "What is the minimum safe clearance distance for crane booms operating near 50kV power lines?",
        "context_topic": "safety_standards"
    }
    response = client.post("/api/assistant/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["answer"]) > 10
    assert "key_points" in data
    assert "standard_references" in data

def test_weather_endpoint():
    response = client.get("/api/weather/current?latitude=28.6139&longitude=77.2090&city=Metro%20Hub")
    assert response.status_code == 200
    data = response.json()
    assert "current_temperature_celsius" in data
    assert "wind_speed_kmh" in data
    assert len(data["advisories"]) > 0

def test_safety_image_upload_endpoint():
    img_bytes = create_test_image_bytes()
    files = {"image": ("site.jpg", img_bytes, "image/jpeg")}
    data = {"site_name": "Metro Heights Tower A"}
    response = client.post("/api/safety/analyze", files=files, data=data)
    assert response.status_code == 200
    result = response.json()
    assert "summary" in result
    assert "detections" in result
    assert result["summary"]["compliance_score_percentage"] > 0

def test_crack_image_upload_endpoint():
    img_bytes = create_test_image_bytes()
    files = {"image": ("column_crack.jpg", img_bytes, "image/jpeg")}
    data = {"element_type": "column", "site_name": "Metro Heights Tower A"}
    response = client.post("/api/cracks/analyze", files=files, data=data)
    assert response.status_code == 200
    result = response.json()
    assert "crack_detected" in result
    assert "severity_level" in result
    assert "structural_impact_analysis" in result

def test_analyses_history_endpoint():
    response = client.get("/api/analyses")
    assert response.status_code == 200
    data = response.json()
    assert "total_count" in data
    assert data["total_count"] > 0

import httpx
import asyncio

async def test():
    async with httpx.AsyncClient() as client:
        payload = {
            "fir_number": "FIR/2026/1234",
            "station_id": "123e4567-e89b-12d3-a456-426614174000",
            "district_id": "123e4567-e89b-12d3-a456-426614174001",
            "date_filed": "2026-07-22T19:47:30.000Z",
            "date_incident": "2026-07-22T19:47:30.000Z",
            "crime_type": "THEFT",
            "status": "OPEN",
            "priority": "NORMAL",
            "description": "Test"
        }
        resp = await client.post("http://localhost:8000/api/v1/firs", json=payload)
        print(resp.status_code)
        print(resp.text)

if __name__ == "__main__":
    asyncio.run(test())

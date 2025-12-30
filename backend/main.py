from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
import os
import sys
# Add current directory to path so imports work irrespective of run location
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
from supabase import create_client, Client
from pdf_generator import create_esmeralda_report
import uvicorn

# Load Environment Variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Vecy Avalúos API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5701"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase Config
url: str = os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("VITE_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

class ReportRequest(BaseModel):
    appraisal_id: str
    insights: Optional[List[str]] = None

@app.get("/")
def read_root():
    return {"status": "active", "service": "Vecy Avalúos PDF Engine"}

@app.post("/generate-pdf/")
async def generate_pdf_endpoint(req: ReportRequest):
    try:
        # 1. Fetch Appraisal Data
        response = supabase.table("appraisals").select("*").eq("id", req.appraisal_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Appraisal not found")
            
        appraisal = response.data[0]
        property_data = appraisal.get('property_data', {})
        details = property_data.get('details', {})
        
        # 2. Prepare Data for PDF
        report_data = {
            'id': appraisal['id'],
            'address': details.get('address', 'Ubicación no disponible'),
            'area': float(details.get('area', 0)),
            'estrato': int(details.get('estrato', 0)),
            'type': details.get('type', 'Inmueble'),
            'price_suggested': property_data.get('valuation', {}).get('estimated_value', 0),
            'price_m2': property_data.get('valuation', {}).get('price_m2', 0),
            'market_avg_m2': property_data.get('valuation', {}).get('market_avg_m2', 0),
            'insights': req.insights or [
                "Efecto Vitrina: La iluminación LED puede aumentar el valor percibido.",
                "Negociación: Tu precio es competitivo para venta rápida (<60 días).",
                "Normativa: Revisa el uso de suelo para posibles usos comerciales."
            ]
        }
        
        # 3. Generate PDF
        temp_filename = f"report_{req.appraisal_id}.pdf"
        output_path = os.path.join(os.getcwd(), temp_filename)
        
        create_esmeralda_report(report_data, output_path)
        
        # 4. Return File
        return FileResponse(output_path, media_type='application/pdf', filename=f"Vecy_Reporte_{req.appraisal_id}.pdf")

    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

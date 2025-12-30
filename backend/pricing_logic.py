from typing import Dict, Union, Optional
from pydantic import BaseModel

# --- CONFIGURACIÓN GLOBAL ---
SMMLV_2026 = 1750905.0
TOTAL_VITAL_2026 = 2000000.0
IVA_RATE = 0.0  # Configurable: Cambiar a 0.19 cuando sea responsable

class PricingRequest(BaseModel):
    plan: str  # "esmeralda" | "oro"
    tipo_inmueble: str  # "residencial" | "comercial" | "especial"
    estrato: int  # 1-6
    area_m2: float
    valor_estimado_jania: float

class PricingResponse(BaseModel):
    precio_base: float
    iva: float
    total_a_pagar: float
    mensaje_legal: str
    mensaje_especial: Optional[str] = None

def liquidar_servicios_vecy(req: PricingRequest) -> Union[PricingResponse, Dict]:
    """
    Calcula el precio de los servicios de Vecy Avalúos según reglas de negocio 2026 (Salario Vital).
    """
    
    # 0. Restricciones de Seguridad (Gran Activo)
    if req.valor_estimado_jania > 5_000_000_000 or req.tipo_inmueble == "especial":
        return {
            "mensaje_especial": "Contacto directo para cotización de Gran Activo"
        }

    precio_base = 0.0
    mensaje_legal = ""
    smmlv = SMMLV_2026

    # 1. Lógica PLAN ESMERALDA (Analítica IA)
    if req.plan == "esmeralda":
        mensaje_legal = "Servicio de Analítica de Datos e Inteligencia Artificial."
        
        if req.tipo_inmueble == "residencial":
            tarifas_estrato = {
                1: 150_000, 2: 200_000, 3: 250_000, 
                4: 350_000, 5: 450_000, 6: 550_000
            }
            precio_base = tarifas_estrato.get(req.estrato, 350_000)
            
        elif req.tipo_inmueble == "comercial":
            # Base $600k + $500/m2
            precio_base = 600_000 + (500 * req.area_m2)

    # 2. Lógica PLAN ORO (Avalúo RAA Certificado) - 2026
    elif req.plan == "oro":
        mensaje_legal = "Avalúo Corporativo Certificado RAA. Cumple Ley 1673."
        
        if req.tipo_inmueble == "residencial":
            if req.estrato <= 2:
                # Vivienda VIS (1-2) -> 0.5 SMMLV BASE
                precio_base = round(smmlv * 0.5)
            else:
                # No VIS (3-6) -> Max(1 SMMLV, 1.2 x 1000)
                opcion_a = smmlv * 1.0
                opcion_b = req.valor_estimado_jania * (1.2 / 1000)
                precio_base = max(opcion_a, opcion_b)
                
        elif req.tipo_inmueble == "comercial":
            # Max(1.3 SMMLV, 1.5 x 1000)
            opcion_a = smmlv * 1.3
            opcion_b = req.valor_estimado_jania * (1.5 / 1000)
            precio_base = max(opcion_a, opcion_b)

    # Cálculos Finales
    diva = precio_base * IVA_RATE
    total = precio_base + diva

    return PricingResponse(
        precio_base=round(precio_base, 2),
        iva=round(diva, 2),
        total_a_pagar=round(total, 2),
        mensaje_legal=mensaje_legal
    )

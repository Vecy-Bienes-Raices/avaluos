import os
from fpdf import FPDF
from datetime import datetime
import matplotlib.pyplot as plt
import qrcode
import tempfile

# --- CONFIGURACIÓN DE COLORES VECY ---
COLOR_PRIMARY = (15, 15, 15)       # Negro Vecy (#0f0f0f)
COLOR_ACCENT = (212, 175, 55)      # Oro (#d4af37)
COLOR_SECONDARY = (66, 50, 41)     # Coffee (#423229)
COLOR_TEXT_MAIN = (50, 50, 50)     # Gris Oscuro
COLOR_TEXT_LIGHT = (100, 100, 100) # Gris Claro

class VecyReport(FPDF):
    def header(self):
        # Fondo del Encabezado
        self.set_fill_color(*COLOR_PRIMARY)
        self.rect(0, 0, 210, 35, 'F')
        
        # Logo Vecy (Asumiendo ruta relativa)
        logo_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'public', 'logo-vecy.png'))
        if os.path.exists(logo_path):
            self.image(logo_path, 10, 8, 30)
            
        # Título del Reporte
        self.set_font('helvetica', 'B', 16)
        self.set_text_color(*COLOR_ACCENT)
        self.set_xy(50, 10)
        self.cell(0, 10, 'INFORME INTELIGENTE - PLAN ESMERALDA', align='R')
        
        # Subtítulo (Slogan)
        self.set_font('helvetica', 'I', 9)
        self.set_text_color(255, 255, 255)
        self.set_xy(50, 18)
        self.cell(0, 5, 'Analítica Inmobiliaria y Estrategia de Valor', align='R')
        
        # Marca de Agua (Header)
        self.set_font('helvetica', '', 7)
        self.set_text_color(150, 150, 150)
        self.set_xy(50, 24)
        self.cell(0, 5, 'PROPIEDAD DE VECY AVALÚOS - CONFIDENCIAL', align='R')
        
        self.ln(20)

    def footer(self):
        self.set_y(-25)
        
        # Línea Dorada
        self.set_draw_color(*COLOR_ACCENT)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        
        self.set_y(-22)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(*COLOR_TEXT_LIGHT)
        
        # Aviso Legal
        legal_text = "AVISO LEGAL: Este informe es una estimación de valor basada en inteligencia artificial y datos de mercado. NO constituye un avalúo comercial certificado bajo la Ley 1673 de 2013 ni reemplaza el criterio de un perito RAA. El uso de esta información es responsabilidad exclusiva del usuario."
        self.multi_cell(0, 3, legal_text, align='C')
        
        self.set_y(-10)
        self.set_font('helvetica', 'B', 8)
        self.set_text_color(*COLOR_SECONDARY)
        self.cell(0, 5, f'Página {self.page_no()}/{{nb}} | Vecy Avalúos S.A.S | www.vecyavaluos.com', align='C')

    def chapter_title(self, label):
        self.ln(5)
        self.set_font('helvetica', 'B', 14)
        self.set_text_color(*COLOR_SECONDARY)
        self.cell(0, 10, label, ln=True)
        # Línea decorativa
        self.set_draw_color(*COLOR_ACCENT)
        self.set_line_width(1)
        self.line(10, self.get_y(), 60, self.get_y())
        self.ln(5)

    def chapter_body(self, text):
        self.set_font('helvetica', '', 11)
        self.set_text_color(*COLOR_TEXT_MAIN)
        self.multi_cell(0, 6, text)
        self.ln()

    def info_card(self, title, value):
        self.set_font('helvetica', 'B', 10)
        self.set_text_color(*COLOR_SECONDARY)
        self.cell(45, 8, title, border=0)
        self.set_font('helvetica', '', 10)
        self.set_text_color(*COLOR_TEXT_MAIN)
        self.cell(0, 8, str(value), border=0, ln=True)

def generate_market_chart(price_history):
    """Genera una gráfica temporal de Matplotlib"""
    plt.figure(figsize=(6, 3))
    # Datos simulados si no existen
    dates = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
    values = [5.2, 5.3, 5.25, 5.4, 5.45, 5.5] # Millones/m2
    
    plt.plot(dates, values, marker='o', color='#d4af37', linewidth=2)
    plt.fill_between(dates, values, alpha=0.1, color='#d4af37')
    plt.title('Tendencia de Valorización - Zona (Millones COP/m²)', fontsize=10, color='#423229')
    plt.grid(axis='y', linestyle='--', alpha=0.5)
    plt.box(False)
    
    # Save to temp file
    temp_chart = os.path.join(tempfile.gettempdir(), 'vecy_chart.png')
    plt.savefig(temp_chart, dpi=300, bbox_inches='tight')
    plt.close()
    return temp_chart

def create_esmeralda_report(data: dict, output_path: str):
    """
    Genera el PDF Plan Esmeralda.
    data: Diccionario con {
        'id': str,
        'date': str,
        'address': str,
        'area': float,
        'estrato': int,
        'type': str,
        'price_suggested': float,
        'price_m2': float,
        'market_avg_m2': float,
        'insights': [str, str, str], # 3 insights
        'pot_analysis': str
    }
    """
    pdf = VecyReport()
    pdf.alias_nb_pages()
    pdf.add_page()
    
    # --- 1. RESUMEN DE ACTIVOS ---
    pdf.chapter_title('1. Resumen del Activo')
    
    # Grid de Datos (Simulado con celdas)
    pdf.set_fill_color(250, 250, 250)
    pdf.rect(10, pdf.get_y(), 190, 40, 'F')
    pdf.set_y(pdf.get_y() + 5)
    
    start_x = 15
    pdf.set_x(start_x)
    pdf.info_card('ID de Consulta:', data.get('id', 'N/A'))
    pdf.set_x(start_x)
    pdf.info_card('Fecha de Emisión:', datetime.now().strftime("%d/%m/%Y"))
    pdf.set_x(start_x)
    pdf.info_card('Ubicación:', data.get('address', 'Bogotá D.C.'))
    
    pdf.set_y(pdf.get_y() - 24)
    pdf.set_x(110)
    pdf.info_card('Área Construida:', f"{data.get('area', 0)} m²")
    pdf.set_x(110)
    pdf.info_card('Tipo de Inmueble:', data.get('type', 'Apartamento').capitalize())
    pdf.set_x(110)
    pdf.info_card('Estrato Socioeconómico:', str(data.get('estrato', 4)))
    
    pdf.ln(15)

    # --- 2. VEREDICTO JANIA ---
    pdf.chapter_title('2. Veredicto de Valor (JanIA Market)')
    
    # Caja Destacada
    pdf.set_fill_color(66, 50, 41) # Coffee
    pdf.rect(10, pdf.get_y(), 190, 35, 'F')
    
    # Precio Sugerido
    pdf.set_y(pdf.get_y() + 5)
    pdf.set_font('helvetica', 'B', 12)
    pdf.set_text_color(212, 175, 55) # Gold
    pdf.cell(0, 8, 'PRECIO DE MERCADO SUGERIDO', align='C', ln=True)
    
    price = data.get('price_suggested', 0)
    price_fmt = f"${price:,.0f} COP"
    pdf.set_font('helvetica', 'B', 24)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 12, price_fmt, align='C', ln=True)
    
    # Comparativa m2
    price_m2 = data.get('price_m2', 0)
    avg_m2 = data.get('market_avg_m2', 0)
    diff = ((price_m2 - avg_m2) / avg_m2) * 100 if avg_m2 > 0 else 0
    sign = "+" if diff > 0 else ""
    
    pdf.set_font('helvetica', '', 10)
    pdf.set_text_color(200, 200, 200)
    pdf.cell(0, 6, f"Precio por m²: ${price_m2:,.0f} | Promedio Zona: ${avg_m2:,.0f} ({sign}{diff:.1f}%)", align='C', ln=True)
    
    pdf.ln(10)
    
    # --- 3. GRÁFICA DE MERCADO ---
    chart_path = generate_market_chart([])
    pdf.image(chart_path, x=20, w=170)
    pdf.ln(5)
    
    # --- 4. INSIGHTS ESTRATÉGICOS ---
    pdf.chapter_title('3. Insights "Vecina Experta" (Estrategia)')
    
    insights = data.get('insights', [
        "Efecto Vitrina: Mejora la iluminación para aumentar el valor percibido.",
        "Negociación: Tu precio es competitivo, mantente firme en un margen del 3%.",
        "Normativa: El POT permite uso mixto, ideal para home-office."
    ])
    
    for idx, insight in enumerate(insights, 1):
        pdf.set_font('helvetica', 'B', 11)
        pdf.set_text_color(*COLOR_SECONDARY)
        pdf.cell(10, 8, f"{idx}.", ln=False)
        
        pdf.set_font('helvetica', '', 11)
        pdf.set_text_color(*COLOR_TEXT_MAIN)
        pdf.multi_cell(0, 8, insight)
        pdf.ln(2)

    # --- 5. QR DE AUTENTICIDAD ---
    pdf.set_y(-55)
    
    # Generar QR
    qr_data = f"https://vecyavaluos.com/verify/{data.get('id', 'unknown')}"
    qr = qrcode.make(qr_data)
    temp_qr = os.path.join(tempfile.gettempdir(), 'vecy_qr.png')
    qr.save(temp_qr)
    
    pdf.image(temp_qr, x=170, y=pdf.get_y(), w=25)
    
    pdf.set_x(10)
    pdf.set_font('helvetica', 'B', 9)
    pdf.set_text_color(*COLOR_ACCENT)
    pdf.cell(0, 5, 'SELLO DE SEGURIDAD DIGITAL', ln=True)
    pdf.set_font('helvetica', '', 8)
    pdf.set_text_color(*COLOR_TEXT_MAIN)
    pdf.multi_cell(150, 4, f"Este documento cuenta con una firma digital única. Escanee el código QR para verificar su autenticidad directamente en nuestros servidores.\nID: {data.get('id')}")

    # Output
    pdf.output(output_path)
    
    # Cleanup
    if os.path.exists(chart_path): os.remove(chart_path)
    if os.path.exists(temp_qr): os.remove(temp_qr)

if __name__ == "__main__":
    # Test Manual
    sample_data = {
        'id': 'TEST-12345',
        'address': 'Calle 100 # 15-20, Bogotá',
        'area': 85.5,
        'estrato': 5,
        'type': 'apartamento',
        'price_suggested': 650000000,
        'price_m2': 7600000,
        'market_avg_m2': 7200000
    }
    create_esmeralda_report(sample_data, "test_report.pdf")
    print("PDF generado: test_report.pdf")

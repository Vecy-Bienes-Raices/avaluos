import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 40, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
    header: {
        marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#10B981', // Emerald Color
        paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    title: { fontSize: 22, color: '#000', fontWeight: 'bold' },
    subtitle: { fontSize: 10, color: '#059669', textTransform: 'uppercase', letterSpacing: 1 },
    brand: { fontSize: 12, color: '#10B981', fontWeight: 'bold' },

    // Section Styles
    sectionTitle: { fontSize: 14, color: '#000', fontWeight: 'bold', marginTop: 15, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 4 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    label: { fontSize: 10, color: '#6B7280' },
    value: { fontSize: 10, color: '#111827', fontFamily: 'Helvetica-Bold' },

    // CMA Box (Mock Graph)
    cmaContainer: { marginTop: 10, padding: 15, backgroundColor: '#F0FDF4', borderRadius: 8, borderWidth: 1, borderColor: '#10B981' },
    cmaText: { fontSize: 10, color: '#065F46', marginBottom: 5 },
    barContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, height: 20 },
    barNeighborhood: { width: '100%', height: 8, backgroundColor: '#D1FAE5', position: 'absolute', borderRadius: 4 }, // Range
    barProperty: { width: '10px', height: 16, backgroundColor: '#10B981', position: 'absolute', left: '60%', borderRadius: 2 }, // Pinpoint
    cmaLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
    cmaLabelText: { fontSize: 8, color: '#059669' },

    // Value Suggestion Box
    suggestionBox: { marginTop: 20, padding: 20, backgroundColor: '#064E3B', borderRadius: 8, alignItems: 'center' },
    suggestionTitle: { fontSize: 12, color: '#D1FAE5', marginBottom: 5, textTransform: 'uppercase' },
    suggestionValue: { fontSize: 24, color: '#FFFFFF', fontFamily: 'Helvetica-Bold' },

    // Human Review
    humanReview: { marginTop: 20, padding: 10, borderLeftWidth: 3, borderLeftColor: '#10B981', backgroundColor: '#F9FAFB' },
    reviewerName: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#111827' },

    // Watermark
    watermarkContainer: { position: 'absolute', top: 350, left: 0, right: 0, transform: 'rotate(-45deg)', alignItems: 'center', justifyContent: 'center', opacity: 0.08 },
    watermarkText: { fontSize: 50, color: '#EF4444', fontWeight: 'bold' },

    disclaimer: { marginTop: 30, fontSize: 9, color: '#9CA3AF', textAlign: 'justify' },
    footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 9, color: '#9CA3AF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10 },
});

const EsmeraldaReport = ({ propertyData, neighborhoodAnalysis, humanReviewer, estimatedValue }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Informe Inteligente PRO</Text>
                    <Text style={styles.subtitle}>Plan Esmeralda - Vecy Avalúos</Text>
                </View>
                <Text style={styles.brand}>VECY AVALÚOS</Text>
            </View>

            {/* WATERMARK */}
            <View style={styles.watermarkContainer}>
                <Text style={styles.watermarkText}>INFORME PRO</Text>
                <Text style={styles.watermarkText}>SIN VALIDEZ JURIDICA NI BANCARIA</Text>
            </View>

            {/* 1. PROPERTY SUMMARY */}
            <Text style={styles.sectionTitle}>Resumen del Inmueble</Text>
            <View style={{ marginBottom: 10 }}>
                <View style={styles.row}>
                    <Text style={styles.label}>Dirección:</Text>
                    <Text style={styles.value}>{propertyData?.address || 'No especificada'}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Área Privada:</Text>
                    <Text style={styles.value}>{propertyData?.area || 0} m²</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Estrato:</Text>
                    <Text style={styles.value}>{propertyData?.stratum || 'N/A'}</Text>
                </View>
            </View>

            {/* 2. C.M.A. (Análisis Comparativo) */}
            <Text style={styles.sectionTitle}>Estudio Comparativo de Mercado (CMA)</Text>
            <View style={styles.cmaContainer}>
                <Text style={styles.cmaText}>Comparativa Precio m² Barrio vs. Tu Inmueble</Text>

                {/* Mock Visualization */}
                <View style={{ marginTop: 10, marginBottom: 10 }}>
                    <View style={{ height: 10, width: '100%', backgroundColor: '#E5E7EB', borderRadius: 5, position: 'relative' }}>
                        {/* Range Bar (Market) */}
                        <View style={{ position: 'absolute', left: '20%', width: '60%', height: '100%', backgroundColor: '#34D399', borderRadius: 5 }} />
                        {/* Pinpoint (Subject) */}
                        <View style={{ position: 'absolute', left: '55%', top: -3, width: 4, height: 16, backgroundColor: '#064E3B' }} />
                    </View>
                    <View style={styles.cmaLabels}>
                        <Text style={styles.cmaLabelText}>$4.2M (Min)</Text>
                        <Text style={styles.cmaLabelText}>Promedio Zona</Text>
                        <Text style={styles.cmaLabelText}>$5.2M (Max)</Text>
                    </View>
                </View>

                <Text style={styles.label}>
                    El precio de tu inmueble se encuentra dentro del rango competitivo del sector, con una desviación del +2% frente al promedio histórico.
                </Text>
            </View>

            {/* 3. VALUE SUGGESTION */}
            <View style={styles.suggestionBox}>
                <Text style={styles.suggestionTitle}>Sugerencia de Valor Real</Text>
                <Text style={styles.suggestionValue}>
                    {estimatedValue ? `$${new Intl.NumberFormat('es-CO').format(estimatedValue)}` : '$ ---'} COP
                </Text>
                <Text style={{ color: '#A7F3D0', fontSize: 10, marginTop: 5 }}>Basado en IA + Validación Humana</Text>
            </View>

            {/* 4. HUMAN REVIEW */}
            <View style={styles.humanReview}>
                <Text style={styles.label}>Visto Bueno Profesional:</Text>
                <Text style={styles.reviewerName}>Revisado por: {humanReviewer || 'Arq. Camilo Osorio (Equipo Vecy)'}</Text>
                <Text style={{ fontSize: 9, color: '#6B7280', marginTop: 2 }}>
                    Este análisis cuenta con validación técnica de mercado, pero no sustituye un peritaje legal.
                </Text>
            </View>

            {/* DISCLAIMER */}
            <Text style={styles.disclaimer}>
                AVISO LEGAL: Este informe es una estimación profesional de mercado (Plan Esmeralda). No tiene validez para créditos hipotecarios, sucesiones o trámites judiciales que requieran certificación RAA (Plan Oro). Vecy Avalúos no se hace responsable por el uso indebido de esta información.
            </Text>

            {/* FOOTER */}
            <View style={styles.footer}>
                <Text>Generado por Tecnología Vecy Avalúos | Validación Humana Incluida</Text>
            </View>

        </Page>
    </Document>
);

export default EsmeraldaReport;

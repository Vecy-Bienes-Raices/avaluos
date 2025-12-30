import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register a standard font if needed, otherwise use Helvetica/Times implied
// Font.register({ family: 'Roboto', src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf' });

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#D4AF37', // Gold Color
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: '#000',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 10,
        color: '#666',
    },
    brand: {
        fontSize: 12,
        color: '#D4AF37',
        fontWeight: 'bold',
    },
    content: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
    },
    label: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    value: {
        fontSize: 18,
        color: '#111827',
        marginBottom: 16,
        fontFamily: 'Helvetica-Bold',
    },
    valueHighlight: {
        fontSize: 28,
        color: '#D4AF37', // Gold
        fontFamily: 'Helvetica-Bold',
        marginBottom: 20,
    },
    watermarkContainer: {
        position: 'absolute',
        top: 300,
        left: 0,
        right: 0,
        transform: 'rotate(-45deg)',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.1,
    },
    watermarkText: {
        fontSize: 60,
        color: 'red',
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 10,
        color: '#9CA3AF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 10,
    },
    disclaimer: {
        marginTop: 30,
        fontSize: 10,
        color: '#6B7280',
        fontStyle: 'italic',
        textAlign: 'justify',
    },
});

const CafeReport = ({ propertyAddress, area, estimatedValue, userName }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Sondeo Digital Vecy</Text>
                    <Text style={styles.subtitle}>Reporte Preliminar de Mercado</Text>
                </View>
                <Text style={styles.brand}>VECY AVALÚOS</Text>
            </View>

            {/* WATERMARK */}
            <View style={styles.watermarkContainer}>
                <Text style={styles.watermarkText}>SIN VALIDEZ JURIDICA NI BANCARIA</Text>
                <Text style={styles.watermarkText}>DOCUMENTO INFORMATIVO</Text>
            </View>

            {/* CONTENT */}
            <View style={styles.content}>
                <Text style={styles.label}>Solicitante:</Text>
                <Text style={styles.value}>{userName || 'Vecino Invitado'}</Text>

                <Text style={styles.label}>Dirección del Inmueble:</Text>
                <Text style={styles.value}>{propertyAddress || 'No especificada'}</Text>

                <Text style={styles.label}>Área Privada:</Text>
                <Text style={styles.value}>{area ? `${area} m²` : 'N/A'}</Text>

                <Text style={styles.label}>Valor Estimado de Mercado (IA):</Text>
                <Text style={styles.valueHighlight}>
                    {estimatedValue
                        ? `$${new Intl.NumberFormat('es-CO').format(estimatedValue)} COP`
                        : 'Pendiente de cálculo'}
                </Text>
            </View>

            {/* DISCLAIMER */}
            <View style={styles.disclaimer}>
                <Text>
                    Este documento es un sondeo de mercado generado automáticamente por Inteligencia Artificial "JanIA".
                    NO constituye un avalúo comercial certificado ni tiene validez ante entidades bancarias, judiciales o notariales (RAA).
                    Para trámites legales, se requiere un Avalúo Certificado (Plan Oro).
                </Text>
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
                <Text>Generado por JanIA - Vecy Avalúos | www.vecyavaluos.com</Text>
            </View>
        </Page>
    </Document>
);

export default CafeReport;

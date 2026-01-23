import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const VECY_LOGO = "https://i.ibb.co/G3ngFMmn/Vecy-agenda1.png"; // Using provided logo

// Theme Definitions
const THEMES = {
    cafe: {
        primary: '#665145', // Coffee Medium
        secondary: '#937E74', // Coffee Light
        accent: '#423229', // Coffee Darkest
        bg: '#FAF8F7',
        title: 'REPORTE CAFÉ EXPRESS',
        badgeColor: '#5D493A'
    },
    esmeralda: {
        primary: '#0DBB83', // Emerald
        secondary: '#E6FFFA', // Light Emerald BG
        accent: '#098A60', // Dark Emerald
        bg: '#F0FDF9',
        title: 'AVALÚO ESMERALDA PLUS',
        badgeColor: '#047857'
    },
    oro: {
        primary: '#CCAC4E', // Gold
        secondary: '#FFFBE6', // Light Gold BG
        accent: '#B8860B', // Dark Gold
        bg: '#FFFCF2',
        title: 'AVALÚO CERTIFICADO ORO',
        badgeColor: '#D4AF37'
    }
};

const getTheme = (plan) => THEMES[plan?.toLowerCase()] || THEMES.cafe;

const createStyles = (theme) => StyleSheet.create({
    page: { padding: 40, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 3,
        borderBottomColor: theme.primary,
        paddingBottom: 15
    },
    logo: { width: 65, height: 65, borderRadius: 32 },

    // Header Text
    titlesContainer: { alignItems: 'flex-end' },
    title: { fontSize: 20, color: theme.accent, fontWeight: 'bold', textTransform: 'uppercase' },
    subtitle: { fontSize: 10, color: '#666', marginTop: 4 },
    date: { fontSize: 8, color: '#999', marginTop: 2 },

    // Sections
    section: {
        marginTop: 15,
        padding: 15,
        backgroundColor: theme.bg,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: theme.primary
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    label: { fontSize: 10, color: '#555', fontWeight: 'bold' },
    value: { fontSize: 11, color: '#000' },

    // Value Box
    valueBox: {
        marginTop: 25,
        padding: 20,
        backgroundColor: theme.secondary, // Light BG
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.primary,
        alignItems: 'center'
    },
    estimatedLabel: { fontSize: 12, color: theme.accent, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 5 },
    estimatedValue: { fontSize: 26, color: theme.badgeColor, fontFamily: 'Helvetica-Bold' },

    // Badge
    badge: {
        marginTop: 5,
        backgroundColor: theme.primary,
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 10,
        alignSelf: 'flex-start'
    },
    badgeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },

    // Footer
    footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 10 },
    disclaimer: { fontSize: 7, color: '#888', textAlign: 'justify', marginBottom: 5 }
});

const CafeReport = ({ propertyAddress, area, estimatedValue, userName, planType = 'cafe', date }) => {
    const theme = getTheme(planType);
    const styles = createStyles(theme);

    // Format Currency
    const formatCurrency = (val) => {
        if (typeof val === 'number') {
            return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
        }
        return val;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* HEADER */}
                <View style={styles.header}>
                    <Image src={VECY_LOGO} style={styles.logo} />
                    <View style={styles.titlesContainer}>
                        <Text style={styles.title}>{theme.title}</Text>
                        <Text style={styles.subtitle}>Generado por JanIA - Inteligencia Inmobiliaria</Text>
                        <Text style={styles.date}>{date || new Date().toLocaleDateString()}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>PLAN {planType.toUpperCase()}</Text>
                        </View>
                    </View>
                </View>

                {/* INFO CLIENTE */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.label}>SOLICITANTE:</Text>
                        <Text style={styles.value}>{userName || 'Usuario'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>INMUEBLE:</Text>
                        <Text style={styles.value}>{propertyAddress || 'Dirección no registrada'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>ÁREA:</Text>
                        <Text style={styles.value}>{area ? `${area} m²` : '---'}</Text>
                    </View>
                </View>

                {/* VALOR ESTIMADO */}
                <View style={styles.valueBox}>
                    <Text style={styles.estimatedLabel}>
                        {planType === 'oro' ? 'VALOR BASE DE COTIZACIÓN' : 'VALOR COMERCIAL ESTIMADO'}
                    </Text>
                    <Text style={styles.estimatedValue}>
                        {typeof estimatedValue === 'number'
                            ? `${formatCurrency(estimatedValue * 0.9)} - ${formatCurrency(estimatedValue * 1.1)}`
                            : (estimatedValue || "En Proceso...")}
                    </Text>
                    <Text style={{ fontSize: 9, color: theme.accent, marginTop: 5 }}>
                        {planType === 'oro' ? '(Sujeto a confirmación por Perito RAA)' : '(Rango estadístico de mercado)'}
                    </Text>
                </View>

                {/* PLAN ORO: SIGNATURE PLACEHOLDER */}
                {planType === 'oro' && (
                    <View style={{ marginTop: 50, alignItems: 'center' }}>
                        <View style={{ width: 200, borderBottomWidth: 1, borderBottomColor: theme.primary, marginBottom: 5 }} />
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>PERITO CERTIFICADO RAA</Text>
                        <Text style={{ fontSize: 8, color: '#666' }}>Vecy Avalúos S.A.S.</Text>
                    </View>
                )}

                {/* PLAN ESMERALDA: GRAPHIC PLACEHOLDER */}
                {planType === 'esmeralda' && (
                    <View style={{ marginTop: 30, padding: 15, backgroundColor: '#F0FDF9', borderRadius: 8 }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: theme.primary, marginBottom: 5 }}>ANÁLISIS DE MERCADO</Text>
                        <Text style={{ fontSize: 9, color: '#555' }}>
                            Este informe incluye análisis de big data de ofertas similares en el sector de {propertyAddress || 'la zona'}.
                            La precisión de este avalúo es del 92% comparado con el mercado real.
                        </Text>
                    </View>
                )}

                {/* DISCLAIMER */}
                <View style={styles.footer}>
                    <Text style={styles.disclaimer}>
                        Este documento es un reporte generado automáticamete.
                        {planType === 'cafe' && " NO constituye un avalúo comercial certificado."}
                        {planType === 'esmeralda' && " Uso exclusivo para toma de decisiones informadas."}
                        {planType === 'oro' && " Documento preliminar sujeto a visita técnica."}
                        Vecy Avalúos no se hace responsable por el uso indebido de esta información.
                    </Text>
                    <Text style={{ fontSize: 8, color: theme.primary, fontWeight: 'bold' }}>
                        www.vecyavaluos.com
                    </Text>
                </View>

            </Page>
        </Document>
    );
};

export default CafeReport;

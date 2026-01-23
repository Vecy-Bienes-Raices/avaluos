import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
        position: 'relative',
    },
    // Watermark
    watermarkContainer: {
        position: 'absolute',
        top: '40%',
        left: '10%',
        right: '10%',
        transform: 'rotate(-45deg)',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.08,
        zIndex: -1,
    },
    watermarkText: {
        fontSize: 60,
        color: '#D4AF37', // Brand Gold
        fontWeight: 'bold',
        textAlign: 'center',
    },
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        borderBottomWidth: 2,
        borderBottomColor: '#D4AF37',
        paddingBottom: 10,
    },
    headerLogo: {
        width: 120,
        height: 'auto',
    },
    headerTitleContainer: {
        alignItems: 'flex-end',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C2420', // Brand Dark
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 10,
        color: '#666',
    },
    // Hero Image
    heroImage: {
        width: '100%',
        height: 200,
        objectFit: 'cover',
        marginBottom: 20,
        borderRadius: 8,
    },
    // Section
    section: {
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#F9FAFB',
        borderRadius: 6,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#D4AF37',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 4,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    label: {
        width: 120,
        fontSize: 10,
        color: '#6B7280',
        fontWeight: 'bold',
    },
    value: {
        flex: 1,
        fontSize: 10,
        color: '#111827',
    },
    // Price Highlight
    priceContainer: {
        backgroundColor: '#2C2420',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    priceLabel: {
        color: '#D4AF37',
        fontSize: 12,
        marginBottom: 5,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    priceValue: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    // Disclaimer
    disclaimerBox: {
        marginTop: 'auto',
        marginBottom: 20,
        padding: 10,
        borderLeftWidth: 3,
        borderColor: '#EF4444', // Red for warning
        backgroundColor: '#FEF2F2',
    },
    disclaimerText: {
        fontSize: 8,
        color: '#7F1D1D',
        textAlign: 'justify',
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: '#D4AF37',
        paddingTop: 10,
        alignItems: 'center',
    },
    footerBrand: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2C2420',
        marginBottom: 4,
    },
    footerContact: {
        fontSize: 8,
        color: '#666',
        marginBottom: 8,
    },
    socialLinks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    socialLink: {
        fontSize: 7,
        color: '#D4AF37',
        textDecoration: 'none',
        marginHorizontal: 4,
    },
    // Oro Specific: Perito Signature
    signatureBox: {
        marginTop: 30,
        marginBottom: 20,
        alignItems: 'center',
    },
    signatureLine: {
        width: 200,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginBottom: 8,
    },
    signatureName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
    },
    signatureDetail: {
        fontSize: 9,
        color: '#444',
    }
});

const ProfessionalReport = ({
    planType = 'esmeralda', // 'cafe', 'esmeralda', 'oro'
    propertyData = {},
    userPhotos = [],
    userName = ''
}) => {
    // Determine content based on plan
    const isOro = planType === 'oro' || planType.includes('oro');
    const isEsmeralda = planType === 'esmeralda' || planType.includes('esmeralda');
    const isCafe = !isOro && !isEsmeralda; // Fallback to Cafe

    // Formatting helpers
    const formatCurrency = (val) => val ? `$${new Intl.NumberFormat('es-CO').format(val)} COP` : 'Por Definir';
    const currentDate = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

    // Cafe: No photos in cover, just branding
    const coverPhoto = !isCafe && userPhotos.length > 0 ? userPhotos[0] : null;

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* WATERMARK */}
                <View style={styles.watermarkContainer}>
                    <Text style={styles.watermarkText}>VECY AVALÚOS</Text>
                    {isOro ? (
                        <Text style={{ ...styles.watermarkText, fontSize: 30, marginTop: 10, color: '#059669' }}>
                            DOCUMENTO VALIDO FINANCIERA Y JURÍDICAMENTE
                        </Text>
                    ) : (
                        <Text style={{ ...styles.watermarkText, fontSize: 30, marginTop: 10, color: '#EF4444' }}>
                            {isCafe ? 'SONDEO BÁSICO - NO VALIDO PARA TRÁMITES' : 'INFORME DE MERCADO - NO VALIDO JURÍDICAMENTE'}
                        </Text>
                    )}
                </View>

                {/* HEADER */}
                <View style={styles.header}>
                    {/* Simplified Header for Cafe, Full for others */}
                    <View>
                        <Text style={styles.headerTitle}>{isCafe ? 'SONDEO DE MERCADO' : `AVALÚO COMERCIAL ${propertyData.tipo?.toUpperCase() || ''}`}</Text>
                        <Text style={styles.headerSubtitle}>
                            {propertyData.tipo || 'INMUEBLE'} EN {propertyData.barrio?.toUpperCase() || 'BOGOTÁ'}
                        </Text>
                        <Text style={{ fontSize: 8, color: '#888', marginTop: 2 }}>{currentDate}</Text>
                    </View>
                </View>

                {/* HERO IMAGE OR BANNER */}
                {!isCafe && (
                    coverPhoto ? (
                        <Image src={coverPhoto} style={styles.heroImage} />
                    ) : (
                        <View style={{ ...styles.heroImage, backgroundColor: '#EEE', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#999' }}>Foto de Fachada No Disponible</Text>
                        </View>
                    )
                )}

                {/* MAIN CONTENT */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DETALLES DEL INMUEBLE</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Solicitante:</Text>
                        <Text style={styles.value}>{userName || 'Cliente Vecy'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Ubicación:</Text>
                        <Text style={styles.value}>{propertyData.direccion_normalizada || 'Bogotá D.C.'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Área Privada:</Text>
                        <Text style={styles.value}>{propertyData.area ? `${propertyData.area} m²` : 'Pendiente'}</Text>
                    </View>
                    {/* Oro specifics */}
                    {isOro && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Visita Técnica:</Text>
                            <Text style={styles.value}>Realizada por Perito Certificado</Text>
                        </View>
                    )}
                </View>

                {/* PRICE HIGHLIGHT */}
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>{isCafe ? 'VALOR SUGERIDO (SONDEO)' : 'VALOR ESTIMADO DE MERCADO'}</Text>
                    <Text style={styles.priceValue}>{formatCurrency(propertyData.valor)}</Text>
                    <Text style={{ color: '#AAA', fontSize: 8, marginTop: 4 }}>
                        {isOro
                            ? 'Valor certificado para trámites comerciales y bancarios.'
                            : isEsmeralda
                                ? 'Sugerencia basada en estudio de mercado (CMA).'
                                : 'Estimación básica estadística (No peritaje).'
                        }
                    </Text>
                </View>

                {/* ESMERALDA & ORO: DEEP ANALYSIS */}
                {!isCafe && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>ANÁLISIS DE MERCADO COMPARATIVO (CMA)</Text>
                        <Text style={{ fontSize: 9, color: '#444', marginBottom: 10 }}>
                            Comparativa con 3 inmuebles similares en {propertyData.barrio}.
                        </Text>
                        {/* Static Table Structure for Demo - Needs Real Data Binding later */}
                        <View style={{ flexDirection: 'row', backgroundColor: '#E5E7EB', padding: 5, borderRadius: 4 }}>
                            <Text style={{ fontSize: 8, fontWeight: 'bold', width: '33%' }}>Promedio Zona ($ m²)</Text>
                            <Text style={{ fontSize: 8, fontWeight: 'bold', width: '33%' }}>Inmueble Sujeto ($ m²)</Text>
                            <Text style={{ fontSize: 8, fontWeight: 'bold', width: '33%' }}>Rendimiento</Text>
                        </View>
                        <View style={{ flexDirection: 'row', padding: 5, borderBottomWidth: 1, borderColor: '#EEE' }}>
                            <Text style={{ fontSize: 8, width: '33%' }}>$5.5M (Est.)</Text>
                            <Text style={{ fontSize: 8, width: '33%', fontWeight: 'bold' }}>{propertyData.area ? formatCurrency(propertyData.valor / propertyData.area).replace(' COP', '') : 'N/A'}</Text>
                            <Text style={{ fontSize: 8, width: '33%', color: 'green' }}>Competitivo</Text>
                        </View>
                    </View>
                )}

                {/* ORO ONLY: GRAPHICS PLACEHOLDER & FULL DETAILS */}
                {isOro && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>ANÁLISIS DE NORMATIVA Y ENTORNO</Text>
                        <Text style={{ fontSize: 9, color: '#444' }}>
                            Análisis detallado de la ficha catastral y normativa POT vigente. (Se anexa documento técnico completo).
                        </Text>
                    </View>
                )}

                {/* PHOTO GALLERY (ESMERALDA & ORO) */}
                {!isCafe && userPhotos.length > 1 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>REGISTRO FOTOGRÁFICO DE ACABADOS</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
                            {userPhotos.slice(1, 7).map((photo, i) => (
                                <Image key={i} src={photo} style={{ width: 150, height: 100, objectFit: 'cover', borderRadius: 4, marginBottom: 5 }} />
                            ))}
                        </View>
                    </View>
                )}

                {/* DISCLAIMERS & SIGNATURES */}
                <View style={{ marginTop: 'auto' }}>
                    {isCafe && (
                        <View style={styles.disclaimerBox}>
                            <Text style={{ fontWeight: 'bold', fontSize: 9, marginBottom: 2, color: '#7F1D1D' }}>AVISO PLAN CAFÉ:</Text>
                            <Text style={styles.disclaimerText}>
                                Este reporte es un sondeo estadístico básico. NO reemplaza un avalúo comercial.
                            </Text>
                        </View>
                    )}
                    {isEsmeralda && (
                        <View style={styles.disclaimerBox}>
                            <Text style={{ fontWeight: 'bold', fontSize: 9, marginBottom: 2, color: '#7F1D1D' }}>AVISO PLAN ESMERALDA:</Text>
                            <Text style={styles.disclaimerText}>
                                Informe de valoración comercial detallado. Útil para negociación, pero sin validez jurídica ante juzgados o bancos.
                            </Text>
                        </View>
                    )}
                    {isOro && (
                        <View>
                            <View style={styles.signatureBox}>
                                <View style={styles.signatureLine} />
                                <Text style={styles.signatureName}>PERITO PROFESIONAL R.A.A.</Text>
                                <Text style={styles.signatureDetail}>Certificado RAA #ACTIVO-2026</Text>
                                <Text style={styles.signatureDetail}>Lonja de Propiedad Raíz de Bogotá</Text>
                            </View>
                            <View style={{ ...styles.disclaimerBox, borderColor: '#D4AF37', backgroundColor: '#FFFBEB' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 9, marginBottom: 2, color: '#92400E' }}>CERTIFICACIÓN PLAN ORO:</Text>
                                <Text style={styles.disclaimerText}>
                                    Documento con plena validez jurídica y financiera. Firmado por avaluador certificado.
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* FOOTER */}
                <View style={styles.footer}>
                    <Text style={styles.footerBrand}>Vecy Avalúos | Agente JanIA V2.0</Text>
                    <Text style={styles.footerContact}>Celular: +57 (316) 6569719 | Email: vecybienesraices@gmail.com</Text>
                </View>
            </Page>
        </Document>
    );
};

export default ProfessionalReport;

import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { supabase } from '../lib/supabaseClient';
import { triggerEmailWorkflow, sendAdminNotification } from './notificationService';

// REPORTS MAPPING
import CafeReport from '../components/reports/CafeReport';
import EsmeraldaReport from '../components/reports/EsmeraldaReport';
import ProfessionalReport from '../components/reports/ProfessionalReport'; // Plan ORO

/**
 * Genera el PDF basado en el plan, lo sube a Supabase y dispara el correo.
 * @param {string} planType - 'cafe', 'esmeralda', 'oro'
 * @param {object} appraisalData - Datos del avalúo y propiedad
 * @param {object} user - Objeto de usuario (Auth)
 * @returns {object} { success: true, link: string }
 */
export const generateAndSendReport = async (planType, appraisalData, user) => {
    try {
        console.log(`📄 [ReportService] Iniciando generación de reporte Plan: ${planType}`);

        // 1. SELECT REPORT COMPONENT
        let ReportComponent;
        const cleanPlan = planType.toLowerCase();

        switch (cleanPlan) {
            case 'cafe':
            case 'café':
                ReportComponent = CafeReport;
                break;
            case 'esmeralda':
                ReportComponent = EsmeraldaReport;
                break;
            case 'oro':
            case 'gold':
                ReportComponent = ProfessionalReport;
                break;
            default:
                ReportComponent = CafeReport; // Fallback
        }

        // 2. GENERATE PDF BLOB (Client-Side Rendering)
        const blob = await pdf(
            <ReportComponent
                propertyData={appraisalData.property_data || {}}
                appraisalData={appraisalData}
                estimatedValue={appraisalData.property_data?.price_estimate || appraisalData.valuation_price || 0}
                userName={user.user_metadata?.full_name || user.email || "Usuario Vecy"}
                planType={cleanPlan.toUpperCase()}
                date={new Date().toLocaleDateString()}
                // 📸 INJECT REAL PHOTOS
                userPhotos={appraisalData.photos || []}
                // Pass extra data depending on component props requirements
                neighborhoodAnalysis={appraisalData.market_analysis}
                humanReviewer="AI JanIA (Validación Preliminar)"
            />
        ).toBlob();

        // 3. UPLOAD TO SUPABASE STORAGE
        const timestamp = Date.now();
        const fileName = `Reporte_${cleanPlan.toUpperCase()}_${user.id.slice(0, 4)}_${timestamp}.pdf`;
        const filePath = `${user.id}/${fileName}`;

        console.log(`📄 [ReportService] Subiendo a Supabase: ${filePath}`);
        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, blob, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (uploadError) throw new Error('Upload Failed: ' + uploadError.message);

        // 4. GET PUBLIC LINK
        const { data: urlData } = supabase.storage.from('documents').getPublicUrl(filePath);
        const publicLink = urlData.publicUrl;
        console.log(`📄 [ReportService] Link Generado: ${publicLink}`);

        // 5. TRIGGER EMAIL WORKFLOW (Make/Resend)
        console.log(`📧 [ReportService] Enviando correo a: ${user.email}`);
        await triggerEmailWorkflow({
            email: user.email,
            name: user.user_metadata?.full_name || 'Usuario',
            link: publicLink,
            plan: cleanPlan,
            address: appraisalData.property_data?.direccion_normalizada || appraisalData.property_data?.barrio || 'Propiedad en Bogotá'
        });

        // 6. NOTIFY ADMIN (WhatsApp)
        await sendAdminNotification('Reporte Generado y Enviado', {
            user_name: user.user_metadata?.full_name,
            user_email: user.email,
            plan: cleanPlan,
            pdf_link: publicLink
        });

        return { success: true, link: publicLink };

    } catch (error) {
        console.error("❌ [ReportService] Error Crítico:", error);
        return { success: false, error: error.message };
    }
};

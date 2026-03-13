import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '../lib/supabaseClient';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Model for Embeddings (Standardizing on v1)
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" }, { apiVersion: "v1" });

/**
 * Generates a vector embedding for a given text.
 * @param {string} text - The text to vectorize.
 * @returns {Promise<Array<number>>} - The vector array (768 dimensions).
 */
export async function generateEmbedding(text) {
    try {
        const result = await embeddingModel.embedContent(text);
        const embedding = result.embedding;
        return embedding.values;
    } catch (error) {
        console.error("Error generating embedding:", error);
        return null;
    }
}

/**
 * Searches the Knowledge Base (POT, Norms) for relevant context.
 * @param {string} queryText - The user's question or context.
 * @returns {Promise<Array>} - List of relevant knowledge fragments.
 */
export async function searchRegulatoryContext(queryText) {
    const queryEmbedding = await generateEmbedding(queryText);
    if (!queryEmbedding) return [];

    const { data, error } = await supabase.rpc('match_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: 0.7, // Sensitivity threshold
        match_count: 5 // Number of results
    });

    if (error) {
        console.error("Error searching knowledge base:", error);
        return [];
    }
    return data;
}

/**
 * Searches for similar past valuations (Comparables).
 * @param {string} queryText - Description of the property (e.g., "Apto Chicó 80m2").
 * @returns {Promise<Array>} - List of similar past appraisals.
 */
export async function searchSimilarValuations(queryText) {
    const queryEmbedding = await generateEmbedding(queryText);
    if (!queryEmbedding) return [];

    const { data, error } = await supabase.rpc('match_valuations', {
        query_embedding: queryEmbedding,
        match_threshold: 0.75, // Higher threshold for strict comparison
        match_count: 3
    });

    if (error) {
        console.error("Error searching valuations:", error);
        return [];
    }
    return data;
}

/**
 * Stores a new valuation memory (Learning).
 * call this when a valuation is finalized/approved.
 */
export async function memorizeValuation(solicitudId, summaryText, valuationPrice, metadata = {}) {
    const embedding = await generateEmbedding(summaryText);
    if (!embedding) return false;

    const { error } = await supabase.from('valuation_memory').insert({
        solicitud_id: solicitudId,
        summary_text: summaryText,
        valuation_price: valuationPrice,
        metadata: metadata,
        embedding: embedding
    });

    if (error) {
        console.error("Error memorizing valuation:", error);
        return false;
    }
    return true;
}

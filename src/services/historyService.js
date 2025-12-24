import { supabase } from '../lib/supabaseClient';

/**
 * Persistencia Real de Vecy Avalúos (JanIA 3.0)
 * Gestiona el historial de chats en Supabase
 */

export const saveChatToHistory = async (userId, chatId, title, messages, metadata = {}) => {
  if (!userId || !chatId) return null;

  try {
    const { data, error } = await supabase
      .from('chats') // Asegúrate de que esta tabla exista en Supabase
      .upsert({
        id: chatId,
        user_id: userId,
        title: title || 'Nuevo Avalúo',
        messages: messages,
        metadata: metadata,
        updated_at: new Date()
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('❌ Error al guardar historial:', error);
    return null;
  }
};

export const getUserChats = async (userId) => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('chats')
      .select('id, title, updated_at, metadata')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ Error al obtener chats:', error);
    return [];
  }
};

export const getChatDetail = async (chatId) => {
  if (!chatId) return null;

  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ Error al obtener detalles del chat:', error);
    return null;
  }
};

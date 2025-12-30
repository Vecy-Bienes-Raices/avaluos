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
/**
 * Sube un archivo al bucket 'documents' de Supabase
 */
export const uploadChatFile = async (userId, chatId, file) => {
  console.log("🔍 [UPLOAD DEBUG] Starting upload...", { userId, chatId, fileName: file?.name }); // DEBUG ENTRY
  if (!userId) {
    console.error("❌ Upload aborted: Missing userId. User might not be fully authenticated.");
    return null;
  }
  if (!file) {
    console.error("❌ Upload aborted: Missing file object.");
    return null;
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${chatId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('documents') // Asegúrate de crear este bucket en Supabase
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('❌ Error subiendo archivo:', error); // Mostrar objeto completo
    console.error('❌ Detalles:', error.message || error.error_description); // Mostrar mensaje
    return null;
  }
};

export const deleteChat = async (chatId) => {
    try {
        const { count, error } = await supabase
            .from('chats')
            .delete({ count: 'exact' })
            .eq('id', chatId);
        
        if (error) throw error;
        
        // If count is 0/null, it means RLS or ID mismatch prevented deletion
        if (count === 0) {
            console.warn("⚠️ [DELETE] Supabase returned 0 deletions. RLS might be blocking or chat doesn't exist.");
            return false;
        }

        return true;
    } catch (error) {
        console.error('❌ Error al eliminar chat:', error);
        return false;
    }
};

export const clearUserHistory = async (userId) => {
    try {
        const { count, error } = await supabase
            .from('chats')
            .delete({ count: 'exact' })
            .eq('user_id', userId);
            
        if (error) throw error;

        if (count === 0) {
             console.warn("⚠️ [CLEAR] Supabase returned 0 deletions. RLS Policy likely blocking DELETE.");
             return false; // CORRECT: Fail so UI shows error
        }

        return true;
    } catch (error) {
        console.error('❌ Error al limpiar historial:', error);
        return false;
    }
};

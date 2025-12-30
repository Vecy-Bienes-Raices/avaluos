import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info', // 'info', 'success', 'error', 'warning'
        onConfirm: null, // For confirmation dialogs
        confirmText: 'Aceptar',
        cancelText: 'Cancelar'
    });

    const showModal = ({
        title,
        message,
        type = 'info',
        onConfirm = null,
        confirmText = 'Aceptar',
        cancelText = 'Cancelar'
    }) => {
        setModal({
            isOpen: true,
            title,
            message,
            type,
            onConfirm,
            confirmText,
            cancelText
        });
    };

    const closeModal = () => {
        setModal(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <ModalContext.Provider value={{ modal, showModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

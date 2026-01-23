import React, { useState, useEffect } from 'react';

export const GlassAvatar = ({ src, name = 'Usuario', size = 'md', className = '' }) => {
    // Determine size classes
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-16 h-16 text-xl',
        xl: 'w-24 h-24 text-3xl'
    };

    const [imgError, setImgError] = useState(false);

    // Reset error if src changes
    useEffect(() => {
        setImgError(false);
    }, [src]);

    // Get Initials
    const getInitials = (n) => {
        if (!n) return '?';
        const parts = n.split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    // Fallback Gradient
    if (!src || imgError) {
        return (
            <div
                className={`rounded-full flex items-center justify-center text-white shadow-lg bg-gradient-to-br from-brand-gold-dark to-brand-gold ${sizeClasses[size] || sizeClasses.md} ${className}`}
                title={name}
            >
                {getInitials(name)}
            </div>
        );
    }

    // Actual Image
    return (
        <div
            className={`relative rounded-full overflow-hidden shadow-lg border border-white/10 shrink-0 ${sizeClasses[size] || sizeClasses.md} ${className}`}
            title={name}
        >
            <img
                src={src}
                alt={name}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
            />
        </div>
    );
};

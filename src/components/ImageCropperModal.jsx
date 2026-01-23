import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

const ImageCropperModal = ({ imageSrc, onCancel, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [loading, setLoading] = useState(false);

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom) => {
        setZoom(zoom);
    };

    const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropComplete(croppedImageBlob);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#1e1e1e] border border-brand-gold/20 rounded-2xl w-[90%] max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                    <h3 className="text-brand-gold font-bold uppercase tracking-wider text-sm">Ajustar Foto de Perfil</h3>
                    <button onClick={onCancel} className="text-stone-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Cropper Area */}
                <div className="relative w-full h-[300px] bg-black">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteHandler}
                        onZoomChange={onZoomChange}
                        cropShape="round" // Circular stencil for profile
                        showGrid={false}
                    />
                </div>

                {/* Controls */}
                <div className="p-6 space-y-6 bg-[#2c2420]">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-stone-400 font-medium">
                            <span>Zoom</span>
                            <span>{Math.round(zoom * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl border border-white/10 text-stone-300 font-bold text-xs uppercase hover:bg-white/5 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl bg-brand-gold text-black font-bold text-xs uppercase hover:bg-brand-gold-light hover:shadow-[0_0_20px_rgba(204,172,78,0.4)] transition-all flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Foto'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropperModal;

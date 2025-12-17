
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, EffectFade, Zoom, Autoplay } from 'swiper/modules';
import Lightbox from "yet-another-react-lightbox";
import ZoomPlugin from "yet-another-react-lightbox/plugins/zoom";
import DownloadPlugin from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/styles.css";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/effect-fade';
import 'swiper/css/zoom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faDownload } from '@fortawesome/free-solid-svg-icons';

const ImageGallery = ({ images: sourceImages }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [openLightbox, setOpenLightbox] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    // Process external images or fallback to placeholders if empty
    const images = (sourceImages && sourceImages.length > 0)
        ? sourceImages.map((src, i) => ({ src, alt: `Foto Propiedad ${i + 1}` }))
        : Array.from({ length: 5 }, (_, i) => ({ // Fallback to 5 placeholders if no images
            src: `/${i + 1}.jpeg`,
            alt: `Foto Representativa ${i + 1}`
        }));

    return (
        <section id="gallery" className="py-12 px-4 max-w-6xl mx-auto">
            <div className="glass-panel p-4 md:p-8 bg-white/5 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl md:text-4xl font-extrabold text-brand-accent text-shadow-volcanic tracking-tight">Galería Fotográfica</h2>
                    <button
                        onClick={() => setOpenLightbox(true)}
                        className="text-stone-300 hover:text-brand-accent transition-colors text-sm font-bold uppercase tracking-wider flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faExpand} /> Pantalla Completa
                    </button>
                </div>

                {/* Main Swiper */}
                <Swiper
                    style={{
                        '--swiper-navigation-color': '#FFFFFF',
                        '--swiper-pagination-color': '#CCAC4E',
                        borderRadius: '1.5rem',
                        marginBottom: '1rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                    }}
                    spaceBetween={10}
                    navigation={true}
                    thumbs={{ swiper: thumbsSwiper }}
                    effect={'fade'}
                    modules={[Navigation, Thumbs, EffectFade, Autoplay]}
                    className="h-[300px] md:h-[500px] w-full rounded-3xl"
                    autoplay={{ delay: 3000, disableOnInteraction: true }}
                >
                    {images.map((img, index) => (
                        <SwiperSlide key={index} className="bg-black flex items-center justify-center">
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-700"
                                onClick={() => {
                                    setPhotoIndex(index);
                                    setOpenLightbox(true);
                                }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Thumbs Swiper */}
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[Navigation, Thumbs]}
                    className="gallery-thumbs h-24 w-full"
                    breakpoints={{
                        640: { slidesPerView: 5 },
                        768: { slidesPerView: 6 },
                        1024: { slidesPerView: 8 },
                    }}
                >
                    {images.map((img, index) => (
                        <SwiperSlide key={index} className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer rounded-xl overflow-hidden border-2 border-transparent hover:border-brand-accent">
                            <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Lightbox */}
            <Lightbox
                open={openLightbox}
                close={() => setOpenLightbox(false)}
                slides={images}
                index={photoIndex}
                plugins={[ZoomPlugin, DownloadPlugin]}
                zoom={{ maxZoomPixelRatio: 3 }}
            />
        </section>
    );
};

export default ImageGallery;

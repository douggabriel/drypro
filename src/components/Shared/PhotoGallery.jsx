import React, { useState } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

/**
 * Photo Gallery Component
 * @param {Object} props
 * @param {Array} props.photos - Array of photo URLs or objects with url property
 * @param {string} props.title - Gallery title (default: "Photos")
 * @param {string} props.emptyMessage - Message when no photos (default: "No photos uploaded")
 */
const PhotoGallery = ({ photos = [], title = "Photos", emptyMessage = "No photos uploaded yet" }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Normalize photos to always be array of URLs
  const normalizedPhotos = photos.map(photo =>
    typeof photo === 'string' ? photo : photo?.url || photo
  ).filter(Boolean);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedPhoto(normalizedPhotos[index]);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : normalizedPhotos.length - 1;
    setCurrentIndex(newIndex);
    setSelectedPhoto(normalizedPhotos[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex < normalizedPhotos.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedPhoto(normalizedPhotos[newIndex]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  if (normalizedPhotos.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-semibold">
            {normalizedPhotos.length} {normalizedPhotos.length === 1 ? 'photo' : 'photos'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {normalizedPhotos.map((photo, index) => (
            <div
              key={index}
              onClick={() => openLightbox(index)}
              className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous button */}
          {normalizedPhotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next button */}
          {normalizedPhotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl max-h-[90vh]"
          >
            <img
              src={selectedPhoto}
              alt={`Photo ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm font-semibold">
            {currentIndex + 1} / {normalizedPhotos.length}
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGallery;

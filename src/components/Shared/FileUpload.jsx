import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { validateFileSize, validateImageFile } from '../../utils/validators';
import { formatFileSize } from '../../utils/formatters';

/**
 * File upload component
 * @param {Object} props
 * @param {Function} props.onChange - Change handler (receives array of files)
 * @param {boolean} props.multiple - Allow multiple files
 * @param {number} props.maxFiles - Maximum number of files
 * @param {number} props.maxSizeMB - Maximum file size in MB
 * @param {string} props.accept - Accepted file types
 * @param {Array} props.value - Current files
 * @param {boolean} props.showPreview - Show file previews
 * @param {string} props.className - Additional CSS classes
 */
const FileUpload = ({
  onChange,
  multiple = true,
  maxFiles = 10,
  maxSizeMB = 5,
  accept = 'image/*',
  value = [],
  showPreview = true,
  className = '',
}) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');
  const [previews, setPreviews] = useState([]);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    setError('');

    // Check max files
    if (value.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate each file
    const validFiles = [];
    const newPreviews = [...previews];

    for (const file of files) {
      // Validate size
      const sizeError = validateFileSize(file, maxSizeMB);
      if (sizeError) {
        setError(sizeError);
        continue;
      }

      // Validate type (if images only)
      if (accept === 'image/*') {
        const typeError = validateImageFile(file);
        if (typeError) {
          setError(typeError);
          continue;
        }

        // Generate preview
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push({
            file,
            url: e.target.result,
          });
          setPreviews([...newPreviews]);
        };
        reader.readAsDataURL(file);
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onChange([...value, ...validFiles]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      {/* Upload button */}
      <div
        onClick={handleClick}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-primary-blue hover:bg-blue-50 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          multiple={multiple}
          accept={accept}
          className="hidden"
        />

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-primary-blue" />
          </div>
          <p className="text-lg font-semibold text-gray-700 mb-1">
            Click to upload {multiple ? 'files' : 'a file'}
          </p>
          <p className="text-sm text-gray-500">
            {accept === 'image/*' ? 'Images only' : 'All files'} • Max {maxSizeMB}MB
            {multiple && ` • Up to ${maxFiles} files`}
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {/* Preview grid */}
      {showPreview && previews.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                {preview.url ? (
                  <img
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Remove button */}
              <button
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
              >
                <X className="w-5 h-5" />
              </button>

              {/* File info */}
              <p className="mt-1 text-xs text-gray-600 truncate">
                {preview.file.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(preview.file.size)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;

import React, { useState, useRef } from 'react';
import { uploadFile } from '../services/api';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setMessage('');
    setError('');

    // Dosya türü kontrolü
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Sadece PDF, JPG ve PNG dosyaları yükleyebilirsiniz');
      return false;
    }

    // Dosya boyutu kontrolü (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Dosya boyutu 10MB\'ı geçemez');
      return false;
    }

    setFile(selectedFile);
    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!file) {
      return setError('Lütfen bir dosya seçin');
    }

    setLoading(true);

    try {
      const response = await uploadFile(file);
      setMessage('Dosya başarıyla yüklendi');
      setFile(null);
      // Dosya listesini yenilemek için sayfayı yeniden yükle
      // Daha iyi bir çözüm, bir context veya state yönetimi kullanarak dosya listesini güncellemek olurdu
      window.location.reload();
    } catch (err) {
      setError(
        err.response && err.response.data.error
          ? err.response.data.error
          : 'Dosya yüklenirken bir hata oluştu'
      );
    } finally {
      setLoading(false);
    }
  };

  // Dosya boyutunu formatla
  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  };

  // Dosya türüne göre simge belirleme ve renk
  const getFileInfo = (file) => {
    if (!file) return { icon: '📁', color: 'gray' };
    
    if (file.type === 'application/pdf') {
      return { icon: '📄', color: 'red' };
    } else if (file.type.startsWith('image/jpeg')) {
      return { icon: '🖼️', color: 'blue' };
    } else if (file.type.startsWith('image/png')) {
      return { icon: '🖼️', color: 'green' };
    } else {
      return { icon: '📁', color: 'gray' };
    }
  };

  const fileInfo = file ? getFileInfo(file) : null;

  return (
    <div className="h-full">
      {message && (
        <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm animate-pulse">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p>{message}</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm animate-pulse">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={onSubmit} className="flex flex-col h-full">
        <div 
          className={`w-full mb-4 p-6 border-2 border-dashed rounded-lg transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
            dragActive 
              ? 'border-indigo-500 bg-indigo-50' 
              : file 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
          style={{ minHeight: '150px' }}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
          />
          
          {file ? (
            <div className="text-center">
              <div className="text-5xl mb-2">{fileInfo.icon}</div>
              <span className="font-semibold text-gray-800 block truncate max-w-xs">{file.name}</span>
              <span className="text-sm text-gray-500 block">{formatFileSize(file.size)}</span>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="mt-2 text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Dosyayı Kaldır
              </button>
            </div>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-sm text-gray-700 text-center">
                <span className="font-semibold">Dosya yüklemek için tıklayın</span> veya dosyayı buraya sürükleyin
              </p>
              <p className="text-xs text-gray-500">PDF, PNG veya JPG (Maks. 10MB)</p>
            </>
          )}
        </div>
        
        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 transform ${
            loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
          } ${
            file ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-md hover:shadow-lg' : 'bg-gray-400'
          }`}
          disabled={loading || !file}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Yükleniyor...
            </div>
          ) : (
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              {file ? 'Dosyayı Yükle' : 'Dosya Seçin'}
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default FileUpload; 
import React, { useState, useEffect } from 'react';
import { getFiles, deleteFile } from '../services/api';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [fileDetails, setFileDetails] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getFiles();
      setFiles(response.data);
    } catch (err) {
      setError(
        err.response && err.response.data.error
          ? err.response.data.error
          : 'Dosyalar yüklenirken bir hata oluştu'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    
    if (!window.confirm('Bu dosyayı silmek istediğinize emin misiniz?')) {
      return;
    }

    setDeleteLoading(id);

    try {
      await deleteFile(id);
      setFiles(files.filter((file) => file.id !== id));
      setFileDetails(null);
    } catch (err) {
      setError(
        err.response && err.response.data.error
          ? err.response.data.error
          : 'Dosya silinirken bir hata oluştu'
      );
    } finally {
      setDeleteLoading(null);
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

  // Dosya türüne göre simge belirleme
  const getFileInfo = (mimetype) => {
    if (mimetype === 'application/pdf') {
      return { icon: '📄', color: 'red', name: 'PDF' };
    } else if (mimetype.startsWith('image/jpeg')) {
      return { icon: '🖼️', color: 'blue', name: 'JPEG' };
    } else if (mimetype.startsWith('image/png')) {
      return { icon: '🖼️', color: 'green', name: 'PNG' };
    } else {
      return { icon: '📁', color: 'gray', name: 'Dosya' };
    }
  };

  // Tarih formatlama
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sıralama fonksiyonu
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedFiles = [...files].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Arama filtresi
  const filteredFiles = sortedFiles.filter((file) => 
    file.originalname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dosya detayını gösterme/gizleme
  const toggleFileDetails = (file) => {
    if (fileDetails && fileDetails.id === file.id) {
      setFileDetails(null);
    } else {
      setFileDetails(file);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 animate-pulse">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-600 mb-4"></div>
          <p className="text-lg text-indigo-600 font-medium">Dosyalarınız Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {error && (
        <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm animate-pulse">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Dosya Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={fetchFiles}
          className="ml-3 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center"
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Yenile
        </button>
      </div>

      {fileDetails && (
        <div className="mb-4 bg-indigo-50 rounded-lg p-4 border border-indigo-100 animate__animated animate__fadeIn">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2 flex items-center">
              <span className="text-2xl mr-2">{getFileInfo(fileDetails.mimetype).icon}</span>
              {fileDetails.originalname}
            </h3>
            <button 
              onClick={() => setFileDetails(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tip:</p>
              <p className="font-medium">{getFileInfo(fileDetails.mimetype).name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Boyut:</p>
              <p className="font-medium">{formatFileSize(fileDetails.size)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Yükleme Tarihi:</p>
              <p className="font-medium">{formatDate(fileDetails.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Dosya ID:</p>
              <p className="font-medium">{fileDetails.id}</p>
            </div>
          </div>
          <div className="flex mt-4 space-x-3">
            <a
              href={`http://localhost:5000${fileDetails.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 text-center"
            >
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Görüntüle
              </span>
            </a>
            <a
              href={`http://localhost:5000${fileDetails.url}`}
              download
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 text-center"
            >
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                İndir
              </span>
            </a>
            <button
              onClick={(e) => handleDelete(fileDetails.id, e)}
              className={`flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 ${deleteLoading === fileDetails.id ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={deleteLoading === fileDetails.id}
            >
              {deleteLoading === fileDetails.id ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Siliniyor
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Sil
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {filteredFiles.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-12 text-center">
          {searchTerm ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h5 className="text-xl font-medium text-gray-800 mb-1">Arama sonucu bulunamadı</h5>
              <p className="text-gray-600">
                "{searchTerm}" ile eşleşen dosya bulunamadı.
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Aramayı Temizle
              </button>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <h5 className="text-xl font-medium text-gray-800 mb-1">Henüz dosya yüklenmemiş</h5>
              <p className="text-gray-600">
                Dosya yüklemek için yandaki formu kullanabilirsiniz.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto bg-white rounded-2xl shadow-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <span>Dosya</span>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-indigo-700 transition-colors" onClick={() => requestSort('size')}>
                  <div className="flex items-center">
                    <span>Boyut</span>
                    {sortConfig.key === 'size' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 ${sortConfig.direction === 'asc' ? '' : 'transform rotate-180'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-indigo-700 transition-colors" onClick={() => requestSort('created_at')}>
                  <div className="flex items-center">
                    <span>Tarih</span>
                    {sortConfig.key === 'created_at' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 ${sortConfig.direction === 'asc' ? '' : 'transform rotate-180'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                  <span>İşlemler</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFiles.map((file) => (
                <tr 
                  key={file.id} 
                  className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${fileDetails && fileDetails.id === file.id ? 'bg-indigo-50' : ''}`} 
                  onClick={() => toggleFileDetails(file)}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">
                        {getFileInfo(file.mimetype).icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {file.originalname}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getFileInfo(file.mimetype).name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(file.created_at)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <div className="flex justify-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`http://localhost:5000${file.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100 transition-colors"
                        title="Görüntüle"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </a>
                      <a
                        href={`http://localhost:5000${file.url}`}
                        download
                        className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition-colors"
                        title="İndir"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                      <button
                        onClick={(e) => handleDelete(file.id, e)}
                        className={`text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors ${deleteLoading === file.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={deleteLoading === file.id}
                        title="Sil"
                      >
                        {deleteLoading === file.id ? (
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileList; 
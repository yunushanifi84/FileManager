import React, { useState, useEffect } from 'react';
import { getFiles, deleteFile } from '../services/api';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Bu dosyayı silmek istediğinize emin misiniz?')) {
      return;
    }

    setDeleteLoading(id);

    try {
      await deleteFile(id);
      setFiles(files.filter((file) => file.id !== id));
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
  const getFileIcon = (mimetype) => {
    if (mimetype === 'application/pdf') {
      return '📄';
    } else if (mimetype.startsWith('image/')) {
      return '🖼️';
    } else {
      return '📁';
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

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-2">Dosyalar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Dosyalarım</h5>
        <button
          onClick={fetchFiles}
          className="btn btn-sm btn-light"
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise"></i> Yenile
        </button>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}

        {files.length === 0 ? (
          <div className="text-center py-5">
            <h5>Henüz dosya yüklenmemiş</h5>
            <p className="text-muted">
              Dosya yüklemek için sol taraftaki formu kullanabilirsiniz.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Tür</th>
                  <th>Dosya Adı</th>
                  <th>Boyut</th>
                  <th>Yükleme Tarihi</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id}>
                    <td>{getFileIcon(file.mimetype)}</td>
                    <td>{file.originalname}</td>
                    <td>{formatFileSize(file.size)}</td>
                    <td>{formatDate(file.created_at)}</td>
                    <td>
                      <div className="btn-group">
                        <a
                          href={`http://localhost:5000${file.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-info text-white me-1"
                        >
                          Görüntüle
                        </a>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="btn btn-sm btn-danger"
                          disabled={deleteLoading === file.id}
                        >
                          {deleteLoading === file.id ? 'Siliniyor...' : 'Sil'}
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
    </div>
  );
};

export default FileList; 
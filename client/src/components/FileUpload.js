import React, { useState } from 'react';
import { uploadFile } from '../services/api';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!file) {
      return setError('Lütfen bir dosya seçin');
    }

    // Dosya türü kontrolü
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return setError('Sadece PDF, JPG ve PNG dosyaları yükleyebilirsiniz');
    }

    // Dosya boyutu kontrolü (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return setError('Dosya boyutu 10MB\'ı geçemez');
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

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5>Dosya Yükle</h5>
      </div>
      <div className="card-body">
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="file" className="form-label">
              Dosya Seç (PDF, PNG, JPG)
            </label>
            <input
              type="file"
              className="form-control"
              id="file"
              onChange={onFileChange}
              accept=".pdf,.png,.jpg,.jpeg"
            />
            <small className="form-text text-muted">
              Maksimum dosya boyutu: 10MB
            </small>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !file}
          >
            {loading ? 'Yükleniyor...' : 'Yükle'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileUpload; 
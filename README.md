# Dosya Yükleme ve Yönetimi Uygulaması

Bu uygulama, kullanıcıların PDF, PNG veya JPG gibi dosyaları yükleyebileceği, listeleyebileceği ve silebileceği bir web uygulamasıdır.

## Özellikler

- Kullanıcı kaydı ve girişi (JWT ile doğrulama)
- Dosya yükleme (PDF, PNG, JPG)
- Dosya listeleme
- Dosya silme
- Dosya önizleme

## Teknolojiler

### Backend
- Node.js
- Express.js
- SQLite
- JWT (JSON Web Token)
- Bcrypt
- Multer (dosya yükleme)

### Frontend
- React
- React Router
- Bootstrap
- Axios

## Kurulum

### Gereksinimler
- Node.js (v14.0.0 veya üzeri)
- npm (v6.0.0 veya üzeri)

### Adımlar

1. Projeyi bilgisayarınıza klonlayın:
```
git clone <repo-url>
cd dosya-yonetim-uygulamasi
```

2. Backend kurulumu:
```
cd server
npm install
```

3. .env dosyasını oluşturun:
```
PORT=5000
JWT_SECRET=gizli-anahtar-buraya
```

4. Backend sunucusunu başlatın:
```
npm start
```

5. Yeni bir terminal açın ve frontend kurulumunu yapın:
```
cd client
npm install
```

6. Frontend uygulamasını başlatın:
```
npm start
```

7. Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı kullanmaya başlayabilirsiniz.

## Kullanım

1. Kayıt olun veya giriş yapın
2. Ana sayfada, sol taraftaki form ile dosya yükleyebilirsiniz
3. Sağ tarafta yüklediğiniz dosyaları görebilir, görüntüleyebilir veya silebilirsiniz

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız. 
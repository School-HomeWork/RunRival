# RunRival 🏃‍♂️⚡

> **Mobil uygulama geliştirme challenge** — Koşuyu rekabete dönüştür!

RunRival, koşucuların birbirleriyle yarışmasını, meydan okumalara katılmasını ve istatistiklerini takip etmesini sağlayan bir koşu & fitness rekabet uygulamasıdır.

---

## 📱 Ekran Görüntüleri

|         Ana Sayfa          |      Meydan Okumalar       |        Liderlik         |        Bire Bir        |        Profil         |
| :------------------------: | :------------------------: | :---------------------: | :--------------------: | :-------------------: |
| Dashboard + haftalık stats | Filtreli challenge listesi | Top-3 podium + sıralama | Metrik karşılaştırması | İstatistik + rozetler |

---

## 🎯 Uygulama Özellikleri

### 🏠 Ana Sayfa (Dashboard)

- Bugünün aktivite halkası ve hedef takibi
- Haftalık koşu çubuk grafiği (Pazartesi–Pazar)
- Hızlı istatistik kartları (mesafe, kalori, seri)
- Aktif meydan okuma önizlemesi
- Son koşuların listesi

### 🏆 Meydan Okumalar (Meydan Okumalar)

- Mesafe, hız, seri, topluluk challenge türleri
- Filtre sekmeleri (Tümü / Katıldıklarım / Mesafe / Hız / Topluluk)
- Animasyonlu ilerleme çubukları
- Katılımcı sayısı & kalan gün gösterimi

### 🌍 Liderlik Tablosu (Dünyaya Meydan Oku)

- Haftalık / Aylık / Tüm Zamanlar filtreleme
- Top-3 kupa podyumu (altın 🥇, gümüş 🥈, bronz 🥉)
- "Senin Sıran" banner'ı & lidere uzaklık
- Seri 🔥, sıralama değişimi ↑↓ gösterimi

### ⚔️ Bire Bir Yarış

- Rakip seçimi (modal popup)
- 4 metrik yan yana karşılaştırması:
  - 📍 Toplam Mesafe
  - 🔥 Yakılan Kalori
  - 🏔️ Yükseklik Farkı
  - ⚡ Ortalama Hız
- Pace karşılaştırması & fark hesaplama
- Animasyonlu karşılaştırma çubukları

### 👤 Profil

- Kişisel istatistikler (6 kategori)
- Başarı rozetleri (6 rozet)
- Son koşuların detaylı listesi
- Ayarlar menüsü

---

## 🛠 Teknoloji Yığını

| Teknoloji                          | Versiyon | Kullanım            |
| ---------------------------------- | -------- | ------------------- |
| **React Native**                   | 0.83     | Mobile framework    |
| **Expo**                           | SDK 53   | Build & development |
| **React Navigation**               | 6.x      | Sayfa navigasyonu   |
| **Bottom Tabs Navigator**          | 6.x      | Tab bar             |
| **expo-linear-gradient**           | Latest   | Gradient efektler   |
| **react-native-safe-area-context** | Latest   | Güvenli alan        |
| **react-native-screens**           | Latest   | Screen optimization |
| **Animated API**                   | Built-in | Animasyonlar        |

---

## 🚀 Kurulum & Çalıştırma

### Gereksinimler

- Node.js >= 18
- npm veya yarn
- Expo Go uygulaması (iOS/Android) **veya** Android Emulator / iOS Simulator

### Adımlar

```bash
# 1. Repoyu klonla
git clone https://github.com/kullaniciadi/RunRival.git
cd RunRival

# 2. Bağımlılıkları yükle
npm install

# 3. Uygulamayı başlat
npm start
# veya
npx expo start

# 4a. Telefonda çalıştır
# Expo Go ile QR kodu tara

# 4b. Emülatörde çalıştır
npm run android   # Android emülatör
npm run ios       # iOS simülatör (macOS)
```

---

## 📁 Proje Yapısı

```
RunRival/
├── App.js                        # Uygulama giriş noktası
├── app.json                      # Expo konfigürasyonu
├── package.json
└── src/
    ├── navigation/
    │   └── AppNavigator.js       # Bottom tab navigator
    ├── screens/
    │   ├── HomeScreen.js         # Dashboard
    │   ├── ChallengesScreen.js   # Meydan Okumalar
    │   ├── LeaderboardScreen.js  # Liderlik Tablosu
    │   ├── HeadToHeadScreen.js   # Bire Bir Yarış
    │   └── ProfileScreen.js     # Profil
    ├── components/
    │   ├── StatCard.js           # İstatistik kartı
    │   ├── ChallengeCard.js      # Meydan okuma kartı
    │   ├── ComparisonBar.js      # Karşılaştırma çubuğu
    │   └── LeaderboardItem.js    # Liderlik listesi satırı
    ├── data/
    │   └── mockData.js           # Mock veri (kullanıcı, challenge, leaderboard)
    └── theme/
        └── index.js              # Renkler, fontlar, spacing
```

---

## 🎨 Tasarım Kararları

Bu uygulama **atletik & enerjik** bir tasarım dili benimsemiştir:

- **Renk Paleti:** Koyu lacivert arka plan (#0D0D1A) + turuncu (#FF6B35) & kırmızı-pembe (#E94560) aksanlar
- **Tipografi:** Kalın fontlar (fontWeight: 900) ve büyük sayılar ile istatistiklerin ön plana çıkarılması
- **Animasyonlar:** Sayfa geçişlerinde fade-in, progress barlar için animasyonlu genişleme, VS ekranında spring animasyonu
- **Dark Mode:** Koşu uygulamalarında yaygın olan dark theme tercih edildi — göz yorgunluğunu azaltır

---

## 👤 Hedef Kullanıcı Kitlesi

- Koşu hobisi olan veya koşuya yeni başlayan bireyler (18–40 yaş)
- Rekabetçi ortamda motive olmak isteyen koşucular
- Fitness hedeflerini sosyal motivasyonla desteklemek isteyenler

## 💡 Çözülen Problem

Birçok koşu uygulaması istatistik kaydeder ama **sosyal rekabet** eksik kalır. RunRival, koşuyu bir **yarışmaya** dönüştürerek motivasyonu artırır.

---

## 📝 Notlar

- Tüm veriler mock datadır — gerçek GPS veya backend entegrasyonu yapılmamıştır
- Uygulama tamamen offline çalışır
- Challenge katılma/ayrılma state yönetimi için React state kullanılmıştır

---

_RunRival — Koş, Rekabet Et, Kazan! 🏆_

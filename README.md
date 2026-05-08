# Tim ATwoh - Portofolio Web Scraping & Visualisasi Data

## Gambaran Umum
Proyek ini adalah website portofolio tim kami, **Tim ATwoh**, mahasiswa Jurusan Teknik Komputer dan Informatika di Politeknik Negeri Bandung (POLBAN). Website ini dibuat sebagai hasil dari praktikum **Proyek I Pengembangan Perangkat Lunak Desktop**, yang berfungsi untuk memamerkan hasil kerja kami dalam melakukan *data scraping* dari berbagai sumber *online* dan memvisualisasikan data tersebut secara interaktif menggunakan grafik.

## Anggota Tim ATwoh
Website ini dan keseluruhan proyek *scraping* di dalamnya merupakan hasil kolaborasi dari:
1. **Nadia Rachma Yuninda** (Leader)
2. **Umar Faruq Robbany** (Project Manager)
3. **Fredy Kurniadi**
4. **Micho Dhani Firmansyah**
5. **Zahra Hilyatul Jannah**

## Fitur Utama Portofolio

Website ini dirancang untuk menyajikan data hasil *scraping* secara interaktif kepada pengguna, yang terbagi ke dalam dua proyek utama:

### 1. Data Scraping & Visualisasi Skincare (Tokopedia)
*   **Target:** Mengekstrak data produk *skincare* dari Tokopedia untuk kategori "Face Wash Acne", "Face Wash Brightening", dan "Face Wash Anti Aging".
*   **Teknologi Scraping:** Python dan Selenium (berada di folder `scrape_skincare_tokopedia/`).
*   **Data yang Diekstrak:** Judul Produk, Harga, Rating, dan Jumlah Terjual.
*   **Visualisasi Data (`pages/skincare.html` & `charts/`):** Menggunakan JavaScript dan Chart.js untuk menampilkan grafik interaktif, seperti:
    *   **Rata-rata Harga Merek (Average Brand Price):** Grafik bar yang membandingkan rata-rata harga dari berbagai merek *skincare*.
    *   **Perbandingan Produk Terjual:** Memvisualisasikan kategori produk atau merek mana yang memiliki volume penjualan tertinggi.
    *   **Merek Populer (Popular Brands):** Menyoroti merek yang paling sering muncul di daftar pencarian atau memiliki penjualan tertinggi.
    *   **Harga vs. Produk Terjual:** Menganalisis korelasi antara penetapan harga produk dan performa penjualan melalui *scatter plot*.
    *   **Rating vs. Produk Terjual:** Mengamati bagaimana rating produk berdampak pada kuantitas penjualan melalui *scatter plot*.

### 2. Data Scraping Manga (MyAnimeList)
*   **Target:** Merayapi (*crawl*) dan mengambil data komprehensif dari daftar manga teratas di MyAnimeList.
*   **Teknologi Scraping:** Python dan Scrapy (berada di folder `scrape_manga_myanimelist/`).
*   **Data yang Diekstrak:** Peringkat, Judul, URL, Gambar Sampul, Rating, Skor Popularitas, Tipe, Volume, Bab (Chapters), Status, Genre, Tema, Demografi, Tanggal Rilis, Penulis, dan Sinopsis.
*   **Presentasi Data (`pages/manga.html`):** Menampilkan seluruh informasi manga secara detail di dalam website dalam format yang rapi dan mudah diakses, layaknya katalog digital.

## Struktur Proyek

- `assets/` - File statis (CSS, JS, foto profil tim, logo) untuk desain tata letak website portofolio.
- `charts/` - File JavaScript menggunakan Chart.js untuk merender grafik visualisasi data *skincare*.
- `data/` - Kumpulan dataset hasil *scraping* (JSON) yang digunakan untuk ditampilkan di website.
- `pages/` - Halaman HTML tambahan untuk profil tim (`about.html`), halaman manga (`manga.html`), halaman visualisasi *skincare* (`skincare.html`), dan kontak (`contact.html`).
- `scrape_manga_myanimelist/` - Direktori *spider* Scrapy untuk *scraping* manga.
- `scrape_skincare_tokopedia/` - Skrip automasi Python Selenium untuk Tokopedia.
- `index.html` - Halaman utama (*landing page*) dari portofolio Tim ATwoh.

## Setup dan Cara Penggunaan

1. **Clone repository ini:**
   ```bash
   git clone <repository-url>
   ```

2. **Menjalankan Web Scraper (Opsional, jika ingin memperbarui data JSON):**
   - **Skincare Tokopedia:**
     Masuk ke folder `scrape_skincare_tokopedia`, pastikan telah menginstal `selenium`, lalu jalankan `python main.py` (membutuhkan browser Google Chrome).
   - **Manga MyAnimeList:**
     Masuk ke folder `scrape_manga_myanimelist`, pastikan telah menginstal `scrapy`, lalu jalankan perintah `scrapy crawl manga -o ../data/manga.json`.

3. **Menjalankan Website Portofolio:**
   Karena ini adalah website *frontend* statis, Anda dapat langsung membuka file `index.html` di web browser Anda. Untuk hasil visualisasi grafik dan pemuatan file JSON yang maksimal (terhindar dari masalah *CORS policy* pada browser), disarankan menggunakan *local development server* seperti *extension* **Live Server** di VS Code atau menggunakan *command* Python:
   ```bash
   python -m http.server 8000
   ```
   Lalu buka `http://localhost:8000` di browser.
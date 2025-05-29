
# 🛍️ eBay Product Scraper

Sebuah scraper berbasis Node.js untuk mengambil data produk dari eBay berdasarkan kata kunci pencarian. Scraper ini dapat mengekstrak:

- ✅ Nama produk
- ✅ Harga
- ✅ Link produk
- ✅ Deskripsi produk (opsional, diringkas dengan AI)
- ✅ eBay Item Number

Didukung oleh **Puppeteer** dan dapat terintegrasi dengan **OpenAI**, **DeepSeek**, dan **HuggingFace** untuk meringkas deskripsi secara otomatis.

---

## ebay URL

https://www.ebay.com/sch/i.html?_from=R40&_nkw=nike&_sacat=0&rt=nc&_pgn=1

## 🚀 Instalasi

1. Clone proyek:

```bash
git clone https://github.com/AbdulMalikMuzakir404/ebay-craping.git
cd ebay-craping
```

2. Install dependencies:

```bash
npm install
```

3. Buat file `.env` dan isi API key jika ingin menggunakan AI:

```env
OPENAI_API_KEY=your_openai_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

---

## 📦 Cara Penggunaan

```bash
node index.js [options]
```

### 🧾 Opsi CLI

| Opsi         | Alias | Default | Deskripsi                                                                 |
|--------------|-------|---------|---------------------------------------------------------------------------|
| `--q`        | `-q`  | `nike`  | Kata kunci pencarian di eBay                                              |
| `--ai`       |       | `null`  | Provider AI untuk ringkasan deskripsi: `openai`, `huggingface`, `deepseek` |
| `--limit`    | `-l`  | `0`     | Batas jumlah produk yang diambil (0 = ambil semua)                        |
| `--headless` |       | `true`  | Jalankan Puppeteer secara headless (`true` atau `false`)                  |
| `--slowmo`   |       | `0`     | Delay antar aksi browser (dalam milidetik)                                |

---

## ✅ Contoh Perintah

Scrape 5 produk dengan AI dari HuggingFace:

```bash
node index.js --q "air jordan" --ai huggingface --limit 5
```

Scrape semua produk tanpa AI (default):

```bash
node index.js -q "nike shoes"
```

Mode debug (tampilan browser terlihat):

```bash
node index.js --q "jordan 1" --headless false --slowmo 100
```

---

## 🧠 Ringkasan Deskripsi dengan AI (Opsional)

Jika kamu menggunakan `--ai`, maka deskripsi produk akan diringkas secara otomatis menggunakan:

- **OpenAI GPT** (`--ai openai`)
- **HuggingFace** (`--ai huggingface`)
- **DeepSeek** (`--ai deepseek`)

Pastikan kamu menyiapkan `.env` dengan API key yang sesuai.

---

## 📤 Output

Hasil scraping akan ditampilkan di console dalam format JSON seperti ini:

```json
[
  {
    "name": "Nike Air Jordan 1",
    "price": "$199.99",
    "link": "https://www.ebay.com/itm/1234567890",
    "description": "Ringkasan deskripsi...",
    "itemNumber": "127139017739"
  }
]
```

> Kamu dapat menambahkan fitur ekspor ke `.json` atau `.csv` jika diperlukan.

---

## 📁 Struktur Proyek

```
├── index.js        # Entry point CLI
├── scraper.js      # Logic scraping eBay
├── utils.js        # Fungsi untuk ringkasan AI
├── .env            # Tempat menyimpan API key 
└── README.md       # Dokumentasi proyek
```

---

## 👨‍💻 Author

**Abdul Malik Muzakir**  
[GitHub](https://github.com/AbdulMalikMuzakir404)

---

## 📄 Lisensi

Licensed under [ISC](https://opensource.org/licenses/ISC) © 2025.

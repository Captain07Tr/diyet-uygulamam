# Diyet Koçum — Web sitesi

Play Store için gizlilik politikası, kullanım şartları ve tanıtım sayfası.

## Dosyalar

| Dosya | Açıklama |
|--------|----------|
| `index.html` | Ana sayfa |
| `privacy.html` | Gizlilik politikası (**Play’e bu URL**) |
| `terms.html` | Kullanım şartları |
| `css/styles.css` | Ortak stil |

## GitHub Pages ile yayınlama

1. GitHub’da yeni repo oluştur (ör. `diyetweb` veya `diyet-kocum-site`)
2. Bu klasörün içeriğini yükle (push)
3. Repo → **Settings** → **Pages**
4. Source: **Deploy from a branch**
5. Branch: `main` (veya `master`), folder: `/ (root)` → Save
6. Birkaç dakika sonra site açılır:
   - `https://KULLANICI_ADIN.github.io/REPO_ADI/`
   - Gizlilik: `https://KULLANICI_ADIN.github.io/REPO_ADI/privacy.html`

### Hızlı komutlar (klasörde)

```bash
cd C:\Users\HP\Desktop\diyet\diyetweb
git init
git add .
git commit -m "Diyet Kocum web: gizlilik ve kullanim sartlari"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/REPO_ADI.git
git push -u origin main
```

## Play Console’a yazılacak linkler

Yayınlandıktan sonra (örnek):

- Gizlilik politikası: `https://….github.io/…/privacy.html`
- Kullanım şartları (isteğe bağlı): `https://….github.io/…/terms.html`

İletişim: `halilbuilds@gmail.com`

Yerel önizleme: `index.html` dosyasını tarayıcıda aç.

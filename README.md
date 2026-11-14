# Render MG Papercut — GitHub Actions

Repo percobaan: me-render komposisi Remotion `ContohMG` (contoh motion graphic
papercut 17 detik, 1280x720, 30 fps, 519 frame) memakai GitHub Actions gratis.

## Cara kerja

Workflow `.github/workflows/render.yml` membagi 519 frame menjadi 6 potongan
dan me-render tiap potongan di runner terpisah secara paralel (repo publik
mendapat runner 4 CPU + 16 GB, gratis tanpa batas menit). Job `stitch`
kemudian menggabungkan keenam potongan menjadi satu video.

## Cara menjalankan

Tab **Actions** → workflow **Render MG Contoh** → **Run workflow**.
Hasilnya ada di artifact bernama `contoh-mg-video`.

## Catatan

- Video hasil TIDAK bersuara. Potongan narasi digabungkan secara lokal,
  dan audio narasi memang tidak disimpan di repo ini.
- Repo ini tidak berisi secret, API key, atau kredensial apa pun.
- Scene `ContohMG` memakai primitif kit papercut-explainer (MIT) dengan
  layout landscape yang ditulis untuk video 16:9.

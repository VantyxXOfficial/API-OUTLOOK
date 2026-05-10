# API-OUTLOOK

API email sender untuk **non-Gmail** provider via SMTP langsung.
Digunakan bersama VXO Bot sebagai pengirim email banding WhatsApp.

## Provider yang didukung

| Provider | Domain | SMTP Server |
|----------|--------|-------------|
| Outlook/Hotmail | @outlook.com, @hotmail.com, @live.com | smtp-mail.outlook.com:587 |
| Yahoo | @yahoo.com, @yahoo.co.id | smtp.mail.yahoo.com:587 |
| Zoho | @zoho.com | smtp.zoho.com:587 |
| Yandex | @yandex.com, @yandex.ru | smtp.yandex.com:587 |
| iCloud | @icloud.com, @me.com | smtp.mail.me.com:587 |
| GMX | @gmx.com, @gmx.net | smtp.gmx.com:587 |
| Mail.com | @mail.com | smtp.mail.com:587 |
| Generic | domain lain | smtp.{domain}:587 |

> Otomatis fallback ke port 465 (SSL) jika port 587 diblokir.

## Endpoint

```
GET /api/send?target=NOMORWA&email=EMAIL&pass=PASSWORD&subject=SUBJEK&message=ISI
```

### Parameter

| Parameter | Wajib | Keterangan |
|-----------|-------|------------|
| `target`  | ✅ | Nomor WhatsApp target (untuk logging) |
| `email`   | ✅ | Email pengirim (Outlook/Yahoo/dll) |
| `pass`    | ✅ | Password atau App Password |
| `message` | ✅ | Isi email banding |
| `subject` | ❌ | Subject email (default: "Banding Akun") |

### Contoh Request

```
GET /api/send?target=628123456789&email=akun@outlook.com&pass=AppPassword123&subject=Banding%20Akun&message=Halo%20saya%20ingin%20melaporkan...
```

### Response Sukses

```json
{
  "status": "success",
  "data": {
    "target": "628123456789",
    "sender": "akun@outlook.com",
    "provider": "outlook.com",
    "server": "smtp-mail.outlook.com",
    "method": "API OUTLOOK"
  },
  "msg": "APPEAL SENT SUCCESSFULLY"
}
```

### Response Gagal

```json
{
  "status": "error",
  "provider": "outlook.com",
  "error": "Invalid login: 535 5.7.3 Authentication unsuccessful"
}
```

## Deploy ke Vercel

```bash
npm i -g vercel
vercel --prod
```

## Tips App Password

- **Outlook/Hotmail**: settings.live.com → More options → App passwords
- **Yahoo**: accountsecurity.yahoo.com → Generate app password
- **Zoho**: accounts.zoho.com → Security → App Passwords
- **Yandex**: id.yandex.com → Security → App Passwords (+ aktifkan IMAP)
- **iCloud**: appleid.apple.com → Sign-In & Security → App-Specific Passwords

## Perbedaan dengan API-VERCAL

| | API-VERCAL | API-OUTLOOK |
|-|-----------|------------|
| Provider | Gmail saja | Outlook, Yahoo, Zoho, Yandex, iCloud, dll |
| SMTP | service: gmail | SMTP langsung per provider |
| Port fallback | Tidak | ✅ Auto fallback 587→465 |

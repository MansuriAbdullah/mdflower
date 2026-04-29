import urllib.request

urls = [
    ("https://upload.wikimedia.org/wikipedia/commons/c/cd/Tanishq_Logo.svg", "public/client_trust_1.svg"),
    ("https://upload.wikimedia.org/wikipedia/commons/1/1d/Adani_logo.svg", "public/client_trust_2.svg"),
    ("https://upload.wikimedia.org/wikipedia/commons/4/41/Reliance_Industries_Logo.svg", "public/client_trust_3.svg"),
    ("https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg", "public/client_trust_4.svg"),
    ("https://upload.wikimedia.org/wikipedia/en/0/07/Raffles_Hotels_and_Resorts_logo.svg", "public/client_trust_5.svg")
]

for url, path in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
            out_file.write(response.read())
        print(f"Downloaded {path}")
    except Exception as e:
        print(f"Failed to download {path}: {e}")

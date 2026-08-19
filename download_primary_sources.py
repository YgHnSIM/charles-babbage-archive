import os
import urllib.request
import time
import hashlib

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

DOCS_TO_DOWNLOAD = [
    {
        "category": "sources/economy",
        "filename": "1832_Babbage_Economy_of_Machinery_and_Manufactures.pdf",
        "url": "https://archive.org/download/oneconomyofmac00babb/oneconomyofmac00babb.pdf",
        "alt_url": "https://archive.org/download/oneconomyofmachi00babb/oneconomyofmachi00babb.pdf"
    },
    {
        "category": "sources/philosophy",
        "filename": "1864_Babbage_Passages_from_the_Life_of_a_Philosopher.pdf",
        "url": "https://archive.org/download/bub_gb_8rtdVgQNCuwC/bub_gb_8rtdVgQNCuwC.pdf",
        "alt_url": "https://archive.org/download/bub_gb_2T0AAAAAQAAJ/bub_gb_2T0AAAAAQAAJ.pdf"
    },
    {
        "category": "sources/philosophy",
        "filename": "1838_Babbage_The_Ninth_Bridgewater_Treatise.pdf",
        "url": "https://archive.org/download/bub_gb_2nRgNWqyMjoC/bub_gb_2nRgNWqyMjoC.pdf",
        "alt_url": "https://archive.org/download/in.ernet.dli.2015.49255/2015.49255.The-Ninth-Bridgewater-Treatise-Ed-2.pdf"
    },
    {
        "category": "sources/analytical_engine",
        "filename": "1843_Scientific_Memoirs_Vol_3_Lovelace_Menabrea.pdf",
        "url": "https://archive.org/download/india.history.resource.53369/53369.pdf",
        "alt_url": "https://archive.org/download/TO01056056/TO01056056.pdf"
    },
    {
        "category": "sources/diff_engine",
        "filename": "1822_Babbage_Letter_to_Sir_Humphry_Davy_Difference_Engine.pdf",
        "url": "https://archive.org/download/TO0E039268_TO0324_PNI-1546_000000/TO0E039268_TO0324_PNI-1546_000000.pdf",
        "alt_url": "https://archive.org/download/bub_gb_2T0AAAAAQAAJ/bub_gb_2T0AAAAAQAAJ.pdf"
    },
    {
        "category": "sources/math",
        "filename": "1816_Lacroix_Differential_Calculus_Babbage_Herschel.pdf",
        "url": "https://archive.org/download/anelementarytre00babbgoog/anelementarytre00babbgoog.pdf",
        "alt_url": "https://archive.org/download/anelementarytre00lacrgoog/anelementarytre00lacrgoog.pdf"
    }
]

def download_item(item):
    cat = item["category"]
    fname = item["filename"]
    out_path = os.path.join(cat, fname)
    os.makedirs(cat, exist_ok=True)
    
    if os.path.exists(out_path) and os.path.getsize(out_path) > 100000:
        print(f"[ALREADY EXISTS] {out_path} ({os.path.getsize(out_path)/(1024*1024):.2f} MB)")
        return True

    for url in [item["url"], item.get("alt_url")]:
        if not url:
            continue
        print(f"Downloading {fname} from {url}...", flush=True)
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=90) as resp:
                with open(out_path, 'wb') as f:
                    while True:
                        buf = resp.read(1024*256)
                        if not buf:
                            break
                        f.write(buf)
            size_mb = os.path.getsize(out_path) / (1024*1024)
            print(f"[SUCCESS] Saved {out_path} ({size_mb:.2f} MB)")
            return True
        except Exception as e:
            print(f"[FAILED] {url}: {e}")
            if os.path.exists(out_path):
                os.remove(out_path)
    return False

if __name__ == '__main__':
    for doc in DOCS_TO_DOWNLOAD:
        download_item(doc)

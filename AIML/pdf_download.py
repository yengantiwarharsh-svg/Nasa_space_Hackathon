import requests
from bs4 import BeautifulSoup
import pandas as pd
import os
from tqdm import tqdm

CSV_FILE = "SB_publication_PMC.csv"
SAVE_DIR = "papers_text"
os.makedirs(SAVE_DIR, exist_ok=True)

# Read CSV and detect the correct columns
df = pd.read_csv(CSV_FILE)

if "Link" in df.columns:
    urls = df["Link"].dropna().tolist()
elif "link" in df.columns:
    urls = df["link"].dropna().tolist()
elif "URL" in df.columns:
    urls = df["URL"].dropna().tolist()
else:
    raise ValueError("CSV must contain a column named 'Link', 'link', or 'URL'")

headers = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/127.0.0.1 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

for i, url in enumerate(tqdm(urls, desc="Scraping NASA PMC Articles")):
    try:
        if not url.endswith("/"):
            url += "/"

        r = requests.get(url, headers=headers, timeout=15)
        r.raise_for_status()

        soup = BeautifulSoup(r.text, "html.parser")

        # Extract title
        title_tag = soup.find("h1")
        title = title_tag.get_text(strip=True) if title_tag else f"Paper_{i+1}"

        # Extract article paragraphs
        paragraphs = [
            p.get_text(" ", strip=True)
            for p in soup.find_all("p")
            if "official website" not in p.get_text().lower()
        ]

        if not paragraphs:
            print(f"⚠️ No main text found for {url}")
            continue

        full_text = "\n\n".join(paragraphs)

        safe_title = "".join(c if c.isalnum() or c in " _-" else "_" for c in title)[:80]
        file_path = os.path.join(SAVE_DIR, f"{safe_title}.txt")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(f"Title: {title}\nURL: {url}\n\n{full_text}")

    except Exception as e:
        print(f"❌ Error scraping {url}: {e}")

import os
import pandas as pd
import subprocess
import ollama


TEXT_DIR = "papers_text"          
OUTPUT_FILE = "summarized_papers.csv"
MODEL_NAME = "mistral"           





if not os.path.exists(TEXT_DIR):
    os.makedirs(TEXT_DIR)
    print(f"📁 Created empty folder: {TEXT_DIR}")
    print("⚠️ Please put your extracted paper text files here first!")
    exit()



try:
    subprocess.run(["ollama", "list"], check=True, capture_output=True)
except Exception:
    print("❌ Ollama not found or not running. Please:")
    print("👉 1. Install Ollama from https://ollama.ai")
    print("👉 2. Start it by running: `ollama serve` in another terminal.")
    exit()



print(f"🔍 Checking if model '{MODEL_NAME}' is available...")
models = subprocess.run(["ollama", "list"], capture_output=True, text=True).stdout
if MODEL_NAME not in models:
    print(f"⬇️ Model '{MODEL_NAME}' not found. Downloading it...")
    subprocess.run(["ollama", "pull", MODEL_NAME], check=True)
else:
    print(f"✅ Model '{MODEL_NAME}' is ready to use.")



def summarize_text_ollama(text):
    """Summarize text using a local Ollama model."""
    prompt = f"Summarize the following scientific article in 5-7 concise sentences:\n\n{text}"
    try:
        response = ollama.chat(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}]
        )
        return response["message"]["content"]
    except Exception as e:
        print("⚠️ Skipping due to Ollama error:", e)
        return "Error during summarization"



def extract_keywords(text, top_n=10):
    from collections import Counter
    import re
    words = re.findall(r'\b[a-zA-Z]{5,}\b', text.lower())
    common = [w for w, _ in Counter(words).most_common(top_n)]
    return ", ".join(common)



rows = []
text_files = [f for f in os.listdir(TEXT_DIR) if f.endswith(".txt")]

if not text_files:
    print("⚠️ No .txt files found in papers_text folder!")
    exit()

for file_name in text_files:
    file_path = os.path.join(TEXT_DIR, file_name)
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    title = content.split("\n", 1)[0].replace("Title:", "").strip() or file_name
    print(f"🧠 Summarizing: {title[:70]}...")

    summary = summarize_text_ollama(content)
    keywords = extract_keywords(content)

    rows.append({
        "Title": title,
        "Summary": summary,
        "Keywords": keywords
    })



df = pd.DataFrame(rows)
df.to_csv(OUTPUT_FILE, index=False, encoding="utf-8")
print(f"\n✅ Summaries saved to {OUTPUT_FILE}")

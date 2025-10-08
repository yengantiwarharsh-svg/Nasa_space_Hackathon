import os
import traceback
import ollama
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

TEXT_DIR = "papers_text"
MODEL_NAME = "mistral"  


papers = []
if os.path.exists(TEXT_DIR):
    for fname in os.listdir(TEXT_DIR):
        if fname.endswith(".txt"):
            path = os.path.join(TEXT_DIR, fname)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            papers.append({"title": fname, "text": content})
else:
    os.makedirs(TEXT_DIR)

print(f"✅ Loaded {len(papers)} papers from '{TEXT_DIR}'")

@app.route("/ask", methods=["POST"])
def ask():
    try:
        data = request.get_json(force=True)
        question = data.get("question", "").strip()

        if not question:
            return jsonify({"error": "Please provide a question"}), 400

        
        best_paper = max(
            papers,
            key=lambda p: sum(word in p["text"].lower() for word in question.lower().split()),
            default=None
        )

        if not best_paper:
            return jsonify({"error": "No papers available to search."}), 404

        context = best_paper["text"][:100000000] 
        prompt = f"Context:\n{context}\n\nQuestion: {question}\n\nAnswer clearly and factually:"

        print(f"🧠 Question: {question}")
        response = ollama.chat(model=MODEL_NAME, messages=[{"role": "user", "content": prompt}])
        answer = response["message"]["content"]

        return jsonify({
            "title": best_paper["title"],
            "answer": answer
        })

    except Exception as e:
        print("❌ ERROR:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)

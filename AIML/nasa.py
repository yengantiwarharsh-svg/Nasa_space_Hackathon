import ollama
import chromadb


client = chromadb.Client()
collection = client.get_collection("nasa_papers")

def ask_nasa(question):
   
    q_emb = ollama.embeddings(model="mistral", prompt=question)["embedding"]

    # Find top 3 most similar papers
    results = collection.query(query_embeddings=[q_emb], n_results=3)

    # Combine the best summaries as context
    context = "\n\n".join(results["documents"][0])

    prompt = f"""
You are a NASA bioscience research assistant.
Use ONLY the context below to answer the user's question clearly and concisely.

Context:
{context}

Question: {question}

Answer:
"""

    answer = ollama.chat(model="mistral", messages=[{"role": "user", "content": prompt}])
    return answer["message"]["content"]

# Interactive mode
if __name__ == "__main__":
    print("🚀 NASA AI Assistant Ready!")
    while True:
        q = input("\n❓ Ask a question (or type 'exit'): ")
        if q.lower() in ["exit", "quit"]:
            break
        print("\n🧠 Answer:", ask_nasa(q))

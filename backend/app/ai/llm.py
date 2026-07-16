from dotenv import load_dotenv
import os
from langchain_groq import ChatGroq

load_dotenv()

print("API Key Loaded:", os.getenv("GROQ_API_KEY")[:10] + "...")

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.2,
)
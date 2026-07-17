from .llm import llm


# -----------------------------------------
# Tool 1 : Log Interaction
# -----------------------------------------
def log_interaction(notes: str):
    try:
        print("========== PROMPT ==========")
        print(notes)

        prompt = f"""
Summarize this doctor's interaction.

Interaction:
{notes}

Return:
- Summary
- Key Points
- Follow Up
"""

        print("Before invoke")

        response = llm.invoke(prompt)

        print("After invoke")
        print("Type:", type(response))
        print("Content:", response.content)

        return response.content

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise


# -----------------------------------------
# Tool 2 : Edit Interaction
# -----------------------------------------
def edit_interaction(old_text: str, instruction: str):

    prompt = f"""
Existing Interaction:
{old_text}

Edit Instruction:
{instruction}

Return updated interaction.
"""

    response = llm.invoke(prompt)

    return response.content


# -----------------------------------------
# Tool 3 : Search Interaction
# -----------------------------------------
def search_interaction(query: str):
    return f"Searching interactions for: {query}"


# -----------------------------------------
# Tool 4 : Follow-up Recommendation
# -----------------------------------------
def followup_recommendation(summary: str):

    prompt = f"""
Based on this interaction suggest next follow-up.

{summary}
"""

    response = llm.invoke(prompt)

    return response.content


# -----------------------------------------
# Tool 5 : Interaction Insights
# -----------------------------------------
def interaction_insights(data: str):

    prompt = f"""
Analyze the following interaction and provide insights.

{data}
"""

    response = llm.invoke(prompt)

    return response.content


# -----------------------------------------
# Tool 6 : AI Chat with Database
# -----------------------------------------
def chat_with_ai(question: str, interactions):

    context = ""

    for item in interactions:
        context += f"""
Doctor: {item.doctor_name}
Hospital: {item.hospital}
Specialty: {item.specialty}
Interaction Type: {item.interaction_type}
Interaction Date: {item.interaction_date}

Notes:
{item.notes}

Summary:
{item.summary}

----------------------------------------
"""

    prompt = f"""
You are an AI CRM Assistant.

Below is the CRM interaction history.

{context}

User Question:
{question}

Instructions:
- Answer ONLY using the CRM interaction history.
- If the information is unavailable, reply:
"I couldn't find that information in the CRM."

Provide a professional answer.
"""

    response = llm.invoke(prompt)

    return response.content
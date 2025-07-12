from difflib import SequenceMatcher

def compute_plagiarism_score(text, known_texts, threshold=0.8):
    """
    Compare the given text against known texts to compute a plagiarism score.
    
    :param text: The input text to check.
    :param known_texts: A list of known texts to compare against.
    :param threshold: Similarity threshold (default 0.8, i.e., 80%).
    :return: The highest similarity score found.
    """
    text = text.lower().strip()
    max_similarity = 0.0

    for known in known_texts:
        known = known.lower().strip()
        similarity = SequenceMatcher(None, text, known).ratio()
        max_similarity = max(max_similarity, similarity)

    return round(max_similarity * 100, 2)  # Convert to percentage

# Example usage
if __name__ == "__main__":
    resume_text = "This is an example resume with some unique content."
    known_resumes = [
        "This is a sample resume with some different content.",
        "This is an example resume with some unique content.",
        "Completely unrelated text."
    ]

    plagiarism_score = compute_plagiarism_score(resume_text, known_resumes)
    print(f"Plagiarism Score: {plagiarism_score}%")

    if plagiarism_score > 80:
        print("Potential plagiarism detected!")
    else:
        print("No significant plagiarism detected.")

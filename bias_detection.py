import re

BIAS_WORDS = ["he", "she", "male", "female", "old", "young", "black", "white", "Asian", "Hispanic"]

def check_bias(text):
    """Check for biased words in resume text."""
    found_words = [word for word in BIAS_WORDS if re.search(rf"\b{word}\b", text, re.IGNORECASE)]
    return found_words if found_words else None

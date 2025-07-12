import language_tool_python

def check_grammar(text):
    """Checks grammar errors in the given text using LanguageTool."""
    tool = language_tool_python.LanguageTool('en-US')
    matches = tool.check(text)
    
    errors = []
    for match in matches:
        errors.append({
            'error': match.message,
            'suggestions': match.replacements,
            'offset': match.offset,
            'length': match.errorLength,
            'context': text[max(0, match.offset-10):match.offset+match.errorLength+10]
        })
    
    return errors

def compute_grammar_score(text):
    """Computes a grammar score based on detected errors."""
    total_words = len(text.split())
    errors = check_grammar(text)
    num_errors = len(errors)
    
    if total_words == 0:
        return 0.0  # Avoid division by zero
    
    score = max(0, 100 - (num_errors / total_words) * 100)  # Scale score to 100
    return round(score, 2)

if __name__ == "__main__":
    sample_text = "This is a sample resume. It have many mistake. The experiense section is not good."
    grammar_errors = check_grammar(sample_text)
    
    if grammar_errors:
        print("Grammar Issues Found:")
        for error in grammar_errors:
            print(f"Error: {error['error']}")
            print(f"Suggestions: {', '.join(error['suggestions'])}")
            print(f"Context: {error['context']}")
            print("-" * 50)
    else:
        print("No grammar issues found.")
    
    score = compute_grammar_score(sample_text)
    print(f"Grammar Score: {score}")

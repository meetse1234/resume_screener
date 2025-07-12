import os
import PyPDF2
import docx
import joblib
from resume_parser import extract_resume_text
from ranking import rank_candidates
from fake_resume_detector import detect_fake_resumes
from bias_detection import check_bias

# Load ML models
ranking_model = joblib.load("models/ranking_model.pkl")
fake_resume_model = joblib.load("models/fake_resume_model.pkl")
nlp_vectorizer = joblib.load("models/nlp_vectorizer.pkl")

def process_and_rank_resumes(filepaths):
    processed_resumes = []

    for filepath in filepaths:
        # Extract text from resume
        resume_text = extract_resume_text(filepath)

        # Perform ranking using ML model
        score = rank_candidates(resume_text, ranking_model, nlp_vectorizer)

        # Fake resume detection
        is_fake = detect_fake_resumes(resume_text, fake_resume_model)

        # Bias detection (optional)
        bias_flags = check_bias(resume_text)

        processed_resumes.append({
            "filename": os.path.basename(filepath),
            "score": score,
            "fake_resume": is_fake,
            "bias_flags": bias_flags,
        })

    # Sort resumes based on ranking score
    processed_resumes.sort(key=lambda x: x["score"], reverse=True)
    
    return processed_resumes

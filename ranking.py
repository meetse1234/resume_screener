import joblib
import numpy as np
from grammar_checker import compute_grammar_score
from plagiarism_checker import compute_plagiarism_score
from fake_resume_detector import detect_fake_resume
from resume_parser import parse_resume
from hr_criteria import validate_hr_criteria

def rank_resume(pdf_path, vectorizer, ranking_model, required_skills, min_experience, min_10th, min_12th, min_cgpa, custom_criteria=None):
    resume_data = parse_resume(pdf_path)
    
    # Compute features
    grammar_score = compute_grammar_score(resume_data["text"])
    plagiarism_score = compute_plagiarism_score(resume_data["text"])
    fake_score = detect_fake_resume(resume_data["text"], vectorizer)
    
    # Match HR criteria (returns a match percentage)
    hr_match_score = validate_hr_criteria(resume_data, required_skills, min_experience, min_10th, min_12th, min_cgpa, custom_criteria)
    
    # Convert resume text to vectorized format
    text_vector = vectorizer.transform([resume_data["text"]]).toarray()
    
    # Combine features
    features = np.hstack((text_vector, [[grammar_score, plagiarism_score, fake_score, hr_match_score]]))
    
    # Predict ranking score
    score = ranking_model.predict(features)[0]
    
    return {
        "resume_data": resume_data,
        "ranking_score": score
    }

if __name__ == "__main__":
    vectorizer = joblib.load("models/nlp_vectorizer.pkl")
    ranking_model = joblib.load("models/ranking_model.pkl")
    
    # Define HR criteria
    required_skills = {"Python", "Data Analysis", "Machine Learning"}
    min_experience = 2  # Minimum years of experience
    min_10th = 70  # Minimum 10th grade percentage
    min_12th = 75  # Minimum 12th grade percentage
    min_cgpa = 8.0  # Minimum CGPA
    
    # Optionally define custom criteria
    custom_criteria = {"certifications": ["AWS Certified", "Data Science Expert"]}

    pdf_path = "sample_resume.pdf"
    result = rank_resume(pdf_path, vectorizer, ranking_model, required_skills, min_experience, min_10th, min_12th, min_cgpa, custom_criteria)
    print(result)

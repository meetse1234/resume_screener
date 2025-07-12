from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import spacy
import numpy as np
from transformers import DistilBertTokenizer, DistilBertModel
import torch
import re

class ResumeAnalyzer:
    def __init__(self):
        self.nlp = spacy.load('en_core_web_sm')
        self.tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
        self.model = DistilBertModel.from_pretrained('distilbert-base-uncased')
        
    def extract_skills(self, text):
        doc = self.nlp(text.lower())
        skills = []
        # Add your skill keywords dictionary here
        skill_patterns = ['python', 'java', 'javascript', 'ml', 'ai', 'data science']
        for token in doc:
            if token.text in skill_patterns:
                skills.append(token.text)
        return list(set(skills))

    def get_bert_embedding(self, text):
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512, padding=True)
        with torch.no_grad():
            outputs = self.model(**inputs)
        return outputs.last_hidden_state.mean(dim=1).numpy()

    def analyze_resume(self, resume_text, job_description):
        # Clean and preprocess texts
        resume_text = re.sub(r'\s+', ' ', resume_text.lower())
        job_description = re.sub(r'\s+', ' ', job_description.lower())
        
        # Get BERT embeddings
        resume_embedding = self.get_bert_embedding(resume_text)
        job_embedding = self.get_bert_embedding(job_description)
        
        # Calculate semantic similarity
        similarity = cosine_similarity(resume_embedding, job_embedding)[0][0]
        
        # Extract skills
        resume_skills = self.extract_skills(resume_text)
        required_skills = self.extract_skills(job_description)
        
        # Calculate skill match
        skill_match = len(set(resume_skills) & set(required_skills)) / len(set(required_skills)) if required_skills else 0
        
        # Combine scores
        final_score = 0.7 * similarity + 0.3 * skill_match
        
        return {
            'match_percentage': final_score * 100,
            'skills_found': resume_skills,
            'required_skills': required_skills,
            'skill_match_percentage': skill_match * 100
        }
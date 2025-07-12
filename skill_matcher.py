from sentence_transformers import SentenceTransformer
import numpy as np

class SkillMatcher:
    def __init__(self):
        self.model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
        
    def match_skills(self, resume_skills, job_description):
        # Encode skills and job description
        skill_embeddings = self.model.encode(resume_skills)
        job_embedding = self.model.encode(job_description)
        
        # Calculate similarity
        similarities = np.dot(skill_embeddings, job_embedding)
        
        # Return matched skills above threshold
        matched_skills = [
            skill for skill, score in zip(resume_skills, similarities)
            if score > 0.5
        ]
        
        return matched_skills
from sentence_transformers import SentenceTransformer
import numpy as np

class TextSimilarity:
    def __init__(self):
        self.model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
    
    def calculate_similarity(self, resume_text, job_description):
        # Encode texts
        resume_embedding = self.model.encode(resume_text)
        job_embedding = self.model.encode(job_description)
        
        # Calculate cosine similarity
        similarity = np.dot(resume_embedding, job_embedding) / (
            np.linalg.norm(resume_embedding) * np.linalg.norm(job_embedding)
        )
        
        # Convert to percentage
        return float(similarity * 100)
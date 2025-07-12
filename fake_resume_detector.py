import pickle
import numpy as np

def detect_fake_resume(resume_features):
    """Identify fake resumes using Isolation Forest."""
    model_path = "models/fake_resume_model.pkl"
    
    # Load trained model
    with open(model_path, "rb") as model_file:
        model = pickle.load(model_file)

    # Predict whether the resume is fake (-1 = fake, 1 = real)
    predictions = model.predict(resume_features)
    
    return predictions

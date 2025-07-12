import os
import pandas as pd
import numpy as np
import joblib
import spacy
import textstat
from tqdm import tqdm
from sklearn.ensemble import IsolationForest
from sklearn.feature_extraction.text import TfidfVectorizer

# Define dataset path
csv_path = r"D:\resume-screener\training_scripts\UpdatedResumeDataSet.csv"

# Check if file exists
if not os.path.exists(csv_path):
    raise FileNotFoundError(f"Dataset not found: {csv_path}. Please check the file path.")
else:
    print("✅ File found! Loading dataset...")

# Load dataset
df = pd.read_csv(csv_path)

# Verify the dataset columns
expected_columns = {"Resume", "Category"}
if not expected_columns.issubset(df.columns):
    raise ValueError(f"Dataset is missing required columns. Found columns: {df.columns}")

# Extract required columns
df = df[["Resume"]].dropna()

# Load Spacy NLP Model
nlp = spacy.load("en_core_web_sm")

# Function to Compute Grammar Score
def compute_grammar_score(text):
    try:
        return textstat.grammar_check(text)  # Higher is better
    except Exception:
        return 0  # Default to 0 if text is invalid

# Function to Compute Plagiarism Score (Dummy)
def compute_plagiarism_score(text):
    return np.random.uniform(0, 1)  # Placeholder, replace with a plagiarism detection API

# Compute Features
print("✅ Computing grammar and plagiarism scores...")
df["grammar_score"] = df["Resume"].apply(compute_grammar_score)
df["plagiarism_score"] = df["Resume"].apply(compute_plagiarism_score)

# Extract Features - TF-IDF on Resume Text
print("✅ Extracting TF-IDF features...")
vectorizer = TfidfVectorizer(max_features=1000)
tfidf_features = vectorizer.fit_transform(df["Resume"]).toarray()

# Convert to DataFrame
feature_df = pd.DataFrame(tfidf_features, columns=[f"tfidf_{i}" for i in range(tfidf_features.shape[1])])
feature_df["grammar_score"] = df["grammar_score"]
feature_df["plagiarism_score"] = df["plagiarism_score"]

# Generate Fake Labels (For Demonstration)
df["is_fake"] = np.random.choice([0, 1], size=len(df), p=[0.85, 0.15])  # 15% fake resumes
df["label"] = df["is_fake"].apply(lambda x: -1 if x == 1 else 1)  # Fake: -1, Real: 1

# Train Isolation Forest Model
print("✅ Training Isolation Forest model...")
model = IsolationForest(n_estimators=200, contamination=0.15, random_state=42, verbose=1)
model.fit(feature_df)

# Create a directory for saving models
os.makedirs("models", exist_ok=True)

# Save Model & Vectorizer
joblib.dump(model, "models/fake_resume_model.pkl")
joblib.dump(vectorizer, "models/nlp_vectorizer.pkl")

print("🎉 Large-Scale Fake Resume Model Trained and Saved Successfully!")

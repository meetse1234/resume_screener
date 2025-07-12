import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# Define the path to the dataset
dataset_path = os.path.join(os.path.dirname(__file__), 'resume_data.csv')

# Load the dataset
try:
    data = pd.read_csv(dataset_path)
except FileNotFoundError:
    raise FileNotFoundError(f"Dataset not found at {dataset_path}")

# Ensure all required columns are present
required_columns = ['skills', 'experience', 'education_10', 'education_12', 'cgpa', 'job_relevance_score']
missing_columns = [col for col in required_columns if col not in data.columns]
if missing_columns:
    raise ValueError(f"Missing required columns: {missing_columns}")

# Handle missing values
if data.isnull().sum().any():
    raise ValueError("Dataset contains missing values. Please handle them before proceeding.")

# Convert 'skills' column to string type
data['skills'] = data['skills'].astype(str)

# Initialize the TF-IDF Vectorizer
vectorizer = TfidfVectorizer()

# Vectorize the 'skills' column
skills_tfidf = vectorizer.fit_transform(data['skills'])

# Convert TF-IDF matrix to DataFrame
skills_df = pd.DataFrame(skills_tfidf.toarray(), columns=vectorizer.get_feature_names_out())

# Reset index to ensure alignment
data.reset_index(drop=True, inplace=True)
skills_df.reset_index(drop=True, inplace=True)

# Concatenate TF-IDF features with other numeric features
features = pd.concat([skills_df, data[['experience', 'education_10', 'education_12', 'cgpa']]], axis=1)

# Target variable
target = data['job_relevance_score']

# Split the data into training and testing sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

# Initialize the RandomForestRegressor
model = RandomForestRegressor(n_estimators=100, random_state=42)

# Train the model
model.fit(X_train, y_train)

# Make predictions on the test set
predictions = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print(f"Mean Squared Error: {mse}")
print(f"R^2 Score: {r2}")

# Define the path to save the model and vectorizer
model_dir = os.path.join(os.path.dirname(__file__), 'models')
model_path = os.path.join(model_dir, 'ranking_model.pkl')
vectorizer_path = os.path.join(model_dir, 'nlp_vectorizer.pkl')

# Ensure the 'models' directory exists
os.makedirs(model_dir, exist_ok=True)

# Save the trained model and vectorizer
joblib.dump(model, model_path)
joblib.dump(vectorizer, vectorizer_path)

print(f"Model saved to {model_path}")
print(f"Vectorizer saved to {vectorizer_path}")

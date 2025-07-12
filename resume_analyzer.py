from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import PyPDF2
import docx
import re

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
    return text

def extract_text_from_docx(docx_path):
    doc = docx.Document(docx_path)
    text = ''
    for paragraph in doc.paragraphs:
        text += paragraph.text + '\n'
    return text

def analyze(resume_path, job_description):
    # Extract text from resume based on file type
    if resume_path.endswith('.pdf'):
        resume_text = extract_text_from_pdf(resume_path)
    elif resume_path.endswith('.docx'):
        resume_text = extract_text_from_docx(resume_path)
    else:
        return 0  # Unsupported file type

    # Preprocess texts
    resume_text = re.sub(r'\s+', ' ', resume_text.lower())
    job_description = re.sub(r'\s+', ' ', job_description.lower())

    # Vectorize the texts
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([resume_text, job_description])

    # Calculate similarity score
    similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    
    return similarity
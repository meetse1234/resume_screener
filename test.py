from hr_criteria import validate_hr_criteria

# Sample resume data
resume = {
    "skills": ["Python", "Machine Learning", "Data Science"],
    "experience": 3,
    "grade_10": 85,
    "grade_12": 90,
    "cgpa": 6.5
}

# HR Criteria
required_skills = {"Python", "Machine Learning"}
min_experience = 2
min_10th = 80
min_12th = 85
min_cgpa = 5

# Run the function
result = validate_hr_criteria(resume, required_skills, min_experience, min_10th, min_12th, min_cgpa)

# Output the result
print("Candidate meets HR criteria:", result)  # Expected output: True

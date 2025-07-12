def validate_hr_criteria(resume_data, required_skills, min_experience, min_10th, min_12th, min_cgpa, custom_criteria=None):
    """
    Check if a candidate meets HR criteria.
    
    Parameters:
    - resume_data: Dictionary with candidate details (skills, experience, education).
    - required_skills: Set of skills required by HR.
    - min_experience: Minimum years of experience required.
    - min_10th: Minimum 10th grade percentage.
    - min_12th: Minimum 12th grade percentage.
    - min_cgpa: Minimum CGPA in graduation.
    - custom_criteria: (Optional) Dictionary with additional custom criteria to validate (e.g., specific qualifications, certifications).
    
    Returns:
    - Boolean: True if candidate meets all criteria, False otherwise.
    """

    # Extracting candidate data safely, using default values if not available
    skills = set(resume_data.get("skills", []))
    experience = resume_data.get("experience", 0)
    grade_10 = resume_data.get("grade_10", 0)
    grade_12 = resume_data.get("grade_12", 0)
    cgpa = resume_data.get("cgpa", 0)

    # Checking all primary conditions
    meets_criteria = (
        skills.issuperset(required_skills) and
        experience >= min_experience and
        grade_10 >= min_10th and
        grade_12 >= min_12th and
        cgpa >= min_cgpa
    )

    # If custom criteria is provided, validate it
    if meets_criteria and custom_criteria:
        for key, required_value in custom_criteria.items():
            if key in resume_data:
                if isinstance(required_value, (list, set)):  # Handle multiple acceptable values
                    if resume_data[key] not in required_value:
                        return False
                else:  # Single value comparison
                    if resume_data[key] != required_value:
                        return False
            else:
                return False  # Missing custom field

    return meets_criteria

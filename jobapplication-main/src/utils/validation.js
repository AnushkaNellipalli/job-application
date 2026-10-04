export function validateForm(values) {
  const errors = {};
  if (!values.fullName.trim()) errors.fullName = "Full name is required.";
  else if (values.fullName.trim().length < 2)
    errors.fullName = "Please enter a valid name.";

  if (!values.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Enter a valid email address.";

  if (!values.phone.trim()) errors.phone = "Phone number is required.";
  else if (!/^[+]?[\d\s\-()]{7,16}$/.test(values.phone))
    errors.phone = "Enter a valid phone number.";

  if (!values.currentLocation.trim())
    errors.currentLocation = "Current location is required.";

  if (values.yearsExperience === "" || values.yearsExperience == null)
    errors.yearsExperience = "Years of experience is required.";
  else if (Number(values.yearsExperience) < 0)
    errors.yearsExperience = "Enter a valid number.";

  if (!values.expectedSalary.trim())
    errors.expectedSalary = "Expected salary is required.";

  if (values.linkedin && !/^https?:\/\/.+/i.test(values.linkedin))
    errors.linkedin = "Enter a valid URL.";

  if (values.github && !/^https?:\/\/.+/i.test(values.github))
    errors.github = "Enter a valid URL.";

  if (!values.resume) errors.resume = "Please upload your resume (PDF/DOC).";

  if (!values.coverLetter.trim())
    errors.coverLetter = "Cover letter is required.";
  else if (values.coverLetter.trim().length < 20)
    errors.coverLetter = "Cover letter should be at least 20 characters.";

  return errors;
}

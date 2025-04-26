document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.querySelector(".auth-form")
  
    if (authForm) {
      authForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Get form data
        const formData = new FormData(authForm)
        const formValues = {}
  
        for (const [key, value] of formData.entries()) {
          formValues[key] = value
        }
  
        // Simple validation
        let isValid = true
        const errorMessages = []
  
        if (formValues.email && !validateEmail(formValues.email)) {
          isValid = false
          errorMessages.push("Please enter a valid email address.")
        }
  
        if (formValues.password && formValues.password.length < 6) {
          isValid = false
          errorMessages.push("Password must be at least 6 characters long.")
        }
  
        // Display errors or submit form
        if (!isValid) {
          showErrors(errorMessages)
        } else {
          // Simulate form submission
          const submitButton = authForm.querySelector('button[type="submit"]')
          const originalText = submitButton.textContent
  
          submitButton.disabled = true
          submitButton.textContent = "Processing..."
  
          setTimeout(() => {
            // Redirect to home page after successful login/signup
            window.location.href = "index.html"
          }, 2000)
        }
      })
    }
  
    // Email validation function
    function validateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    }
  
    // Show error messages
    function showErrors(messages) {
      // Remove any existing error messages
      const existingErrors = document.querySelector(".auth-errors")
      if (existingErrors) {
        existingErrors.remove()
      }
  
      // Create error message container
      const errorContainer = document.createElement("div")
      errorContainer.className = "auth-errors"
      errorContainer.style.color = "#ff5555"
      errorContainer.style.marginTop = "15px"
      errorContainer.style.fontSize = "14px"
  
      // Add each error message
      messages.forEach((message) => {
        const errorElement = document.createElement("p")
        errorElement.textContent = message
        errorElement.style.marginBottom = "5px"
        errorContainer.appendChild(errorElement)
      })
  
      // Insert error container after the form
      const authForm = document.querySelector(".auth-form")
      authForm.after(errorContainer)
    }
  })
  
  
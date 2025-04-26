document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chat-messages")
    const userInput = document.getElementById("user-input")
    const sendBtn = document.getElementById("send-btn")
    const suggestionChips = document.querySelectorAll(".suggestion-chip")
  
    // Sample responses for demo
    const responses = {
      hello: "Hello! How can I help you with Python today?",
      hi: "Hi there! What Python topic would you like to learn about?",
      help: "I can help you with Python syntax, explain concepts, debug code, and provide examples. What do you need help with?",
      python:
        "Python is a high-level, interpreted programming language known for its readability and versatility. What would you like to know about Python?",
      function:
        'In Python, a function is defined using the "def" keyword, followed by the function name and parameters. For example: def greet(name): return f"Hello, {name}!"',
      list: 'Python lists are ordered, mutable collections that can store different types of objects. You can create a list using square brackets: my_list = [1, 2, 3, "hello"]',
      loop: 'Python has two main types of loops: "for" loops for iterating over sequences, and "while" loops for executing code while a condition is true.',
      variable: 'In Python, you can create variables by assigning values to names. For example: x = 10, name = "John"',
      default: "I'm not sure about that. Could you provide more details or ask a different question about Python?",
    }
  
    // Function to add a message to the chat
    function addMessage(content, isUser = false) {
      const messageDiv = document.createElement("div")
      messageDiv.className = isUser ? "message user-message" : "message bot-message"
  
      const messageContent = document.createElement("div")
      messageContent.className = "message-content"
  
      const messagePara = document.createElement("p")
      messagePara.textContent = content
  
      messageContent.appendChild(messagePara)
      messageDiv.appendChild(messageContent)
      chatMessages.appendChild(messageDiv)
  
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight
    }
  
    // Function to get bot response
    function getBotResponse(message) {
      message = message.toLowerCase()
  
      // Check for keywords in the message
      for (const keyword in responses) {
        if (message.includes(keyword)) {
          return responses[keyword]
        }
      }
  
      // If no keyword matches, return default response
      return responses.default
    }
  
    // Function to handle user message
    function handleUserMessage() {
      const message = userInput.value.trim()
  
      if (message) {
        // Add user message to chat
        addMessage(message, true)
  
        // Clear input
        userInput.value = ""
  
        // Simulate bot thinking
        setTimeout(() => {
          // Get and add bot response
          const botResponse = getBotResponse(message)
          addMessage(botResponse)
        }, 500)
      }
    }
  
    // Send button click event
    if (sendBtn) {
      sendBtn.addEventListener("click", handleUserMessage)
    }
  
    // Enter key press event
    if (userInput) {
      userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          handleUserMessage()
        }
      })
    }
  
    // Suggestion chips click event
    if (suggestionChips) {
      suggestionChips.forEach((chip) => {
        chip.addEventListener("click", function () {
          const message = this.textContent
          userInput.value = message
          handleUserMessage()
        })
      })
    }
  })
  
  
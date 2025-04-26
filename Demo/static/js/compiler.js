document.addEventListener("DOMContentLoaded", () => {
    // Initialize CodeMirror if it exists
    if (typeof CodeMirror !== "undefined") {
        const editor = CodeMirror(document.getElementById("editor"), {
            mode: "python",
            theme: "dracula",
            lineNumbers: true,
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: false,
            smartIndent: true,
            lineWrapping: true,
            gutters: ["CodeMirror-linenumbers"],
            autoCloseBrackets: true,
            matchBrackets: true,
            extraKeys: {
                Tab: (cm) => {
                    cm.replaceSelection("    ", "end")
                },
            },
        });

        // Set default code
        editor.setValue(`def greet():
return "Hi!"

print(greet())`);

        // Run button functionality
        const runBtn = document.getElementById("run-btn");
        const output = document.querySelector(".output-content");
        const executionStatus = document.querySelector(".execution-status");

        if (runBtn) {
            runBtn.addEventListener("click", async () => {
                const code = editor.getValue();

                // Clear previous output
                output.textContent = "";
                executionStatus.textContent = "Running...";

                try {
                    // Run code using Piston API
                    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ language: "python", version: "3.10.0", files: [{ content: code }] })
                    });
                    const result = await response.json();

                    if (result.run.output) {
                        output.textContent = result.run.output;
                        executionStatus.textContent = "=== Code Execution Successful";
                        executionStatus.className = "execution-status success";
                    } else {
                        output.textContent = "No output generated";
                        executionStatus.textContent = "=== Code Execution Failed";
                        executionStatus.className = "execution-status error";
                    }
                } catch (error) {
                    output.textContent = "Error running code";
                    executionStatus.textContent = "=== Code Execution Failed";
                    executionStatus.className = "execution-status error";
                }
            });
        }

        // Clear output button
        const clearOutputBtn = document.getElementById("clear-output");

        if (clearOutputBtn) {
            clearOutputBtn.addEventListener("click", () => {
                output.textContent = "";
                executionStatus.textContent = "";
            });
        }
    } else {
        // Fallback if CodeMirror is not loaded
        const editorElement = document.getElementById("editor");
        if (editorElement) {
            editorElement.innerHTML =
                '<textarea class="fallback-editor" rows="10" cols="50">def greet():\n    return "Hi!"\n\nprint(greet())</textarea>';

            // Add some basic styling
            const style = document.createElement("style");
            style.textContent = `
              .fallback-editor {
                width: 100%;
                height: 100%;
                background-color: #282a36;
                color: #f8f8f2;
                border: none;
                padding: 10px;
                font-family: monospace;
                resize: none;
              }
            `;
            document.head.appendChild(style);
        }
    }

    // Ask AI button
    const askAiBtn = document.getElementById("ask-ai-btn");

    if (askAiBtn) {
        askAiBtn.addEventListener("click", () => {
            window.location.href = "chatbot.html";
        });
    }
});

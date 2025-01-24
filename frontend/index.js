
let lastSavedContent = "";
let debounceTimer;


const saveToLocalStorage = (content) => {
    try {
        localStorage.setItem("editorContent", content);
    } catch (error) {
        console.error("Failed to save to local storage", error);
    }
};

const showFeedback = (message) => {
    const feedback = document.createElement("div");
    feedback.textContent = message;
    feedback.style.position = "fixed";
    feedback.style.bottom = "10px";
    feedback.style.right = "10px";
    feedback.style.backgroundColor = "#4caf50";
    feedback.style.color = "white";
    feedback.style.padding = "10px";
    feedback.style.borderRadius = "5px";
    feedback.style.zIndex = 1000;
    document.body.appendChild(feedback);
    setTimeout(() => {
        document.body.removeChild(feedback);
    }, 3000); 
};


const userInput = document.getElementById("editor");
userInput.addEventListener("input", (event) => {
    const content = event.target.value;

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        if (content !== lastSavedContent) {
            saveToLocalStorage(content);
            lastSavedContent = content;
            showFeedback("Saved");
        }
    }, 500);
});


const saveAsFile = () => {
    const content = document.getElementById("editor").value;
    if (content !== lastSavedContent) {
        saveTextFile(content);
        lastSavedContent = content;
        showFeedback("Saved");
    }
};

const saveTextFile = (content) => {
    try {
        const fileData = {
            name: "saved_content.txt",
            content: content,
        };
        localStorage.setItem("savedTextFile", JSON.stringify(fileData));
        showFeedback("Saved");
        console.log("File saved successfully");
    } catch (error) {
        console.error("Failed to save the file", error);
    }
};


document.getElementById("saveButton").addEventListener("click", saveAsFile);


const openFile = (event) => {
    console.log("openFile function");
    const file = event.target.files[0];
    if (!file) {
        alert("No file selected");
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        const content = e.target.result;
        document.getElementById("editor").value = content;
        console.log("File content loaded", content);
    };

    reader.onerror = (e) => {
        console.error("Error reading file:", e.target.error);
        alert("Failed to read the file.");
    };

    reader.readAsText(file);
};


document.getElementById("openFile").addEventListener("click", () => {
    document.getElementById("fileInput").click();
});
document.getElementById("fileInput").addEventListener("change", openFile);

const clearContent = () => {
      const textArea = document.getElementById("editor");
      textArea.value = ""
}

document.getElementById("clearContent").addEventListener("click",clearContent);





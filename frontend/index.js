
let lastSavedContent = "";
let debounceTimer;

let files = [];
let activeFileId = null;

const getUserId = () => {
      let userId = localStorage.getItem("userId");
      if(!userId){
        userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem("userId",userId);
      }

      return userId;
}

const userId = getUserId();

const loadAutoSavedContent = (activeFileId) => {
   return localStorage.getItem(`${activeFileId}`)
}

const saveFile=(fileId)=>{
      activeFileId = `${userId}_${fileId}`;
      const content = document.getElementById("editor").value;
      if(content!==""){
        localStorage.setItem(activeFileId,content);
      }
      else{
        alert("Cant save empty file");
      }
      
}

const switchToFile = (fileId) => {
    if(!fileId){
        fileId = "file1";
    }

    activeFileId = `${userId}_${fileId}`;
    const content = loadAutoSavedContent(activeFileId);
    if(content!==null){
        document.getElementById(editor).value = content;
    }
  
    lastSavedContent = content || ""
    showFeedback(`Switched to the file : ${fileId}`)
}

document.getElementById("mySaves").addEventListener("click",()=>{
    
})


const saveToLocalStorage = (fileKey,content) => {
    try {
        localStorage.setItem(fileKey, content);
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
    if(!activeFileId){
        switchToFile();
    }
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (content !== lastSavedContent && activeFileId) {
            saveToLocalStorage(activeFileId,content);
            lastSavedContent = content;
            showFeedback(`Saved`);
        }
    }, 500);
});

document.getElementById("saveButton").addEventListener("click",()=>{
    const fileName = prompt("Enter a file name to save:")

    if(fileName){
        saveFile(fileName)
    }
})




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





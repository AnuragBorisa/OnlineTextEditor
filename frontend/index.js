let lastSavedContent = "";
let debounceTimer;
let activeFileId = null;
let count = 0;


const getUserId = () => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem("userId", userId);
    }
    return userId;
};

const userId = getUserId();


const loadAutoSavedContent = (activeFileId) => {
    return localStorage.getItem(activeFileId);
};


const saveFile = (fileId) => {
    if (!fileId || fileId.trim() === "") {
        alert("File name cannot be empty");
        return;
    }
    activeFileId = `${userId}_${fileId}`;
    const content = document.getElementById("editor").value;
    if (content !== "") {
        localStorage.setItem(activeFileId, content);
        showFeedback(`File "${fileId}" saved successfully`);
    } else {
        alert("Cannot save an empty file");
    }
};


const switchToFile = (fileId) => {
    if (!fileId) {
        fileId = "file1";
    }
    activeFileId = `${userId}_${fileId}`;
    const content = loadAutoSavedContent(activeFileId);
    if (content !== null) {
        document.getElementById("editor").value = content;
    }
    lastSavedContent = content || "";
    showFeedback(`Switched to file: ${fileId}`);
};


const getUserFiles = () => {
    return Object.keys(localStorage)
        .filter((key) => key.startsWith(`${userId}_`) && localStorage.getItem(key))
        .map((key) => key.replace(`${userId}_`, ""));
};


const sidebar = document.getElementById("sidebar");
const fileList = document.getElementById("fileList");

document.getElementById("mySaves").addEventListener("click", () => {
    const files = getUserFiles();
    fileList.innerHTML = ""; 

    if (files.length === 0) {
        alert("No saved files found");
        return;
    }

    files.forEach((fileName) => {
    const listItemContainer = document.createElement("div");
    listItemContainer.classList.add("list-item-container")

        const listItem = document.createElement("li");
        listItem.textContent = fileName;
        listItem.classList.add("sidebar-item");
        listItem.addEventListener("click", () => {
            switchToFile(fileName);
            sidebar.style.display = "none";
        });
        
        const deleteButton = document.createElement("button")
        deleteButton.textContent = "Delete"
        deleteButton.classList.add("delete-button")
        deleteButton.addEventListener("click",(e)=>{
         e.stopPropagation();
         if (confirm(`Are you sure you want to delete the file "${fileName}"?`)) {
            localStorage.removeItem(`${userId}_${fileName}`);
            listItemContainer.remove();
            showFeedback(`File "${fileName} deleted.`)
         }
        })
        
        listItemContainer.append(listItem);
        listItemContainer.append(deleteButton);

        fileList.appendChild(listItemContainer);
    });

    sidebar.style.display = "block"; 
});

document.getElementById("closeSidebar").addEventListener("click", () => {
    sidebar.style.display = "none";
});


const saveToLocalStorage = (fileKey, content) => {
    try {
        if (content.trim() !== "") {
            localStorage.setItem(fileKey, content);
        } else {
            console.warn("Attempted to save empty content");
        }
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
    if (!activeFileId) {
        switchToFile();
    }
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (content !== lastSavedContent && activeFileId) {
            saveToLocalStorage(activeFileId, content);
            lastSavedContent = content;
            showFeedback("Saved");
        }
    }, 500);
});

const addNewFile = ()=>{

    const fileName = prompt("Enter a file name to save:");
    if (fileName) {
        saveFile(fileName);
    }
}

document.getElementById("saveButton").addEventListener("click", addNewFile);

document.getElementById("addFile").addEventListener("click",()=>{
    const fileName = prompt("Enter the file name")
    if(fileName!=null){
        activeFileId = `${userId}_${fileName}`;
        document.getElementById("editor").value = "";  
        lastSavedContent = ""; 
        saveToLocalStorage(activeFileId, "");
        showFeedback(`New file "${fileName}" created.`);
    }
   
});


const openFile = (event) => {
    const file = event.target.files[0];
    if (!file) {
        alert("No file selected");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        document.getElementById("editor").value = content;
    };

    reader.onerror = () => {
        alert("Failed to read the file");
    };

    reader.readAsText(file);
};

document.getElementById("openFile").addEventListener("click", () => {
    document.getElementById("fileInput").click();
});
document.getElementById("fileInput").addEventListener("change", openFile);


document.getElementById("clearContent").addEventListener("click", () => {
    const textArea = document.getElementById("editor");
    textArea.value = "";
});


const editor = document.getElementById("editor")
const counter = document.getElementById("counter");

const updateLineNumber = () => {
    const lines = editor.value.split("\n").length;
    const lineNumbers = Array.from({length:lines},(_,i)=> i+1).join("\n")
    counter.textContent = lineNumbers;
}

function syncScroll(){
    counter.scrollTop = editor.scrollTop
}

updateLineNumber();

editor.addEventListener("input",updateLineNumber);
editor.addEventListener("scroll",syncScroll)

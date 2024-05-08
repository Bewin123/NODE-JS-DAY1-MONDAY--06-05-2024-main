const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const folderPath = path.join(__dirname, "public"); // Folder path where tasks.txt is located

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Endpoint to create a text file with current timestamp
app.get("/createFile", (req, res) => {
  const currentDate = new Date().toISOString().replace(/:/g, "-"); // Format current date-time
  const fileName = `${currentDate}.txt`;
  const filePath = path.join(folderPath, fileName);

  fs.writeFile(filePath, currentDate, (err) => {
    if (err) {
      console.error("Error creating file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log(`File ${fileName} created successfully`);
    res.status(200).json({ message: `File ${fileName} created successfully` });
  });
});

// Endpoint to retrieve all text files in the folder
app.get("/getTextFiles", (req, res) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const textFiles = files.filter((file) => path.extname(file) === ".txt");
    const fileNames = textFiles.slice(0, 3); // Get the first 3 file names

    res.status(200).json({ files: fileNames });
  });
});
app.get("/", (req, res) => {res.send("server running ") })
// Endpoint to retrieve and display content of tasks.txt file
app.get("/getTasksContent", (req, res) => {
  const fileName = "tasks.txt";
  const filePath = path.join(folderPath, fileName);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).send(data);
  });
});

// Endpoint to display details from files folder containing tasks.txt file information
//localhost:3000/displayDetails
// Endpoint to display details from files folder containing tasks.txt file information
app.get("/displayDetails", (req, res) => {
  const filePath = path.join(folderPath, "tasks.txt");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    let tasks;
    try {
      tasks = JSON.parse(data);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Format the tasks into an HTML table
    let tableHTML = `
      <style>
        body{
          color:black;
        }
        h1 {
          text-align: center;
          text-transform: uppercase;
          color: blue;
        }
        table {
          width: 70%;
          margin: 0 auto;
          border-collapse: collapse;
        }
        th, td {
          padding: 10px;
          border: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
      </style>
    `;
    tableHTML += "<h1>Task Details</h1>";
    tableHTML += "<table><tr><th>ID</th><th>Task</th><th>Completed</th></tr>";

    tasks.forEach((task) => {
      tableHTML += `<tr><td>${task.id}</td><td>${task.task}</td><td>${
        task.completed ? "Yes" : "No"
      }</td></tr>`;
    });

    tableHTML += "</table>";

    res.status(200).send(tableHTML);
  });
});

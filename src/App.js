import React, { useEffect, useState } from 'react';
import { storage } from './firebase'; // Import Firebase storage
import axios from 'axios';
import FileCard from './FileCard'; 
import './App.css';
import { Button } from 'react-bootstrap';

// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS


function App() {
  // const [showToast, setShowToast] = useState(false);
  // const [toastType, setToastType] = useState('success'); // 'success' or 'error'


  // const toggleToast = () => setShowToast(!showToast);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  // const [title, setTitle] = useState('');
  // const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('https://notes-server-steel.vercel.app/files');
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('Please select a file');
      return;
    }
  
    const uploadTask = storage.ref(`files/${selectedFile.name}`).put(selectedFile);
  
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Optionally track upload progress here
      },
      (error) => {
        setMessage('Error uploading file');
        console.error('Error uploading file:', error);
      },
      async () => {
        // Get the download URL
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
  
        // Create a new file object to save to your database
        const newFile = {
          filename: selectedFile.name,
          url: downloadURL,
        };
  
        // Save to your backend database (e.g., MongoDB)
        try {
          await axios.post('https://your-backend-url/upload', newFile);
          setMessage('File uploaded successfully');
          fetchFiles(); // Refresh the file list
        } catch (error) {
          setMessage('Error saving file to database');
          console.error('Error saving file to database:', error);
        }
      }
    );
  };
  

  
  const handleUpdate = async (id) => {
    const updatedTitle = prompt("Enter new title:");
    const updatedDescription = prompt("Enter new description:");

    try {
      await axios.put(`https://notes-server-steel.vercel.app/update/${id}`, {
        title: updatedTitle,
        description: updatedDescription
      });
      setMessage(<h5 style={{color:'#0d6efd'}}>File updated successfully</h5>);
      fetchFiles();
    } catch (error) {
      setMessage('Error updating file');
      console.error('Error updating file:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
       await axios.delete(`https://notes-server-steel.vercel.app/delete/${id}`);
     
     setMessage(<h5 style={{color:'#dc3545'}}> File deleted successfully</h5>);

      fetchFiles();
    } catch (error) {
      setMessage('Error deleting file');
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div className="App">
      <h1><span style={{color:"rgb(4, 241, 111)",fontSize:'44px'}}>E-Notes</span> </h1>
      <h4><span style={{color:"magenta"}}>Upload & Share</span> </h4>

      <form onSubmit={handleSubmit}>
        {/* <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /> */}
        <input type="file" onChange={handleFileChange} />
        <Button className="sbtbtn"type="submit" style={{backgroundColor:'#0d6efd'}} >Upload</Button>
      </form>
      <p>{message}</p>
      <h2>Uploaded Files  &darr; &darr;</h2>
      <div className="cards">
        {files.map(file => (
          <FileCard
            key={file._id}
            file={file}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {/* <Toast  show={showToast} onClose={toggleToast}  style={{  backgroundColor:'white', position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <Toast.Header closeButton>
          <strong className="me-auto">{toastType === 'success' ? 'Success' : '! Select File to upload'}</strong>
        </Toast.Header>
        <Toast.Body>
          {toastType === 'success' ?  'File Uploaded successfully!' : 'An error occurred while uploading file.'}
        </Toast.Body>
      </Toast> */}
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import './Message.css';

const Message = () => {
  const [clientId, setClientId] = useState("");
  const [numbers, setNumbers] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [importedCount, setImportedCount] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result;
      const numbersArray = contents.replace(/[^\d\n]/g, '').trim().split('\n').map(number => {
        return '91' + number.trim();
      }).join(', ');
      setNumbers(numbersArray);
      setImportedCount(numbersArray.split(',').length);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('clientId', clientId);
    formData.append('numbers', numbers);
    formData.append('messages', message);
    if (file) {
      formData.append('file', file);
    }

    const requestOptions = {
      method: 'POST',
      body: formData,
    };

    // Manually construct multipart/form-data headers
    const headers = new Headers();
    headers.append("Accept", "application/json");

    try {
      const response = await fetch('http://localhost:3002/sendmessage', {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      if (response.ok) {
        console.log('Message sent successfully');
      } else {
        console.log('Message sending failed');
      }
    } catch (err) {
      console.error('An error occurred:', err);
    }
  };

  return (
    <div className="container2">
      <h1>Send Message</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="clientId">Client ID</label>
          <input
            type="text"
            name="clientId"
            id="clientId"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="numbers" id="numbersLabel">
            Numbers (Separated by comma) or <a href="#" id="importLink" onClick={(e) => {
              e.preventDefault();
              document.getElementById('fileInput').click();
            }}>Import from CSV</a> 
            {importedCount > 0 && ` (${importedCount} contacts imported)`}
          </label>
          <input
            type="text"
            name="numbers"
            id="numbers"
            value={numbers}
            onChange={(e) => setNumbers(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="message">Message</label>
          <textarea
            name="messages"
            id="messages"
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="fileupload">File Upload</label>
          <input
            type="file"
            name="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <div className="btn-box">
          <input type="submit" name="submit" id="submit" value="Send Message" />
        </div>
      </form>
    </div>
  ); 
}

export default Message;

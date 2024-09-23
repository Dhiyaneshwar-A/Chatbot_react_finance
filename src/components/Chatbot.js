import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import md from 'markdown-it';
import axios from 'axios';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

const apiKey = "AIzaSyAloCAeKwkEeV9y_IFn5mabczcpa97YV5g";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [isChatbotOpen, setChatbotOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(initialHistory());

  function initialHistory() {
    return [
      { role: 'user', parts: [{ text: 'I will upload a document or provide a URL. You need to extract data, summarize it, and provide answers based on its content.' }] },
      { role: 'model', parts: [{ text: 'Got it! Here’s what I can do: ...' }] },
    ];
  }

  const addToHistory = (role, text) => {
    const entry = { role, parts: [{ text }] };
    setHistory(prevHistory => [...prevHistory, entry]);
  };

  const handleFetchContent = async () => {
    if (!url) {
      setError('Please provide a valid URL');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:3001/scrape?url=${encodeURIComponent(url)}`);
      const fetchedContent = data.content || 'No content available';
      setError('');
      addToHistory('user', `Scraped Content: ${fetchedContent}`);
      setMessages(prevMessages => [...prevMessages, { text: fetchedContent, fromUser: false }]);
      const aiResponse = await getResponse(fetchedContent.trim());
      addToHistory('model', aiResponse);
      setMessages(prevMessages => [...prevMessages, { text: aiResponse, fromUser: false }]);
    } catch (err) {
      setError('Error fetching content from the website');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePDFUpload = async (file) => {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onload = async (event) => {
        const typedArray = new Uint8Array(event.target.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let textContent = '';
        
        for (let i = 0; i < pdf.numPages; i++) {
          const page = await pdf.getPage(i + 1);
          const content = await page.getTextContent();
          textContent += content.items.map(item => item.str).join(' ') + '\n';
        }
        resolve(textContent);
      };
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(file);
    });
  };

  const handleDOCXUpload = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value;
  };

  const handleFileUpload = async (file) => {
    const fileType = file.type;
    if (fileType.includes('application/pdf')) {
      return await handlePDFUpload(file);
    } else if (fileType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') || 
               fileType.includes('application/msword')) {
      return await handleDOCXUpload(file);
    } else if (fileType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || 
               fileType.includes('application/vnd.ms-excel')) {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetData = workbook.SheetNames.map(sheet => XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
      return JSON.stringify(sheetData);
    } else {
      const textContent = await file.text();
      return textContent;
    }
  };

  const getResponse = async (prompt) => {
    try {
      const chat = await model.startChat({ history });
      const result = await chat.sendMessage(prompt);
      return await result.response.text();
    } catch (error) {
      console.error('Error in getResponse:', error);
      return 'An error occurred while generating the response.';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (input.trim() === '' && !file) return;

    if (input.trim() !== '') {
      addToHistory('user', input.trim());
      setMessages(prevMessages => [...prevMessages, { text: input.trim(), fromUser: true }]);
    }

    if (file) {
      try {
        const fileContent = await handleFileUpload(file);
        addToHistory('user', `File: ${file.name}\n\n${fileContent}`);
        setMessages(prevMessages => [...prevMessages, { text: fileContent, fromUser: false }]);
        const aiResponse = await getResponse(fileContent.trim());
        addToHistory('model', aiResponse);
        setMessages(prevMessages => [...prevMessages, { text: aiResponse, fromUser: false }]);
        setFile(null);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    } else {
      setLoading(true);
      try {
        const aiResponse = await getResponse(input.trim());
        addToHistory('model', aiResponse);
        setMessages(prevMessages => [...prevMessages, { text: aiResponse, fromUser: false }]);
      } catch (error) {
        console.error('Error generating AI response:', error);
      } finally {
        setInput('');
        setFile(null);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <button id="open-chatbot" className="open-chatbot-button" onClick={() => setChatbotOpen(true)}>
        <h1>ASK</h1>
        <img src="legaldad.png" alt="LegalAppa icon" className="w-12 h-12 rounded-md" />
      </button>

      {isChatbotOpen && (
        <div id="chatbot-popup" className="chatbot-popup">
          <span className="close-button" onClick={() => setChatbotOpen(false)}>&times;</span>
          <div className="p-2 bg-gemRegular flex gap-5 items-center">
            <img src="legaldad.png" alt="chatbot image" className="w-10 h-10 rounded-md" />
            <h1 className="text-gemDeep text-lg font-medium">LegalAppa</h1>
          </div>
          <div id="chat-container" className="chat-container">
            {messages.map((msg, index) => (
              <div key={index} className={msg.fromUser ? 'user-message' : 'ai-message'} dangerouslySetInnerHTML={{ __html: md().render(msg.text) }} />
            ))}
            {loading && <div className="loading-indicator">Loading...</div>}
          </div>
          <form onSubmit={handleSubmit} className="chat-form p-2">
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full p-1 mb-2 border border-grey rounded-md" placeholder="Enter URL to scrape..." />
            <button type="button" onClick={handleFetchContent} className={`w-full p-1 ${loading ? 'bg-gray-400' : 'bg-gemDeep'} rounded text-white`} disabled={loading}>
              {loading ? 'Scraping...' : 'Scrape URL'}
            </button>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} cols="30" rows="2" className="w-full p-2 rounded-md resize-none focus:outline-none" placeholder="Enter message here..." />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full p-1 mb-2 border border-grey rounded-md" />
            <button type="submit" className={`w-full p-1 ${loading ? 'bg-gray-400' : 'bg-gemDeep'} rounded text-white`} disabled={loading}>
              {loading ? 'Processing...' : 'Submit'}
            </button>
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;

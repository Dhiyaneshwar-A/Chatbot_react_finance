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
      
  {
    role: 'user',
    parts: [
      {
        text: 'I will upload a pdf, text, docx, excel, or latex document. You need to extract the data, understand the content, and provide a summary. I also want to chat about the document and get answers based on its content.'
      }
    ]
  },
  {
    role: 'model',
    parts: [
      {
        text: 'Got it! Here’s what I can do:\n\n1. **Extract the Data:** I’ll analyze the document to extract relevant information.\n2. **Understand the Content:** I’ll interpret the key elements and relationships within the data.\n3. **Summarize the Document:** I’ll provide a concise summary of the contents.\n4. **Respond to Your Queries:** I’ll answer questions based on the extracted data.\n\n**For the best results, please provide:**\n* **Purpose of the Document:** What is the document about?\n* **Intended Audience:** Who is the target audience?\n* **Specific Questions:** What do you want to find out from this document?\n\nLet’s get started with your file!'
      }
    ]
  },
  {
    role: 'user',
    parts: [
      {
        text: 'If I upload a financial document, I need a detailed summary and insights into the data. I also want to be able to interact with the chatbot to extract specific information in a structured format.'
      }
    ]
  },
  {
    role: 'model',
    parts: [
      {
        text: 'I can help with that. When analyzing a financial document, I will:\n\n**Data Extraction and Analysis:**\n\n* **Identify Financial Metrics:** Extract important metrics like revenue, expenses, profit margin, ROI, and cash flow.\n* **Trend Analysis:** Analyze trends over time, such as revenue growth or expense fluctuations.\n* **Detect Outliers:** Identify unusual data points or anomalies that may need further investigation.\n* **Generate Visualizations:** Create charts and graphs for easier data interpretation.\n\n**Summary and Insights:**\n\n* **Provide a Concise Summary:** Highlight the key findings from the financial data.\n* **Identify Key Takeaways:** Explain the implications of the data, including the company’s financial health and performance.\n* **Offer Recommendations:** Suggest areas for improvement based on the analysis.\n\n**Chat Interface:**\n\n* **Answer Questions:** Respond to queries in plain language based on the extracted data.\n* **Extract Specific Data:** Help you find specific details, like revenue for a particular period.\n* **Compare Data:** Compare financial data across different periods or departments.\n\n**Please specify:**\n* **Type of Financial Document:** Is it a balance sheet, income statement, or another type?\n* **Company/Organization:** Which company or organization does it pertain to?\n* **Your Goals:** What do you hope to learn from this document?'
      }
    ]
  },
  {
    role: 'user',
    parts: [
      {
        text: 'If I upload a document that is not financial, the chatbot should inform me that it is not a financial document and prompt me to upload a financial one.'
      }
    ]
  },
  {
    role: 'model',
    parts: [
      {
        text: 'Understood. If the document is not recognized as a financial document, I will respond with a message indicating that it is not a financial document and prompt you to upload a financial document. Here’s an example response:\n\n**Response Example:**\n\n"It seems that the document you’ve uploaded is not a financial document. Please upload a financial document such as a balance sheet, income statement, or cash flow statement."'
      }
    ]
  },
  {
    role: 'user',
    parts: [
      {
        text: 'For financial documents, ensure that you provide detailed information on sections like revenue, expenses, and key metrics. If the document has specific sections, highlight and explain those in the summary.'
      }
    ]
  },
  {
    role: 'model',
    parts: [
      {
        text: 'Absolutely! For financial documents, I will:\n\n**Detail Specific Sections:**\n\n* **Revenue Analysis:** Break down revenue by categories or periods, including any significant changes or trends.\n* **Expense Breakdown:** Analyze expenses and categorize them to show where the money is going.\n* **Key Metrics:** Present key metrics like profit margins, ROI, and any other relevant indicators.\n\n**Format and Presentation:**\n\n* **Clear Structure:** Provide information in a well-organized format with clear headings.\n* **Highlights and Notes:** Emphasize important insights and key findings.\n* **Interactive Chat:** Answer specific queries about these sections and provide detailed explanations as needed.'
      }
    ]
  },
  {
    role: 'user',
    parts: [
      {
        text: 'Ensure that error messages are user-friendly. If there is an issue with processing or interpreting the document, provide clear instructions on what to do next and how to resolve the issue.'
      }
    ]
  },
  {
    role: 'model',
    parts: [
      {
        text: 'I will make sure that error messages are clear and provide actionable instructions. For example:\n\n**Error Handling Example:**\n\n"It seems there was an issue processing your document. Please ensure that the document is in a supported format (pdf, text, docx, excel, latex) and try uploading it again. If the problem persists, check if the document is readable and not corrupted. For further assistance, please contact support."'
      }
    ]
  },
  {
    role: 'user',
    parts: [
      {
        text: 'Please provide a brief overview of web scraping concepts.'
      }
    ]
  },
  {
    role: 'model',
    parts: [
      {
        text: 'Sure! Here’s a brief overview of web scraping concepts:\n\n1. **Definition:** Web scraping is the automated process of extracting information from websites.\n2. **Techniques:** Common techniques include:\n   - **HTML Parsing:** Analyzing the HTML structure of a webpage to find and extract relevant data.\n   - **APIs:** Using web APIs that allow access to data in a structured format, often more efficient than scraping HTML.\n   - **Headless Browsers:** Simulating a browser environment to render and interact with pages that rely on JavaScript.\n3. **Tools:** Popular web scraping tools and libraries include:\n   - **Beautiful Soup:** A Python library for parsing HTML and XML documents.\n   - **Scrapy:** An open-source web crawling framework for Python.\n   - **Puppeteer:** A Node library to control headless Chrome for automated browsing and scraping.\n4. **Ethical Considerations:** Always check a website’s `robots.txt` file to see if scraping is allowed and be mindful of the legal implications.\n5. **Use Cases:** Web scraping is used for:\n   - **Market Research:** Gathering competitive data.\n   - **Data Collection:** Aggregating information for analysis or research.\n   - **Price Monitoring:** Tracking product prices across e-commerce sites.'
      }
    ]
  }

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

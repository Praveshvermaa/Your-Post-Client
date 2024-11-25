import React, { useState } from 'react';
import axios from 'axios';

function AIGenerate() {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const handleGenerateImage = async () => {
         if (!prompt) return;
         setLoading(true);
         try {
             const response = await axios.post('http://localhost:3000/api/aigenerator', { prompt });
             console.log(response.data.photo);
             setImageUrl(response.data.photo);
        }
        catch (error) {
            console.log('Error generating image:', error);
         }
         setLoading(false);
    };
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800">
            <h1 className="text-3xl font-bold mb-6">AI Image Generator</h1>
            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter your prompt here..." className="mb-4 p-2 border border-gray-300 rounded w-80" />
            <button onClick={handleGenerateImage} className="bg-blue-500 text-white py-2 px-4 rounded" disabled={loading} > 
                {loading ? 'Generating...' : 'Generate Image'}
            </button> 
            {imageUrl && (<div className="mt-6">
                <img src={imageUrl} alt="Generated" className="max-w-full h-auto rounded shadow-md" />
                 </div>)}
        </div>);
};

export default AIGenerate


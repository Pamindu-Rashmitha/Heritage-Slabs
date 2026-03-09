import React, { useState } from 'react';
import { X, Upload, Sparkles } from 'lucide-react';

const VisualizerModal = ({ isOpen, onClose, productImageUrl, productName }) => {
    const [roomImageFile, setRoomImageFile] = useState(null);
    const [roomImagePreview, setRoomImagePreview] = useState(null);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [aiSuggestion, setAiSuggestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRoomImageFile(file);
            setRoomImagePreview(URL.createObjectURL(file));
            // Reset previous results
            setGeneratedImage(null);
            setAiSuggestion('');
        }
    };

    const handleGenerate = async () => {
        if (!roomImageFile || !productImageUrl) {
            setError("Please upload a room image first.");
            return;
        }
        setLoading(true);
        setError('');
        setGeneratedImage(null);
        setAiSuggestion('');

        try {
            // We need to fetch the actual product image file blob to send it
            const productImageResponse = await fetch(productImageUrl);
            const productImageBlob = await productImageResponse.blob();

            const formData = new FormData();
            formData.append('room_image', roomImageFile);
            // Append the product image blob with a filename
            formData.append('product_image', productImageBlob, 'product.jpg');

            // Calling Python Directly 
            const response = await fetch('http://localhost:8000/genai-visualize', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setGeneratedImage(data.generated_image_base64);
                setAiSuggestion(data.ai_suggestion || '');
            } else {
                const errData = await response.json();
                setError(errData.detail || "Failed to generate image");
            }
        } catch (err) {
            setError("Could not connect to AI service.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="text-blue-600" /> AI Visualizer: {productName}
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Side: Inputs */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2">1. Selected Granite</h3>
                            <img src={productImageUrl} alt={productName} className="w-32 h-32 object-cover rounded-lg border" />
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">2. Upload Your Room</h3>
                            <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                                <Upload className="text-gray-400 mb-2" size={32} />
                                <span className="text-gray-600">Click to upload room photo</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                            {roomImagePreview && (
                                <img src={roomImagePreview} alt="Room Preview" className="mt-4 w-full h-48 object-cover rounded-lg" />
                            )}
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !roomImageFile}
                            className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 ${loading || !roomImageFile ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {loading ? 'Generating with AI...' : <><Sparkles size={20} /> Generate Preview</>}
                        </button>
                    </div>

                    {/* Right Side: Output */}
                    <div className="bg-gray-100 rounded-lg flex flex-col items-center justify-center min-h-[400px] p-4">
                        {loading ? (
                            <div className="text-center text-gray-500 animate-pulse">
                                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                AI is working its magic...<br />This may take 10-20 seconds.
                            </div>
                        ) : generatedImage ? (
                            <div className="w-full">
                                <h3 className="font-semibold mb-2 text-center">Preview with Granite</h3>
                                <img src={generatedImage} alt="AI Generated Room" className="w-full rounded-lg shadow-lg mb-4" />
                                {aiSuggestion && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                                        <p className="text-sm text-blue-800 flex items-start gap-2">
                                            <Sparkles size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                            <span>{aiSuggestion}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500">Result will appear here</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualizerModal;

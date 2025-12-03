function VoiceAssistant() {
  const [isListening, setIsListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');
  const [response, setResponse] = React.useState('');

  const startListening = () => {
    setIsListening(true);
    setTimeout(() => {
      setTranscript('What is the current mustard price?');
      setTimeout(() => {
        setResponse('Current mustard price is ₹6,000 per quintal in Wardha market, up 2.5% from yesterday.');
        setIsListening(false);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button 
        onClick={startListening}
        disabled={isListening}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isListening ? 'bg-red-500 animate-pulse' : 'bg-[var(--primary-color)] hover:scale-110'
        }`}
        title="Voice Assistant"
      >
        <div className={`icon-${isListening ? 'mic-off' : 'mic'} text-2xl text-white`}></div>
      </button>
      
      {(transcript || response) && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-lg shadow-2xl p-4">
          {transcript && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">You said:</p>
              <p className="text-sm">{transcript}</p>
            </div>
          )}
          {response && (
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Response:</p>
              <p className="text-sm">{response}</p>
            </div>
          )}
          <button onClick={() => { setTranscript(''); setResponse(''); }} className="text-xs text-gray-500 hover:text-gray-700 mt-2">Close</button>
        </div>
      )}
    </div>
  );
}
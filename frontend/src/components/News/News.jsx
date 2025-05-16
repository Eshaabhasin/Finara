import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    async function fetchNews() {
      try {
        // Make sure this URL matches your server's endpoint and port
        const response = await axios.get("http://localhost:5000/api/financial-news");
        
        // Check if the data structure matches what your component expects
        if (response.data && response.data.data) {
          setNews(response.data.data);
        } else {
          throw new Error("Unexpected data structure");
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load financial news. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  // Function to toggle expanded state for a card
  const toggleExpand = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Function to generate a placeholder image URL based on the headline text
  const getImageUrl = (headline) => {
    // Extract keywords from headline to use in placeholder image
    const keywords = headline
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 2)
      .join(',');

    // Use a financial/business placeholder image
    return `/api/placeholder/400/200`;
  };

  return (
  <div>
    <NavBar></NavBar>
    <main className="min-h-screen px-4 py-10 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mt-20 mx-auto">
        <h1 className="text-4xl font-bold text-left mb-12 text-white">
          Financial News - powered by SONAR
        </h1>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-4 border-green-400 border-t-transparent animate-spin mb-4"></div>
              <p className="text-green-400 font-medium">Loading latest insights...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900 bg-opacity-70 backdrop-blur-md rounded-xl p-6 shadow-xl">
            <p className="text-center text-white font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-8 shadow-xl">
            <p className="text-center text-gray-300 font-medium">No news articles found.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {!loading && !error && news.map(({ headline, summary, market_impact, citation }, index) => (
            <article
              key={index}
              className="bg-opacity-10 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden border border-green-400/30 hover:border-green-400/70 transition duration-300 flex flex-col h-full transform hover:-translate-y-1"
            >
              {/* Image Section */}

              <div className="p-6 flex flex-col flex-grow">
                <div className="bg-green-500 w-16 h-1 mb-4 rounded-full"></div>
                <h2 className="text-xl font-bold text-white mb-4">{headline}</h2>
                
                <div className="space-y-4 flex-grow">
                  <div>
                    <h3 className="text-green-400 font-semibold text-sm uppercase tracking-wider mb-1">Summary</h3>
                    <p className="text-gray-300 font-medium">
                      {expandedCards[index] ? summary : summary.length > 100 ? `${summary.substring(0, 100)}...` : summary}
                    </p>
                    {summary.length > 100 && (
                      <button 
                        onClick={() => toggleExpand(index)}
                        className="text-green-400 hover:text-green-300 text-sm mt-2 focus:outline-none font-medium"
                      >
                        {expandedCards[index] ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                  
                  {expandedCards[index] && (
                    <div>
                      <h3 className="text-green-400 font-semibold text-sm uppercase tracking-wider mb-1">Market Impact</h3>
                      <p className="text-gray-300 font-medium">{market_impact}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t border-green-400/20 p-4 bg-green-900 bg-opacity-20 flex justify-between items-center">
                {!expandedCards[index] && (
                  <button 
                    onClick={() => toggleExpand(index)}
                    className="text-green-400 hover:text-green-300 font-medium"
                  >
                    View Details
                  </button>
                )}
                <a
                  href={citation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 font-semibold flex items-center ml-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Source
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
    <Footer></Footer>
    </div>
  );
}
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const News = () => {
  const [newsItems, setNewsItems] = useState([]);

  const fetchNews = async () => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=4abb2676cb6c4941b4a4d7ae1f073dda`
      );
      const data = await response.json();
      setNewsItems(data.articles); // store articles in state
    } catch (err) {
      toast.error("Error fetching news:", err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4">Top News</h2>
      <div className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
        {newsItems.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col border p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {item.urlToImage && (
              <img
                src={item.urlToImage}
                alt={item.title}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
            )}
            <p className="font-semibold">{item.title}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

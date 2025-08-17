import { NewsScreen } from "../ui/screens/newsList";

export interface NewsArticle {
    articles: Array<{
        title: string;  
        description: string;
        urlToImage: string;
    }>;
    status: string;
}


export const fetchNews = async (page: number): Promise<NewsArticle> => {
    try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=sports&page=${page}&apiKey=50a2a1bc29ae4598968d8e76e0716e3a`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch news:', error);
        throw error;
    }
}

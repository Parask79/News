 
 import AsyncStorage from '@react-native-async-storage/async-storage';
 
 
  const saveArticlesToCache = async (articles: any[]) => {
    try {
      await AsyncStorage.setItem('newsArticles', JSON.stringify(articles));
      console.log('Articles cached successfully!');
    } catch (error) {
      console.error('Error caching articles:', error);
    }
  };

  // 🔹 Load cached articles
  const loadCachedArticles = async () => {
    try {
      const cachedData = await AsyncStorage.getItem('newsArticles');
      return cachedData ? JSON.parse(cachedData) : [];
    } catch (error) {
      console.error('Error loading cached articles:', error);
      return [];
    }
  };


  export { saveArticlesToCache, loadCachedArticles };
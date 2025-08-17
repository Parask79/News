import {
  Text,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from './style';
import { fetchNews } from '../../../api/NewsAPI'; // Assuming you have an API function to fetch news

import {
  saveArticlesToCache,
  loadCachedArticles,
} from '../../../localStorage/NewsCache';

export const NewsScreen: React.FC = () => {
  const [newsArticles, setNewsArticles] = useState<
    { title: string; description: string; urlToImage: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(2);
  const [refreshing, setRefreshing] = useState(false);
  const [errorShown, setErrorShown] = useState(false);

  // 🔹 Refreshing (pull-to-refresh)
  const onRefreshing = () => {
    setRefreshing(true);
    setPage(2);
    setErrorShown(false); // ✅ reset error state
    // reset pagination
    fetchNews(1)
      .then(data => {
        const freshArticles = data.articles || [];
        setNewsArticles(freshArticles);
        saveArticlesToCache(freshArticles);
        console.log('Refreshed news:', data);
      })
      .catch(error => {
        console.error('Error refreshing news:', error);
        Alert.alert('Error', 'Failed to refresh news articles.');
      })
      .finally(() => setRefreshing(false));
  };

  // 🔹 Load more items (pagination)
  const loadMoreItems = () => {
    if (loading) return; // ✅ guard

    setLoading(true);
    fetchNews(page)
      .then(data => {
        const articles = data.articles || [];

        if (articles.length === 0) {
          console.log('No more articles found. Stopping pagination.');
          // ✅ stop further calls
          return;
        }

        setNewsArticles(prevArticles => {
          const updatedArticles = [...prevArticles, ...articles];
          saveArticlesToCache(updatedArticles); // ✅ cache updated list
          return updatedArticles;
        });

        console.log(`Fetched page ${page}:`, articles.length, 'articles');
        setPage(prevPage => prevPage + 1);
      })
      .catch(error => {
        console.error('Error fetching news:', error);
        if (!errorShown) {
          setErrorShown(true); // ✅ show error only once
          Alert.alert('Error', 'Failed to load more news articles.');
        }
      })
      .finally(() => setLoading(false));
  };

  // 🔹 On mount → load cached articles, then fetch fresh data
  useEffect(() => {
    (async () => {
      const cached = await loadCachedArticles();
      if (cached.length > 0) {
        console.log('Loaded cached articles:', cached.length);
        setNewsArticles(cached);
      }
      // Always try fresh data
      fetchNews(1)
        .then(data => {
          const articles = data.articles || [];
          setNewsArticles(articles);
          saveArticlesToCache(articles);
          console.log('Fetched fresh news:', articles.length);
        })
        .catch(error => {
          console.error('Error fetching news:', error);
          Alert.alert('Error', 'Unable to fetch latest news.');
        });
    })();
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: '#fff' }]}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 10 }}>
        News Articles
      </Text>
      <FlatList
        style={styles.list}
        data={newsArticles}
        onEndReached={() => {
          if (!loading && newsArticles.length > 0 && !errorShown) {
            loadMoreItems();
          }
        }}
        onEndReachedThreshold={0.2}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            {item.urlToImage ? (
              <Image
                source={{ uri: item.urlToImage }}
                style={styles.newsImage}
                resizeMode="cover"
              />
            ) : null}
            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
            {item.description ? (
              <Text style={{ color: '#555' }}>{item.description}</Text>
            ) : null}
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator style={{ padding: 20 }} color="#0000ff" />
          ) : null
        }
      />
    </View>
  );
};

import { Dimensions, StyleSheet, Text, View, Image, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign } from 'react-native-vector-icons';
import AnimatedLottieView from "lottie-react-native";

const { width } = Dimensions.get('window');

const UserPostScreen = ({ route }) => {
  const { image, firstName, lastName, id } = route.params;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPostCount, setCurrentPostCount] = useState(10);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://dummyjson.com/users/${id}/posts`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setPosts(data.posts.slice(0, currentPostCount));
    } catch (error) {
      setError("Error fetching posts: " + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const loadMorePosts = () => {
    if (currentPostCount < posts.length) {
      setCurrentPostCount(currentPostCount + 10);
    }
  };

  const renderPostItem = ({ item }) => (
    <View style={styles.subCard}>
      <Text style={styles.titleFont}>{item.title}</Text>
      <Text>{item.body}</Text>
      <Text style={styles.tagFont}>#{item.tags.join(', ')}</Text>
      <View style={styles.rowContainerNoPadding}>
        <View style={styles.iconContainer}>
          <AntDesign name="like1" size={width * 0.04} />
          <Text style={styles.iconText}>{item.reactions.likes}</Text>
        </View>
        <View style={[styles.iconContainer, styles.flexGrow]}>
          <AntDesign name="dislike1" size={width * 0.04} />
          <Text style={styles.iconText}>{item.reactions.dislikes}</Text>
        </View>
        <View style={styles.iconContainer}>
          <AntDesign name="eyeo" size={width * 0.04} />
          <Text style={styles.iconText}>{item.views}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{flex:1}}>
      <View style={styles.header}>
        <Text style={styles.headerText}>User Posts</Text>
      </View>
    <View style={styles.container}>
   
    


      <View style={styles.rowContainer}>
        <Image
          style={styles.profileImg}
          source={{ uri: image }}
          onError={() => console.error("Image failed to load")}
        />
        <Text style={styles.nameFont}>{firstName} {lastName}</Text>
      </View>

     
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : posts.length === 0 ? (
        <View style={styles.centeredContainer}>
          <AnimatedLottieView autoPlay loop style={styles.notFoundImg} source={require('../assets/animatedLottieJsonFile/noMessageFound.json')} />
          <Text style={styles.noPostsText}>There are no posts to show</Text>
        </View>
      ) : (
        <FlatList
          data={posts.slice(0, currentPostCount)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPostItem}
          contentContainerStyle={styles.columnContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
    </View>
  );
};

export default UserPostScreen;

const styles = StyleSheet.create({
  container: {
    padding: width * 0.07,
    justifyContent: 'center',
    flex: 1,
  },
  header: {
    padding: width * 0.05,
    backgroundColor: '#515adc',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',color:'#ffffff'
  },
  notFoundImg: {
    height: width * 0.6,
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: width * 0.05,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagFont: {
    color: 'blue',
    paddingVertical: width * 0.03,
  },
  subCard: {
    borderBottomWidth: 0.5,
    marginBottom: width * 0.04,
    width: '100%',
    padding: width * 0.02,
  },
  profileImg: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.02,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: width * 0.02,
  },
  nameFont: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginHorizontal: width * 0.04,
  },
  columnContainer: {
    paddingTop: width * 0.06,
  },
  titleFont: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: width * 0.03,
  },
  rowContainerNoPadding: {
    flexDirection: 'row',
    paddingVertical: 0,
  },
  iconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: width * 0.02,
    paddingTop: 0,
  },
  flexGrow: {
    flexGrow: 1,
  },
  iconText: {
    fontSize: width * 0.025,
  },
  noPostsText: {
    fontSize: width * 0.045,
    textAlign: 'center',
    color: 'gray',
    marginTop: width * 0.05,
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, FlatList, ActivityIndicator } from 'react-native';

const { width } = Dimensions.get("window");

const UserListScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [visibleUsers, setVisibleUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        const userDataFromApi = async () => {
            try {
                const response = await fetch('https://dummyjson.com/users');
                const data = await response.json();
                setUsers(data.users);
                setVisibleUsers(data.users.slice(0, pageSize));
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        userDataFromApi();
    }, []);

    const loadMoreUsers = () => {
        if (!loadingMore && visibleUsers.length < users.length) {
            setLoadingMore(true);
            setTimeout(() => {
                const nextPageUsers = users.slice(page * pageSize, (page + 1) * pageSize);
                setVisibleUsers([...visibleUsers, ...nextPageUsers]);
                setPage(page + 1);
                setLoadingMore(false);
            }, 1500);
        }
    };

    const UserDataDetail = ({ user }) => {
        return (
            <TouchableOpacity onPress={() => handleNavigationToUserPostScreen(user)} style={styles.card}>
                <View style={styles.rowContainer}>
                    <Image style={styles.profileImg} source={{ uri: user.image }} />
                    <Text style={styles.nameFont}>{user.firstName} {user.lastName}</Text>
                </View>
                <View style={styles.columnContainer}>
                    <Row label="Email" value={user.email} />
                    <Row label="Company" value={user.company.name} />
                    <Row label="Phone" value={user.phone} />
                    <Row label="City" value={user.address.city} />
                    <Row label="State" value={user.address.state} />
                </View>
            </TouchableOpacity>
        );
    };

    const Row = ({ label, value }) => (
        <View style={[styles.rowContainer, { justifyContent: 'space-between', width: '100%' }]}>
            <Text style={styles.descHeader}>{label}</Text>
            <Text style={styles.descValue}>{value || 'N/A'}</Text>
        </View>
    );

    const handleNavigationToUserPostScreen = (user) => {
        navigation.navigate("UserPost", {
            image: user.image,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id,
        });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
    }

    return (
        <View style={{ flex: 1 }}>
         
            <View style={styles.header}>
                <Text style={styles.headerText}>User List</Text>
            </View>
          
            <FlatList
                data={visibleUsers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <UserDataDetail user={item} />}
                contentContainerStyle={styles.container}
                onEndReached={loadMoreUsers}
                onEndReachedThreshold={0.1}
                ListFooterComponent={
                    loadingMore && <ActivityIndicator size="small" color="#0000ff" />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: width * 0.07,
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
    card: {
        padding: width * 0.04,
        borderBottomWidth: 0.5,
        marginBottom: width * 0.04,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: width * 0.02,
    },
    profileImg: {
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: width * 0.02,
    },
    nameFont: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        marginHorizontal: width * 0.04,
    },
    columnContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingTop: width * 0.06,
    },
    descHeader: {
        fontSize: width * 0.035,
    },
    descValue: {
        fontSize: width * 0.035,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default UserListScreen;

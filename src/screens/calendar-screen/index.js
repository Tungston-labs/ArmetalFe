import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import styles from "./styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native"; // ✅ Correct hooks
import BottomNavbar from "../BottomNavbar";

const holidays = [
  { id: "1", date: "January 31", title: "Dummy holiday", from: "31-01-2002", to: "2-02-2002" },
  { id: "2", date: "January 31", title: "Dummy holiday", from: "31-01-2002", to: "2-02-2002" },
  { id: "3", date: "January 31", title: "Dummy holiday", from: "31-01-2002", to: "2-02-2002" },
  { id: "4", date: "January 31", title: "Dummy holiday", from: "31-01-2002", to: "2-02-2002" },
  { id: "5", date: "January 31", title: "Dummy holiday", from: "31-01-2002", to: "2-02-2002" },
];

const CalendarScreen = () => {
  const navigation = useNavigation(); // ✅ Must be INSIDE the component
  const route = useRoute(); // For tab highlighting (optional)

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.greenStrip} />
      <View style={styles.cardContent}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.dateRange}>
          From {item.from} To {item.to}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calender</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Public Holiday List */}
      <Text style={styles.sectionTitle}>Public holiday list</Text>
      <FlatList
        data={holidays}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
      />

      {/* Bottom Tab Navigation */}
      <BottomNavbar navigation={navigation} route={route} />
    </SafeAreaView>
  );
};

export default CalendarScreen;

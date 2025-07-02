import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./styles";
import BottomNavbar from "../BottomNavbar";
import { useNavigation, useRoute } from "@react-navigation/native";
import LeaveHeader from "../LeaveHeader-screen";

const leaveData = [
  {
    id: "1",
    status: "Approved",
    from: "12/12/2025",
    to: "19/12/2025",
    time: "11:30 AM",
    type: "Paid Leave",
  },
  {
    id: "2",
    status: "Approved",
    from: "12/12/2025",
    to: "19/12/2025",
    time: "11:30 AM",
    type: "Paid Leave",
  },
  {
    id: "3",
    status: "Approved",
    from: "12/12/2025",
    to: "19/12/2025",
    time: "11:30 AM",
    type: "Paid Leave",
  },
  {
    id: "4",
    status: "Approved",
    from: "12/12/2025",
    to: "19/12/2025",
    time: "11:30 AM",
    type: "Paid Leave",
  },
];

export default function LeaveApproveScreen() {
  // ✅ Correctly move these *inside* the component
  const navigation = useNavigation();
  const route = useRoute();

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.row}>
          <Text style={styles.label}>From</Text>
          <Text style={styles.value}>{item.from}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>To</Text>
          <Text style={styles.value}>{item.to}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{item.time}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Leave Type</Text>
          <Text style={styles.value}>{item.type}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Status Bar / Top Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusTime}>11:07</Text>
        <View style={styles.statusIcons}>
          <Ionicons
            name="wifi"
            size={18}
            color="#fff"
            style={styles.statusIcon}
          />
          <Ionicons name="battery-full" size={18} color="#fff" />
        </View>
      </View>

      <LeaveHeader navigation={navigation} route={route} />

      {/* Date header */}
      <Text style={styles.dateHeader}>12 March 2025</Text>

      {/* Leave List */}
      <FlatList
        data={leaveData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("LeaveRequestFormScreen")}
      >
        <Ionicons name="add" size={20} color="white" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <BottomNavbar navigation={navigation} route={route} />
    </SafeAreaView>
  );
}

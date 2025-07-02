import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import BottomNavbar from "../BottomNavbar";
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
    status: "Rejected",
    from: "12/12/2025",
    to: "19/12/2025",
    time: "11:30 AM",
    type: "Paid Leave",
  },
  {
    id: "3",
    status: "Pending",
    from: "12/12/2025",
    to: "19/12/2025",
    time: "11:30 AM",
    type: "Paid Leave",
  },
  {
    id: "4",
    status: "Pending",
    from: "12/12/2025",
    to: "19/12/2025",
    time: "11:30 AM",
    type: "Paid Leave",
  },
];

export default function LeaveAllScreen({ navigation, route }) {
  const [selectedTab, setSelectedTab] = useState("All");

  const handleStatusNavigation = (status) => {
    if (status === "Approved") {
      navigation.navigate("RequestApprovedScreen");
    } else if (status === "Rejected") {
      navigation.navigate("RequestRejected");
    } else if (status === "Pending") {
      navigation.navigate("RequestPending");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={[styles.statusBadge, styles[`status${item.status}`]]}
        onPress={() => handleStatusNavigation(item.status)}
      >
        <Text style={styles.statusText}>{item.status}</Text>
      </TouchableOpacity>

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
      <View style={styles.topHeader}>
        <Text style={styles.time}>11:07</Text>
        <Ionicons name="wifi" size={20} color="#fff" />
        <Ionicons
          name="battery-full"
          size={20}
          color="#fff"
          style={styles.batteryIcon}
        />
      </View>

      <LeaveHeader navigation={navigation} route={route} />

      <Text style={styles.dateHeader}>12 March 2025</Text>

      <FlatList
        data={leaveData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("LeaveRequestFormScreen")}
      >
        <Ionicons name="add" size={20} color="white" />
      </TouchableOpacity>

      <BottomNavbar navigation={navigation} route={route} />
    </SafeAreaView>
  );
}

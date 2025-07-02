import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

export default function LeaveRequestFormScreen() {
  const navigation = useNavigation();

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const onFromChange = (event, selectedDate) => {
    setShowFromPicker(false);
    if (selectedDate) setFromDate(selectedDate);
  };

  const onToChange = (event, selectedDate) => {
    setShowToPicker(false);
    if (selectedDate) setToDate(selectedDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leave Request</Text>
      </View>
      <View style={styles.separator} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stat Boxes */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Pending Leaves</Text>
            <Text style={styles.statValue}>20</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Loss of Pay Taken</Text>
            <Text style={styles.statValue}>0</Text>
          </View>
        </View>

        {/* From/To Dates */}
        <View style={styles.section}>
          <View style={styles.dateRow}>
            <View style={styles.dateInput}>
              <Text style={styles.inputLabel}>From</Text>
              <TouchableOpacity
                style={styles.dateField}
                onPress={() => setShowFromPicker(true)}
              >
                <Text style={styles.dateText}>{fromDate.toLocaleDateString()}</Text>
                <Ionicons name="calendar" size={20} color="#ccc" />
              </TouchableOpacity>
            </View>

            <View style={styles.dateInput}>
              <Text style={styles.inputLabel}>To</Text>
              <TouchableOpacity
                style={styles.dateField}
                onPress={() => setShowToPicker(true)}
              >
                <Text style={styles.dateText}>{toDate.toLocaleDateString()}</Text>
                <Ionicons name="calendar" size={20} color="#ccc" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {showFromPicker && (
          <DateTimePicker
            value={fromDate}
            mode="date"
            display="default"
            onChange={onFromChange}
          />
        )}
        {showToPicker && (
          <DateTimePicker
            value={toDate}
            mode="date"
            display="default"
            onChange={onToChange}
          />
        )}

        {/* Leave Type */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>Leave Type</Text>
          <TextInput
            style={styles.input}
            placeholder="Select Leave type"
            placeholderTextColor="#889"
          />
        </View>

        {/* To */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>To</Text>
          <TextInput
            style={styles.input}
            placeholder="Department Lead"
            placeholderTextColor="#889"
          />
        </View>

        {/* CC */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>C.C</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor="#889"
            keyboardType="email-address"
          />
        </View>

        {/* Reason */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>Reason</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter Reason"
            placeholderTextColor="#889"
            multiline
          />
        </View>
      </ScrollView>

      {/* Footer buttons pinned at bottom */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.deleteButton}>
          <Ionicons name="trash" size={24} color="#ff3333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply Leave</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

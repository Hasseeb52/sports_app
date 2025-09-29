/**
 * My Events Screen
 * Shows user's RSVPed events and events they've organized
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Calendar, Users } from 'lucide-react-native';
import { useEvents } from '../../contexts/EventsContext';
import { useAuth } from '../../contexts/AuthContext';
import { Event } from '../../types';
import { router } from 'expo-router';
import EventCard from '../../components/EventCard';

export default function MyEvents() {
  const { events, toggleRSVP } = useEvents();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'rsvped' | 'organized'>('rsvped');
  const [myEvents, setMyEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (!user) return;

    let filteredEvents: Event[] = [];

    if (activeTab === 'rsvped') {
      // Show events user has RSVPed to
      filteredEvents = events.filter(event => 
        event.rsvpList.includes(user.uid)
      );
    } else {
      // Show events user has organized
      filteredEvents = events.filter(event => 
        event.hostId === user.uid
      );
    }

    // Sort by date (upcoming first)
    filteredEvents.sort((a, b) => 
      new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    );

    setMyEvents(filteredEvents);
  }, [events, user, activeTab]);

  const handleRSVP = async (eventId: string) => {
    try {
      await toggleRSVP(eventId);
    } catch (error) {
      console.error('Failed to update RSVP:', error);
    }
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <EventCard
      event={item}
      onPress={() => handleEventPress(item.id)}
      onRSVP={() => handleRSVP(item.id)}
      isRSVPed={user ? item.rsvpList.includes(user.uid) : false}
      showHost={activeTab === 'rsvped'}
    />
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>Please log in to view your events</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Events</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'rsvped' && styles.activeTab]}
            onPress={() => setActiveTab('rsvped')}
          >
            <Calendar size={20} color={activeTab === 'rsvped' ? '#2563eb' : '#6b7280'} />
            <Text style={[styles.tabText, activeTab === 'rsvped' && styles.activeTabText]}>
              RSVPed
            </Text>
          </TouchableOpacity>
          
          {user.role === 'organizer' && (
            <TouchableOpacity
              style={[styles.tab, activeTab === 'organized' && styles.activeTab]}
              onPress={() => setActiveTab('organized')}
            >
              <Users size={20} color={activeTab === 'organized' ? '#2563eb' : '#6b7280'} />
              <Text style={[styles.tabText, activeTab === 'organized' && styles.activeTabText]}>
                Organized
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={myEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Calendar size={48} color="#d1d5db" />
            <Text style={styles.emptyStateTitle}>
              {activeTab === 'rsvped' ? 'No RSVPed Events' : 'No Organized Events'}
            </Text>
            <Text style={styles.emptyStateText}>
              {activeTab === 'rsvped' 
                ? 'Events you RSVP to will appear here'
                : 'Events you create will appear here'
              }
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#2563eb',
  },
  listContainer: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 64,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  loginPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loginPromptText: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
  },
});
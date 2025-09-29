/**
 * Event Card Component
 * Displays event information in a card format for lists
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Calendar, Clock, MapPin, Users, Star } from 'lucide-react-native';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  onRSVP: () => void;
  isRSVPed: boolean;
  showHost?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onPress, 
  onRSVP, 
  isRSVPed, 
  showHost = false 
}) => {
  const eventDate = new Date(event.dateTime);
  const isUpcoming = eventDate > new Date();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Event Image */}
      {event.imageURL ? (
        <Image source={{ uri: event.imageURL }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Calendar size={32} color="#d1d5db" />
        </View>
      )}

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          <View style={styles.badges}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{event.type}</Text>
            </View>
            <View style={styles.difficultyBadge}>
              <Star size={12} color="#f59e0b" />
              <Text style={styles.difficultyBadgeText}>{event.difficulty}</Text>
            </View>
          </View>
        </View>

        {/* Event Info */}
        <View style={styles.info}>
          <View style={styles.infoRow}>
            <Calendar size={16} color="#6b7280" />
            <Text style={styles.infoText}>
              {eventDate.toLocaleDateString([], { 
                month: 'short', 
                day: 'numeric',
                year: eventDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
              })}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Clock size={16} color="#6b7280" />
            <Text style={styles.infoText}>
              {eventDate.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MapPin size={16} color="#6b7280" />
            <Text style={styles.infoText} numberOfLines={1}>
              {event.location.address}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Users size={16} color="#6b7280" />
            <Text style={styles.infoText}>
              {event.rsvpCount} attending
            </Text>
          </View>

          {showHost && (
            <View style={styles.infoRow}>
              <Text style={styles.hostText}>by {event.hostName}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {event.shortDescription}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.status, !isUpcoming && styles.statusPast]}>
            {isUpcoming ? 'Upcoming' : 'Past Event'}
          </Text>
          
          {isUpcoming && (
            <TouchableOpacity
              style={[styles.rsvpButton, isRSVPed && styles.rsvpButtonActive]}
              onPress={onRSVP}
            >
              <Text style={[styles.rsvpButtonText, isRSVPed && styles.rsvpButtonTextActive]}>
                {isRSVPed ? 'Going' : 'Join'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
  },
  imagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 22,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  typeBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563eb',
  },
  difficultyBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  difficultyBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#f59e0b',
  },
  info: {
    marginBottom: 12,
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  hostText: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
    color: '#059669',
  },
  statusPast: {
    color: '#6b7280',
  },
  rsvpButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  rsvpButtonActive: {
    backgroundColor: '#2563eb',
  },
  rsvpButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  rsvpButtonTextActive: {
    color: '#ffffff',
  },
});

export default EventCard;
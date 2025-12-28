import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FooterMenuItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  color: string;
  onPress: () => void;
}

const FooterMenuItem = ({ iconName, title, color, onPress }: FooterMenuItemProps) => (
  <TouchableOpacity 
    onPress={onPress}
    activeOpacity={0.7}
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
    }}
  >
    <View style={{
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: `${color}15`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
    }}>
      <Ionicons name={iconName} size={22} color={color} />
    </View>
    <Text style={{ fontSize: 12, fontWeight: '600', color: '#555' }}>{title}</Text>
  </TouchableOpacity>
);

const FooterScreen = () => {
  return (
    <View style={{ 
      flexDirection: 'row', 
      backgroundColor: '#fff', 
      borderTopWidth: 1, 
      borderTopColor: '#eee' 
    }}>
      {/* <FooterMenuItem 
        iconName="wallet" 
        title="급여" 
        color="#AA00FF" 
        onPress={() => console.log('급여 클릭')} 
      />
      <FooterMenuItem 
        iconName="calendar" 
        title="스케줄" 
        color="#007AFF" 
        onPress={() => console.log('스케줄 클릭')} 
      />
      <FooterMenuItem 
        iconName="person" 
        title="마이" 
        color="#FF9500" 
        onPress={() => console.log('마이 클릭')} 
      /> */}

      <FooterMenuItem 
        iconName="time" 
        title="출퇴근" 
        color="#2962FF" 
        onPress={() => console.log('출퇴근')} 
      />
      <FooterMenuItem 
        iconName="calendar" 
        title="일정" 
        color="#00C853" 
        onPress={() => console.log('일정')} 
      />
      <FooterMenuItem 
        iconName="wallet" 
        title="급여" 
        color="#AA00FF" 
        onPress={() => console.log('급여')} 
      />
    </View>
  );
};

export default FooterScreen;

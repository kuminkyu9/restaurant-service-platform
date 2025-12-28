import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';



interface WorkplaceFooterProps {
  isWorking: boolean;
  onWorkToggle: () => void;
}

const WorkplaceFooter = ({ isWorking, onWorkToggle }: WorkplaceFooterProps) => {
  const [expanded, setExpanded] = useState(!isWorking);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={{
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1, borderTopColor: '#EEEEEE',
      borderTopLeftRadius: 16, borderTopRightRadius: 16,
      elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 3,
    }}>
      {/* 핸들러 (높이 축소) */}
      <TouchableOpacity 
        onPress={toggleExpand}
        activeOpacity={0.8}
        style={{ alignItems: 'center', paddingVertical: 8 }}
      >
        <View style={{ width: 32, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Ionicons name={expanded ? "chevron-down" : "chevron-up"} size={14} color="#999" />
        </View>
      </TouchableOpacity>
      <View style={{ height: 20 }} />
      {/* 버튼 영역 (높이 및 패딩 축소, 색상 톤다운) */}
      {expanded && (
        <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
          <TouchableOpacity
            onPress={onWorkToggle}
            style={{
              // ✅ 색상 변경: 쨍하지 않은 부드러운 톤
              backgroundColor: isWorking ? '#4C566A' : '#66BB6A', 
              paddingVertical: 12, borderRadius: 8,
              alignItems: 'center', justifyContent: 'center',
              // 살짝 그림자 추가해서 버튼 느낌 살리기
              elevation: 2, shadowColor: isWorking ? '#4C566A' : '#66BB6A', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 2}
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600' }}>
              {isWorking ? '퇴근 처리' : '출근 처리'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default WorkplaceFooter;

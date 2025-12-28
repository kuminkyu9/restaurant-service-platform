import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Order, OrderStatus } from './OrderItemCard';

interface StatusChangeModalProps {
  visible: boolean;
  selectedOrder: Order | null;
  selectedStatus: OrderStatus;
  onClose: () => void;
  onStatusSelect: (status: OrderStatus) => void;
  onConfirm: () => void;
}

const STATUS_OPTIONS: { label: string; value: OrderStatus }[] = [
  { label: '접수대기', value: 'PENDING' },
  { label: '조리중', value: 'COOKING' },
  { label: '서빙중', value: 'SERVED' },
  { label: '완료', value: 'COMPLETED' },
  { label: '취소', value: 'CANCELED' },
];

const StatusChangeModal = ({
  visible,
  selectedOrder,
  selectedStatus,
  onClose,
  onStatusSelect,
  onConfirm,
}: StatusChangeModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center'
      }}>
        <View style={{
          width: '85%', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24,
          elevation: 5
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8, textAlign: 'center' }}>
            주문 상태 변경
          </Text>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' }}>
            {selectedOrder?.tableNumber}번 테이블의 주문 상태를 선택하세요.
          </Text>

          <View style={{ marginBottom: 24 }}>
            {STATUS_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={{
                  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                  paddingVertical: 12, paddingHorizontal: 16,
                  borderBottomWidth: selectedStatus === option.value ? 0 : 1,
                  borderBottomColor: '#F5F5F5',
                  backgroundColor: selectedStatus === option.value ? '#FFF3E0' : 'transparent',
                  borderRadius: selectedStatus === option.value ? 8 : 0,
                }}
                onPress={() => onStatusSelect(option.value)}
              >
                <Text style={{ fontSize: 16, fontWeight: selectedStatus === option.value ? 'bold' : 'normal', color: selectedStatus === option.value ? '#FF6B00' : '#333' }}>
                  {option.label}
                </Text>
                {selectedStatus === option.value && (
                  <Ionicons name="checkmark-circle" size={20} color="#FF6B00" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity 
              style={{ flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center', backgroundColor: '#F5F5F5' }}
              onPress={onClose}
            >
              <Text style={{ color: '#666', fontWeight: 'bold', fontSize: 15 }}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center', backgroundColor: '#FF6B00' }}
              onPress={onConfirm}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 }}>완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default StatusChangeModal;
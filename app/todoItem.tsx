import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Button,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import SelectDropdown from 'react-native-select-dropdown';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { updateTodo, deleteTodo } from './todoSlice';

type TodoItemProps = {
  id: string;
  label: string;
  priority: number;
  deadline: string;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
};

const TodoItem = ({
  id,
  label,
  priority,
  deadline,
  activeId,
  setActiveId,
}: TodoItemProps) => {
  const dispatch = useDispatch();
  const active = activeId === id;

  const selectData = [
    { title: 'Cao', id: 3 },
    { title: 'Trung bình', id: 2 },
    { title: 'Thấp', id: 1 },
  ];

  const [text, setText] = useState(label);
  const [selectedPriority, setSelectedPriority] = useState(priority);
  const [date, setDate] = useState<Date | null>(
    deadline ? moment(deadline, 'DD/MM/YYYY').toDate() : null,
  );
  const [open, setOpen] = useState(false);

  const height = useSharedValue(80);
  const baseOpacity = useSharedValue(1);
  const extraOpacity = useSharedValue(0);

  const deleteBtnTranslateX = useSharedValue(100);
  const deleteBtnTranslateY = useSharedValue(-20);

  const inputRef = useRef<TextInput>(null);

  const heightStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  const extraStyle = useAnimatedStyle(() => ({
    opacity: extraOpacity.value,
  }));

  const deleteBtnStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: deleteBtnTranslateX.value },
      { translateY: deleteBtnTranslateY.value },
    ],
  }));

  useEffect(() => {
    height.value = withTiming(active ? 250 : 80, { duration: 300 });
    baseOpacity.value = withTiming(active ? 0 : 1, { duration: 200 });
    extraOpacity.value = withTiming(active ? 1 : 0, { duration: 300 });

    deleteBtnTranslateX.value = withTiming(active ? 16 : 100, {
      duration: 300,
    });
    deleteBtnTranslateY.value = withTiming(active ? -170 : -20, {
      duration: 300,
    });

    if (active) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 350);
    }
  }, [active]);

  const toggle = () => {
    setActiveId(active ? null : id);
  };

  const getDeadline = (deadline: string) => {
    const deadlineDate = moment(deadline, 'DD/MM/YYYY');
    const today = moment();
    const diffDays = deadlineDate.diff(today, 'days');

    if (deadline === '') return '';

    if (diffDays > 0) return `Còn ${diffDays} ngày`;
    if (diffDays === 0) return 'Hết hạn hôm nay';
    return `Đã quá hạn ${Math.abs(diffDays)} ngày`;
  };

  const getPriority = (type: number) => {
    switch (type) {
      case 3:
        return 'Cao';
      case 2:
        return 'Trung bình';
      default:
        return 'Thấp';
    }
  };

  const getPriorityColor = (type: number) => {
    switch (type) {
      case 3:
        return 'green';
      case 2:
        return 'orange';
      default:
        return 'red';
    }
  };

  const handleSave = () => {
    dispatch(
      updateTodo({
        id,
        label: text,
        deadline: date ? moment(date).format('DD/MM/YYYY') : '',
        priority: selectedPriority,
      }),
    );
    setActiveId(null);
    Toast.show({
      type: 'success',
      text1: 'Cập nhật thành công',
      position: 'bottom',
    });
  };

  const handleDelete = () => {
    dispatch(deleteTodo(id));
    Toast.show({
      type: 'error',
      text1: 'Đã xoá task',
      position: 'bottom',
    });
  };

  return (
    <Pressable onPress={toggle}>
      <Animated.View style={[styles.card, heightStyle]}>
        {!active && (
          <View style={styles.row}>
            <View style={styles.checkbox} />
            <View style={styles.textBlock}>
              <Text style={styles.title}>{label}</Text>
              <Text
                style={[styles.title, { color: getPriorityColor(priority) }]}
              >
                {getPriority(priority)}
              </Text>
            </View>
            <View style={styles.rightBlock}>
              <Text style={styles.edit}>✎</Text>
              <Text style={styles.title}>{getDeadline(deadline)}</Text>
            </View>
          </View>
        )}

        {active && (
          <Animated.View style={[styles.extraContainer, extraStyle]}>
            <TextInput
              ref={inputRef}
              value={text}
              onChangeText={setText}
              style={styles.input}
              placeholderTextColor="#888"
            />

            <View style={styles.rowBetween}>
              <Text>Thời hạn</Text>
              {!date ? (
                <Button title="Chọn ngày" onPress={() => setOpen(true)} />
              ) : (
                <Pressable onPress={() => setOpen(true)}>
                  <Text style={styles.dateText}>
                    {moment(date).format('DD/MM/YYYY')}
                  </Text>
                </Pressable>
              )}

              <DatePicker
                modal
                open={open}
                date={date || new Date()}
                onConfirm={d => {
                  setOpen(false);
                  setDate(d);
                }}
                onCancel={() => setOpen(false)}
              />
            </View>

            <View style={styles.rowBetween}>
              <Text>Độ ưu tiên</Text>
              <SelectDropdown
                data={selectData}
                defaultValue={selectData.find(p => p.id === selectedPriority)}
                onSelect={item => setSelectedPriority(item.id)}
                renderButton={selectedItem => (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {(selectedItem && selectedItem.title) ||
                        'Chọn độ ưu tiên'}
                    </Text>
                  </View>
                )}
                renderItem={item => (
                  <View key={item.id} style={styles.dropdownItemStyle}>
                    <Text style={styles.dropdownItemTxtStyle}>
                      {item.title}
                    </Text>
                  </View>
                )}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />
            </View>

            <Pressable style={styles.addBtn} onPress={handleSave}>
              <Text style={styles.addBtnText}>Xong</Text>
            </Pressable>

            <Animated.View style={[styles.deleteWrapper, deleteBtnStyle]}>
              <Pressable style={styles.deleteBtn} onPress={handleDelete}>
                <Text style={styles.deleteBtnText}>Xoá</Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
  },
  rightBlock: {
    alignItems: 'flex-end',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#ccc',
    marginRight: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  edit: {
    fontSize: 18,
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginTop: 12,
    padding: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addBtn: {
    marginTop: 16,
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 6,
    width: '50%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteWrapper: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  deleteBtn: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  deleteBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  extraContainer: {
    flex: 1,
  },
  dropdownButtonStyle: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  dropdownButtonTxtStyle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    width: 200,
    position: 'absolute',
    left: 200,
  },
  dropdownItemStyle: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
});

export default TodoItem;

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { RootState } from './store';
import { addTodo } from './todoSlice';
import TodoItem from './todoItem';

export default function TodoList() {
  const todos = useSelector((state: RootState) => state.todo.todos);
  const dispatch = useDispatch();
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleAddTodo = () => {
    const newId = Date.now().toString();
    dispatch(
      addTodo({
        id: newId,
        label: 'Task mới',
        deadline: moment().format('DD/MM/YYYY'),
        priority: 2,
      }),
    );
    setActiveId(newId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.todoList}>
        {todos.map(t => (
          <TodoItem
            key={t.id}
            id={t.id}
            label={t.label}
            priority={t.priority}
            deadline={t.deadline}
            activeId={activeId}
            setActiveId={setActiveId}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddTodo}>
        <Text style={styles.buttonText}>Tạo task mới +</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7CC15',
  },
  todoList: {
    marginTop: 64,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#F65D79',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 'auto',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});

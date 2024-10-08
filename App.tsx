import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';

interface toDo {
  id: number;
  title: string;
  statue: boolean;
}

const App = () => {
  const [title, setTitle] = useState<string>('');
  const [toDo, setToDo] = useState<toDo[]>([]);
  const [editId, setEditId] = useState<number>(0);
  const [editTitle, setEditTitle] = useState<string>('');

  const handleAdd = () => {
    if (title.trim() === '') {
      return;
    }

    const newToDo = {
      id: Date.now(),
      title: title,
      statue: false,
    };

    setToDo(prev => [...prev, newToDo]);

    setTitle('');
  };

  const handleDelete = (deleteId: number) => {
    if (deleteId != 0) {
      const updateToDo = toDo.filter(item => item.id !== deleteId);
      setToDo(updateToDo);
    }
    return;
  };

  const handleEdit = () => {
    if (editTitle.trim() === '') {
      return;
    } else {
      setToDo(prev =>
        prev.map(item =>
          item.id === editId ? {...item, title: editTitle} : item,
        ),
      );

      setEditId(0);
      setEditTitle('');
    }
  };

  const handleStartEdit = (editId: number, currentTitle: string) => {
    setEditId(editId);
    setEditTitle(currentTitle);
  };

  return (
    <View style={style.container}>
      <View style={style.row}>
        <TextInput
          style={style.input}
          placeholder="Coba ges"
          value={title}
          onChangeText={setTitle}
        />

        <Pressable style={style.button} onPress={handleAdd}>
          <Text style={style.texts}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={toDo}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={style.flex}> 
            <View style={[style.row, style.bt]}>
              {item.id === editId ? (
                <TextInput
                  style={style.editInput}
                  value={editTitle}
                  onChangeText={setEditTitle}
                />
              ) : (
                <Text style={style.texts}>{item.title}</Text>
              )}
              <View style={style.row}>
                {item.id === editId ? (
                  <Pressable
                    style={buttonRadius('green').buttonRad}
                    onPress={handleEdit}>
                    <Text style={style.texts}>Save</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={buttonRadius('blue').buttonRad}
                    onPress={() => handleStartEdit(item.id, item.title)}>
                    <Text style={style.texts}>Edit</Text>
                  </Pressable>
                )}
                <Pressable
                  style={buttonRadius('red').buttonRad}
                  onPress={() => handleDelete(item.id)}>
                  <Text style={style.texts}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  flex: {
    flex: 1,
  },
  texts: {
    color: 'black',
    fontSize: 18,
  },
  input: {
    borderColor: 'black',
    flex: 1,
    backgroundColor: 'black',
  },
  button: {
    paddingHorizontal: 20,
    backgroundColor: 'blue',
  },
  row: {
    flexDirection: 'row',
  },
  bt: {
    justifyContent: 'space-between',
  },
  editInput: {
    borderColor: 'black',
    color: 'black',
    flex: 1,
    backgroundColor: 'white',
    padding: 8,
    borderWidth: 1,
  },
});

const buttonRadius = (color: any) =>
  StyleSheet.create({
    buttonRad: {
      padding: 20,
      backgroundColor: color,
      borderRadius: 12,
    },
  });

export default App;

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Image,
  ScrollView,
  Modal,
  PermissionsAndroid,
} from 'react-native';
import React, {useState} from 'react';

interface toDo {
  id: number;
  title: string;
  statue: boolean;
}

const planCategory = ['Personal', 'Office', 'Shopping', 'Notes', 'Family'];
const colors = ['red', 'blue', 'green', 'black', 'yellow'];

const App = () => {
  const [title, setTitle] = useState<string>('');
  const [toDo, setToDo] = useState<toDo[]>([
    {id: Date.now() + 1, title: 'Complete project proposal', statue: false},
    {id: Date.now() + 2, title: 'Buy groceries for the week', statue: false},
    {
      id: Date.now() + 3,
      title: 'Schedule team meeting',
      statue: false,
    },
    {id: Date.now() + 4, title: 'Work out for 30 minutes', statue: false},
    {id: Date.now() + 5, title: 'Read 20 pages of a new book', statue: false},
    {id: Date.now() + 6, title: 'Reply to client emails', statue: false},
    {id: Date.now() + 7, title: 'Plan weekend trip itinerary', statue: false},
  ]);
  const [editId, setEditId] = useState<number>(0);
  const [editTitle, setEditTitle] = useState<string>('');
  const [verifyModalVisible, setVerifyModalVisible] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

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

    setModalVisible(false);
  };

  // const handleDelete = (deleteId: number) => {
  //   if (deleteId != 0) {
  //     const updateToDo = toDo.filter(item => item.id !== deleteId);
  //     setToDo(updateToDo);
  //   }
  //   return;
  // };

  const handleDelete = () => {
    if (deleteId != 0) {
      const updateToDo = toDo.filter(item => item.id !== deleteId);
      setToDo(updateToDo);
    }
    setVerifyModalVisible(false); // Tutup modal setelah menghapus
  };

  const handleConfirmDelete = (id: number) => {
    setDeleteId(id);
    setVerifyModalVisible(true);
  };

  const handleCancelDelete = () => {
    setVerifyModalVisible(false);
    setDeleteId(0); // Batalkan penghapusan
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

  const formatDateFromTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);

    const tanggal = date.getDate();
    const bulan = date.getMonth();
    const tahun = date.getFullYear();

    const bulanNama = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];

    return `${tanggal.toString().padStart(2, '0')}, ${
      bulanNama[bulan]
    }, ${tahun}`;
  };

  return (
    <View style={[style.container, {backgroundColor: '#F3F4F9'}]}>
      <View
        style={[
          style.row,
          {justifyContent: 'space-between', margin: 18, marginBottom: 20},
        ]}>
        <View>
          <Text style={style.texts}>Plan</Text>
          <Text style={style.texts}>What is your plan?</Text>
        </View>
        <Image
          source={require('./assets/images/notification.png')}
          style={{height: 20, width: 20, margin: 20}}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{flexGrow: 0, marginBottom: 20}}>
        {planCategory.map((planCategory, index) => (
          <Pressable key={index}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 80 / 2,
                height: 80,
                width: 80,
                justifyContent: 'center',
                position: 'relative',
                marginHorizontal: 6,
              }}>
              <View
                style={{
                  height: 10,
                  width: 10,
                  borderRadius: 5,
                  backgroundColor: colors[index % colors.length],
                  position: 'absolute',
                  top: 0,
                  alignSelf: 'center',
                }}></View>
              <Text style={[style.texts, {textAlign: 'center'}]}>
                {planCategory}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={[style.texts, {marginBottom: 20, marginLeft: 18}]}>
        Upcomming
      </Text>

      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          padding: 18,
        }}>
        <Text style={style.texts}>May</Text>

        {/* <View style={style.row}>
          <TextInput
            style={style.input}
            placeholder="Coba ges"
            value={title}
            onChangeText={setTitle}
          />

          <Pressable style={style.button} onPress={handleAdd}>
            <Text style={style.texts}>Add</Text>
          </Pressable>
        </View> */}

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
                  <View style={{width: 260}}>
                    <Text style={style.texts}>{item.title}</Text>
                    <Text style={style.hintTexts}>
                      {formatDateFromTimestamp(item.id)}
                    </Text>
                  </View>
                )}
                <View style={[style.row, {alignItems: 'center'}]}>
                  {item.id === editId ? (
                    <Pressable
                      style={buttonRadius('blue').buttonRad}
                      onPress={handleEdit}>
                      <Text style={style.textWhite}>Save</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      // style={buttonRadius('blue').buttonRad}
                      onPress={() => handleStartEdit(item.id, item.title)}>
                      {/* <Text style={style.texts}>Edit</Text> */}
                      <Image
                        source={require('./assets/images/pen.png')}
                        style={{
                          width: 20,
                          height: 22,
                          margin: 10,
                          tintColor: 'blue',
                        }}
                      />
                    </Pressable>
                  )}
                  <Pressable
                    // style={buttonRadius('red').buttonRad}
                    onPress={() => handleConfirmDelete(item.id)}>
                    {/* <Text style={style.texts}>Delete</Text> */}
                    <Image
                      source={require('./assets/images/trash.png')}
                      style={{
                        width: 20,
                        height: 22,
                        margin: 10,
                        tintColor: 'red',
                      }}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      </View>
      <Pressable style={style.fab} onPress={() => setModalVisible(true)}>
        <Text style={style.fabText}>+</Text>
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        {/* <View style={style.modalView}></View> */}

        <Pressable
          style={style.modalView}
          onPress={() => setModalVisible(false)}>
          <View style={style.modalInside} pointerEvents="box-none">
            <Text style={[style.texts, {margin: 4}]}>Masukan To Do</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TextInput
                style={style.input}
                placeholderTextColor={'black'}
                placeholder="Enter to-do title"
                value={title}
                onChangeText={setTitle}
              />
              <Pressable style={style.button} onPress={handleAdd}>
                <Text style={style.textWhite}>Add</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={verifyModalVisible}
        onRequestClose={handleCancelDelete}>
        <Pressable style={style.modalView} onPress={handleCancelDelete}>
          <View style={[style.modalInsideVerif, {padding: 5}]}>
            <Text
              style={[
                style.texts,
                {marginBottom: 20, width: 300, alignSelf: 'center'},
              ]}>
              Apakah Anda yakin ingin menghapus to-do ini?
            </Text>
            <View style={[style.row, {justifyContent: 'space-around'}]}>
              <Pressable
                style={[
                  style.button,
                  {backgroundColor: 'red', width: 120, alignItems: 'center'},
                ]}
                onPress={handleDelete}>
                <Text style={style.textWhite}>Ya</Text>
              </Pressable>
              <Pressable
                style={[
                  style.button,
                  {backgroundColor: 'gray', width: 120, alignItems: 'center'},
                ]}
                onPress={handleCancelDelete}>
                <Text style={style.textWhite}>Tidak</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const style = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalInside: {
    height: 120,
    justifyContent: 'space-evenly',
    width: '100%',

    borderRadius: 10,
    // flex: 1,
    backgroundColor: 'white',
  },
  modalInsideVerif: {
    height: 150,
    justifyContent: 'space-evenly',
    width: '100%',

    borderRadius: 10,
    // flex: 1,
    backgroundColor: 'white',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 30,
    right: 20,
  },
  fabText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
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
  hintTexts: {
    color: 'grey',
    fontSize: 14,
  },
  textWhite: {
    color: 'white',
    fontSize: 18,
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    flex: 1,
    color: 'black',
    borderRadius: 12,
    marginLeft: 4,
    backgroundColor: 'white',
  },
  button: {
    padding: 12,
    borderRadius: 12,
    margin: 4,
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
    fontSize: 18,
    flex: 1,
    backgroundColor: 'white',
    padding: 8,
    borderWidth: 0.5,
  },
});

const buttonRadius = (color: any) =>
  StyleSheet.create({
    buttonRad: {
      padding: 12,
      backgroundColor: color,
    },
  });

export default App;

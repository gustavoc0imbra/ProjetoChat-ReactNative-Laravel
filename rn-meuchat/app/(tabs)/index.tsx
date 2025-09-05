import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import axios from 'axios';
import { FlatList, GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import EchoService from '../services/websocket';


type Message = {
  text: string;
  sender: string;
  date: string;
};

const AXIOS = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function HomeScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [user, setUser] = useState<string>('');

  useEffect(() => {
    EchoService.channel('chat').listen('NewMessageArrived', (message: any) => {
      console.log("Chegou mensagem", message);
      setMessages((prevMessages) => [...prevMessages, { text: message.message, sender: message.user, date: message.date }]);
    });
  }, []);

  const sendMessage = async () => {
    
    if (!message || !user) {
      Alert.alert("Erro", "Por favor, preencha seu nome e a mensagem.");
      return;
    }

    try {
      AXIOS.post('/sendMsg', {
          message: message,
          user: user,
        },
        {
          headers: {
            "X-Socket-ID": EchoService.socketId()
          }
        }
      )
      .then(() => {
        setMessages((prevMessages) => [...prevMessages, { text: message, sender: user, date: Date().toLocaleString() }])
      });
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert("Erro", error)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={[styles.container]}>
          <Text style={{ fontWeight: "bold", textTransform: "uppercase" }}>Chatzap</Text>
          <FlatList
            style={{ flex: 1 }}
            data={messages}
            renderItem={({ item }) => (
              <Text style={[
                styles.message,
                item.sender === user ? { backgroundColor: "#929292ff" } : { backgroundColor: "#ddd" }
              ]}>{item.sender}: {item.text} às {item.date}</Text>
            )}
            ListEmptyComponent={<Text>Nenhuma mensagem :(</Text>}
          />
          <View
            style={{
              gap: 6,
              padding: 6
            }}
          >
            <TextInput
            style={styles.input}
              placeholder='Digite seu nome'
              onChangeText={setUser}
            />
            <TextInput
            style={styles.input}
              placeholder='Digite uma mensagem'
              onChangeText={setMessage}
            />
            <TouchableOpacity
              onPress={() => sendMessage()}
              style={styles.button}
            >
                <Text style={{ textAlign: "center" }}>Enviar Mensagem</Text>
            </TouchableOpacity>
          </View>
          
        </View>
        </GestureHandlerRootView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 6,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f1f1ff',
  },
  button: {
    backgroundColor: "#ddd",
    padding: 8,
    borderRadius: 4,
    textAlign: "center",
  },
  input: {
    padding: 8,
  },
  message: {
    padding: 8,
    backgroundColor: "#ddd"
  }
});

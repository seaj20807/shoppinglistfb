import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Button,
} from "react-native";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  onValue,
  update,
  remove,
} from "firebase/database";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_TOKEN,
  authDomain: "shoppinglist-2fe5b.firebaseapp.com",
  databaseURL:
    "https://shoppinglist-2fe5b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shoppinglist-2fe5b",
  storageBucket: "shoppinglist-2fe5b.appspot.com",
  messagingSenderId: "834978338577",
  appId: "1:834978338577:web:7974fe42670ed2d6e69eb0",
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export default function App() {
  const [product, setProduct] = useState({
    id: "",
    title: "",
    amount: "",
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    onValue(ref(database, "/products"), (snapshot) => {
      const data = snapshot.val();
      data ? setProducts(Object.values(data)) : setProducts([]);
    });
  }, []);

  const addProduct = () => {
    let key = "";
    key = push(ref(database, "/products"), product).key;
    const updates = {};
    updates["/products/" + key + "/id"] = key;
    update(ref(database), updates);
    setProduct({});
  };

  const removeProduct = (key) => {
    remove(ref(database, "/products/" + key));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={product.title}
        onChangeText={(value) => setProduct({ ...product, title: value })}
        placeholder="Product"
      />
      <TextInput
        style={styles.input}
        value={product.amount}
        onChangeText={(value) => setProduct({ ...product, amount: value })}
        placeholder="Amount"
      />
      <Button title="Save" onPress={addProduct} />
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.listitems}>
            <Text>
              {item.title}, {item.amount}{" "}
            </Text>
            <Text
              style={{ color: "#ff0000" }}
              onPress={() => removeProduct(item.id)}
            >
              Collected
            </Text>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    borderColor: "grey",
    borderWidth: 1,
  },
  listitems: {
    flexDirection: "row",
  },
});

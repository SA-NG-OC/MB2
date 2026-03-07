import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

// --- 1. MÀN HÌNH LOGIN ---
function LoginScreen({ navigation }: any) {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.heading}>Login</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email/UserName</Text>
        <TextInput placeholder="test@gmail.com" style={styles.input} />

        <Text style={styles.label}>Password</Text>
        <TextInput
          secureTextEntry
          placeholder="password"
          style={styles.input}
        />

        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot password</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.buttonText}>SignIn</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={{ color: 'gray' }}>
          Don't have an account? <Text style={{ color: 'blue', fontWeight: 'bold' }}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// --- 2. MÀN HÌNH REGISTER (Code của bạn đã thêm navigation) ---
function RegisterScreen({ navigation }: any) {
  return (
    <ScrollView contentContainerStyle={styles.mainContainer}>
      <Text style={styles.heading}>Register</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput placeholder="John Doe" style={styles.input} />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="test@gmail.com"
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          secureTextEntry={true}
          placeholder="password"
          style={styles.input}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          secureTextEntry={true}
          placeholder="confirm password"
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Profile")}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={{ color: 'gray' }}>
          Already have an account? <Text style={{ color: 'blue', fontWeight: 'bold' }}>Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// --- 3. MÀN HÌNH PROFILE ---
function ProfileScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.profileContainer}>
      <Text style={styles.profileTitle}>Profile</Text>

      <View style={styles.profileGroup}>
        <Text style={styles.profileLabel}>Username</Text>
        <TextInput style={styles.profileInput} value="john_doe" />

        <Text style={styles.profileLabel}>Email</Text>
        <TextInput style={styles.profileInput} value="john@example.com" />

        <Text style={styles.profileLabel}>Phone</Text>
        <TextInput style={styles.profileInput} value="+1234567890" />

        <Text style={styles.profileLabel}>Date of Birth</Text>
        <TextInput style={styles.profileInput} value="1990-01-01" />

        <Text style={styles.profileLabel}>Address</Text>
        <TextInput
          style={styles.profileInput}
          value="123 Main St, City, Country"
        />

        <Text style={styles.profileLabel}>Description</Text>
        <TextInput
          style={styles.profileInput}
          value="A passionate developer and tech enthusiast."
          multiline
        />
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// --- MAIN APP ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- STYLES (Tổng hợp) ---
const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 30,
    backgroundColor: '#fff'
  },
  heading: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  formGroup: {
    width: "80%",
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: '500'
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    width: "100%",
  },
  forgotText: {
    alignSelf: "flex-end",
    color: "blue",
    marginBottom: 20
  },
  button: {
    backgroundColor: "pink",
    borderRadius: 10,
    height: 45,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  buttonText: {
    fontWeight: 'bold'
  },
  // Profile styles
  profileContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 60
  },
  profileTitle: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30
  },
  profileGroup: {
    marginBottom: 20
  },
  profileLabel: {
    marginBottom: 5,
    fontWeight: "500"
  },
  profileInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15
  },
  logoutButton: {
    backgroundColor: "#f47c4c",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 50
  },
  logoutText: {
    color: "white",
    fontWeight: "bold"
  }
});
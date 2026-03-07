import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function RegisterScreen() {
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

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 20 }}>
                <Text style={{ color: 'gray' }}>Already have an account? <Text style={{ color: 'blue' }}>Login</Text></Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flexGrow: 1,
        alignItems: "center",
        paddingTop: 50,
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
    }
});
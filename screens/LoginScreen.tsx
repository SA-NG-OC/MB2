import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function LoginScreen({ navigation }: any) {
    return (
        <View style={styles.mainContainer}>
            <Text style={styles.heading}>Login</Text>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Email/UserName</Text>
                <TextInput placeholder="test@gmail.com" style={styles.input} />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    secureTextEntry={true}
                    placeholder="password"
                    style={styles.input}
                />

                <TouchableOpacity>
                    <Text style={styles.forgotText}>Forgot password</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>SignIn</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
            >
                <Text style={{ color: "blue", marginTop: 15 }}>
                    Don't have an account? Register
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: "center",
        paddingTop: 50,
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
        alignSelf: 'flex-end',
        color: 'blue',
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
    }
});
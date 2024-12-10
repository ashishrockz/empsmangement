import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import {useAuth} from '../../hooks/Authentication';

const Login = () => {
  const [companyMail, setCompanyMail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {login} = useAuth();

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        'https://backend-api-social.vercel.app/api/emp/login',
        {
          companyMail,
          password,
        },
      );
      console.log('Signin successful:', response.data);
      login(response.data.token);
    } 
    catch (error) {
      // console.error('Login failed:', error);
      Alert.alert('Error', 'Invalid email or password. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>

        <ScrollView>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/empLogin.png')}
              style={styles.image}
            />
          </View>
          <View style={styles.loginContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Employee Login</Text>
            </View>
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mail:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your mail"
                  value={companyMail}
                  onChangeText={setCompanyMail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={'black'}

                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password:</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor={'black'}
                  />
                  <TouchableOpacity
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  >
                    <Image
                      style={styles.icon}
                      source={
                        passwordVisible
                          ? require('../../assets/Eye.png')
                          : require('../../assets/Eyeoff.png')
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightblue',
    height:'100%'
  },
  imageContainer: {
    alignItems: 'center',
    padding: 10,
    marginTop: 50,
  },
  image: {
    width: 250,
    height: 250,
  },
  loginContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingVertical: 30,
    height:'100%'
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  form: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    fontSize: 18,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  passwordInput: {
    flex: 1,
    fontSize: 18,
    color:'black'
  },
  icon: {
    width: 25,
    height: 25,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#3b56dc',
    alignItems: 'center',
    padding: 15,
    borderRadius: 25,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default Login;

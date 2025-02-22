import React, {useState, useEffect, useContext} from 'react';
import {
  KeyboardAvoidingView,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Eye from '../../../node_modules/react-native-vector-icons/Entypo';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/EvilIcons';
import styles from './style_login';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Context} from '../../context';
import Loading from '../../Components/Loading';
import {getToken, validateToken} from '../../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, SetPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntryIcon, setSecureTextEntryIcon] = useState(true);
  const [token, setToken] = useState();
  const {setSessionId} = useContext(Context);
  const [error, setError] = useState(false);
  const [errorUser, setErrorUser] = useState(false);

  useEffect(() => {
    const getResponseToken = async () => {
      const response = await getToken();
      setToken(response.data.request_token);
    };
    getResponseToken();
    checkLogin();
  }, []);

  const handleSignin = async () => {
    if (email && password !== '') {
      setLoading(true);
      const response = await validateToken(email, password, token);
      if (response) {
        const session_id = response.data.session_id;
        setSessionId(session_id);
        await AsyncStorage.setItem('sessionId', session_id);
        const id = await AsyncStorage.getItem('sessionId');
        navigation.reset({index: 0, routes: [{name: 'TabBottomRoutes'}]});
      } else {
        setTimeout(() => {
          setLoading(false);
          setErrorUser(true);
        }, 1000),
          setTimeout(() => {
            setErrorUser(false);
          }, 6000);
      }
    } else {
      console.log('error');

      setTimeout(() => {
        setError(false);
      }, 2000),
        setError(true);
    }
  };

  const checkLogin = async () => {
    const userStorage = await AsyncStorage.getItem('sessionId');
    if (userStorage) {
      navigation.reset({index: 0, routes: [{name: 'TabBottomRoutes'}]});

      setSessionId(userStorage);
    }
  };

  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Image
        source={require('../../assets/login_imagens/bannerLogin.png')}
        style={styles.banner}
      />

      <Animatable.Image
        animation="zoomInUp"
        duration={1000}
        source={require('../../assets/login_imagens/logo.png')}
        style={styles.logo}
      />

      <View style={styles.textContainer}>
        <Animatable.Text
          animation="fadeInUp"
          duration={1000}
          style={[styles.text, styles.loginText]}>
          Login
        </Animatable.Text>
        <Animatable.Text
          animation="fadeInUp"
          duration={1000}
          style={[styles.text, styles.descriptionText]}>
          Entre na sua conta para continuar.
        </Animatable.Text>

        <View style={styles.ViewInput}>
          <Animatable.View
            animation="fadeInLeft"
            duration={1000}
            style={styles.inputView}>
            <Icon
              size={25}
              color={'#ffffff80'}
              style={{paddingTop: 10, paddingLeft: 10}}
              name="user"
            />
            <TextInput
              style={styles.inputText}
              placeholder="usuário"
              autoCorrect={false}
              placeholderTextColor={error ? '#EC2626' : '#ffffff80'}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
            />
          </Animatable.View>

          <Animatable.View
            animation="fadeInRight"
            duration={1000}
            style={styles.inputView}>
            <Icon
              size={30}
              color={'#ffffff80'}
              style={{paddingTop: 10, paddingLeft: 10}}
              name="lock"
            />
            <TextInput
              style={styles.inputText}
              placeholder="senha"
              autoCorrect={false}
              value={secureTextEntryIcon}
              secureTextEntry={secureTextEntryIcon}
              placeholderTextColor={error ? '#EC2626' : '#ffffff80'}
              autoCapitalize="none"
              onChangeText={value => SetPassword(value)}
            />

            <View style={{position: 'absolute', marginLeft: 230, marginTop: 8}}>
              <TouchableOpacity
                onPress={() => setSecureTextEntryIcon(!secureTextEntryIcon)}>
                {secureTextEntryIcon == true ? (
                  <Eye name="eye-with-line" color={'#ffffff80'} size={23} />
                ) : (
                  <Eye name="eye" color={'#ffffff80'} size={23} />
                )}
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>

        {error ? (
          <Text style={{color: '#EC2626', left: 80}}>
            Preencha todos os campos
          </Text>
        ) : null}
        {errorUser ? (
          <Text style={{color: '#EC2626', left: 80}}>
            Usuário ou senha inválidos
          </Text>
        ) : null}

        <TouchableOpacity
          disabled={loading}
          style={styles.button}
          onPress={handleSignin}>
          {loading ? (
            <ActivityIndicator color={'white'} />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

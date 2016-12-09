import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { connect } from 'dva/mobile';
import { Button, WingBlank, ActivityIndicator, InputItem, List, WhiteSpace } from 'antd-mobile';

const Item = List.Item;
const LoginForm = ({ dispatch, loginLoading, error, email, password, autoLogin }) => {
  const styles = {
    errorTextStyle: {
      fontSize: 20,
      alignSelf: 'center',
      color: 'red'
    },
  };

  return (
    <View>
      {
      autoLogin ?
        <View>
          <WhiteSpace />
          <ActivityIndicator text="Auto Login" />
          <WhiteSpace />
        </View>
        :
         <List>
          <InputItem
            clear
            value={email}
            onChange={(value) => dispatch({ type: 'auth/userEmail', payload: value })}
            placeholder="email@gmail.com"
            labelNumber={7}
          >Email
          </InputItem>
          <InputItem
            clear
            value={password}
            type="password"
            onChange={(value) => dispatch({ type: 'auth/userPassword', payload: value })}
            placeholder="********"
            labelNumber={7}
          >Password
          </InputItem>
          <Text style={styles.errorTextStyle}>
            {error}
          </Text>
          <WhiteSpace />
            {loginLoading ?
              <WingBlank>
                <ActivityIndicator text="Logining" />
              </WingBlank>
              :
              <WingBlank>
                <Button
                  onClick={() => dispatch({ type: 'auth/loginUser' })}
                  type="primary">
                    Login
                </Button>
              </WingBlank>
            }
          <WhiteSpace />
        </List>
      }
    </View>
  );
};

const mapStateToProps = ({ auth }) => {
  const { loginLoading, error, email, password, autoLogin } = auth;
  return {
    loginLoading,
    error,
    email,
    password,
    autoLogin,
  };
}

export default connect(mapStateToProps)(LoginForm);

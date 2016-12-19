import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import { WingBlank } from 'antd-mobile';

class Circle extends Component {
  render() {
    const color = this.props.color || '#000000';
    const size = 20;

    return (
      <View
        style={{
          borderRadius: size / 2,
          backgroundColor: color,
          width: size,
          height: size,
          margin: 1,
        }}
      />
    );
  }
};

export default Circle;

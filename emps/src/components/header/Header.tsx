import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

interface HeaderProps {
  logout: () => void;
}
const Header :React.FC<HeaderProps> = ({logout}) => {
  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection:'row',
          backgroundColor: '#fff',
          height:60,
          elevation: 20,
          alignItems:'center',
          justifyContent:'space-evenly',
        }}>
        <TouchableOpacity>
          <Image
            style={{width: 30, height: 30}}
            source={require('../../assets/Menu.png')}
          />
        </TouchableOpacity>
        <View>
          <Text>Admin</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({});

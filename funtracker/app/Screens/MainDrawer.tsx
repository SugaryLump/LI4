import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { EstabelecimentoMenu } from './Estabelecimento';

const Drawer = createDrawerNavigator();

export default function MainDrawerNavigator() {
  return (
    <Drawer.Navigator>
        <Drawer.Screen
            name="Estabelecimentos"
            component={EstabelecimentoMenu}
            initialParams={{
              bar:false,
              disco:false,
              aberto:false,
              ordem:0,
              nome:null,
              searched:false,
            }}
        />
    </Drawer.Navigator>
  );
}
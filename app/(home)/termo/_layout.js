import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../index'
import TermoListScreen from '../termo/index'
import TermoCreateScreen from '../termo/create/index'
import TermoScreen from '../termo/[id]/index'

const Stack = createNativeStackNavigator()

export default function Layout() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TermoList"
        component={TermoListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TermoCreate"
        component={TermoCreateScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Termo"
        component={TermoScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

import { useAuth, useUser } from '@clerk/clerk-expo'
import { ActivityIndicator, Text, View } from 'react-native'
import Button from '../../components/button'

export default function User() {
  const { user } = useUser()
  const { signOut } = useAuth()

  if (!user) {
    return (
      <ActivityIndicator className="flex-1 justify-center items-center text-black" />
    )
  }

  return (
    <View className="flex-1 p-4 justify-center items-center gap-4">
      <Text>Olá, {user?.fullName}</Text>
      <Button icon="exit" title="Sair" onPress={() => signOut()} />
    </View>
  )
}

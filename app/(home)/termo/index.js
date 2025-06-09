import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useUser } from '@clerk/clerk-expo'
import Button from '../../../components/button'
import ListData from '../../../components/listData'

export default function TermoList() {
  const [activeTab, setActiveTab] = useState('public')
  const navigation = useNavigation()
  const { user } = useUser()

  const userId = user?.id || null

  const URL = process.env.EXPO_PUBLIC_URL_API
  const LIMIT = 15

  return (
    <View className="flex-1 p-4 pt-16">
      <View className="flex-row justify-around">
        <TouchableOpacity onPress={() => setActiveTab('user')}>
          <Text
            className={`pb-2 ${
              activeTab === 'user'
                ? 'text-black border-b-2 border-black font-bold'
                : 'text-gray-500'
            }`}
          >
            Meus Jogos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('public')}>
          <Text
            className={`pb-2 ${
              activeTab === 'public'
                ? 'text-black border-b-2 border-black font-bold'
                : 'text-gray-500'
            }`}
          >
            Publicos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('private')}>
          <Text
            className={`pb-2 ${
              activeTab === 'private'
                ? 'text-black border-b-2 border-black font-bold'
                : 'text-gray-500'
            }`}
          >
            Privados
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center items-center py-4">
        {activeTab === 'user' && (
          <ListData
            url={`${URL}/termo/page/${userId}?`}
            limit={LIMIT}
            userId={userId}
          />
        )}

        {activeTab === 'public' && (
          <ListData
            url={`${URL}/termo/page?isPublic=true&userId=${userId}&`}
            limit={LIMIT}
          />
        )}

        {activeTab === 'private' && (
          <ListData
            url={`${URL}/termo/page?isPublic=false&userId=${userId}&`}
            limit={LIMIT}
          />
        )}
      </View>

      <Button
        icon="add-circle"
        title="Criar novo jogo"
        onPress={() => navigation.navigate('TermoCreate')}
      />
    </View>
  )
}

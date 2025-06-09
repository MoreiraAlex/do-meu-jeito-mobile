import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native'
import usePagination from '../hooks/usePaginationn'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import Modal from 'react-native-modal'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '@clerk/clerk-expo'

export default function ListData({ url, limit, userId, method }) {
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [gameId, setGameId] = useState('')
  const [loadingItemId, setLoadingItemId] = useState(null)
  const [loadingPrivateGame, setLoadingPrivateGame] = useState(false)

  const navigation = useNavigation()
  const { getToken } = useAuth()

  const { data, isLoading, isRefreshing, loadMore, refresh } = usePagination(
    url,
    limit,
    method,
  )

  const RenderData = ({ item }) => {
    return (
      <TouchableOpacity
        className="w-full flex-row justify-between items-center border rounded-md p-2 my-1"
        onPress={() => {
          setLoadingItemId(item.gameId)
          requestAnimationFrame(() => {
            if (item.isPublic) {
              navigation.navigate('Termo', { id: item.gameId })
              setLoadingItemId(null)
            } else {
              setGameId(item.gameId)
              setShowModal(true)
              setLoadingItemId(null)
            }
          })
        }}
      >
        {loadingItemId === item.gameId ? (
          <ActivityIndicator className="flex-1 text-black" />
        ) : (
          <>
            <Text>#{item.gameId}</Text>
            <Text>
              {item.theme.length > 15
                ? item.theme.substring(0, 15)
                : item.theme}
            </Text>
            <View className="flex flex-row gap-2">
              {item.userId === userId && (
                <>
                  {!item.isPublic && (
                    <Ionicons
                      className="text-md"
                      name="lock-closed"
                      size={20}
                    />
                  )}
                  {/* <TouchableOpacity
                    onPress={() => {
                      setLoadingItemId(item.gameId)
                      requestAnimationFrame(() => {
                        setLoadingItemId(null)
                        navigation.navigate('TermoCreate', { id: item.gameId })
                      })
                    }}
                  >
                    <Ionicons className="text-md" name="create" size={20} />
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    onPress={() => {
                      setGameId(item.gameId)
                      setShowDeleteModal(true)
                    }}
                  >
                    <Ionicons
                      className="text-md"
                      name="trash"
                      color="red"
                      size={20}
                    />
                  </TouchableOpacity>
                </>
              )}
              <Ionicons
                className="text-md"
                name={item.completed ? 'checkbox' : 'checkbox-outline'}
                color="black"
                size={20}
              />
            </View>
          </>
        )}
      </TouchableOpacity>
    )
  }

  const PrivateModal = ({ id, visible, onClose, onSubmit }) => {
    const [password, setPassword] = useState(0)

    return (
      <Modal
        isVisible={visible}
        onBackdropPress={onClose}
        backdropOpacity={0.5}
      >
        <View className="bg-white rounded-md p-6 items-center justify-center gap-4">
          <Text className="text-center">Jogo #{id}</Text>
          <TextInput
            className="border w-full rounded-md"
            placeholder="Insira a senha..."
            keyboardType="numeric"
            secureTextEntry
            onChangeText={setPassword}
          />
          <View className="flex flex-row gap-4 justify-center w-full">
            <TouchableOpacity
              className="bg-black p-3 rounded-md"
              onPress={onClose}
              disabled={loadingPrivateGame}
            >
              <Text className="text-white text-center">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-black p-3 rounded-md"
              onPress={() => onSubmit(password)}
              disabled={loadingPrivateGame}
            >
              {loadingPrivateGame ? (
                <ActivityIndicator className="flex-1 text-white" />
              ) : (
                <Text className="text-white text-center">Entrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  const DeleteModal = ({ id, visible, onClose, onSubmit }) => {
    return (
      <Modal
        isVisible={visible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onBackdropPress={onClose}
        backdropOpacity={0.5}
      >
        <View className="bg-white rounded-md p-6 items-center justify-center gap-4">
          <Text className="text-center">Deseja deletar o Jogo #{id}?</Text>

          <View className="flex flex-row gap-4 justify-center w-full">
            <TouchableOpacity
              className="bg-black p-3 rounded-md"
              onPress={onClose}
              disabled={loadingPrivateGame}
            >
              <Text className="text-white text-center">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-red-600 p-3 rounded-md"
              onPress={onSubmit}
              disabled={loadingPrivateGame}
            >
              {loadingPrivateGame ? (
                <ActivityIndicator className="flex-1 text-white" />
              ) : (
                <Text className="text-white text-center">Deletar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  const privateGame = async (password) => {
    setLoadingPrivateGame(true)
    const token = await getToken()

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_URL_API}/termo/check-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ gameId, password }),
        },
      )

      if (!res.ok) {
        Alert.alert('Senha incorreta')
        setLoadingPrivateGame(false)
        setShowModal(false)
        return
      }

      requestAnimationFrame(() => {
        setShowModal(false)
        setLoadingPrivateGame(false)
        navigation.navigate('Termo', { id: gameId })
      })
    } catch (err) {
      Alert.alert('Erro ao validar senha')
    }
  }

  const deletePrivateGame = async () => {
    setLoadingPrivateGame(true)
    const token = await getToken()

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_URL_API}/termo/${gameId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!res.ok) {
        Alert.alert('Erro ao deletar jogo')
        setLoadingPrivateGame(false)
        setShowDeleteModal(false)
        return
      }

      refresh()
      setShowDeleteModal(false)
      setLoadingPrivateGame(false)
    } catch (err) {
      Alert.alert('Erro ao deletar jogo')
    }
  }

  return (
    <>
      <PrivateModal
        id={gameId}
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(password) => {
          privateGame(password)
        }}
      />

      <DeleteModal
        id={gameId}
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSubmit={() => deletePrivateGame()}
      />

      <FlatList
        style={{ flex: 1 }}
        data={data}
        keyExtractor={(item) => item?._id?.toString()}
        renderItem={({ item }) => <RenderData item={item} />}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() =>
          isLoading ? (
            <ActivityIndicator animating size="large" color="black" />
          ) : null
        }
      />
    </>
  )
}

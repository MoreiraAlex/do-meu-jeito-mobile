import Modal from 'react-native-modal'
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo'
import Keyboard from '../../../../components/keyboard'
import { useNavigation, useRoute } from '@react-navigation/native'
import LetterRow from '../../../../components/letterRow'

export default function Termo() {
  const [theme, setTheme] = useState('')
  const [word, setWord] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [attempts, setAttempts] = useState([])
  const [isModalVisible, setModalVisible] = useState(false)

  const navigation = useNavigation()

  const route = useRoute()
  const id = route.params?.id

  const { getToken } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken()

      if (id) {
        try {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_URL_API}/termo/${id}?userId=${user?.id}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          const res = await response.json()

          if (!res) {
            return Alert.alert('Erro ao carregar os dados!')
          }

          setTheme(res.theme)
          setWord(res.word)

          const currentAttemptIndex = res.lastAttempts.findIndex(
            (a) => a.trim() === '',
          )
          setAttempt(
            currentAttemptIndex === -1
              ? res.lastAttempts.length
              : currentAttemptIndex,
          )

          if (res.lastAttempts.length > 0) {
            setAttempts([...res.lastAttempts])
          } else {
            setAttempts(Array.from(Array(parseInt(res.attempts))).fill(''))
          }

          const allAttemptsUsed =
            res.lastAttempts.length > 0 &&
            res.lastAttempts.every((a) => a.trim() !== '')

          if (res.completed || allAttemptsUsed) {
            setModalVisible(true)
          }
        } catch (error) {
          Alert.alert('Erro ao carregar os dados!')
        }
      }
    }

    fetchData()
  }, [id])

  const updateUserGame = async (attempts, completed) => {
    try {
      const token = await getToken()
      const game = {
        attempts,
        completed,
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_URL_API}/userGame/${id}?userId=${user?.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(game),
        },
      )

      if (!response.ok) {
        return Alert.alert('Erro ao atualizar o jogo!')
      }
    } catch (error) {
      Alert.alert('Erro ao atualizar o jogo!')
    }
  }

  function pressLetter(letter) {
    setAttempts((prev) => {
      const updated = [...prev]
      if (updated[attempt].length < word.length) {
        updated[attempt] += letter
      }
      return updated
    })
  }

  function cleanLetter() {
    setAttempts((prev) => {
      const updated = [...prev]
      if (updated[attempt].length) {
        const word = updated[attempt]
        updated[attempt] = word.slice(0, -1)
      }
      return updated
    })
  }

  function tryGuess() {
    const guess = attempts[attempt]

    if (guess?.length < word.length) return
    const isCorrect = guess.toUpperCase() === word.toUpperCase()
    const isLastAttempt = attempt + 1 === attempts.length

    setAttempt(attempt + 1)
    updateUserGame(attempts, isCorrect)

    if (isCorrect) {
      setModalVisible(true)
    } else if (isLastAttempt) {
      setModalVisible(true)
    }
  }

  const screenWidth = Dimensions.get('window').width
  const paddingHorizontal = 64
  const lettersPerWord = word.length

  const squareSize = Math.min(
    (screenWidth - paddingHorizontal) / lettersPerWord,
    64,
  )

  if (word === '') {
    return <ActivityIndicator className="flex-1 text-black" />
  }

  return (
    <>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => {}}
        onBackButtonPress={() => {}}
        backdropOpacity={0.7}
      >
        <View className="bg-white p-6 rounded-lg items-center">
          <Text className="text-2xl font-bold mb-4">Fim de jogo!</Text>
          <Text className="text-lg mb-4">
            Parabens! Foram {attempt} tentativas
          </Text>
          <Text className="text-lg mb-4">
            A palavra era:{' '}
            <Text className="font-bold">{word.toUpperCase()}</Text>
          </Text>
          <TouchableOpacity
            className="bg-black p-3 rounded-md"
            onPress={() => {
              setModalVisible(false)
              navigation.navigate('TermoList')
            }}
          >
            <Text className="text-white text-center">Voltar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <SafeAreaView className="flex-1 items-center p-4">
        <Text className="text-2xl font-bold mb-8">Tema - {theme}</Text>

        <ScrollView>
          <View className="gap-2 px-4">
            {attempts.map((guess, idx) => (
              <LetterRow
                key={idx}
                letters={Array.from(word)}
                guess={guess}
                squareSize={squareSize}
                shouldAnimate={idx === attempt - 1} // só o palpite anterior anima
                word={word}
              />
            ))}
          </View>
        </ScrollView>

        <View className="p-6 flex gap-2">
          <Keyboard
            letters={['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']}
            onPressKey={(letter) => pressLetter(letter)}
          />
          <View className="flex-row justify-center gap-1">
            <Keyboard
              letters={['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']}
              onPressKey={(letter) => pressLetter(letter)}
            />
            <TouchableOpacity
              className="bg-neutral-800 px-3 py-3 rounded-md ml-2"
              onPress={cleanLetter}
            >
              <Text className="text-white font-bold">
                <Ionicons name="backspace-outline" size={20} />
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center gap-1">
            <Keyboard
              letters={['Z', 'X', 'C', 'V', 'B', 'N', 'M']}
              onPressKey={(letter) => pressLetter(letter)}
            />
            <TouchableOpacity
              className="bg-neutral-800 px-3 py-3 rounded-md ml-2"
              onPress={tryGuess}
            >
              <Text className="text-white font-bold">ENTER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}

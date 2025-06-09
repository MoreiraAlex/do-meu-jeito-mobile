import { Text, TextInput, View, Switch, ScrollView, Alert } from 'react-native'
import Button from '../../../../components/button'
import { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { useNavigation, useRoute } from '@react-navigation/native'

export default function TermoCreate() {
  const [isChecked, setIsChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState('')
  const [word, setWord] = useState('')
  const [password, setPassword] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const { user } = useUser()
  const navigation = useNavigation()
  const { getToken } = useAuth()

  const route = useRoute()
  const id = route.params?.id

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_URL_API}/termo/${id}`,
          )
          const result = await response.json()

          if (!result) {
            return Alert.alert('Erro ao carregar os dados!')
          }

          setTheme(result.theme)
          setWord(result.word)
          setAttempts(result.attempts)
          setIsChecked(!result.isPublic)
          setPassword(result.password)
        } catch (error) {
          Alert.alert('Erro ao carregar os dados!')
        }
      }
    }

    fetchData()
  }, [id])

  const handleAttemptsChange = (numeric) => {
    const number = parseInt(numeric, 10)

    if (!numeric) {
      setAttempts('')
      return
    }

    if (number >= 1 && number <= 10) {
      setAttempts(numeric)
    }
  }

  const saveGame = async () => {
    setIsLoading(true)

    if (!theme || !word || (isChecked && !password)) {
      setIsLoading(false)
      return Alert.alert('Preencha todos os campos obrigatórios')
    }

    const game = {
      theme,
      userId: user?.id || null,
      isPublic: !isChecked,
      word,
      attempts: attempts || 5,
      password,
    }

    const token = await getToken()

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_URL_API}/termo${id ? `/${id}` : ''}`,
        {
          method: `${id ? 'PUT' : 'POST'}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(game),
        },
      )

      setIsLoading(false)

      if (!res.ok) {
        Alert.alert('Erro ao criar jogo')
        return
      }

      navigation.navigate('TermoList')
    } catch (err) {
      Alert.alert('Erro ao criar jogo')
    }
  }

  return (
    <ScrollView>
      <View className="p-6 pt-24 gap-4 w-full h-full flex justify-between">
        <View className="gap-4">
          <View className="gap-2">
            <Text className="text-base font-medium text-gray-700">
              Tema<Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={theme}
              className="border border-gray-300 rounded-md px-4 py-2"
              placeholder="Digite o tema"
              onChangeText={setTheme}
            />
          </View>

          <View className="gap-2">
            <Text className="text-base font-medium text-gray-700">
              Palavra<Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={word}
              className="border border-gray-300 rounded-md px-4 py-2"
              placeholder="Digite a palavra chave"
              onChangeText={setWord}
            />
          </View>

          <View className="gap-2">
            <Text className="text-base font-medium text-gray-700">
              Tentativas
            </Text>
            <TextInput
              value={attempts}
              className="border border-gray-300 rounded-md px-4 py-2"
              placeholder="Digite o número de tentativas"
              onChangeText={handleAttemptsChange}
              keyboardType="numeric"
            />
          </View>

          <View className="items-start">
            <Text className="text-base font-medium text-gray-700">Privado</Text>
            <Switch
              value={isChecked}
              onValueChange={(value) => setIsChecked(value)}
              trackColor={{ false: '#ccc', true: 'black' }}
              thumbColor={isChecked ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor="#ccc"
            />
          </View>

          {isChecked && (
            <View className="gap-2">
              <Text className="text-base font-medium text-gray-700">
                Senha<Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                editable={!id}
                value={password}
                className="border border-gray-300 rounded-md px-4 py-2"
                placeholder="Digite a senha"
                keyboardType="numeric"
                secureTextEntry
                onChangeText={setPassword}
              />
            </View>
          )}
        </View>

        <Button
          title={`${id ? 'Salvar' : 'Criar'}`}
          onPress={saveGame}
          isLoading={isLoading}
        />
      </View>
    </ScrollView>
  )
}

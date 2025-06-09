import * as WebBrowser from 'expo-web-browser'
import * as Liking from 'expo-linking'
import Button from '../../components/button'
import { Image, View } from 'react-native'
import { useEffect, useState } from 'react'
import { useSSO } from '@clerk/clerk-expo'

const useWarmUpBrowser = () => {
  useEffect(() => {
    WebBrowser.warmUpAsync()
    return () => {
      WebBrowser.coolDownAsync()
    }
  }, [])
}
WebBrowser.maybeCompleteAuthSession()

export default function SignIn() {
  useWarmUpBrowser()

  const { startSSOFlow } = useSSO()
  const [isLoading, setIsLoading] = useState(false)

  async function onGoogleSignIn() {
    try {
      setIsLoading(true)

      const redirectUrl = Liking.createURL('/(home)')
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      })

      if (createdSessionId) {
        setActive?.({ session: createdSessionId })
      } else {
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Erro no login com Google:', err)
      setIsLoading(false)
    }
  }

  return (
    <View className="flex-1 p-6 justify-center">
      <View className="w-full h-80 rounded-xl overflow-hidden relative items-center justify-end">
        <Image
          source={require('../../assets/DMJLogo.jpeg')}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          resizeMode="contain"
          alt="Jogo"
        />
      </View>
      <Button
        icon="logo-google"
        title="Entrar com Google"
        isLoading={isLoading}
        onPress={onGoogleSignIn}
      />
    </View>
  )
}

import '../global.css'
import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { router, Slot } from 'expo-router'
import { ActivityIndicator, StatusBar } from 'react-native'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { useEffect } from 'react'
// import * as NavigationBar from 'expo-navigation-bar'

// const AndroidSoftwareNavHidden = async () => {
//   await NavigationBar.setVisibilityAsync('hidden')
//   await NavigationBar.setPositionAsync('absolute')
//   await NavigationBar.setBehaviorAsync('overlay-swipe')
// }

function InitialLayout() {
  const { isSignedIn, isLoaded } = useAuth()

  useEffect(() => {
    // if (Platform.OS === 'android') {
    //   AndroidSoftwareNavHidden()
    // }

    if (!isLoaded) return

    if (isSignedIn) {
      router.replace('/(home)')
    } else {
      router.replace('/(auth)')
    }
  }, [isSignedIn, isLoaded])

  return isLoaded ? (
    <Slot />
  ) : (
    <ActivityIndicator className="flex-1 justify-center items-center text-black" />
  )
}

export default function RootLayout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <StatusBar animated={true} barStyle="default" translucent={true} />
      <InitialLayout />
    </ClerkProvider>
  )
}

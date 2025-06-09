import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

const Key = React.memo(({ letter, onPress }) => (
  <TouchableOpacity
    className="bg-neutral-800 px-3 py-3 rounded-md"
    onPress={() => onPress(letter)}
  >
    <Text className="text-white font-bold text-center">{letter}</Text>
  </TouchableOpacity>
))
Key.displayName = 'Key'

export default function Keyboard({ letters, onPressKey }) {
  return (
    <View className="flex-row justify-center gap-1">
      {letters.map((letter) => (
        <Key key={letter} letter={letter} onPress={() => onPressKey(letter)} />
      ))}
    </View>
  )
}

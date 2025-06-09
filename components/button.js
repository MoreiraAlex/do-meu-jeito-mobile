import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { Ionicons } from '@expo/vector-icons'

export default function Button({
  title,
  isLoading = false,
  icon,
  className,
  ...rest
}) {
  return (
    <TouchableOpacity
      className={twMerge(
        'w-full flex flex-row items-center justify-center gap-2 bg-black p-3 rounded-md',
        className,
      )}
      disabled={isLoading}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          <Ionicons className="text-md" name={icon} color="white" />
          <Text className="text-white text-md">{title}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}

import { useEffect } from 'react'
import { Text, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated'

export default function LetterRow({
  letters,
  guess,
  squareSize,
  word,
  shouldAnimate,
}) {
  function getLetterColors(word, result) {
    const colors = Array(result.length).fill('#312A2C')
    const resultArr = result.toUpperCase().split('')
    const wordArr = word?.toUpperCase().split('') || []
    const letterCount = {}

    for (const letter of wordArr) {
      letterCount[letter] = (letterCount[letter] || 0) + 1
    }

    for (let i = 0; i < resultArr.length; i++) {
      if (wordArr[i] === resultArr[i]) {
        colors[i] = '#3AA394'
        letterCount[wordArr[i]] -= 1
      }
    }

    for (let i = 0; i < resultArr.length; i++) {
      if (
        colors[i] === '#312A2C' &&
        letterCount[resultArr[i]] > 0 &&
        wordArr.includes(resultArr[i])
      ) {
        colors[i] = '#D3AD69'
        letterCount[resultArr[i]] -= 1
      }
    }

    return colors
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const rotations = letters.map(() => useSharedValue(0))
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const bgColors = letters.map(() => useSharedValue(0)) // 0 = base, 1 = correto, 2 = quase

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const colorMap = {
    '#312A2C': 0,
    '#3AA394': 1,
    '#D3AD69': 2,
  }

  const styleBoxes = letters.map((_, i) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAnimatedStyle(() => ({
      transform: [{ rotate: `${rotations[i].value}deg` }],
      backgroundColor: interpolateColor(
        bgColors[i].value,
        [0, 1, 2],
        ['#312A2C', '#3AA394', '#D3AD69'],
      ),
    })),
  )

  useEffect(() => {
    if (guess.length && shouldAnimate) {
      const colors = getLetterColors(word, guess)
      guess.split('').forEach((_, i) => {
        rotations[i].value = withDelay(
          i * 200,
          withTiming(360, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
          }),
        )
        bgColors[i].value = withDelay(
          i * 200 + 200, // um pouco depois da rotação
          withTiming(colorMap[colors[i]], {
            duration: 500,
            easing: Easing.linear,
          }),
        )
      })
    }
  }, [bgColors, colorMap, guess, rotations, shouldAnimate, word])

  return (
    <View className="w-full flex-row justify-around">
      {letters.map((_, i) => (
        <Animated.View
          key={i}
          style={[styleBoxes[i], { width: squareSize, height: squareSize }]}
          className="rounded-md items-center justify-center border-4"
        >
          <Text
            style={{ fontSize: squareSize * 0.5 }}
            className="text-white font-bold"
          >
            {guess[i]?.toUpperCase() || ''}
          </Text>
        </Animated.View>
      ))}
    </View>
  )
}

import { useNavigation } from '@react-navigation/native'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

export default function Home() {
  const navigation = useNavigation()

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 items-center justify-start pt-24 px-4 gap-16 bg-white">
        <Text className="text-5xl font-bold text-center">Nossos jogos</Text>

        <View className="w-full max-w-2xl flex-row flex-wrap justify-center gap-x-8 gap-y-12">
          {[
            {
              name: 'Termo',
              image: require('../../assets/termo.jpeg'),
              goTo: 'TermoList',
            },
            {
              name: 'Palavra Cruzada',
              image: require('../../assets/palavraCruzada.jpeg'),
            },
            {
              name: 'Caça Palavra',
              image: require('../../assets/cacaPalavra.jpeg'),
            },
            { name: 'Mais jogos', image: require('../../assets/DMJLogo.jpeg') },
          ].map((game, idx) => (
            <TouchableOpacity
              key={idx}
              className="w-40 h-40 rounded-xl overflow-hidden relative items-center justify-end"
              onPress={() => game.goTo && navigation.navigate(game.goTo)}
            >
              <Image
                source={game.image}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                resizeMode="contain"
                alt="Jogo"
              />
              <View className="w-full bg-black/60 py-1">
                <Text className="text-center text-white font-bold">
                  {game.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

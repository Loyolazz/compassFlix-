import React from 'react';
import {View, Text, FlatList} from 'react-native';

import {CardMovies} from './components/cardMovies';
import moviesList from './data/movies';

import styles from './styles';

export function SelectionMovies() {
  return (
    <View>
      <View style={styles.section}>
        <View style={styles.header}>
          <View style={styles.containerRow}>
            <Text style={styles.title}>Ola,</Text>
            <Text style={styles.label}>Jonh</Text>
            <Text style={styles.title}>!</Text>
          </View>
          <Text style={styles.description}>
            Reveja ou acompanhe os filmes que você assistiu...
          </Text>

          <Text style={styles.popularMovies}>Filmes populares esse mês</Text>
        </View>

        <View>
          <FlatList
            data={moviesList}
            keyExtractor={item => String(item.id)}
            numColumns={4}
            renderItem={({item}) => (
              <CardMovies text="9.8/10" source={item.image} />
            )}
          />
        </View>
      </View>
    </View>
  );
}

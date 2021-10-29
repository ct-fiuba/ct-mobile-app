import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, Image } from 'react-native';

import styles from './styles';

import healthy from '../../../assets/healthy.png';
import logout from '../../../assets/logout.png';
import scan from '../../../assets/scan.png';
import pandemic from '../../../assets/pandemic.png';

const ICONS = {
  healthy,
  logout,
  scan,
  pandemic,
};

export default function ActionableCard({
  onPress,
  title,
  icon,
  main,
  loading,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.common, main ? styles.mainContainer : null]}
    >
      {!loading && (
        <Image source={ICONS[icon]} style={{ width: 30, height: 30 }} />
      )}

      <Text style={[styles.title, main ? styles.mainTitle : null]}>
        {loading ? (
          <ActivityIndicator
            style={styles.loader}
            size="small"
            color="#0000ff"
          />
        ) : (
          title
        )}
      </Text>
    </TouchableOpacity>
  );
}

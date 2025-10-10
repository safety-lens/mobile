import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Typography } from '../Typography';
import CustomButton from '../CustomButton/button';

type Props = {
  text: string;
  description?: string;
  buttonTitle?: string;
  onPress?: () => void;
};

const Placeholder = ({ text, description, buttonTitle, onPress }: Props) => {
  return (
    <View style={styles.container}>
      <Typography preset="title" center>
        {text}
      </Typography>
      {description ? <Typography center>{description}</Typography> : null}
      {onPress ? <CustomButton title={buttonTitle} onPress={onPress} /> : null}
    </View>
  );
};

export default Placeholder;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
});

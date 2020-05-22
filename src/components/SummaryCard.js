import React from 'react';
import {
  StyleSheet, Text, Dimensions,
} from 'react-native';
import { Card } from '@ui-kitten/components';
import { color } from '../config';


const { width, height } = Dimensions.get('window');

const SummaryCard = ({
  number, title, description, totalRoom, containerStyle,
}) => (
  <Card style={styles.summary}>
    {totalRoom
      ? (
        <Text style={styles.summaryNumber}>
          {number}
          <Text style={styles.subText}>
            {' '}
            /
            {totalRoom}
          </Text>
        </Text>
      )
      : (<Text style={styles.summaryNumber}>{number}</Text>)}
    <Text style={styles.summaryLabel}>{title}</Text>
    <Text style={styles.summaryDes}>{description}</Text>
  </Card>
);

const styles = StyleSheet.create({
  summary: {
    flexGrow: 1,
    width: (width / 2) - 10,
    margin: 1,
  },
  summaryNumber: {
    fontSize: 34,
    fontWeight: 'bold',
    color: color.primary,
    marginBottom: 5,
    textAlign: 'center',
  },
  summaryLabel: {
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  summaryDes: {
    color: '#808080',
    textAlign: 'center',
  },
  subText: {
    color: '#B7B7B7',
    fontSize: 17,
  },
});

export default SummaryCard;

import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface ProgressBarProps {
  percent: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  showText = true,
  size = 'md',
  color = 'primary'
}) => {
  const safePercent = Math.min(100, Math.max(0, percent));

  return (
    <View className={classnames(styles.progressBar, styles[size])}>
      <View className={classnames(styles.track, styles[`track-${size}`])}>
        <View
          className={classnames(styles.fill, styles[color], styles[`fill-${size}`])}
          style={{ width: `${safePercent}%` }}
        />
      </View>
      {showText && (
        <Text className={classnames(styles.percentText, styles[color])}>
          {safePercent}%
        </Text>
      )}
    </View>
  );
};

export default ProgressBar;

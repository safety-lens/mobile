import { Platform, StyleSheet, Text } from 'react-native';
import React from 'react';
import Markdown, { RenderRules } from 'react-native-markdown-display';
import * as Linking from 'expo-linking';

interface IMessage {
  text: string;
  customExpand?: string;
  appendEllipsis?: boolean;
  onChange?: () => void;
}

export default function MessageMarkdown({
  text,
  customExpand,
  appendEllipsis,
  onChange,
}: IMessage) {
  const isAndroid = Platform.OS === 'android';
  const customRules: RenderRules = {
    link: (node, children) => {
      const href = node.attributes.href;

      if (href && href.startsWith('action:')) {
        const action = href.replace('action:', '');
        return (
          <Text onPress={() => action === 'click' && onChange && onChange()}>
            {children[0]}
          </Text>
        );
      }
      return <Text onPress={() => Linking.openURL(href)}>{children[0] as string}</Text>;
    },
  };

  const customContent = customExpand
    ? `${appendEllipsis ? '...' : ''} [${customExpand}](action:click)`
    : '';

  return (
    <Markdown
      style={{
        body: styles.messageText,
        bullet_list_icon: {
          paddingTop: isAndroid ? 0 : 5,
          fontSize: isAndroid ? 24 : 32,
        },
        link: {
          lineHeight: 24,
          fontSize: 18,
          color: '#0077FF',
        },
      }}
      rules={customRules}
    >
      {`${text}${customContent}`}
    </Markdown>
  );
}

const styles = StyleSheet.create({
  messageText: {
    lineHeight: 24,
    fontSize: 18,
  },
});

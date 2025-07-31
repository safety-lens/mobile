import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Markdown, { RenderRules } from 'react-native-markdown-display';
import * as Linking from 'expo-linking';

interface IMessage {
  text: string;
  customExpand?: string;
  onChange?: () => void;
}

export default function MessageMarkdown({ text, customExpand, onChange }: IMessage) {
  const isAndroid = Platform.OS === 'android';
  const customRules: RenderRules = {
    link: (node, children) => {
      const href = node.attributes.href;
      if (href && href.startsWith('action:')) {
        const action = href.replace('action:', '');
        return (
          <TouchableOpacity
            key={href}
            onPress={() => action === 'click' && onChange && onChange()}
          >
            <Text style={{ color: 'blue', marginBottom: -4 }}>{children[0]}</Text>
          </TouchableOpacity>
        );
      }
      return (
        <Text onPress={() => Linking.openURL(href)} style={{ marginBottom: -4 }}>
          {children[0] as string}
        </Text>
      );
    },
  };

  const customContent = customExpand ? `[${customExpand}](action:click)` : '';

  return (
    <Markdown
      style={{
        body: styles.messageText,
        bullet_list_icon: {
          paddingTop: isAndroid ? 0 : 5,
          fontSize: isAndroid ? 24 : 32,
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

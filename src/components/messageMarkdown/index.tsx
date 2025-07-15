import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Markdown, { RenderRules } from 'react-native-markdown-display';
import * as Linking from 'expo-linking';

interface IMessage {
  text: string;
  customExpand?: string;
  onChange?: () => void;
}

export default function MessageMarkdown({ text, customExpand, onChange }: IMessage) {
  const customRules: RenderRules = {
    link: (node, children, parent, styles) => {
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
        <TouchableOpacity
          key={href}
          style={styles.link}
          onPress={() => Linking.openURL(href)}
        >
          <Text style={{ marginBottom: -4 }}>{children[0] as string}</Text>
        </TouchableOpacity>
      );
    },
  };

  const customContent = customExpand ? `[${customExpand}](action:click)` : '';

  return (
    <Markdown
      style={{
        body: styles.messageText,
        list_item: {
          marginTop: 12,
          lineHeight: 24,
        },
        bullet_list_icon: {
          paddingTop: 8,
          fontSize: 32,
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

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Message as MessageType } from '@/types/chatTypes';
import MessageMarkdown from '@/components/messageMarkdown';
import MessageImage from '@/components/messageImage';

interface IMessage {
  item: MessageType;
}

export default function Message({ item }: IMessage) {
  function checkAndReplace(messages: string) {
    if (messages?.includes('OpenAI')) {
      return 'Chatbot is currently unavailable';
    }
    if (messages?.includes('No violations detected')) {
      return '**No violations detected.**';
    }
    return messages;
  }

  return (
    <View>
      <View>
        {typeof item.content !== 'string' &&
          item.content?.map((content) => (
            <>
              {content.image_url && (
                <MessageImage
                  imageUrl={typeof item.content !== 'string' && content.image_url?.url}
                />
              )}
            </>
          ))}
      </View>

      <View
        style={[
          styles.messages,
          item.role === 'assistant' ? styles.systemMesg : styles.userMesg,
        ]}
      >
        <MessageMarkdown
          text={
            typeof item.content === 'string'
              ? checkAndReplace(item?.content)
              : item.content[0]?.text || ''
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messages: {
    borderRadius: 8,
  },
  systemMesg: {
    padding: 16,
    paddingLeft: 16,
    paddingRight: 16,
    alignSelf: 'flex-start',
    backgroundColor: '#F9F9F9',
    width: '100%',
  },
  userMesg: {
    alignSelf: 'flex-end',
    backgroundColor: '#E7E9EC',
    paddingLeft: 16,
    paddingRight: 16,
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ArrowLeftIcon from '../../../assets/svgs/arrowLeft';
import { Dropdown } from 'react-native-element-dropdown';

interface IPagination {
  currentPage: number;
  count: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  size?: 'small' | 'normal';
  isLimitSelector?: boolean;
  onLimitChange?: (value: { label: string; value: number }) => void | undefined;
}

const Pagination = ({
  currentPage,
  count,
  onPageChange,
  pageSize = 6,
  size = 'normal',
  isLimitSelector = false,
  onLimitChange,
}: IPagination) => {
  const totalPages = Math.ceil(count / pageSize);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPages = () => {
    const pages = [];
    const SIBLINGS_COUNT = 1;

    const leftSiblingIndex = Math.max(currentPage - SIBLINGS_COUNT, 1);
    const rightSiblingIndex = Math.min(currentPage + SIBLINGS_COUNT, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    const selected = (id: number | string) => {
      return currentPage === id && styles.selectedPageText;
    };

    pages.push(
      <TouchableOpacity
        style={[
          styles.pageItemBox,
          { minWidth: size === 'small' ? 20 : 40 },
          selected(1),
        ]}
        key={1}
        onPress={() => handlePageChange(1)}
      >
        <Text style={[styles.pageText, size === 'small' && { fontSize: 14 }]}>{1}</Text>
      </TouchableOpacity>
    );

    if (shouldShowLeftDots) {
      pages.push(
        <Text
          key="dots1"
          style={[
            styles.pageItemBox,
            {
              minWidth: size === 'small' ? 20 : 40,
              paddingHorizontal: size === 'small' ? 6 : 12,
            },
          ]}
        >
          ...
        </Text>
      );
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(
          <TouchableOpacity
            style={[
              styles.pageItemBox,
              { minWidth: size === 'small' ? 20 : 40 },
              selected(i),
            ]}
            key={i}
            onPress={() => handlePageChange(i)}
          >
            <Text style={[styles.pageText, size === 'small' && { fontSize: 14 }]}>
              {i}
            </Text>
          </TouchableOpacity>
        );
      }
    }

    if (shouldShowRightDots) {
      pages.push(
        <Text
          key="dots2"
          style={[
            styles.pageItemBox,
            {
              minWidth: size === 'small' ? 20 : 40,
              paddingHorizontal: size === 'small' ? 6 : 12,
            },
          ]}
        >
          ...
        </Text>
      );
    }

    if (totalPages > 1) {
      pages.push(
        <TouchableOpacity
          style={[
            styles.pageItemBox,
            selected(totalPages),
            { minWidth: size === 'small' ? 20 : 40 },
          ]}
          key={totalPages}
          onPress={() => handlePageChange(totalPages)}
        >
          <Text style={[styles.pageText, size === 'small' && { fontSize: 14 }]}>
            {totalPages}
          </Text>
        </TouchableOpacity>
      );
    }

    return pages;
  };

  if (totalPages < 2) return;

  return (
    <View style={styles.containerMain}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            opacity: currentPage === 1 ? 0.3 : 1,
            padding: 20,
            paddingHorizontal: size === 'small' ? 6 : 12,
            paddingLeft: size === 'small' ? 0 : 20,
          }}
        >
          <ArrowLeftIcon />
        </TouchableOpacity>

        {renderPages()}

        <TouchableOpacity
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            opacity: currentPage === totalPages ? 0.3 : 1,
            padding: 20,
            paddingHorizontal: size === 'small' ? 0 : 12,
          }}
        >
          <View style={{ transform: 'rotate(180deg)' }}>
            <ArrowLeftIcon />
          </View>
        </TouchableOpacity>
      </View>

      {isLimitSelector && (
        <View style={{ width: 106 }}>
          <Dropdown
            onChange={onLimitChange || (() => {})}
            data={[
              { label: '10', value: 10 },
              { label: '20', value: 20 },
              { label: '50', value: 50 },
              { label: '100', value: 100 },
            ]}
            // value={pageSize}
            placeholder={`${pageSize} / page`}
            labelField="label"
            valueField="value"
            dropdownPosition={'top'}
            containerStyle={{ borderRadius: 6, marginBottom: 8 }}
            selectedTextStyle={{ fontSize: 14 }}
            itemTextStyle={{ fontSize: 14 }}
            placeholderStyle={{ fontSize: 14 }}
            style={{
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#D0D5DD',
              padding: 8,
            }}
          />
        </View>
      )}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  containerMain: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageItemBox: {
    padding: 12,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  pageText: {
    fontWeight: '500',
    fontSize: 16,
    height: 20,
  },
  selectedPageText: {
    backgroundColor: '#E3E8EE',
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ArrowLeftIcon from '../../../assets/svgs/arrowLeft';

interface IPagination {
  currentPage: number;
  count: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, count, onPageChange }: IPagination) => {
  const totalPages = Math.ceil(count / 6);

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
        style={[styles.pageItemBox, selected(1)]}
        key={1}
        onPress={() => handlePageChange(1)}
      >
        <Text style={[styles.pageText]}>{1}</Text>
      </TouchableOpacity>
    );

    if (shouldShowLeftDots) {
      pages.push(
        <Text key="dots1" style={styles.pageItemBox}>
          ...
        </Text>
      );
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(
          <TouchableOpacity
            style={[styles.pageItemBox, selected(i)]}
            key={i}
            onPress={() => handlePageChange(i)}
          >
            <Text style={[styles.pageText]}>{i}</Text>
          </TouchableOpacity>
        );
      }
    }

    if (shouldShowRightDots) {
      pages.push(
        <Text key="dots2" style={styles.pageItemBox}>
          ...
        </Text>
      );
    }

    if (totalPages > 1) {
      pages.push(
        <TouchableOpacity
          style={[styles.pageItemBox, selected(totalPages)]}
          key={totalPages}
          onPress={() => handlePageChange(totalPages)}
        >
          <Text style={[styles.pageText]}>{totalPages}</Text>
        </TouchableOpacity>
      );
    }

    return pages;
  };

  if (totalPages < 2) return;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ opacity: currentPage === 1 ? 0.3 : 1, padding: 20 }}
      >
        <ArrowLeftIcon />
      </TouchableOpacity>

      {renderPages()}

      <TouchableOpacity
        onPress={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{ opacity: currentPage === totalPages ? 0.3 : 1, padding: 20 }}
      >
        <View style={{ transform: 'rotate(180deg)' }}>
          <ArrowLeftIcon />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageItemBox: {
    padding: 12,
    minWidth: 40,
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

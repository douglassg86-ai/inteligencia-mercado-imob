export const TAG_PALETTE = [
  '#00E5C7', '#FF6B4A', '#FFD23F', '#B388FF',
  '#4FC3F7', '#FF4D8D', '#7CFC9E', '#FFA94D',
  '#6C7BFF', '#FF7597', '#4ADE80', '#F472B6',
]

const DIACRITIC_PATTERN = new RegExp('\\p{Diacritic}', 'gu')

export function normalizeTagName(raw) {
  return raw
    .normalize('NFD')
    .replace(DIACRITIC_PATTERN, '')
    .toUpperCase()
    .trim()
    .replace(/\s+/g, ' ')
}

export function colorForTagIndex(index) {
  return TAG_PALETTE[index % TAG_PALETTE.length]
}

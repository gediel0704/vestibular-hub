export const normalizeText = (value, max) => value.trim().replace(/\s+/g, ' ').slice(0, max)
export const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 255
export const safeNext = value => typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/dashboard'

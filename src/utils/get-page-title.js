import defaultSettings from '@/settings'

const title = defaultSettings.title || 'jiejialife Admin Test'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

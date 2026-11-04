export type Theme = 'light' | 'dark'

/**
 * Light/dark theme. The initial class is set by an inline script in <head>
 * (see nuxt.config.ts) so there is no flash; this composable keeps it in sync.
 */
export function useTheme() {
  const theme = useState<Theme>('theme', () => 'light')

  function apply(next: Theme) {
    theme.value = next
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* storage unavailable (private mode): ignore */
    }
  }

  function toggle() {
    apply(theme.value === 'dark' ? 'light' : 'dark')
  }

  function sync() {
    theme.value = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  }

  return { theme, toggle, sync }
}

import { reactive } from 'vue'

/** The current page's title, shown in the app bar. Pages set it through PageHeader. */
export const pageTitle = reactive({ title: '', subtitle: '', back: '' })

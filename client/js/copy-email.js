/* globals M */
/**
 * @fileoverview Script to allow my email to be copied to the
 *   clipboard on click.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

window.onload = () => {
  document.getElementById('email-link').addEventListener('click', () => {
    const text = document.createElement('textarea')
    text.value = 'alvin@omgimanerd.tech'
    document.body.appendChild(text)
    text.select()
    text.setSelectionRange(0, Number.MAX_SAFE_INTEGER)
    document.execCommand('copy')
    document.body.removeChild(text)
    M.toast({ html: 'Email copied to clipboard.' })
  })
}

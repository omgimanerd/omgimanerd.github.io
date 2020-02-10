/**
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

window.addEventListener('load', () => {
  const sections = document.getElementsByClassName('notes-section')
  for (const section of sections) {
    const header = section.getElementsByClassName('notes-header')[0]
    const content = section.getElementsByClassName('notes-content')[0]

    header.addEventListener('click', () => {
      content.classList.toggle('visible')
    })
  }
})

import yo from 'yo-yo'
import * as toast from './toast'
import closeIcon from '../icon/close'
import {writeToClipboard} from '../../lib/fg/event-handlers'

// globals
// =

var resolve
var reject

// exported api
// =

export function render (url) {
  return yo`
    <div id="add-pinned-bookmark-popup" class="popup-wrapper" onclick=${onClickWrapper}>
      <form class="popup-inner" onsubmit=${onSubmit}>
        <div class="head">
          <span class="title">Add a pinned bookmark</span>
        </div>

        <div>
          <label for="url-input">URL</label>
          <input type="text" id="url-input" name="url" required />
          <label for="title-input">Title</label>
          <input type="text" id="title-input" name="title" required />
        </div>

        <div class="actions">
          <button type="button" class="btn" onclick=${destroy} tabindex="2">Cancel</button>
          <button type="submit" class="btn primary" tabindex="1">Save</button>
        </div>
      </form>
    </div>
  `
}

export function create (url) {
  // render interface
  var popup = render(url)
  document.body.appendChild(popup)
  document.addEventListener('keyup', onKeyUp)

  // select input
  var input = popup.querySelector('input')
  input.focus()
  input.select()

  // return promise
  return new Promise((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })
}

export function destroy () {
  var popup = document.getElementById('add-pinned-bookmark-popup')
  document.body.removeChild(popup)
  document.removeEventListener('keyup', onKeyUp)
  reject()
}

// event handlers
// =

function onKeyUp (e) {
  e.preventDefault()
  e.stopPropagation()

  if (e.keyCode === 27) {
    destroy()
  }
}

function onClickWrapper (e) {
  if (e.target.id === 'add-pinned-bookmark-popup') {
    destroy()
  }
}

function onSubmit (e) {
  e.preventDefault()
  resolve({
    url: e.target.url.value,
    title: e.target.title.value
  })
  destroy()
}
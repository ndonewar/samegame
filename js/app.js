/* global $ */

const colors = ['Red', 'Blue', 'Green', 'Purple']
const bX = 31
const bY = 19
let points = 0
let total = 0
function generatePieces () {
  for (let i = 0; i < bX * bY; i++) {
    const pTop = Math.floor(i / bX) * 40
    const pLeft = (i % bX) * 40
    const color = colors[Math.floor(Math.random() * colors.length)]
    $('<div class="p"></div>').attr('id', i).css('top', pTop).css('left', pLeft).css('background-color', color).data('color', color).appendTo('#board').click(
      function () {
        if (isMarked(this)) {
          deleteMarked()
          settleDown()
          settleLeft()
          updateTotal(points)
        } else {
          $('.mark').removeClass('mark')
          let n = checkTRBL(this)
          points = (n - 1) * (n - 1)
          $('#points').html('' + points)
          if (n) {
            mark(this)
          } else {
            updatePoints(0)
          }
        }
      }
    )
  }
}
generatePieces()

function updatePoints (n) {
  points = n
  $('#points').html(n)
}

function updateTotal () {
  total += points
  $('#total').html('' + total)
  updatePoints(0)
}

function settleLeft () {
  let again = false
  for (let h = 0; h < bX - 1; h++) {
    const col = []
    for (let v = 0; v < bY; v++) {
      const id = h + (bX * v)
      if (document.getElementById(id.toString())) {
        break
      } else {
        col.push(id)
        if (col.length === bY) {
          while (col.length > 0) {
            const oid = col.pop()
            if (document.getElementById(oid + 1)) {
              again = true
              $('#' + (oid + 1)).attr('id', oid).animate({left: '-=40'}, 10)
            }
          }
        }
      }
    }
  }
  if (again) settleLeft()
}

function settleDown () {
  let again = false
  for (let i = bX * bY - 1; i > -1; i--) {
    if (!document.getElementById(i.toString())) {
      if (document.getElementById((i - bX).toString())) {
        $('#' + (i - bX)).attr('id', i).animate({top: '+=40'}, 10)
        again = true
      }
    }
  }
  if (again) settleDown()
}

function deleteMarked () {
  $('.mark').remove()
}

function mark (el) {
  $(el).addClass('mark')
}

function checkTRBL (el) {
  let c = 0
  const t = parseInt(el.id) - bX
  const r = parseInt(el.id) + 1
  const b = parseInt(el.id) + bX
  const l = parseInt(el.id) - 1
  if (t > -1 && same(el, t) && !isMarked(document.getElementById(t.toString()))) {
    c++
    mark(document.getElementById(t.toString()))
    c += checkTRBL(document.getElementById(t.toString()))
  }
  if (r % bX !== 0 && same(el, r) && !isMarked(document.getElementById(r.toString()))) {
    c++
    mark(document.getElementById(r.toString()))
    c += checkTRBL(document.getElementById(r.toString()))
  }
  if (b < bX * bY && same(el, b) && !isMarked(document.getElementById(b.toString()))) {
    c++
    mark(document.getElementById(b.toString()))
    c += checkTRBL(document.getElementById(b.toString()))
  }
  if ((l + 1) % bX !== 0 && same(el, l) && !isMarked(document.getElementById(l.toString()))) {
    c++
    mark(document.getElementById(l.toString()))
    c += checkTRBL(document.getElementById(l.toString()))
  }
  return c
}

function same (el, nb) {
  return $(el).data('color') === $('#' + nb).data('color')
}
function isMarked (el) {
  return $(el).hasClass('mark')
}
